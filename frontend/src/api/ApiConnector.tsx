import axios from "axios";

const API_BASE = "/api/v1";

const client = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

function authHeaders() {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Artists
export const getArtists = () => client.get("/artists", { headers: authHeaders() });
export const getArtist = (id: string) => client.get(`/artists/${id}`, { headers: authHeaders() });
export const createArtist = (data: any) => client.post("/artists", data, { headers: authHeaders() });
export const updateArtist = (id: string, data: any) => client.put(`/artists/${id}`, data, { headers: authHeaders() });
export const deleteArtist = (id: string) => client.delete(`/artists/${id}`, { headers: authHeaders() });
export const getArtistTracks = (id: string) => client.get(`/artists/${id}/tracks`, { headers: authHeaders() });

// Tracks
export const getTracks = () => client.get("/tracks", { headers: authHeaders() });
export const getTrack = (id: string) => client.get(`/tracks/${id}`, { headers: authHeaders() });
export const createTrack = (data: any) => client.post("/tracks", data, { headers: authHeaders() });
export const updateTrack = (id: string, data: any) => client.put(`/tracks/${id}`, data, { headers: authHeaders() });
export const deleteTrack = (id: string) => client.delete(`/tracks/${id}`, { headers: authHeaders() });