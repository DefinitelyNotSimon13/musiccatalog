import React, { useEffect, useState } from "react";
import { Box, Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getTracks, deleteTrack } from "../api/ApiConnector";
import TrackForm from "./TrackForm";

export default function TrackList() {
  const [tracks, setTracks] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [openForm, setOpenForm] = useState(false);

  const load = () => { getTracks().then(r => setTracks(r.data)).catch(() => setTracks([])); };
  useEffect(() => { load(); }, []);

  const onDelete = (id: string) => {
    if (!confirm("Track löschen?")) return;
    deleteTrack(id).then(load);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Tracks</Typography>
        <Button variant="contained" onClick={() => { setEditing(null); setOpenForm(true); }}>Neuer Track</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Artist</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell align="right">Aktionen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tracks.map(t => (
              <TableRow key={t.id}>
                <TableCell>{t.title}</TableCell>
                <TableCell>{t.artistName}</TableCell>
                <TableCell>{t.duration}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => { setEditing(t); setOpenForm(true); }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => onDelete(t.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TrackForm open={openForm} initial={editing} onClose={() => { setOpenForm(false); setEditing(null); }} onSaved={() => { setOpenForm(false); load(); }} />
    </Box>
  );
}