package org.uni.music.adapter;

import org.uni.music.model.Track;

import java.util.List;

public interface TrackAdapter {

    public List<String> getTracks();

    public Track getTrack(String id);

    public boolean updateTrack(String id, Track track);

    public boolean deleteTrack(String id);

}
