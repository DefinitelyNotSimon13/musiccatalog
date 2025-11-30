package org.uni.music.api;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.uni.music.model.Track;
import org.uni.music.service.ArtistService;
import org.uni.music.service.TrackService;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tracks")
@AllArgsConstructor
public class TrackController {

    private final TrackService trackService;
    private final ArtistService artistService;

    /**
     * GET /api/v1/tracks
     * GET /api/v1/tracks?q=rock&page=0&size=20&sort=title,asc
     */
    @GetMapping
    public ResponseEntity<Page<Track>> getTracks(
            @RequestParam(name = "q", required = false) String query,
            Pageable pageable
    ) {
        if (query == null || query.isBlank()) {
            return ResponseEntity.ok(trackService.getTracks(pageable));
        }
        return ResponseEntity.ok(trackService.searchTracks(query, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Track> getTrack(@Valid @PathVariable UUID id) {
        return trackService.getTrackById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/artist")
    public ResponseEntity<?> getTrackArtist(@PathVariable UUID id) {
        return trackService.getTrackById(id)
                .flatMap(track -> artistService.getArtistById(track.artistId()))
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Track> createTrack(@Valid @RequestBody Track newTrack) {
        Track createdTrack = trackService.createTrack(newTrack);
        URI location = URI.create("/api/v1/tracks/" + createdTrack.id());
        return ResponseEntity.created(location).body(createdTrack);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Track> updateTrack(@Valid @PathVariable UUID id, @RequestBody Track track) {
        return trackService.updateTrack(id, track)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrack(@PathVariable UUID id) {
        boolean success = trackService.deleteTrack(id);
        if (success) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
