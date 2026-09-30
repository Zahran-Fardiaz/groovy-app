import React, { useState, useEffect } from 'react';
import { Search, X, Star, Disc3, SlidersHorizontal } from 'lucide-react';
import { Album } from '../types/music';
import { musicApi } from '../services/musicApi';

interface SearchViewProps {
  onOpenAlbum: (albumId: string) => void;
}

const GENRE_TAGS = [
  { id: 'All', label: 'All' },
  { id: 'Pop Indonesia', label: 'Pop Indo' },
  { id: 'Indie Lokal', label: 'Indie Lokal' },
  { id: 'Rock Indo', label: 'Rock Indo' },
  { id: 'Folk / Akustik', label: 'Folk' },
  { id: 'Art Rock', label: 'Art Rock' },
  { id: 'R&B / Soul', label: 'R&B' },
  { id: 'Electronic', label: 'Electronic' },
  { id: 'Alternative', label: 'Alt' },
];

export const SearchView: React.FC<SearchViewProps> = ({ onOpenAlbum }) => {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [onlyIndonesian, setOnlyIndonesian] = useState(true);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        let searchQuery = query.trim();
        if (!searchQuery && selectedTag !== 'All') {
          searchQuery = selectedTag.trim();
        }

        const country = onlyIndonesian ? 'ID' : 'US';
        const results = searchQuery
          ? await musicApi.searchAlbums(searchQuery, country)
          : await musicApi.fetchRecentReleases(country);
        setAlbums(results);
      } catch (e) {
        console.error('Search failed', e);
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query, selectedTag, onlyIndonesian]);

  const filteredAlbums = albums.filter(album => {
    if (onlyIndonesian && !album.isIndonesian) return false;
    return true;
  });

  return (
    <div className="search-view-root">

      {/* ── Search Header ── */}
      <div className="search-view-header">
        <h1 className="search-view-title">Discover</h1>
        <button
          id="search-origin-toggle"
          className={`search-origin-toggle ${onlyIndonesian ? 'active' : ''}`}
          onClick={() => setOnlyIndonesian(!onlyIndonesian)}
          aria-label={`Indonesian catalog: ${onlyIndonesian ? 'on' : 'off'}`}
        >
          <Disc3 size={13} />
          <span>{onlyIndonesian ? 'Indonesian' : 'Global'}</span>
        </button>
      </div>

      {/* ── Search Input ── */}
      <div className="search-input-wrap">
        <Search size={15} className="search-input-icon" aria-hidden="true" />
        <input
          id="search-music-input"
          type="text"
          className="search-input-field"
          placeholder="Search tracks, artists, or albums…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
        {query && (
          <button
            className="search-input-clear"
            onClick={() => setQuery('')}
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* ── Genre Capsule Bar ── */}
      <div className="search-genre-section">
        <div className="search-genre-track" role="listbox" aria-label="Genre filter">
          {GENRE_TAGS.map(tag => {
            const isActive = selectedTag === tag.id;
            return (
              <button
                key={tag.id}
                id={`genre-tag-${tag.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                role="option"
                aria-selected={isActive}
                className={`search-genre-capsule ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setSelectedTag(tag.id);
                  if (tag.id !== 'All') setQuery('');
                }}
              >
                {tag.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Results Header ── */}
      <div className="search-results-header">
        <div className="search-results-title-wrap">
          <SlidersHorizontal size={14} className="search-results-icon" />
          <h2 className="search-results-title">
            {query ? `Results for "${query}"` : selectedTag !== 'All' ? selectedTag : 'Recent Releases'}
          </h2>
        </div>
        <span className="search-results-count" aria-live="polite">
          {isLoading ? (
            <span className="search-loading-dot-wrap">
              <span className="search-loading-dot" />
              <span className="search-loading-dot" />
              <span className="search-loading-dot" />
            </span>
          ) : (
            `${filteredAlbums.length} albums`
          )}
        </span>
      </div>

      {/* ── Album Grid ── */}
      {filteredAlbums.length > 0 ? (
        <div className="search-album-grid">
          {filteredAlbums.map(album => {
            const score = Number.isFinite(album.averageRating) && album.averageRating > 0
              ? Math.min(100, Math.round(album.averageRating * 20))
              : null;

            return (
              <div
                key={album.id}
                id={`album-card-${album.id}`}
                className="search-album-card"
                onClick={() => onOpenAlbum(album.id)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && onOpenAlbum(album.id)}
              >
                {/* Artwork Sleeve */}
                <div className="search-album-sleeve">
                  <img
                    src={album.coverUrl}
                    alt={album.title}
                    className="search-album-img"
                    loading="lazy"
                  />

                  {/* Origin Pill */}
                  <span className="search-album-origin-pill">
                    {album.isIndonesian ? 'Indo' : 'Global'}
                  </span>

                  {/* Score Badge */}
                  {score !== null && (
                    <span className="search-album-score-badge" aria-label={`${score} out of 100`}>
                      <Star size={9} fill="currentColor" strokeWidth={0} />
                      {score}
                    </span>
                  )}
                </div>

                {/* Meta */}
                <div className="search-album-meta">
                  <p className="search-album-title">{album.title}</p>
                  <p className="search-album-artist">{album.artist}</p>
                  <div className="search-album-footer">
                    <span className="search-album-year">{album.releaseYear}</span>
                    {album.genres[0] && (
                      <span className="search-album-genre">{album.genres[0]}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        !isLoading && (
          <div className="search-empty-state">
            <Disc3 size={36} className="search-empty-icon" />
            <p className="search-empty-title">No albums found</p>
            <p className="search-empty-sub">Try a different search or genre filter</p>
          </div>
        )
      )}
    </div>
  );
};
