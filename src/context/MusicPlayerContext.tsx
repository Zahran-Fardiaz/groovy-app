import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Track } from '../types/music';

interface MusicPlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number; // 0 to 100
  currentTime: number; // in seconds
  duration: number; // in seconds
  playTrack: (track: Track) => void;
  togglePlayPause: () => void;
  pauseTrack: () => void;
  seekTo: (percent: number) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export const MusicPlayerProvider: React.FC<{
  children: React.ReactNode;
  onScrobbleTrack?: (track: Track) => void;
}> = ({ children, onScrobbleTrack }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrobbledRef = useRef<string | null>(null);
  const timerRef = useRef<number | null>(null);

  // Initialize Audio element
  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100);

        // Auto-scrobble trigger if listened to >= 10s of 30s preview
        if (
          audio.currentTime >= 10 &&
          currentTrack &&
          scrobbledRef.current !== currentTrack.id
        ) {
          scrobbledRef.current = currentTrack.id;
          if (onScrobbleTrack) {
            onScrobbleTrack(currentTrack);
          }
        }
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    const handleError = () => {
      console.warn('Audio preview load error or CORS issue, continuing in simulated player mode');
      // If audio can't load, start simulated 30s playback timer for seamless prototype demo
      if (isPlaying) {
        startSimulatedPlayback();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentTrack, onScrobbleTrack]);

  const startSimulatedPlayback = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setDuration(30);
    timerRef.current = window.setInterval(() => {
      setCurrentTime(prev => {
        const next = prev + 1;
        if (next >= 30) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsPlaying(false);
          setProgress(0);
          return 0;
        }
        setProgress((next / 30) * 100);

        if (next >= 10 && currentTrack && scrobbledRef.current !== currentTrack.id) {
          scrobbledRef.current = currentTrack.id;
          if (onScrobbleTrack) onScrobbleTrack(currentTrack);
        }
        return next;
      });
    }, 1000);
  };

  const playTrack = (track: Track) => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (currentTrack?.id === track.id) {
      togglePlayPause();
      return;
    }

    setCurrentTrack(track);
    scrobbledRef.current = null;
    setProgress(0);
    setCurrentTime(0);

    if (audioRef.current) {
      if (track.previewUrl) {
        audioRef.current.src = track.previewUrl;
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            setIsPlaying(true);
            startSimulatedPlayback();
          });
      } else {
        // Simulated playback if no preview URL is available
        setIsPlaying(true);
        startSimulatedPlayback();
      }
    }
  };

  const togglePlayPause = () => {
    if (!currentTrack) return;

    if (isPlaying) {
      pauseTrack();
    } else {
      if (audioRef.current && audioRef.current.src) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            setIsPlaying(true);
            startSimulatedPlayback();
          });
      } else {
        setIsPlaying(true);
        startSimulatedPlayback();
      }
    }
  };

  const pauseTrack = () => {
    setIsPlaying(false);
    if (audioRef.current) audioRef.current.pause();
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const seekTo = (percent: number) => {
    const targetTime = (percent / 100) * duration;
    setCurrentTime(targetTime);
    setProgress(percent);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = targetTime;
    }
  };

  return (
    <MusicPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        currentTime,
        duration,
        playTrack,
        togglePlayPause,
        pauseTrack,
        seekTo
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (!context) throw new Error('useMusicPlayer must be used within MusicPlayerProvider');
  return context;
};
