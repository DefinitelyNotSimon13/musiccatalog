import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UUID } from "../types/common";
import type { NewArtist, UpdateArtist } from "../types/Artist";
import type { NewTrack, UpdateTrack } from "../types/Track";
import type { PageRequest } from "../types/Page";
import * as api from "./ApiConnector";

// Query Keys
export const artistKeys = {
  all: ["artists"] as const,
  lists: () => [...artistKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) => [...artistKeys.lists(), { filters }] as const,
  details: () => [...artistKeys.all, "detail"] as const,
  detail: (id: UUID) => [...artistKeys.details(), id] as const,
  tracks: (id: UUID) => [...artistKeys.detail(id), "tracks"] as const,
};

export const trackKeys = {
  all: ["tracks"] as const,
  lists: () => [...trackKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) => [...trackKeys.lists(), { filters }] as const,
  details: () => [...trackKeys.all, "detail"] as const,
  detail: (id: UUID) => [...trackKeys.details(), id] as const,
};

// Artist Queries
export function useArtists(params?: PageRequest) {
  return useQuery({
    queryKey: artistKeys.list(params),
    queryFn: () => api.getArtists(params),
  });
}

// Artist search
export function useSearchArtists(q: string, params?: Omit<PageRequest, "q">) {
  const merged: PageRequest | undefined = q ? { ...(params || {}), q } : params;
  return useQuery({
    queryKey: artistKeys.list(merged),
    queryFn: () => api.getArtists(merged),
    enabled: !!q,
  });
}

export function useArtist(id: UUID) {
  return useQuery({
    queryKey: artistKeys.detail(id),
    queryFn: () => api.getArtist(id),
    enabled: !!id,
  });
}

export function useArtistTracks(id: UUID) {
  return useQuery({
    queryKey: artistKeys.tracks(id),
    queryFn: () => api.getArtistTracks(id),
    enabled: !!id,
  });
}

// Artist Mutations
export function useCreateArtist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NewArtist) => api.createArtist(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: artistKeys.lists() });
    },
  });
}

export function useUpdateArtist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: UUID; data: UpdateArtist }) =>
      api.updateArtist(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: artistKeys.lists() });
      queryClient.invalidateQueries({ queryKey: artistKeys.detail(variables.id) });
    },
  });
}

export function useDeleteArtist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: UUID) => api.deleteArtist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: artistKeys.lists() });
    },
  });
}

// Track Queries
export function useTracks(params?: PageRequest) {
  return useQuery({
    queryKey: trackKeys.list(params),
    queryFn: () => api.getTracks(params),
  });
}

// Track search
export function useSearchTracks(q: string, params?: Omit<PageRequest, "q">) {
  const merged: PageRequest | undefined = q ? { ...(params || {}), q } : params;
  return useQuery({
    queryKey: trackKeys.list(merged),
    queryFn: () => api.getTracks(merged),
    enabled: !!q,
  });
}

export function useTrack(id: UUID) {
  return useQuery({
    queryKey: trackKeys.detail(id),
    queryFn: () => api.getTrack(id),
    enabled: !!id,
  });
}

// Track Mutations
export function useCreateTrack() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NewTrack) => api.createTrack(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trackKeys.lists() });
    },
  });
}

export function useUpdateTrack() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: UUID; data: UpdateTrack }) =>
      api.updateTrack(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: trackKeys.lists() });
      queryClient.invalidateQueries({ queryKey: trackKeys.detail(variables.id) });
    },
  });
}

export function useDeleteTrack() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: UUID) => api.deleteTrack(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trackKeys.lists() });
    },
  });
}
