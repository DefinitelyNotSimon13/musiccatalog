import { useState, type ReactNode } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Divider,
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTrack, useDeleteTrack, useArtist } from "../api/hooks";
import { ApiError } from "../api/ApiConnector";
import { ResourceError } from "../components/ResourceError";
import TrackForm from "../components/TrackForm";
import { useIsAdmin } from "../context/roles";

export default function TrackDetailPage() {
  const isAdmin = useIsAdmin();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [openForm, setOpenForm] = useState(false);

  const { data: track, isLoading, error } = useTrack(id!);
  // Do NOT query artist until track loaded; remove 'as any'
  const artistId = track?.artistId;
  const {
    data: artist,
    isLoading: artistLoading,
    error: artistError,
  } = useArtist(artistId as string); // enabled will short-circuit until id truthy
  const deleteTrackMutation = useDeleteTrack();

  const onDelete = () => {
    if (!track) return;
    if (!confirm("Delete this track?")) return;
    deleteTrackMutation.mutate(track.id, {
      onSuccess: () => navigate("/tracks"),
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

  if (error || !track) {
    return (
      <ResourceError error={error} resource="Track" id={id} backTo="/tracks" />
    );
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <IconButton aria-label="back" onClick={() => navigate(-1)} size="small">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" flexGrow={1}>
          {track.title}
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
          Track Information
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <ArtistLinkRow
          artistId={track.artistId}
          loading={artistLoading}
          artistName={artist?.name}
          error={artistError}
        />
        <DetailRow label="Album" value={track.album} />
        <DetailRow label="Category" value={track.category} />
        <DetailRow label="Media Type" value={track.mediaType} />
        <DetailRow label="File Name" value={track.fileName} />
        <DetailRow
          label="Published At"
          value={new Date(track.publishedAt).toLocaleDateString()}
        />
        <DetailRow label="Duration" value={formatDuration(track.lengthMs)} />
        <DetailRow label="ISO Duration" value={track.lengthIso} />
      </Paper>

      <TrackForm
        open={openForm}
        initial={track}
        onClose={() => setOpenForm(false)}
        onSaved={() => setOpenForm(false)}
      />
    </Box>
  );
}

function DetailRow({
  label,
  value,
  link,
}: {
  label: string;
  value: ReactNode;
  link?: string;
}) {
  const content = <Typography variant="body2">{value}</Typography>;
  return (
    <Box display="flex" mb={1}>
      <Typography variant="subtitle2" sx={{ width: 160 }}>
        {label}
      </Typography>
      {link ? (
        <Typography
          variant="body2"
          component={Link}
          to={link}
          sx={{ textDecoration: "none" }}
        >
          {value}
        </Typography>
      ) : (
        content
      )}
    </Box>
  );
}

function ArtistLinkRow({
  artistId,
  loading,
  artistName,
  error,
}: {
  artistId: string;
  loading: boolean;
  artistName?: string;
  error: unknown;
}) {
  if (loading) {
    return <DetailRow label="Artist" value="Loading…" />;
  }
  if (error instanceof ApiError && error.status === 404) {
    return <DetailRow label="Artist" value="(Artist not found)" />;
  }
  return (
    <DetailRow
      label="Artist"
      value={artistName || artistId}
      link={artistName ? `/artists/${artistId}` : undefined}
    />
  );
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes} min ${seconds} sec`;
}
