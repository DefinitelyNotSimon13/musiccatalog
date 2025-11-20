package org.uni.music.adapter;

import org.uni.music.model.Track;

import java.util.List;

public class TrackMongoAdapter implements TrackAdapter {

    // TODO Implement me

    public List<String> getTracks() {
        return List.of();
    }

    public Track getTrack(String id) {
        return new Track();
    }

    public boolean updateTrack(String id, Track track) {
        return true;
    }

    public boolean deleteTrack(String id) {
        return true;
    }
}
