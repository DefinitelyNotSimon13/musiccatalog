package org.uni.music.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.uni.music.model.Track;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TrackService {

    Page<Track> getTracks(Pageable pageable);

    List<Track> getTracksByArtistId(UUID artistId);

    Optional<Track> getTrackById(UUID id);

    Track createTrack(Track newTrack);

    Optional<Track> updateTrack(UUID id, Track updatedTrack);

    boolean deleteTrack(UUID id);

    Page<Track> searchTracks(String query, Pageable pageable);
}
