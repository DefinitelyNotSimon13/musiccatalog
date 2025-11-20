package org.uni.music.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.uni.music.model.Track;

import java.util.List;

@Repository
public interface MusicMongoRepository extends MongoRepository<Track, String> {

    List<Track> findByInterpreter(String interpreter);

    List<Track> findByTitle(String title);

    List<Track> findByYear(int year);

    List<Track> findByCategory(String category);

    List<Track> findByFileName(String fileName);
}
