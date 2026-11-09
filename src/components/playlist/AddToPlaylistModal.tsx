import React, { useState } from 'react';
import { X, Plus, Check, ListMusic, Music, Disc } from 'lucide-react';
import { Track, Album } from '../../types/music';
import { useAuth } from '../../context/AuthContext';
import './AddToPlaylistModal.css';

export type PlaylistItemTarget = 
  | { type: 'track'; track: Track; albumCover?: string }
  | { type: 'album'; album: Album };

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: PlaylistItemTarget | null;
  onSuccess?: (message: string) => void;
}

export const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({
  isOpen,
  onClose,
  target,
  onSuccess
}) => {
  const { playlists, createPlaylist, addTrackToPlaylist, addAlbumToPlaylist } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  if (!isOpen || !target) return null;

  const itemTitle = target.type === 'track' ? target.track.title : target.album.title;
  const itemArtist = target.type === 'track' ? target.track.artist : target.album.artist;
  const itemCover = target.type === 'track' ? target.albumCover : target.album.coverUrl;

  const handleCreateAndAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newPl = createPlaylist(newTitle.trim());
    if (target.type === 'track') {
      addTrackToPlaylist(newPl.id, target.track, target.albumCover);
    } else {
      addAlbumToPlaylist(newPl.id, target.album);
    }

    setNewTitle('');
    setIsCreating(false);
    onSuccess?.(`Ditambahkan ke "${newPl.title}"`);
    onClose();
  };

  const handleSelectPlaylist = (playlistId: string, playlistTitle: string) => {
    if (target.type === 'track') {
      const added = addTrackToPlaylist(playlistId, target.track, target.albumCover);
      if (added) {
        onSuccess?.(`Ditambahkan ke "${playlistTitle}"`);
      } else {
        onSuccess?.(`Sudah ada di "${playlistTitle}"`);
      }
    } else {
      const count = addAlbumToPlaylist(playlistId, target.album);
      onSuccess?.(`${count} lagu ditambahkan ke "${playlistTitle}"`);
    }
    onClose();
  };

  return (
    <div className="add-playlist-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="add-playlist-sheet" onClick={e => e.stopPropagation()}>
        <div className="add-playlist-handle" aria-hidden="true" />

        {/* Header */}
        <header className="add-playlist-header">
          <div className="add-playlist-header-text">
            <span className="add-playlist-badge">Simpan ke Playlist</span>
            <h3 className="add-playlist-title">Pilih Playlist</h3>
          </div>
          <button
            type="button"
            className="add-playlist-close-btn"
            onClick={onClose}
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </header>

        {/* Item preview banner */}
        <div className="add-playlist-target-card">
          {itemCover ? (
            <img src={itemCover} alt="" className="target-card-cover" />
          ) : (
            <div className="target-card-cover fallback">
              <Music size={18} />
            </div>
          )}
          <div className="target-card-info">
            <span className="target-card-type">{target.type === 'track' ? 'Lagu' : 'Album'}</span>
            <strong className="target-card-title">{itemTitle}</strong>
            <span className="target-card-artist">{itemArtist}</span>
          </div>
        </div>

        {/* New Playlist Trigger / Form */}
        <div className="add-playlist-create-section">
          {!isCreating ? (
            <button
              type="button"
              className="add-playlist-new-btn"
              onClick={() => setIsCreating(true)}
            >
              <Plus size={16} />
              <span>Buat Playlist Baru</span>
            </button>
          ) : (
            <form onSubmit={handleCreateAndAdd} className="add-playlist-form">
              <input
                type="text"
                className="add-playlist-input"
                placeholder="Nama playlist..."
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                autoFocus
                maxLength={40}
              />
              <div className="add-playlist-form-actions">
                <button
                  type="button"
                  className="add-playlist-btn-cancel"
                  onClick={() => {
                    setIsCreating(false);
                    setNewTitle('');
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="add-playlist-btn-submit"
                  disabled={!newTitle.trim()}
                >
                  Buat & Tambah
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Playlists List */}
        <div className="add-playlist-list" role="list">
          {playlists.length > 0 ? (
            playlists.map(pl => {
              const isAlreadyAdded =
                target.type === 'track'
                  ? pl.tracks.some(t => t.id === target.track.id)
                  : pl.tracks.length > 0 &&
                    target.album.tracklist?.every(at => pl.tracks.some(pt => pt.id === at.id));

              return (
                <button
                  key={pl.id}
                  type="button"
                  className={`add-playlist-item ${isAlreadyAdded ? 'already-added' : ''}`}
                  onClick={() => handleSelectPlaylist(pl.id, pl.title)}
                >
                  <div className="playlist-item-art">
                    {pl.coverUrl ? (
                      <img src={pl.coverUrl} alt="" />
                    ) : (
                      <div className="playlist-item-art-empty">
                        <Disc size={18} />
                      </div>
                    )}
                  </div>

                  <div className="playlist-item-meta">
                    <span className="playlist-item-title">{pl.title}</span>
                    <span className="playlist-item-count">{pl.tracks.length} lagu</span>
                  </div>

                  <div className="playlist-item-action">
                    {isAlreadyAdded ? (
                      <span className="playlist-item-check" title="Sudah ditambahkan">
                        <Check size={16} />
                      </span>
                    ) : (
                      <span className="playlist-item-add">
                        <Plus size={16} />
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          ) : (
            <div className="add-playlist-empty">
              <ListMusic size={28} className="empty-playlist-icon" />
              <p>Belum ada playlist dibuat.</p>
              <small>Ketik nama playlist di atas untuk membuat playlist pertamamu.</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
