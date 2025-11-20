package org.uni.music.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.uni.music.model.Track;
import org.uni.music.repository.MusicMongoRepository;

import java.util.List;

/**
 * Einfacher REST Controller für Track-Verwaltung
 */
@RestController
@RequestMapping("/api/tracks")
@RequiredArgsConstructor
public class TrackController {

    private final MusicMongoRepository repository;

    // Alle Tracks abrufen
    @GetMapping
    public List<Track> getAllTracks() {
        return repository.findAll();
    }

    // Track nach ID abrufen
    @GetMapping("/{id}")
    public ResponseEntity<Track> getTrackById(@PathVariable String id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Neuen Track erstellen
    @PostMapping
    public Track createTrack(@RequestBody Track track) {
        return repository.save(track);
    }

    // Track aktualisieren
    @PutMapping("/{id}")
    public ResponseEntity<Track> updateTrack(@PathVariable String id, @RequestBody Track track) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        track.setId(id);
        return ResponseEntity.ok(repository.save(track));
    }

    // Track löschen
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrack(@PathVariable String id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Suche nach Interpret
    @GetMapping("/search/interpreter")
    public List<Track> findByInterpreter(@RequestParam String interpreter) {
        return repository.findByInterpreter(interpreter);
    }

    // Suche nach Titel
    @GetMapping("/search/title")
    public List<Track> findByTitle(@RequestParam String title) {
        return repository.findByTitle(title);
    }

    // Suche nach Jahr
    @GetMapping("/search/year")
    public List<Track> findByYear(@RequestParam int year) {
        return repository.findByYear(year);
    }

    // Suche nach Kategorie
    @GetMapping("/search/category")
    public List<Track> findByCategory(@RequestParam String category) {
        return repository.findByCategory(category);
    }

    // Suche nach Dateiname
    @GetMapping("/search/filename")
    public List<Track> findByFileName(@RequestParam String fileName) {
        return repository.findByFileName(fileName);
    }
}

