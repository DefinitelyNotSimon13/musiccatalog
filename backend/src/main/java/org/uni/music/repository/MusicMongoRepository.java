package org.uni.music.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.uni.music.model.Track;

@Repository
public interface MusicMongoRepository extends MongoRepository<Track, String> {
    // Nur Standard-CRUD-Methoden von MongoRepository:
    // findAll(), findById(), save(), deleteById(), existsById()
}
