package org.uni.music.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Track - Repräsentiert ein Musikstück (CD, Schallplatte oder MP3-File)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tracks")
public class Track {

    @Id
    private String id;

    private String title;        // Titel des Stücks/Albums
    private String interpreter;  // Interpret/Künstler
    private int year;           // Erscheinungsjahr
    private String category;    // Musikrichtung (z.B. Rock, Pop, Jazz)
    private String fileName;    // Dateiname (für MP3)
    private int length;         // Länge in Sekunden
}
