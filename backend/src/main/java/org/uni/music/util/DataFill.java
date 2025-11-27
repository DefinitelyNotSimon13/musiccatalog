package org.uni.music.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.uni.music.model.Artist;
import org.uni.music.model.Track;
import org.uni.music.repository.ArtistRepository;
import org.uni.music.repository.TrackRepository;

import java.time.Duration;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataFill implements CommandLineRunner {

    private final TrackRepository trackRepository;
    private final ArtistRepository artistRepository;

    @Override
    public void run(String... args) {
        if (trackRepository.count() == 0) {
            log.info("Database is empty, adding example data...");

            Artist beatles = artistRepository.save(new Artist(
                    UUID.randomUUID(),
                    "The Beatles",
                    "United Kingdom",
                    "Rock",
                    "Legendary British rock band formed in Liverpool in 1960."
            ));

            Artist pinkFloyd = artistRepository.save(new Artist(
                    UUID.randomUUID(),
                    "Pink Floyd",
                    "United Kingdom",
                    "Progressive Rock",
                    "English rock band known for their psychedelic and progressive music."
            ));

            Artist michaelJackson = artistRepository.save(new Artist(
                    UUID.randomUUID(),
                    "Michael Jackson",
                    "United States",
                    "Pop",
                    "American singer, songwriter and dancer, known as the 'King of Pop'."
            ));

            Artist milesDavis = artistRepository.save(new Artist(
                    UUID.randomUUID(),
                    "Miles Davis",
                    "United States",
                    "Jazz",
                    "Influential American jazz trumpeter, bandleader and composer."
            ));

            Artist daftPunk = artistRepository.save(new Artist(
                    UUID.randomUUID(),
                    "Daft Punk",
                    "France",
                    "Electronic",
                    "French electronic music duo known for their house and electronic sound."
            ));

            Artist queen = artistRepository.save(new Artist(
                    UUID.randomUUID(),
                    "Queen",
                    "United Kingdom",
                    "Rock",
                    "British rock band known for their eclectic style and powerful live performances."
            ));

            ZoneId zone = ZoneId.systemDefault();

            // CDs
            trackRepository.save(Track.builder()
                    .id(UUID.randomUUID())
                    .title("Abbey Road")
                    .artistId(beatles.id())
                    .publishedAt(toDate(1969, zone))
                    .category("Rock")
                    .album("Abbey Road")
                    .mediaType("CD")
                    .fileName("the_beatles_abbey_road.cd")
                    .length(Duration.ofSeconds(2637))
                    .build());

            trackRepository.save(Track.builder()
                    .id(UUID.randomUUID())
                    .title("The Dark Side of the Moon")
                    .artistId(pinkFloyd.id())
                    .publishedAt(toDate(1973, zone))
                    .category("Rock")
                    .album("The Dark Side of the Moon")
                    .mediaType("CD")
                    .fileName("pink_floyd_the_dark_side_of_the_moon.cd")
                    .length(Duration.ofSeconds(2592))
                    .build());

            trackRepository.save(Track.builder()
                    .id(UUID.randomUUID())
                    .title("Thriller")
                    .artistId(michaelJackson.id())
                    .publishedAt(toDate(1982, zone))
                    .category("Pop")
                    .album("Thriller")
                    .mediaType("CD")
                    .fileName("michael_jackson_thriller.cd")
                    .length(Duration.ofSeconds(2535))
                    .build());

            // Vinyls
            trackRepository.save(Track.builder()
                    .id(UUID.randomUUID())
                    .title("Revolver")
                    .artistId(beatles.id())
                    .publishedAt(toDate(1966, zone))
                    .category("Rock")
                    .album("Revolver")
                    .mediaType("Vinyl")
                    .fileName("the_beatles_revolver.vinyl")
                    .length(Duration.ofSeconds(2132))
                    .build());

            trackRepository.save(Track.builder()
                    .id(UUID.randomUUID())
                    .title("Kind of Blue")
                    .artistId(milesDavis.id())
                    .publishedAt(toDate(1959, zone))
                    .category("Jazz")
                    .album("Kind of Blue")
                    .mediaType("Vinyl")
                    .fileName("miles_davis_kind_of_blue.vinyl")
                    .length(Duration.ofSeconds(2738))
                    .build());

            // MP3-Files
            trackRepository.save(Track.builder()
                    .id(UUID.randomUUID())
                    .title("Discovery")
                    .artistId(daftPunk.id())
                    .publishedAt(toDate(2001, zone))
                    .category("Electronic")
                    .album("Discovery")
                    .mediaType("MP3")
                    .fileName("daft_punk_discovery.mp3")
                    .length(Duration.ofSeconds(3655))
                    .build());

            trackRepository.save(Track.builder()
                    .id(UUID.randomUUID())
                    .title("Bohemian Rhapsody")
                    .artistId(queen.id())
                    .publishedAt(toDate(1975, zone))
                    .category("Rock")
                    .album("A Night at the Opera")
                    .mediaType("MP3")
                    .fileName("queen_bohemian_rhapsody.mp3")
                    .length(Duration.ofSeconds(354))
                    .build());

            log.info("{} example tracks added", trackRepository.count());
        } else {
            log.info("Database already contains {} tracks", trackRepository.count());
        }
    }

    private Date toDate(int year, ZoneId zone) {
        return Date.from(
                LocalDate.of(year, 1, 1)
                        .atStartOfDay(zone)
                        .toInstant()
        );
    }
}
