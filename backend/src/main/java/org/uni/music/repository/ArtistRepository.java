package org.uni.music.repository;

import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;
import org.uni.music.model.Artist;

import java.util.List;
import java.util.UUID;

@Repository
public interface ArtistRepository extends MongoRepository<Artist, UUID> {
    @NonNull
    Page<Artist> findAll(@NonNull Pageable pageable);

    @Query("""
        {
          $or: [
            { "name": { $regex: ?0, $options: "i" } },
            { "countryOfOrigin": { $regex: ?0, $options: "i" } },
            { "primaryGenre": { $regex: ?0, $options: "i" } }
          ]
        }
        """)
    Page<Artist> search(String query, Pageable pageable);
}
