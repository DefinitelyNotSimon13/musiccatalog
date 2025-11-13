package org.uni.music.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.uni.music.model.Track;

@RestController
@RequestMapping("/api/v1/tracks")
public class TrackController {

    @GetMapping()
    public ResponseEntity<String> getTracks() {
        // Get all track id's
        return ResponseEntity.ok("All track id's");
    }

    @GetMapping("/{id}")
    public ResponseEntity<Track> getTrack(@PathVariable String id) {
        // If track is there
        // Get the track
        return ResponseEntity.ok(new Track());
        // Else return error
    }

    @PostMapping()
    public ResponseEntity<String> createTrack(@RequestBody Track track) {
        // If body valid
        return ResponseEntity.ok("Track created");
        // Else return Error
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateTrack(@PathVariable String id, @RequestBody Track track) {
        // If body valid and track is there
        return ResponseEntity.ok("Track updated");
        // Else return Error
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTrack(@PathVariable String id) {
        // If track is there
        return ResponseEntity.ok("Track deleted");
        // Else return Error
    }
}
