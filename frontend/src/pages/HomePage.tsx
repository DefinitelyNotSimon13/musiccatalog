import { Box, Typography, Paper, Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PersonIcon from "@mui/icons-material/Person";

export default function HomePage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome to Music Catalog
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Manage your music collection with artists and tracks
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ mt: 4 }}>
        <Box sx={{ flex: 1 }}>
          <Paper
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <PersonIcon sx={{ fontSize: 60, color: "primary.main" }} />
            <Typography variant="h5">Artists</Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Browse and manage your artist collection
            </Typography>
            <Button
              variant="contained"
              component={Link}
              to="/artists"
              sx={{ mt: 2 }}
            >
              View Artists
            </Button>
          </Paper>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Paper
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <MusicNoteIcon sx={{ fontSize: 60, color: "primary.main" }} />
            <Typography variant="h5">Tracks</Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Browse and manage your track collection
            </Typography>
            <Button
              variant="contained"
              component={Link}
              to="/tracks"
              sx={{ mt: 2 }}
            >
              View Tracks
            </Button>
          </Paper>
        </Box>
      </Stack>
    </Box>
  );
}
