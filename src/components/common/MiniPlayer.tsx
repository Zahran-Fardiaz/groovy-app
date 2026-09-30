import React from 'react';
import { Play, Pause, X, Disc3 } from 'lucide-react';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { storageService } from '../../services/storageService';

interface MiniPlayerProps {
  onOpenAlbum: (albumId: string) => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({ onOpenAlbum }) => {
  const { currentTrack, isPlaying, progress, currentTime, duration, togglePlayPause, pauseTrack, seekTo } = useMusicPlayer();

  if (!currentTrack) return null;

  const album = storageService.getAlbumById(currentTrack.albumId);
  const coverUrl = album?.coverUrl || 'https://upload.wikimedia.org/wikipedia/en/2/2e/In_Rainbows_Official_Cover.jpg';

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="mini-player-dock" id="floating-mini-player">
      {/* Spinning Vinyl Cover */}
      <div
        className={`mini-vinyl-wrapper ${isPlaying ? 'spinning' : ''}`}
        onClick={() => onOpenAlbum(currentTrack.albumId)}
        style={{ cursor: 'pointer' }}
        title="View Album"
      >
        <img src={coverUrl} alt={currentTrack.title} className="mini-vinyl-img" />
      </div>

      {/* Track Information */}
      <div className="mini-player-info">
        <div
          className="mini-player-title"
          onClick={() => onOpenAlbum(currentTrack.albumId)}
          style={{ cursor: 'pointer' }}
        >
          {currentTrack.title}
        </div>
        <div className="mini-player-artist">
          {currentTrack.artist} • <span style={{ color: 'var(--text-muted)' }}>Preview</span>
        </div>

        {/* Progress Bar */}
        <div
          className="mini-progress-bar-bg"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percent = (clickX / rect.width) * 100;
            seekTo(percent);
          }}
        >
          <div
            className="mini-progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="mini-player-controls">
        <span style={{ fontSize: '10px', color: 'var(--text-muted)', minWidth: '24px' }}>
          {formatTime(currentTime)}
        </span>

        <button
          id="mini-player-play-btn"
          className="mini-control-btn play-btn"
          onClick={togglePlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={16} fill="#090a0f" /> : <Play size={16} fill="#090a0f" style={{ marginLeft: '2px' }} />}
        </button>

        <button
          className="mini-control-btn"
          onClick={pauseTrack}
          style={{ color: 'var(--text-muted)' }}
          aria-label="Dismiss mini player"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
