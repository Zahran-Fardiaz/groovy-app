import React from 'react';
import { Play, Pause, Star, Disc, Sparkles } from 'lucide-react';
import { Album } from '../../types/music';
import { useMusicPlayer } from '../../context/MusicPlayerContext';

interface HeroSpotlightProps {
  album: Album;
  onOpenAlbum: (albumId: string) => void;
  onOpenQuickLog: (album: Album) => void;
}

export const HeroSpotlight: React.FC<HeroSpotlightProps> = ({
  album,
  onOpenAlbum,
  onOpenQuickLog
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = useMusicPlayer();

  const isCurrentAlbumPlaying = isPlaying && currentTrack?.albumId === album.id;

  const handlePlayToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentAlbumPlaying) {
      togglePlayPause();
    } else {
      // Find track or construct a preview track from album
      const previewTrack = album.tracklist?.[0] || {
        id: `track-${album.id}-1`,
        title: album.title,
        artist: album.artist,
        albumTitle: album.title,
        albumId: album.id,
        durationMs: 30000,
        trackNumber: 1,
        previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/c3/0d/18/c30d18cb-09a8-e1fa-b7cb-00e9ecbe8f0e/mzaf_13508197175402633010.plus.aac.p.m4a',
        isIndonesian: album.isIndonesian
      };
      playTrack(previewTrack);
    }
  };

  return (
    <div className="hero-spotlight-wrap" id="main-hero-spotlight">
      <div className="hero-ambient-glow" />

      <div className="hero-content">
        {/* Top Badges */}
        <div className="hero-badge-row">
          <div className="hero-tag-spotlight">
            <Sparkles size={11} /> Spotlight LP
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {album.isIndonesian && (
              <span className="hero-tag-indonesia">
                <Disc size={10} color="var(--accent)" />
                <span>Indo Scene</span>
              </span>
            )}
            <span className="hero-pill gold">
              <Star size={10} fill="#f59e0b" strokeWidth={0} />
              {album.averageRating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Vinyl & Cover Stage */}
        <div className="hero-vinyl-stage">
          <div
            className="hero-sleeve-container"
            onClick={() => onOpenAlbum(album.id)}
            title={`View ${album.title} by ${album.artist}`}
          >
            <img
              src={album.coverUrl}
              alt={album.title}
              className="hero-album-art"
            />
            {/* Spinning Vinyl Record peeking out */}
            <div className={`hero-vinyl-disc ${isCurrentAlbumPlaying ? 'playing' : ''}`}>
              <div className="vinyl-grooves" />
              <div className="vinyl-label">
                <div className="vinyl-hole" />
              </div>
            </div>
          </div>

          <div className="hero-meta">
            <h2
              className="hero-album-title"
              onClick={() => onOpenAlbum(album.id)}
            >
              {album.title}
            </h2>
            <div className="hero-artist-name">{album.artist}</div>

            <div className="hero-stat-pills">
              <span className="hero-pill">
                <Disc size={10} /> {album.trackCount || 10} tracks
              </span>
              <span className="hero-pill">
                {album.releaseYear}
              </span>
              {album.genres?.[0] && (
                <span className="hero-pill">
                  {album.genres[0]}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="hero-action-bar">
          <button
            id="hero-btn-play-preview"
            className={`hero-btn-play ${isCurrentAlbumPlaying ? 'playing' : ''}`}
            onClick={handlePlayToggle}
            title={isCurrentAlbumPlaying ? 'Pause 30s preview' : 'Play 30s audio sample'}
          >
            {isCurrentAlbumPlaying ? (
              <>
                <div className="sound-bars-wrap">
                  <div className="sound-bar" />
                  <div className="sound-bar" />
                  <div className="sound-bar" />
                </div>
                <span>Playing</span>
                <Pause size={13} fill="currentColor" />
              </>
            ) : (
              <>
                <Play size={13} fill="currentColor" />
                <span>Play Sample</span>
              </>
            )}
          </button>

          <button
            id="hero-btn-quick-log"
            className="hero-btn-log"
            onClick={() => onOpenQuickLog(album)}
            title="Log or review this album"
          >
            <Star size={13} />
            <span>Rate / Log</span>
          </button>
        </div>
      </div>
    </div>
  );
};
