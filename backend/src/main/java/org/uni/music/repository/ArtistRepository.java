package org.uni.music.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.uni.music.model.Artist;
import org.uni.music.model.Track;

import java.util.List;
import java.util.UUID;

@Repository
public interface ArtistRepository extends MongoRepository<Artist, UUID> {
}
