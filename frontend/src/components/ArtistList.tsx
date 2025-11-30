import React, { useEffect, useState } from "react";
import { getArtists, deleteArtist } from "../api/ApiConnector";
import { Box, Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArtistForm from "./ArtistForm";

export default function ArtistList() {
  const [artists, setArtists] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [openForm, setOpenForm] = useState(false);

  const load = () => {
    getArtists().then(r => setArtists(r.data)).catch(() => setArtists([]));
  };

  useEffect(() => { load(); }, []);

  const onDelete = (id: string) => {
    if (!confirm("Artist löschen?")) return;
    deleteArtist(id).then(load);
  };

  const openNew = () => { setEditing(null); setOpenForm(true); };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Artists</Typography>
        <Button variant="contained" onClick={openNew}>Neuer Artist</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Genre</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Aktionen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {artists.map(a => (
              <TableRow key={a.id}>
                <TableCell>{a.name}</TableCell>
                <TableCell>{a.countryOfOrigin}</TableCell>
                <TableCell>{a.primaryGenre}</TableCell>
                <TableCell>{a.description}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => { setEditing(a); setOpenForm(true); }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => onDelete(a.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ArtistForm
        open={openForm}
        initial={editing}
        onClose={() => { setOpenForm(false); setEditing(null); }}
        onSaved={() => { setOpenForm(false); load(); }}
      />
    </Box>
  );
}