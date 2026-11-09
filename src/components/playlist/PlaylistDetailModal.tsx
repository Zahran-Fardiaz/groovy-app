import React, { useState } from 'react';
import { X, Play, Pause, Trash2, Heart, Music, Disc } from 'lucide-react';
import { Playlist, Track } from '../../types/music';
import { useAuth } from '../../context/AuthContext';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import './PlaylistDetailModal.css';

interface PlaylistDetailModalProps {
  playlist: Playlist | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenAlbum?: (albumId: string) => void;
  onToast?: (message: string) => void;
}

const formatDuration = (ms?: number) => {
  if (!ms) return '0:30';
  const sec = Math.floor(ms / 1000);
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
};

export const PlaylistDetailModal: React.FC<PlaylistDetailModalProps> = ({
  playlist,
  isOpen,
  onClose,
  onOpenAlbum,
  onToast
}) => {
  const { deletePlaylist, removeTrackFromPlaylist, isFavoriteTrack, toggleFavoriteTrack } = useAuth();
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = useMusicPlayer();
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen || !playlist) return null;

  const handleDeletePlaylist = () => {
    deletePlaylist(playlist.id);
    onToast?.(`Playlist "${playlist.title}" dihapus`);
    onClose();
  };

  const handleRemoveTrack = (trackId: string, trackTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeTrackFromPlaylist(playlist.id, trackId);
    onToast?.(`"${trackTitle}" dihapus dari playlist`);
  };

  const handlePlayTrack = (track: Track, e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentTrack?.id === track.id) {
      togglePlayPause();
    } else {
      playTrack(track);
    }
  };

  const handleToggleFavorite = (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isFav = toggleFavoriteTrack(trackId);
    onToast?.(isFav ? 'Ditambahkan ke favorit' : 'Dihapus dari favorit');
  };

  return (
    <div className="playlist-detail-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="playlist-detail-sheet" onClick={e => e.stopPropagation()}>
        <div className="playlist-detail-handle" aria-hidden="true" />

        {/* Header */}
        <header className="playlist-detail-header">
          <div className="playlist-detail-hero">
            <div className="playlist-detail-cover-box">
              {playlist.coverUrl ? (
                <img src={playlist.coverUrl} alt="" className="playlist-detail-cover-img" />
              ) : (
                <div className="playlist-detail-cover-empty">
                  <Disc size={28} />
                </div>
              )}
            </div>

            <div className="playlist-detail-titles">
              <span className="playlist-detail-badge">Playlist Pribadi</span>
              <h2 className="playlist-detail-name">{playlist.title}</h2>
              {playlist.description && (
                <p className="playlist-detail-desc">{playlist.description}</p>
              )}
              <span className="playlist-detail-track-count">{playlist.tracks.length} trek</span>
            </div>
          </div>

          <div className="playlist-detail-header-actions">
            {!confirmDelete ? (
              <button
                type="button"
                className="playlist-detail-del-btn"
                onClick={() => setConfirmDelete(true)}
                title="Hapus playlist"
                aria-label="Hapus playlist"
              >
                <Trash2 size={16} />
              </button>
            ) : (
              <div className="playlist-delete-confirm-box">
                <span className="confirm-delete-text">Hapus playlist?</span>
                <button
                  type="button"
                  className="confirm-yes-btn"
                  onClick={handleDeletePlaylist}
                >
                  Ya
                </button>
                <button
                  type="button"
                  className="confirm-no-btn"
                  onClick={() => setConfirmDelete(false)}
                >
                  Batal
                </button>
              </div>
            )}

            <button
              type="button"
              className="playlist-detail-close-btn"
              onClick={onClose}
              aria-label="Tutup"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        {/* Tracks List */}
        <div className="playlist-detail-tracklist">
          {playlist.tracks.length > 0 ? (
            playlist.tracks.map((track, idx) => {
              const isCurrentPlaying = currentTrack?.id === track.id && isPlaying;
              const isFav = isFavoriteTrack(track.id);

              return (
                <div
                  key={track.id || idx}
                  className={`playlist-track-row ${currentTrack?.id === track.id ? 'is-active-track' : ''}`}
                  onClick={() => {
                    if (track.albumId && onOpenAlbum) {
                      onOpenAlbum(track.albumId);
                      onClose();
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <button
                    type="button"
                    className={`playlist-track-play-btn ${isCurrentPlaying ? 'playing' : ''}`}
                    onClick={e => handlePlayTrack(track, e)}
                    aria-label={isCurrentPlaying ? 'Pause' : 'Play'}
                  >
                    {isCurrentPlaying ? <Pause size={14} /> : <Play size={14} />}
                  </button>

                  <div className="playlist-track-info">
                    <span className="playlist-track-title">{track.title}</span>
                    <span className="playlist-track-artist">
                      {track.artist} {track.albumTitle && `· ${track.albumTitle}`}
                    </span>
                  </div>

                  <div className="playlist-track-meta">
                    <span className="playlist-track-duration">
                      {formatDuration(track.durationMs)}
                    </span>

                    <button
                      type="button"
                      className={`playlist-track-fav-btn ${isFav ? 'favorited' : ''}`}
                      onClick={e => handleToggleFavorite(track.id, e)}
                      aria-label="Favorit lagu"
                    >
                      <Heart size={14} fill={isFav ? '#ef4444' : 'none'} />
                    </button>

                    <button
                      type="button"
                      className="playlist-track-remove-btn"
                      onClick={e => handleRemoveTrack(track.id, track.title, e)}
                      title="Hapus dari playlist"
                      aria-label="Hapus dari playlist"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="playlist-detail-empty">
              <Music size={28} className="empty-music-icon" />
              <h4>Playlist ini masih kosong</h4>
              <p>Buka detail album dan ketuk ikon "+" untuk menambahkan lagu ke playlist ini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
