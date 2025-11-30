import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Artist } from "../types";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Pagination,
} from "@mui/material";
import ArtistForm from "../components/ArtistForm";
import { useIsAdmin } from "../context/roles";
import ArtistTable from "../components/ArtistTable";
import { useArtists, useDeleteArtist } from "../api/hooks";

export default function ArtistsPage() {
  const isAdmin = useIsAdmin();
  const [editing, setEditing] = useState<Artist | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const { data, isLoading, error } = useArtists({ page, size: pageSize });
  const artists = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const navigate = useNavigate();
  const deleteArtistMutation = useDeleteArtist();

  const onDelete = (id: string) => {
    if (!confirm("Delete artist?")) return;
    deleteArtistMutation.mutate(id);
  };

  const onEdit = (artist: Artist) => {
    setEditing(artist);
    setOpenForm(true);
  };

  const openNew = () => {
    setEditing(null);
    setOpenForm(true);
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error">Failed to load artists: {error.message}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4">Artists</Typography>
        {isAdmin && (
          <Button variant="contained" onClick={openNew}>
            New Artist
          </Button>
        )}
      </Box>

      <ArtistTable
        artists={artists}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={(artist) => navigate(`/artists/${artist.id}`)}
      />

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={(_, value) => setPage(value - 1)}
            color="primary"
          />
        </Box>
      )}

      <ArtistForm
        open={openForm}
        initial={editing}
        onClose={() => {
          setOpenForm(false);
          setEditing(null);
        }}
        onSaved={() => {
          setOpenForm(false);
        }}
      />
    </Box>
  );
}
