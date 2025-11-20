package org.uni.music.adapter;

import org.springframework.stereotype.Component;
import org.uni.music.model.Track;
import org.uni.music.repository.MusicMongoRepository;

import java.util.List;

@Component
public class TrackMongoAdapter implements TrackAdapter {

    private final MusicMongoRepository repository;

    public TrackMongoAdapter(MusicMongoRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<String> getTracks() {
        return repository.findAll().stream()
                .map(Track::getId)
                .toList();
    }

    @Override
    public Track getTrack(String id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public boolean createTrack(Track track) {
        repository.save(track);
        return true;
    }

    @Override
    public boolean updateTrack(String id, Track track) {
        if (!repository.existsById(id)) {
            return false;
        }
        track.setId(id);
        repository.save(track);
        return true;
    }

    @Override
    public boolean deleteTrack(String id) {
        if (!repository.existsById(id)) {
            return false;
        }
        repository.deleteById(id);
        return true;
    }
}
