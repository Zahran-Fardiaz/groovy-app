import React, { createContext, useContext, useState, useEffect } from 'react';
import { Scrobble, Track } from '../types/music';
import { storageService } from '../services/storageService';
import { lastfmApi } from '../services/lastfmApi';

interface ScrobbleContextType {
  scrobbles: Scrobble[];
  recentAutoLogged: Scrobble | null;
  isSimulating: boolean;
  clearAutoLogNotification: () => void;
  recordScrobble: (scrobble: Omit<Scrobble, 'id' | 'timestamp'>) => void;
  recordTrackPlay: (track: Track) => void;
  toggleSimulation: () => void;
  triggerInstantScrobble: () => void;
  syncLastFm: (username: string) => Promise<number>;
  markAsReviewed: (albumTitle: string) => void;
}

const ScrobbleContext = createContext<ScrobbleContextType | undefined>(undefined);

export const ScrobbleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scrobbles, setScrobbles] = useState<Scrobble[]>(() => storageService.getScrobbles());
  const [recentAutoLogged, setRecentAutoLogged] = useState<Scrobble | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Background Scrobble Daemon Simulator
  useEffect(() => {
    let interval: number | undefined;

    if (isSimulating) {
      interval = window.setInterval(() => {
        triggerInstantScrobble();
      }, 30000); // Scrobble simulated track every 30 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimulating]);

  const recordScrobble = (data: Omit<Scrobble, 'id' | 'timestamp'>) => {
    const newScrobble = storageService.addScrobble(data);
    setScrobbles(storageService.getScrobbles());
    setRecentAutoLogged(newScrobble);
  };

  const recordTrackPlay = (track: Track) => {
    const album = storageService.getAlbumById(track.albumId);
    recordScrobble({
      trackTitle: track.title,
      artist: track.artist,
      albumTitle: track.albumTitle || album?.title || 'Single',
      albumCover: album?.coverUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      source: 'preview',
      reviewed: false,
      isIndonesian: track.isIndonesian ?? album?.isIndonesian ?? true
    });
  };

  const triggerInstantScrobble = () => {
    const albums = storageService.getAlbums();
    if (albums.length === 0) {
      recordScrobble({
        trackTitle: 'Hati-Hati di Jalan',
        artist: 'Tulus',
        albumTitle: 'Manusia',
        albumCover: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/6f/18/10/6f1810e0-2d6a-a456-1362-de607c70408a/cover.jpg/600x600bb.jpg',
        source: 'spotify',
        reviewed: false,
        isIndonesian: true
      });
      return;
    }

    const randomAlbum = albums[Math.floor(Math.random() * albums.length)];
    const trackTitle = randomAlbum.tracklist && randomAlbum.tracklist.length > 0
      ? randomAlbum.tracklist[Math.floor(Math.random() * randomAlbum.tracklist.length)].title
      : randomAlbum.title;

    recordScrobble({
      trackTitle,
      artist: randomAlbum.artist,
      albumTitle: randomAlbum.title,
      albumCover: randomAlbum.coverUrl,
      source: 'spotify',
      reviewed: false,
      isIndonesian: randomAlbum.isIndonesian
    });
  };

  const toggleSimulation = () => {
    setIsSimulating(prev => !prev);
  };

  const clearAutoLogNotification = () => {
    setRecentAutoLogged(null);
  };

  const syncLastFm = async (username: string): Promise<number> => {
    const synced = await lastfmApi.syncUserScrobbles(username);
    setScrobbles(storageService.getScrobbles());
    if (synced.length > 0) {
      setRecentAutoLogged(synced[0]);
    }
    return synced.length;
  };

  const markAsReviewed = (albumTitle: string) => {
    storageService.markScrobbleReviewed(albumTitle);
    setScrobbles(storageService.getScrobbles());
  };

  return (
    <ScrobbleContext.Provider
      value={{
        scrobbles,
        recentAutoLogged,
        isSimulating,
        clearAutoLogNotification,
        recordScrobble,
        recordTrackPlay,
        toggleSimulation,
        triggerInstantScrobble,
        syncLastFm,
        markAsReviewed
      }}
    >
      {children}
    </ScrobbleContext.Provider>
  );
};

export const useScrobble = () => {
  const context = useContext(ScrobbleContext);
  if (!context) throw new Error('useScrobble must be used within ScrobbleProvider');
  return context;
};
