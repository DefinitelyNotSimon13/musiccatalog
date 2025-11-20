package org.uni.music.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.uni.music.model.Track;
import org.uni.music.repository.MusicMongoRepository;

/**
 * Fügt Beispieldaten ein, wenn die Datenbank leer ist
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final MusicMongoRepository repository;

    @Override
    public void run(String... args) {
        if (repository.count() == 0) {
            log.info("Datenbank ist leer - füge Beispieldaten ein...");

            // CDs
            repository.save(Track.builder()
                    .title("Abbey Road")
                    .interpreter("The Beatles")
                    .year(1969)
                    .category("Rock")
                    .length(2637)
                    .build());

            repository.save(Track.builder()
                    .title("The Dark Side of the Moon")
                    .interpreter("Pink Floyd")
                    .year(1973)
                    .category("Rock")
                    .length(2592)
                    .build());

            repository.save(Track.builder()
                    .title("Thriller")
                    .interpreter("Michael Jackson")
                    .year(1982)
                    .category("Pop")
                    .length(2535)
                    .build());

            // Schallplatten
            repository.save(Track.builder()
                    .title("Revolver")
                    .interpreter("The Beatles")
                    .year(1966)
                    .category("Rock")
                    .length(2132)
                    .build());

            repository.save(Track.builder()
                    .title("Kind of Blue")
                    .interpreter("Miles Davis")
                    .year(1959)
                    .category("Jazz")
                    .length(2738)
                    .build());

            // MP3-Files
            repository.save(Track.builder()
                    .title("Discovery")
                    .interpreter("Daft Punk")
                    .year(2001)
                    .category("Electronic")
                    .fileName("daft_punk_discovery.mp3")
                    .length(3655)
                    .build());

            repository.save(Track.builder()
                    .title("Bohemian Rhapsody")
                    .interpreter("Queen")
                    .year(1975)
                    .category("Rock")
                    .fileName("queen_bohemian_rhapsody.mp3")
                    .length(354)
                    .build());

            log.info("✅ {} Beispiel-Tracks eingefügt", repository.count());
        } else {
            log.info("Datenbank enthält bereits {} Tracks", repository.count());
        }
    }
}

