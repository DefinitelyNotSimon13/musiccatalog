import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Pagination,
} from "@mui/material";
import type { Track } from "../types";
import TrackForm from "../components/TrackForm";
import { useIsAdmin } from "../context/roles";
import TrackTable from "../components/TrackTable";
import { useTracks, useDeleteTrack } from "../api/hooks";

export default function TracksPage() {
  const isAdmin = useIsAdmin();
  const [editing, setEditing] = useState<Track | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const { data, isLoading, error } = useTracks({ page, size: pageSize });
  const tracks = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const navigate = useNavigate();
  const deleteTrackMutation = useDeleteTrack();

  const onDelete = (id: string) => {
    if (!confirm("Delete track?")) return;
    deleteTrackMutation.mutate(id);
  };

  const onEdit = (track: Track) => {
    setEditing(track);
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
        <Alert severity="error">Failed to load tracks: {error.message}</Alert>
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
        <Typography variant="h4">Tracks</Typography>
        {isAdmin && (
          <Button
            variant="contained"
            onClick={() => {
              setEditing(null);
              setOpenForm(true);
            }}
          >
            New Track
          </Button>
        )}
      </Box>

      <TrackTable
        tracks={tracks}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={(track) => navigate(`/tracks/${track.id}`)}
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

      <TrackForm
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
