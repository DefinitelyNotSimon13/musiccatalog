package org.uni.music.service;

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
    public List<Track> getTracks() {
        return repository.findAll();
    }

    @Override
    public Optional<Track> getTrackById(UUID id) {
        return repository.findById(id);
    }

    public List<Track> getTracksByArtistId(UUID artistId) {
        return repository.findByArtistId(artistId);
    }

    @Override
    public Track createTrack(Track newTrack) {
        return repository.save(newTrack);
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
}
