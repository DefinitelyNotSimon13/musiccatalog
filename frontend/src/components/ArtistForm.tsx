import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import type { Artist } from "../types";
import { useIsAdmin } from "../context/roles";
import { useAppForm } from "../lib/form/context";
import { artistSchema } from "../schemas/artist";
import { useCreateArtist, useUpdateArtist } from "../api/hooks";
import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { UUID } from "../types/common";
import { useState } from "react";

type Props = {
  open: boolean;
  initial?: Artist | null;
  onClose: () => void;
  onSaved: () => void;
};

export default function ArtistForm({ open, initial, onClose, onSaved }: Props) {
  const isAdmin = useIsAdmin();
  const createArtistMutation = useCreateArtist();
  const updateArtistMutation = useUpdateArtist();
  const navigate = useNavigate();
  const mutationError =
    createArtistMutation.error || updateArtistMutation.error;
  const [localError, setLocalError] = useState<unknown>(undefined);

  const form = useAppForm({
    defaultValues: {
      name: initial?.name || "",
      countryOfOrigin: initial?.countryOfOrigin || "",
      primaryGenre: initial?.primaryGenre || "",
      description: initial?.description || "",
    },
    validators: {
      onChange: artistSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        if (initial?.id) {
          const updated = await updateArtistMutation.mutateAsync({
            id: initial.id,
            data: value,
          });
          const artistId =
            (updated as { id?: UUID } | undefined)?.id ?? initial.id;
          if (artistId) navigate(`/artists/${artistId}`);
        } else {
          const created = await createArtistMutation.mutateAsync(value);
          const artistId = (created as { id?: UUID } | undefined)?.id;
          if (artistId) navigate(`/artists/${artistId}`);
        }
        onSaved();
      } catch (e) {
        console.error("Error saving artist:", e);
        setLocalError(e);
      }
    },
  });

  const isLoading =
    createArtistMutation.isPending || updateArtistMutation.isPending;

  // Reset form when dialog opens/closes or initial changes
  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!isAdmin) return null;
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <DialogTitle>{initial ? "Edit Artist" : "New Artist"}</DialogTitle>
        <DialogContent>
          {!!(mutationError || localError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {mutationError instanceof Error
                ? mutationError.message
                : localError instanceof Error
                ? localError.message
                : String(
                    mutationError ??
                      localError ??
                      "Failed to save artist. Please review your inputs and try again."
                  )}
            </Alert>
          )}
          <form.AppField
            name="name"
            children={(field) => (
              <field.TextField label="Name" required disabled={isLoading} />
            )}
          />
          <form.AppField
            name="countryOfOrigin"
            children={(field) => (
              <field.TextField label="Country of Origin" disabled={isLoading} />
            )}
          />
          <form.AppField
            name="primaryGenre"
            children={(field) => (
              <field.TextField label="Primary Genre" disabled={isLoading} />
            )}
          />
          <form.AppField
            name="description"
            children={(field) => (
              <field.TextField
                label="Description"
                multiline
                rows={3}
                disabled={isLoading}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                variant="contained"
                disabled={!canSubmit || isSubmitting || isLoading}
              >
                {isSubmitting || isLoading ? "Saving..." : "Save"}
              </Button>
            )}
          />
        </DialogActions>
      </form>
    </Dialog>
  );
}
