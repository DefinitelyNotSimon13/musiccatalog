package org.uni.music.api;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.uni.music.model.Artist;
import org.uni.music.model.Track;
import org.uni.music.service.ArtistService;
import org.uni.music.service.TrackService;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/artists")
@AllArgsConstructor
public class ArtistController {

    private final ArtistService artistService;
    private final TrackService trackService;

    /**
     * GET /api/v1/artists
     * GET /api/v1/artists?q=beatles&page=0&size=20&sort=name,asc
     */
    @GetMapping
    public ResponseEntity<Page<Artist>> getArtists(
            @RequestParam(name = "q", required = false) String query,
            Pageable pageable
    ) {
        if (query == null || query.isBlank()) {
            return ResponseEntity.ok(artistService.getArtists(pageable));
        }
        return ResponseEntity.ok(artistService.searchArtists(query, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Artist> getArtist(@PathVariable UUID id) {
        return artistService.getArtistById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/tracks")
    public ResponseEntity<List<Track>> getTracksByArtist(@PathVariable UUID id) {
        if (artistService.getArtistById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(trackService.getTracksByArtistId(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Artist> createArtist(@Valid @RequestBody Artist newArtist) {
        Artist createdArtist = artistService.createArtist(newArtist);
        URI location = URI.create("/api/v1/artists/" + createdArtist.id());
        return ResponseEntity.created(location).body(createdArtist);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Artist> updateArtist(@Valid @PathVariable UUID id, @RequestBody Artist artist) {
        return artistService.updateArtist(id, artist)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArtist(@PathVariable UUID id) {
        boolean success = artistService.deleteArtist(id);
        if (success) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
