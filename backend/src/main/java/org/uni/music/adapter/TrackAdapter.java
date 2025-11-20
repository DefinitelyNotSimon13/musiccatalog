package org.uni.music.adapter;

import org.uni.music.model.Track;

import java.util.List;

public interface TrackAdapter {

    public List<Track> getTracks();

    public List<Track> getTrack(String id);

    public List<Track> updateTrack(String id, Track track);

    public List<Track> deleteTrack(String id);

}
