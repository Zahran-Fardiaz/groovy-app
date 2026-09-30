import React from 'react';
import { Play, Pause, ChevronRight, Star } from 'lucide-react';
import { Album } from '../../types/music';
import { useMusicPlayer } from '../../context/MusicPlayerContext';

interface PopularSongsShelfProps {
  albums: Album[];
  onOpenAlbum: (albumId: string) => void;
  onOpenQuickLog: (album: Album) => void;
  onSeeAll?: () => void;
}

// Alternating mood ribbon colors matching the design system
const MOOD_COLORS = [
  '#00f0ff', // Cyan
  '#ff6b35', // Orange / Amber
  '#a855f7', // Violet
  '#38bdf8', // Sky Blue
  '#d4ff32', // Sonic Citron
];

export const PopularSongsShelf: React.FC<PopularSongsShelfProps> = ({
  albums,
  onOpenAlbum,
  onOpenQuickLog,
  onSeeAll
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = useMusicPlayer();

  if (!albums || albums.length === 0) return null;

  const handlePlayToggle = (e: React.MouseEvent, album: Album) => {
    e.stopPropagation();
    if (isPlaying && currentTrack?.albumId === album.id) {
      togglePlayPause();
    } else {
      const track = album.tracklist?.[0] || {
        id: `track-${album.id}`,
        title: album.title,
        artist: album.artist,
        albumTitle: album.title,
        albumId: album.id,
        durationMs: 30000,
        trackNumber: 1,
        previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/c3/0d/18/c30d18cb-09a8-e1fa-b7cb-00e9ecbe8f0e/mzaf_13508197175402633010.plus.aac.p.m4a',
        isIndonesian: album.isIndonesian
      };
      playTrack(track);
    }
  };

  return (
    <section className="feed-popular-section" aria-label="Popular Songs">
      <div className="feed-popular-header">
        <h2 className="feed-popular-title">Popular Songs</h2>
        {onSeeAll && (
          <button
            className="feed-see-all-btn"
            onClick={onSeeAll}
            title="View all songs"
          >
            <span>See all</span>
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      <div className="popular-songs-scroll">
        {albums.map((album, idx) => {
          const isPlayingThis = isPlaying && currentTrack?.albumId === album.id;
          const moodColor = MOOD_COLORS[idx % MOOD_COLORS.length];
          const primarySongTitle = album.tracklist?.[0]?.title || album.title;

          return (
            <div
              key={album.id}
              className="popular-song-card"
              onClick={() => onOpenAlbum(album.id)}
              id={`popular-song-${album.id}`}
            >
              {/* Artwork Sleeve with Play Trigger */}
              <div className="popular-sleeve-wrap">
                <img
                  src={album.coverUrl}
                  alt={album.title}
                  className="popular-sleeve-img"
                  loading="lazy"
                />

                {/* Ambient vignette */}
                <div className="popular-sleeve-overlay" />

                {/* Play / Waveform Trigger Button */}
                <button
                  className={`popular-play-btn ${isPlayingThis ? 'playing' : ''}`}
                  onClick={(e) => handlePlayToggle(e, album)}
                  title={isPlayingThis ? 'Pause preview' : 'Play audio preview'}
                  aria-label={isPlayingThis ? 'Pause' : 'Play'}
                >
                  {isPlayingThis ? (
                    <Pause size={14} fill="#0b0d13" color="#0b0d13" />
                  ) : (
                    <Play size={14} fill="#0b0d13" color="#0b0d13" style={{ marginLeft: '2px' }} />
                  )}
                </button>

                {/* Quick Log Action */}
                <button
                  className="popular-log-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenQuickLog(album);
                  }}
                  title="Rate or review"
                  aria-label="Rate or review"
                >
                  <Star size={11} fill="#ffffff" color="#ffffff" />
                </button>
              </div>

              {/* Details & Signature Mood Ribbon */}
              <div className="popular-meta-wrap">
                <div className="popular-title-row">
                  <span
                    className="popular-mood-indicator"
                    style={{ backgroundColor: moodColor, boxShadow: `0 0 8px ${moodColor}` }}
                  />
                  <span className="popular-song-title" title={primarySongTitle}>
                    {primarySongTitle}
                  </span>
                </div>

                <div className="popular-artist-row">
                  <span className="popular-artist-name" title={album.artist}>
                    {album.artist}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
export default PopularSongsShelf;
