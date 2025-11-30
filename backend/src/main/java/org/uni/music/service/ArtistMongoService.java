package org.uni.music.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.uni.music.model.Artist;
import org.uni.music.repository.ArtistRepository;

import java.util.Optional;
import java.util.UUID;

@Component
public class ArtistMongoService implements ArtistService {

    private final ArtistRepository repository;

    public ArtistMongoService(ArtistRepository repository) {
        this.repository = repository;
    }

    @Override
    public Page<Artist> getArtists(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Override
    public Optional<Artist> getArtistById(UUID id) {
        return repository.findById(id);
    }

    @Override
    public Artist createArtist(Artist newArtist) {
        UUID id = newArtist.id() != null ? newArtist.id() : UUID.randomUUID();
        Artist toSave = newArtist.withId(id);
        return repository.save(toSave);
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

    @Override
    public Page<Artist> searchArtists(String query, Pageable pageable) {
        String q = query == null ? "" : query;
        return repository.search(q, pageable);
    }
}
