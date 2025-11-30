import React, { useEffect, useState } from "react";
import { createArtist, updateArtist } from "../api/ApiConnector";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

type Props = {
  open: boolean;
  initial?: any | null;
  onClose: () => void;
  onSaved: () => void;
};

export default function ArtistForm({ open, initial, onClose, onSaved }: Props) {
  const [form, setForm] = useState({ name: "", countryOfOrigin: "", primaryGenre: "", description: "" });

  useEffect(() => {
    if (initial) setForm({ name: initial.name || "", countryOfOrigin: initial.countryOfOrigin || "", primaryGenre: initial.primaryGenre || "", description: initial.description || "" });
    else setForm({ name: "", countryOfOrigin: "", primaryGenre: "", description: "" });
  }, [initial, open]);

  const submit = async () => {
    try {
      if (initial && initial.id) {
        await updateArtist(initial.id, { id: initial.id, ...form });
      } else {
        await createArtist(form);
      }
      onSaved();
    } catch (e) {
      alert("Fehler beim Speichern");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{initial ? "Artist bearbeiten" : "Neuer Artist"}</DialogTitle>
      <DialogContent>
        <TextField fullWidth margin="dense" label="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <TextField fullWidth margin="dense" label="Country" value={form.countryOfOrigin} onChange={e => setForm({ ...form, countryOfOrigin: e.target.value })} />
        <TextField fullWidth margin="dense" label="Genre" value={form.primaryGenre} onChange={e => setForm({ ...form, primaryGenre: e.target.value })} />
        <TextField fullWidth margin="dense" label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} multiline rows={3} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button variant="contained" onClick={submit}>Speichern</Button>
      </DialogActions>
    </Dialog>
  );
}