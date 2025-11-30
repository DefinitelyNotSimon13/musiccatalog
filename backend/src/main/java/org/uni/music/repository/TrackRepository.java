package org.uni.music.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;
import org.uni.music.model.Track;

import java.util.List;
import java.util.UUID;

@Repository
public interface TrackRepository extends MongoRepository<Track, UUID> {

    @NonNull
    Page<Track> findAll(@NonNull Pageable pageable);

    List<Track> findByArtistId(UUID artistId);

    @Query("""
        {
          $or: [
            { "title": { $regex: ?0, $options: "i" } },
            { "album": { $regex: ?0, $options: "i" } },
            { "category": { $regex: ?0, $options: "i" } },
            { "mediaType": { $regex: ?0, $options: "i" } }
          ]
        }
        """)
    Page<Track> search(String query, Pageable pageable);
}
