package org.uni.music.service;

import org.springframework.stereotype.Component;
import org.uni.music.model.Artist;
import org.uni.music.repository.ArtistRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class ArtistMongoService implements ArtistService {

    private final ArtistRepository repository;

    public ArtistMongoService(ArtistRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Artist> getArtist() {
        return repository.findAll();
    }

    @Override
    public Optional<Artist> getArtistById(UUID id) {
        return repository.findById(id);
    }

    @Override
    public Artist createArtist(Artist newArtist) {
        return repository.save(newArtist);
    }

    @Override
    public Optional<Artist> updateArtist(UUID id, Artist updatedArtist) {
        return repository.findById(id)
                .map(existing -> updatedArtist.withId(id))
                .map(repository::save);
    }

    @Override
    public boolean deleteArtist(UUID id) {
        if (!repository.existsById(id)) {
            return false;
        }
        repository.deleteById(id);
        return true;
    }
}
