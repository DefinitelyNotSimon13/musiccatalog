package org.uni.music.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.UUID;

@Document(collection = "artists")
public record Artist(
        @MongoId
        UUID id,

        @NotBlank
        @Size(max = 200, message = "Artist name must be at most 200 characters")
        String name,

        @Size(max = 100, message = "Country must be at most 100 characters")
        String countryOfOrigin,

        @Size(max = 100, message = "Primary genre must be at most 100 characters")
        String primaryGenre,

        @Size(max = 1000, message = "Description must be at most 1000 characters")
        String description
) {

    public Artist withId(UUID newId) {
        return new Artist(newId, name, countryOfOrigin, primaryGenre, description);
    }
}
