package org.uni.music.service;

import org.uni.music.model.Artist;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ArtistService {

    List<Artist> getArtist();

    Optional<Artist> getArtistById(UUID id);

    Artist createArtist(Artist newArtist);

    Optional<Artist> updateArtist(UUID id, Artist updatedArtist);

    boolean deleteArtist(UUID id);
}
