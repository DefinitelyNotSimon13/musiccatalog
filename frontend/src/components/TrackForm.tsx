import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import type { Track } from "../types";
import { useAppForm } from "../lib/form/context";
import { trackSchema } from "../schemas/track";
import { useCreateTrack, useUpdateTrack } from "../api/hooks";
import { useIsAdmin } from "../context/roles";
import {
  Autocomplete,
  TextField as MuiTextField,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useState, useMemo, useEffect } from "react";
import { useSearchArtists } from "../api/hooks";
import type { Artist } from "../types/Artist";
import { useFieldContext } from "../lib/form/context";
import { useNavigate } from "react-router-dom";
import type { UUID } from "../types/common";
import { Alert } from "@mui/material";

type Props = {
  open: boolean;
  initial?: Track | null;
  onClose: () => void;
  onSaved: () => void;
};

export default function TrackForm({ open, initial, onClose, onSaved }: Props) {
  const isAdmin = useIsAdmin();
  const createTrackMutation = useCreateTrack();
  const updateTrackMutation = useUpdateTrack();
  const navigate = useNavigate();
  // Artist search input with debounce
  const [artistInput, setArtistInput] = useState("");
  const [artistQuery, setArtistQuery] = useState("");
  const mutationError = createTrackMutation.error || updateTrackMutation.error;
  const [localError, setLocalError] = useState<unknown>(undefined);
  useEffect(() => {
    const t = setTimeout(() => setArtistQuery(artistInput.trim()), 300);
    return () => clearTimeout(t);
  }, [artistInput]);
  const { data: artistSearchResults } = useSearchArtists(artistQuery);
  const artistOptions: Artist[] = (artistSearchResults?.content ||
    []) as Artist[];
  const artistLoading = !artistSearchResults && !!artistQuery;

  // Human-friendly duration state (MM:SS) derived from initial lengthIso
  const initialMmSs = useMemo(() => {
    // Try to derive MM:SS from initial.lengthIso (e.g., PT3M20S)
    const iso = initial?.lengthIso;
    if (!iso) return "03:00";
    // Basic parse for PT{m}M{s}S
    const m = iso.match(/^PT(?:(\d+)M)?(?:(\d+)S)?$/);
    if (m) {
      const minutes = parseInt(m[1] || "0", 10);
      const seconds = parseInt(m[2] || "0", 10);
      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
        2,
        "0"
      )}`;
    }
    // Fallback
    return "03:00";
  }, [initial?.lengthIso]);
  const [durationMmSs, setDurationMmSs] = useState(initialMmSs);

  const mmSsToIso = (mmss: string) => {
    // Accept forms like MM:SS or M:SS
    const parts = mmss.split(":");
    if (parts.length !== 2) return "PT0S";
    const minutes = Math.max(0, parseInt(parts[0] || "0", 10) || 0);
    const seconds = Math.max(0, parseInt(parts[1] || "0", 10) || 0);
    return `PT${minutes}M${seconds}S`;
  };

  const isValidMmSs = (mmss: string) => {
    // Must match digits:digits and seconds < 60
    const m = mmss.match(/^\d{1,2}:\d{2}$/);
    if (!m) return false;
    const [minStr, secStr] = mmss.split(":");
    const minutes = parseInt(minStr, 10);
    const seconds = parseInt(secStr, 10);
    return minutes >= 0 && seconds >= 0 && seconds < 60;
  };
  const durationError = isValidMmSs(durationMmSs)
    ? undefined
    : "Use MM:SS and keep seconds below 60 (e.g., 03:20)";

  const form = useAppForm({
    defaultValues: {
      title: initial?.title || "",
      artistId: initial?.artistId || "",
      publishedAt:
        initial?.publishedAt.toISOString() ||
        new Date().toISOString().split("T")[0] + "T00:00:00Z",
      category: initial?.category || "",
      album: initial?.album || "",
      mediaType: initial?.mediaType || "MP3",
      fileName: initial?.fileName || "",
      length: initial?.lengthIso || "PT3M0S",
    },
    validators: {
      onChange: trackSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        // Ensure duration is converted to ISO-8601 from human-friendly input
        const payload = {
          ...value,
          length: mmSsToIso(durationMmSs),
        } as typeof value;
        if (initial?.id) {
          const updated = await updateTrackMutation.mutateAsync({
            id: initial.id,
            data: payload,
          });
          const trackId =
            (updated as { id?: UUID } | undefined)?.id ?? initial.id;
          if (trackId) {
            navigate(`/tracks/${trackId}`);
          }
        } else {
          const created = await createTrackMutation.mutateAsync(payload);
          const trackId = (created as { id?: UUID } | undefined)?.id;
          if (trackId) {
            navigate(`/tracks/${trackId}`);
          }
        }
        onSaved();
      } catch (e) {
        console.error("Error saving track:", e);
        setLocalError(e);
      }
    },
  });

  const isLoading =
    createTrackMutation.isPending || updateTrackMutation.isPending;

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
        <DialogTitle>{initial ? "Edit Track" : "New Track"}</DialogTitle>
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
                      "Failed to save track. Please review your inputs and try again."
                  )}
            </Alert>
          )}
          <form.AppField
            name="title"
            children={(field) => (
              <field.TextField label="Title" required disabled={isLoading} />
            )}
          />
          {/* Artist search & select (stores artistId under the hood) */}
          <form.AppField
            name="artistId"
            children={() => (
              <ArtistAutocomplete
                options={artistOptions}
                loading={artistLoading}
                disabled={isLoading}
                onInputChange={setArtistInput}
              />
            )}
          />
          <form.AppField
            name="album"
            children={(field) => (
              <field.TextField label="Album" required disabled={isLoading} />
            )}
          />
          <form.AppField
            name="category"
            children={(field) => (
              <field.TextField label="Category" required disabled={isLoading} />
            )}
          />
          <form.AppField
            name="mediaType"
            children={(field) => (
              <field.TextField
                label="Media Type"
                required
                disabled={isLoading}
                placeholder="MP3, CD, Vinyl, etc."
                helperTextStatic="MP3, CD, Vinyl, etc."
              />
            )}
          />
          <form.AppField
            name="fileName"
            children={(field) => (
              <field.TextField
                label="File Name"
                required
                disabled={isLoading}
              />
            )}
          />
          <form.AppField
            name="publishedAt"
            children={(field) => (
              <field.DateField
                label="Published Date"
                required
                disabled={isLoading}
                onTransform={(dateStr) => `${dateStr}T00:00:00Z`}
              />
            )}
          />
          {/* Human-friendly duration input (MM:SS), converted to ISO when submitting */}
          <Stack spacing={2} sx={{ mt: 1 }}>
            <MuiTextField
              label="Duration (MM:SS)"
              required
              value={durationMmSs}
              onChange={(e) => setDurationMmSs(e.target.value)}
              disabled={isLoading}
              helperText={
                durationError || "Example: 03:20 (3 minutes 20 seconds)"
              }
              error={!!durationError}
              inputProps={{
                inputMode: "numeric",
                pattern: "^\\d{1,2}:\\d{2}$",
              }}
              margin="normal"
              fullWidth
            />
          </Stack>
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
                disabled={
                  !canSubmit || !!durationError || isSubmitting || isLoading
                }
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

type ArtistAutocompleteProps = {
  options: Artist[];
  loading?: boolean;
  disabled?: boolean;
  onInputChange: (value: string) => void;
};

function ArtistAutocomplete({
  options,
  loading = false,
  disabled = false,
  onInputChange,
}: ArtistAutocompleteProps) {
  const field = useFieldContext<string>();
  const selected = options.find((o) => o.id === field.state.value) || null;
  return (
    <Autocomplete
      disabled={disabled}
      options={options}
      getOptionLabel={(opt) => opt.name || opt.id}
      value={selected}
      popupIcon={null}
      sx={{ mt: 1 }}
      onChange={(_, sel) => field.handleChange(sel ? sel.id : "")}
      onBlur={field.handleBlur}
      onInputChange={(_, input) => onInputChange(input)}
      renderInput={(params) => (
        <MuiTextField
          {...params}
          label="Artist"
          required
          helperText={"Search by name; ID stored internally"}
          margin="normal"
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
