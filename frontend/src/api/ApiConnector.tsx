import type { UUID } from "../types/common";
import type { Artist, NewArtist, UpdateArtist } from "../types/Artist";
import type { Track, TrackDTO, NewTrack, UpdateTrack } from "../types/Track";
import type { PagedResponse, PageRequest } from "../types/Page";
import { parseDuration, formatDate } from "../utils/dateUtils";

const API_BASE = "/api/v1";

let authToken: string | null = null;

export class ApiError extends Error {
  status: number;
  url: string;
  rawBody?: string;
  constructor(message: string, status: number, url: string, rawBody?: string) {
    super(message);
    this.status = status;
    this.url = url;
    this.rawBody = rawBody;
  }
}

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }
  return headers;
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const fullUrl = `${API_BASE}${url}`;
  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    // Try to parse json error message if present
    let detail: string | undefined;
    try {
      const data = text ? JSON.parse(text) : null;
      detail = data?.message || data?.error || undefined;
    } catch {
      /* ignore */
    }
    const msg = detail || `Request failed (${response.status})`;
    throw new ApiError(msg, response.status, fullUrl, text);
  }

  if (
    response.status === 204 ||
    response.headers.get("content-length") === "0"
  ) {
    return undefined as T;
  }

  return response.json();
}

export const getArtists = (
  params?: PageRequest
): Promise<PagedResponse<Artist>> => {
  const queryParams = new URLSearchParams();
  if (params?.page !== undefined)
    queryParams.set("page", params.page.toString());
  if (params?.size !== undefined)
    queryParams.set("size", params.size.toString());
  if (params?.q) queryParams.set("q", params.q);
  const query = queryParams.toString();
  return fetchJson<PagedResponse<Artist>>(
    `/artists${query ? `?${query}` : ""}`
  );
};

export const getArtist = (id: UUID): Promise<Artist> =>
  fetchJson<Artist>(`/artists/${id}`);

export const createArtist = (data: NewArtist): Promise<Artist> =>
  fetchJson<Artist>("/artists", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateArtist = (id: UUID, data: UpdateArtist): Promise<Artist> =>
  fetchJson<Artist>(`/artists/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteArtist = (id: UUID): Promise<void> =>
  fetchJson<void>(`/artists/${id}`, {
    method: "DELETE",
  });

export const getArtistTracks = (id: UUID): Promise<Track[]> =>
  fetchJson<TrackDTO[]>(`/artists/${id}/tracks`).then((tracks) =>
    tracks.map(transformTrack)
  );

export const getTracks = (
  params?: PageRequest
): Promise<PagedResponse<Track>> => {
  const queryParams = new URLSearchParams();
  if (params?.page !== undefined)
    queryParams.set("page", params.page.toString());
  if (params?.size !== undefined)
    queryParams.set("size", params.size.toString());
  if (params?.q) queryParams.set("q", params.q);
  const query = queryParams.toString();
  return fetchJson<PagedResponse<TrackDTO>>(
    `/tracks${query ? `?${query}` : ""}`
  ).then((response) => ({
    ...response,
    content: response.content.map(transformTrack),
  }));
};

export const getTrack = (id: UUID): Promise<Track> =>
  fetchJson<TrackDTO>(`/tracks/${id}`).then(transformTrack);

export const createTrack = (data: NewTrack): Promise<Track> =>
  fetchJson<TrackDTO>("/tracks", {
    method: "POST",
    body: JSON.stringify(data),
  }).then(transformTrack);

export const updateTrack = (id: UUID, data: UpdateTrack): Promise<Track> =>
  fetchJson<TrackDTO>(`/tracks/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }).then(transformTrack);

export const deleteTrack = (id: UUID): Promise<void> =>
  fetchJson<void>(`/tracks/${id}`, {
    method: "DELETE",
  });

function transformTrack(dto: TrackDTO): Track {
  return {
    id: dto.id,
    title: dto.title,
    artistId: dto.artistId,
    publishedAt: new Date(dto.publishedAt),
    category: dto.category,
    album: dto.album,
    mediaType: dto.mediaType,
    fileName: dto.fileName,
    lengthMs: parseDuration(dto.length),
    lengthIso: dto.length,
  };
}

export function prepareNewTrack(
  track: Omit<Track, "id" | "lengthMs"> & { publishedAt: Date | string }
): NewTrack {
  return {
    title: track.title,
    artistId: track.artistId,
    publishedAt:
      typeof track.publishedAt === "string"
        ? track.publishedAt
        : formatDate(track.publishedAt),
    category: track.category,
    album: track.album,
    mediaType: track.mediaType,
    fileName: track.fileName,
    length: track.lengthIso,
  };
}
