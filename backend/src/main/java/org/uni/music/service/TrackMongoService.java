package org.uni.music.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.uni.music.model.Track;
import org.uni.music.repository.TrackRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class TrackMongoService implements TrackService {

    private final TrackRepository repository;

    public TrackMongoService(TrackRepository repository) {
        this.repository = repository;
    }

    @Override
    public Page<Track> getTracks(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Override
    public Optional<Track> getTrackById(UUID id) {
        return repository.findById(id);
    }

    @Override
    public List<Track> getTracksByArtistId(UUID artistId) {
        return repository.findByArtistId(artistId);
    }

    @Override
    public Track createTrack(Track newTrack) {
        UUID id = newTrack.id() != null ? newTrack.id() : UUID.randomUUID();
        Track toSave = newTrack.withId(id);
        return repository.save(toSave);
    }

    @Override
    public Optional<Track> updateTrack(UUID id, Track updatedTrack) {
        return repository.findById(id)
                .map(existing -> updatedTrack.withId(id))
                .map(repository::save);
    }

    @Override
    public boolean deleteTrack(UUID id) {
        if (!repository.existsById(id)) {
            return false;
        }
        repository.deleteById(id);
        return true;
    }

    @Override
    public Page<Track> searchTracks(String query, Pageable pageable) {
        String q = query == null ? "" : query;
        return repository.search(q, pageable);
    }
}
