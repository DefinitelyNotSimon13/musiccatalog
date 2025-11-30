import React, { useEffect, useState } from "react";
import { createTrack, updateTrack } from "../api/ApiConnector";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from "@mui/material";

type Props = {
  open: boolean;
  initial?: any | null;
  onClose: () => void;
  onSaved: () => void;
};

export default function TrackForm({ open, initial, onClose, onSaved }: Props) {
  const [form, setForm] = useState({ title: "", artistId: "", duration: "" });

  useEffect(() => {
    if (initial) setForm({ title: initial.title || "", artistId: initial.artistId || "", duration: initial.duration || "" });
    else setForm({ title: "", artistId: "", duration: "" });
  }, [initial, open]);

  const submit = async () => {
    try {
      if (initial && initial.id) {
        await updateTrack(initial.id, { id: initial.id, ...form });
      } else {
        await createTrack(form);
      }
      onSaved();
    } catch (e) {
      alert("Fehler beim Speichern");
    }
  };

  // For simplicity artist selection is a free text (artistId). Could fetch artists and show select.
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{initial ? "Track bearbeiten" : "Neuer Track"}</DialogTitle>
      <DialogContent>
        <TextField fullWidth margin="dense" label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <TextField fullWidth margin="dense" label="Artist ID" value={form.artistId} onChange={e => setForm({ ...form, artistId: e.target.value })} />
        <TextField fullWidth margin="dense" label="Duration" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button variant="contained" onClick={submit}>Speichern</Button>
      </DialogActions>
    </Dialog>
  );
}