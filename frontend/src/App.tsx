import React from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { Container, CssBaseline, AppBar, Toolbar, Typography, Button } from "@mui/material";
import ArtistList from "./components/ArtistList";
import TrackList from "./components/TrackList";

export default function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Music Catalog</Typography>
          <Button color="inherit" component={Link} to="/artists">Artists</Button>
          <Button color="inherit" component={Link} to="/tracks">Tracks</Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 3 }}>
        <Routes>
          <Route path="/" element={<ArtistList />} />
          <Route path="/artists" element={<ArtistList />} />
          <Route path="/tracks" element={<TrackList />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}