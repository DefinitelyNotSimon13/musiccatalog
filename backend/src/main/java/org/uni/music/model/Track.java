package org.uni.music.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.Duration;
import java.util.Date;
import java.util.UUID;

/**
 * Track - Represents a music element (cd, vinyl oder mp3-file)
 */
@Builder
@Document(collection = "tracks")
public record Track(
        @MongoId
        UUID id,

        @NotBlank(message = "Title must not be blank")
        @Size(max = 255, message = "Title must be at most 255 characters")
        String title,

        @NotNull(message = "artistId must not be null")
        UUID artistId,

        @NotNull(message = "publishedAt must not be null")
        @PastOrPresent(message = "publishedAt cannot be in the future")
        Date publishedAt,

        @NotBlank(message = "Category must not be blank")
        @Size(max = 100, message = "Category must be at most 100 characters")
        String category,

        @NotBlank(message = "Album must not be blank")
        @Size(max = 200, message = "Album must be at most 200 characters")
        String album,

        @NotBlank(message = "Media type must not be blank")
        @Size(max = 50, message = "Media type must be at most 50 characters")
        String mediaType, // e.g. "CD", "Vinyl", "MP3"

        @NotBlank(message = "fileName must not be blank")
        String fileName,

        @NotNull(message = "length must not be null")
        Duration length
) {

    public Track withId(UUID newId) {
        return new Track(newId, title, artistId, publishedAt, category, album, mediaType, fileName, length);
    }
}
