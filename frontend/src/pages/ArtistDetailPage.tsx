import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Divider,
  Button,
  Stack,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useArtist, useArtistTracks, useDeleteArtist } from "../api/hooks";
import { ResourceError } from "../components/ResourceError";
import ArtistForm from "../components/ArtistForm";
import { useIsAdmin } from "../context/roles";
import type { Track } from "../types";

export default function ArtistDetailPage() {
  const isAdmin = useIsAdmin();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [openForm, setOpenForm] = useState(false);

  const { data: artist, isLoading, error } = useArtist(id!);
  const { data: tracks = [], isLoading: tracksLoading } = useArtistTracks(id!);
  const deleteArtistMutation = useDeleteArtist();

  const onDelete = () => {
    if (!artist) return;
    if (!confirm("Delete this artist?")) return;
    deleteArtistMutation.mutate(artist.id, {
      onSuccess: () => navigate("/artists"),
    });
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="40vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !artist) {
    return (
      <ResourceError
        error={error}
        resource="Artist"
        id={id}
        backTo="/artists"
      />
    );
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <IconButton aria-label="back" onClick={() => navigate(-1)} size="small">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" flexGrow={1}>
          {artist.name}
        </Typography>
        {isAdmin && (
          <>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setOpenForm(true)}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={onDelete}
            >
              Delete
            </Button>
          </>
        )}
      </Stack>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Artist Information
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <DetailRow
          label="Country of Origin"
          value={artist.countryOfOrigin || "-"}
        />
        <DetailRow label="Primary Genre" value={artist.primaryGenre || "-"} />
        <DetailRow label="Description" value={artist.description || "-"} />
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Tracks ({tracks.length})
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {tracksLoading ? (
          <CircularProgress size={24} />
        ) : tracks.length === 0 ? (
          <Typography variant="body2">No tracks for this artist.</Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Album</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Media Type</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell align="right">View</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tracks.map((t: Track) => (
                <TableRow key={t.id} hover>
                  <TableCell>{t.title}</TableCell>
                  <TableCell>{t.album}</TableCell>
                  <TableCell>{t.category}</TableCell>
                  <TableCell>{t.mediaType}</TableCell>
                  <TableCell>{formatDuration(t.lengthMs)}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      aria-label="view track"
                      component={Link}
                      to={`/tracks/${t.id}`}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      <ArtistForm
        open={openForm}
        initial={artist}
        onClose={() => setOpenForm(false)}
        onSaved={() => setOpenForm(false)}
      />
    </Box>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Box display="flex" mb={1}>
      <Typography variant="subtitle2" sx={{ width: 180 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
        {value}
      </Typography>
    </Box>
  );
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
