package org.uni.music.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.uni.music.model.Artist;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ArtistService {

    Page<Artist> getArtists(Pageable pageable);

    Optional<Artist> getArtistById(UUID id);

    Artist createArtist(Artist newArtist);

    Optional<Artist> updateArtist(UUID id, Artist updatedArtist);

    boolean deleteArtist(UUID id);

    Page<Artist> searchArtists(String query, Pageable pageable);
}
