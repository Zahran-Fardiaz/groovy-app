import React, { useState, useMemo } from 'react';
import { Plus, X, Search, Sparkles, Trash2, Check, Disc3 } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { Album } from '../../types/music';

interface TopFourShowcaseProps {
  topAlbumIds: string[];
  isOwner?: boolean;
  onOpenAlbum: (albumId: string) => void;
}

export const TopFourShowcase: React.FC<TopFourShowcaseProps> = ({
  topAlbumIds,
  isOwner = true,
  onOpenAlbum
}) => {
  const { updateTopFour, currentUser } = useAuth();
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'reviewed' | 'indonesian'>('all');

  const allAlbums = useMemo(() => storageService.getAlbums(), []);
  const myReviews = useMemo(
    () => storageService.getReviews().filter(r => r.userId === currentUser.id),
    [currentUser.id]
  );

  const reviewedAlbumIds = useMemo(
    () => new Set(myReviews.map(r => r.albumId)),
    [myReviews]
  );

  const filteredAlbums = useMemo(() => {
    let list = allAlbums;
    if (filterMode === 'reviewed') {
      list = list.filter(a => reviewedAlbumIds.has(a.id));
    } else if (filterMode === 'indonesian') {
      list = list.filter(a => a.isIndonesian || a.origin === 'Indonesia');
    }

    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      a =>
        a.title.toLowerCase().includes(q) ||
        a.artist.toLowerCase().includes(q) ||
        (a.genres && a.genres.some(g => g.toLowerCase().includes(q)))
    );
  }, [allAlbums, filterMode, searchQuery, reviewedAlbumIds]);

  const handleSelectAlbum = (albumId: string) => {
    if (activeSlot === null) return;
    const ids = Array.from({ length: 4 }, (_, idx) => topAlbumIds[idx] || '');
    ids[activeSlot] = albumId;
    updateTopFour(ids);
    setActiveSlot(null);
    setSearchQuery('');
  };

  const handleClearSlot = (slotIndex: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const ids = Array.from({ length: 4 }, (_, idx) => topAlbumIds[idx] || '');
    ids[slotIndex] = '';
    updateTopFour(ids);
    if (activeSlot === slotIndex) {
      setActiveSlot(null);
      setSearchQuery('');
    }
  };

  return (
    <section className="profile-top-four-section" aria-labelledby="profile-favorites-heading">
      {/* Section Header */}
      <div className="section-header-row">
        <div>
          <h2 id="profile-favorites-heading" className="profile-section-title">
            Top 4 Favorites
          </h2>
          <span className="profile-section-subtitle">Your defining records</span>
        </div>
        {isOwner && (
          <button
            className="profile-curator-action-btn"
            onClick={() => setActiveSlot(0)}
            aria-label="Edit showcase favorites"
          >
            Manage Slots
          </button>
        )}
      </div>

      {/* 4 Vinyl Showcase Grid */}
      <div className="top-four-vinyl-grid">
        {[0, 1, 2, 3].map(index => {
          const albumId = topAlbumIds[index];
          const album: Album | undefined = albumId ? storageService.getAlbumById(albumId) : undefined;
          const isSlotActive = activeSlot === index;

          return (
            <div
              key={index}
              className={`top-four-card ${album ? 'has-album' : 'empty'} ${isSlotActive ? 'is-picking' : ''}`}
            >
              {/* Vinyl Sleeve Container */}
              <div
                className="vinyl-sleeve-wrap"
                onClick={() => {
                  if (album && !isOwner) {
                    onOpenAlbum(album.id);
                  } else if (isOwner) {
                    setActiveSlot(index);
                  }
                }}
              >
                {/* Simulated Vinyl Record Edge Peeking */}
                {album && (
                  <div className="vinyl-peeking-disc" aria-hidden="true">
                    <div className="vinyl-groove-rings" />
                    <div className="vinyl-center-label" />
                  </div>
                )}

                {/* Sleeve Cover or Empty State */}
                <div className="vinyl-sleeve-front">
                  {album ? (
                    <img
                      src={album.coverUrl}
                      alt={album.title}
                      className="vinyl-cover-img"
                      loading="lazy"
                    />
                  ) : (
                    <div className="vinyl-empty-placeholder">
                      <Plus size={22} className="empty-plus-icon" />
                      <span className="empty-add-text">Add #{index + 1}</span>
                    </div>
                  )}

                  {/* Rank Badge */}
                  <span className={`vinyl-rank-badge ${index === 0 ? 'crown-rank' : ''}`}>
                    #{index + 1}
                  </span>

                  {/* Quick Edit Overlay for Owners */}
                  {isOwner && album && (
                    <div className="vinyl-hover-action" title="Change or remove favorite">
                      <span>Change</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Album Metadata Underneath */}
              {album ? (
                <div
                  className="top-four-meta"
                  onClick={() => onOpenAlbum(album.id)}
                  title={`${album.title} — ${album.artist}`}
                >
                  <h4 className="top-four-album-title">{album.title}</h4>
                  <p className="top-four-artist-name">{album.artist}</p>
                </div>
              ) : (
                <div className="top-four-meta empty-meta">
                  <span className="empty-slot-label">Empty Slot</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="top-four-footer-hint">
        Four defining records that capture your soundscape and musical identity.
      </p>

      {/* Modern Album Picker Modal */}
      {activeSlot !== null && (
        <div className="album-picker-backdrop" onClick={() => setActiveSlot(null)}>
          <div
            className="album-picker-sheet"
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="picker-title"
          >
            {/* Header */}
            <div className="picker-header">
              <div className="picker-header-titles">
                <span className="picker-kicker">Slot #{activeSlot + 1} Selection</span>
                <h3 id="picker-title">Pick Your Favorite Album</h3>
              </div>
              <button
                className="picker-close-btn"
                onClick={() => setActiveSlot(null)}
                aria-label="Close album picker"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search Bar */}
            <div className="picker-search-bar">
              <Search size={16} className="picker-search-icon" />
              <input
                type="text"
                className="picker-search-input"
                placeholder="Search by title, artist, or genre..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                autoFocus
              />
              {searchQuery && (
                <button
                  className="picker-search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="picker-filter-chips">
              <button
                className={`picker-chip ${filterMode === 'all' ? 'active' : ''}`}
                onClick={() => setFilterMode('all')}
              >
                All Catalog ({allAlbums.length})
              </button>
              <button
                className={`picker-chip ${filterMode === 'reviewed' ? 'active' : ''}`}
                onClick={() => setFilterMode('reviewed')}
              >
                Your Reviews ({reviewedAlbumIds.size})
              </button>
              <button
                className={`picker-chip ${filterMode === 'indonesian' ? 'active' : ''}`}
                onClick={() => setFilterMode('indonesian')}
              >
                Indonesian
              </button>
            </div>

            {/* Slot Clear Action if slot currently populated */}
            {topAlbumIds[activeSlot] && (
              <div className="picker-clear-row">
                <span className="picker-clear-info">
                  Current: <strong>{storageService.getAlbumById(topAlbumIds[activeSlot])?.title || 'Selected'}</strong>
                </span>
                <button
                  type="button"
                  className="picker-remove-btn"
                  onClick={() => handleClearSlot(activeSlot)}
                >
                  <Trash2 size={13} />
                  Clear this slot
                </button>
              </div>
            )}

            {/* Albums List */}
            <div className="picker-album-list">
              {filteredAlbums.length > 0 ? (
                filteredAlbums.map(item => {
                  const isSelectedForThisSlot = topAlbumIds[activeSlot] === item.id;
                  const isAssignedElsewhere =
                    topAlbumIds.includes(item.id) && !isSelectedForThisSlot;

                  return (
                    <div
                      key={item.id}
                      className={`picker-album-row ${isSelectedForThisSlot ? 'is-selected' : ''}`}
                      onClick={() => handleSelectAlbum(item.id)}
                    >
                      <img
                        src={item.coverUrl}
                        alt={item.title}
                        className="picker-album-cover"
                        loading="lazy"
                      />
                      <div className="picker-album-info">
                        <div className="picker-album-title-line">
                          <h4>{item.title}</h4>
                          {item.isIndonesian && (
                            <span className="picker-indo-badge">Indo</span>
                          )}
                        </div>
                        <p className="picker-album-sub">
                          {item.artist} • {item.releaseYear}
                          {item.genres && item.genres.length > 0 && ` • ${item.genres[0]}`}
                        </p>
                      </div>

                      <div className="picker-row-actions">
                        {isSelectedForThisSlot ? (
                          <span className="picker-selected-pill">
                            <Check size={12} /> Selected
                          </span>
                        ) : isAssignedElsewhere ? (
                          <span className="picker-assigned-pill">
                            In Slot #{topAlbumIds.indexOf(item.id) + 1}
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="picker-select-btn"
                            onClick={e => {
                              e.stopPropagation();
                              handleSelectAlbum(item.id);
                            }}
                          >
                            Set #{activeSlot + 1}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="picker-empty-state">
                  <Disc3 size={32} className="picker-empty-disc" />
                  <h4>No albums found</h4>
                  <p>Try searching for a different artist or release title.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
