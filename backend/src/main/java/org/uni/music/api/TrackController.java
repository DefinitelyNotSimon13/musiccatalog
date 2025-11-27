package org.uni.music.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.uni.music.adapter.TrackMongoAdapter;
import org.uni.music.model.Track;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tracks")
public class TrackController {

    private final TrackMongoAdapter adapter;

    @Autowired
    public TrackController(TrackMongoAdapter adapter) {
        this.adapter = adapter;
    }

    @GetMapping()
    public ResponseEntity<List<String>> getTracks() {
        return ResponseEntity.ok(adapter.getTracks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Track> getTrack(@PathVariable String id) {
        Track track = adapter.getTrack(id);
        if (track != null) {
            return ResponseEntity.ok(track);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping()
    public ResponseEntity<String> createTrack(@RequestBody Track track) {
        boolean success = adapter.createTrack(track);
        if (success) {
            return ResponseEntity.ok("Track created");
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateTrack(@PathVariable String id, @RequestBody Track track) {
        boolean success = adapter.updateTrack(id, track);
        if (success) {
            return ResponseEntity.ok("Track updated");
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTrack(@PathVariable String id) {
        boolean success = adapter.deleteTrack(id);
        if (success) {
            return ResponseEntity.ok("Track deleted");
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
}
