import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, Star, Disc3, SlidersHorizontal, LayoutGrid, List, ChevronDown, Check } from 'lucide-react';
import { Album } from '../types/music';
import { musicApi } from '../services/musicApi';
import { storageService } from '../services/storageService';
import { INDONESIAN_ARTISTS_DATABASE } from '../services/indonesianArtists';
import { GLOBAL_ARTISTS_DATABASE } from '../services/globalArtists';
import { RecommendationsView } from './RecommendationsView';
import { CommunityCharts } from '../components/search/CommunityCharts';
import './SearchView.css';

interface SearchViewProps {
  onOpenAlbum: (albumId: string) => void;
  onOpenArtist?: (artistName: string) => void;
}

export interface TimeRangeOption {
  id: string;
  label: string;
  shortLabel: string;
  queryFallback?: string;
  filter: (album: Album) => boolean;
}

export const TIME_RANGE_OPTIONS: TimeRangeOption[] = [
  {
    id: 'all_time',
    label: 'All Time (Semua Masa)',
    shortLabel: 'All Time',
    filter: () => true
  },
  {
    id: 'this_year',
    label: 'This Year (2026)',
    shortLabel: '2026',
    queryFallback: '2026 album',
    filter: (a) => a.releaseYear === 2026 || (a.releaseDate ? a.releaseDate.startsWith('2026') : false)
  },
  {
    id: '2020s',
    label: '2020s (2020 - 2029)',
    shortLabel: '2020s',
    queryFallback: '2020s hits',
    filter: (a) => a.releaseYear >= 2020 && a.releaseYear <= 2029
  },
  {
    id: '2010s',
    label: '2010s (2010 - 2019)',
    shortLabel: '2010s',
    queryFallback: '2010s hits rock pop',
    filter: (a) => a.releaseYear >= 2010 && a.releaseYear <= 2019
  },
  {
    id: '2000s',
    label: '2000s (2000 - 2009)',
    shortLabel: '2000s',
    queryFallback: '2000s hits rock pop',
    filter: (a) => a.releaseYear >= 2000 && a.releaseYear <= 2009
  },
  {
    id: '1990s',
    label: '1990s (1990 - 1999)',
    shortLabel: '90s',
    queryFallback: '90s classic rock pop grunge',
    filter: (a) => a.releaseYear >= 1990 && a.releaseYear <= 1999
  },
  {
    id: '1980s',
    label: '1980s (1980 - 1989)',
    shortLabel: '80s',
    queryFallback: '80s new wave synth pop rock',
    filter: (a) => a.releaseYear >= 1980 && a.releaseYear <= 1989
  },
  {
    id: '1970s',
    label: '1970s (1970 - 1979)',
    shortLabel: '70s',
    queryFallback: '70s classic rock disco',
    filter: (a) => a.releaseYear >= 1970 && a.releaseYear <= 1979
  },
  {
    id: '1960s',
    label: '1960s (1960 - 1969)',
    shortLabel: '60s',
    queryFallback: '60s rock and roll psychedelic',
    filter: (a) => a.releaseYear >= 1960 && a.releaseYear <= 1969
  },
  {
    id: '1950s',
    label: '1950s (1950 - 1959)',
    shortLabel: '50s',
    queryFallback: '50s jazz rockabilly blues',
    filter: (a) => a.releaseYear >= 1950 && a.releaseYear <= 1959
  },
];

export const GENRE_OPTIONS = [
  { id: 'Pop Indonesia', label: 'Pop Indo' },
  { id: 'Indie Lokal', label: 'Indie Lokal' },
  { id: 'Rock Indo', label: 'Rock Indo' },
  { id: 'Folk / Akustik', label: 'Folk / Akustik' },
  { id: 'Art Rock', label: 'Art Rock' },
  { id: 'R&B / Soul', label: 'R&B / Soul' },
  { id: 'Electronic', label: 'Electronic' },
  { id: 'Alternative', label: 'Alternative' },
  { id: 'Hip Hop', label: 'Hip Hop' },
  { id: 'Party', label: 'Party / Dance' },
  { id: 'Blues', label: 'Blues / Jazz' },
  { id: 'Sad', label: 'Sad / Melancholy' },
];

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';

export const SearchView: React.FC<SearchViewProps> = ({ onOpenAlbum, onOpenArtist }) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'tuner' | 'charts' | 'genre'>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('all_time');
  const [selectedGenre, setSelectedGenre] = useState<string>('Indie Lokal');
  const [openDropdown, setOpenDropdown] = useState<'none' | 'time_range' | 'genre'>('none');
  const [popoverLeft, setPopoverLeft] = useState<number>(180);
  const [onlyIndonesian, setOnlyIndonesian] = useState(true);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [artistPhotoMap, setArtistPhotoMap] = useState<Record<string, string>>({});

  const containerRef = useRef<HTMLElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenDropdown('none');
      }
    };

    if (openDropdown !== 'none') {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  // Is For You / Recommendations or Tuner mode
  const isForYouMode = !query.trim() && (activeTab === 'all' || activeTab === 'tuner');

  // Fetch or filter albums based on activeTab, query, and country
  useEffect(() => {
    const searchQuery = query.trim();

    // 1. Text Search Mode (Universal: queries both Indo & Global Apple Music storefronts)
    if (searchQuery) {
      setIsLoading(true);
      const timer = setTimeout(async () => {
        try {
          const results = await musicApi.searchAlbums(searchQuery);
          setAlbums(results);
        } catch (e) {
          console.error('Search failed', e);
        } finally {
          setIsLoading(false);
        }
      }, 260);
      return () => clearTimeout(timer);
    }

    // 2. Tab: All Picks, Sonic Tuner, or Community Charts
    if (activeTab === 'all' || activeTab === 'tuner' || activeTab === 'charts') {
      setAlbums([]);
      setIsLoading(false);
      return;
    }

    // 4. Tab: Genre Filter (Live iTunes fetch + cache)
    if (activeTab === 'genre') {
      setIsLoading(true);
      const timer = setTimeout(async () => {
        try {
          const country = onlyIndonesian ? 'ID' : 'US';
          const results = await musicApi.searchAlbums(selectedGenre, country);
          setAlbums(results);
        } catch (e) {
          console.error('Genre search failed', e);
        } finally {
          setIsLoading(false);
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [query, activeTab, selectedTimeRange, selectedGenre, onlyIndonesian]);

  // Apply origin filter (only applies when browsing without an active search query)
  const filteredAlbums = albums.filter(album => {
    if (!query.trim()) {
      if (onlyIndonesian && !album.isIndonesian) return false;
      if (!onlyIndonesian && album.isIndonesian) return false;
    }
    return true;
  });

  // Detect if query is searching for an Artist (for dedicated Artist Spotlight Card)
  const matchedArtist = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 2) return null;

    // 1. Check verified Indonesian database
    const indoArtist = INDONESIAN_ARTISTS_DATABASE.find(
      a => a.normalizedName === q || a.name.toLowerCase() === q || (q.length >= 3 && a.normalizedName.includes(q))
    );

    // 2. Check verified Global database
    const globalArtist = GLOBAL_ARTISTS_DATABASE.find(
      a => a.normalizedName === q || a.name.toLowerCase() === q || (q.length >= 3 && a.normalizedName.includes(q))
    );

    // 3. Check returned albums for artist exact or starting match
    const artistFromAlbums = albums.find(
      a => a.artist.toLowerCase() === q || (q.length >= 3 && a.artist.toLowerCase().startsWith(q))
    );

    const artistName = indoArtist?.name || globalArtist?.name || artistFromAlbums?.artist;
    if (!artistName) return null;

    // Releases by this artist in the results
    const matchingAlbums = albums.filter(
      a => a.artist.toLowerCase() === artistName.toLowerCase()
    );

    // If query matches an album title exactly and not the artist name, prioritize the album
    const exactAlbumMatch = albums.find(a => a.title.toLowerCase() === q);
    if (exactAlbumMatch && artistName.toLowerCase() !== q) {
      return null;
    }

    const isIndo = indoArtist ? true : (globalArtist ? false : (matchingAlbums[0]?.isIndonesian ?? false));
    const genre = indoArtist?.genre || globalArtist?.genre || matchingAlbums[0]?.genres[0] || 'Music';
    const avatarUrl = matchingAlbums[0]?.coverUrl || DEFAULT_COVER;

    return {
      name: artistName,
      genre,
      isIndonesian: isIndo,
      avatarUrl,
      albumCount: matchingAlbums.length
    };
  }, [query, albums]);

  // Fetch real artist photo when spotlighted
  useEffect(() => {
    if (!matchedArtist?.name) return;
    const cleanLower = matchedArtist.name.toLowerCase();
    if (artistPhotoMap[cleanLower]) return;

    musicApi.getArtistPhoto(matchedArtist.name).then(photo => {
      if (photo) {
        setArtistPhotoMap(prev => ({ ...prev, [cleanLower]: photo }));
      }
    });
  }, [matchedArtist?.name, artistPhotoMap]);

  const currentTimeOption = TIME_RANGE_OPTIONS.find(t => t.id === selectedTimeRange) || TIME_RANGE_OPTIONS[0];
  const currentGenreOption = GENRE_OPTIONS.find(g => g.id === selectedGenre) || GENRE_OPTIONS[0];

  const getResultsTitle = () => {
    if (query) return `Results for "${query}"`;
    if (activeTab === 'charts') {
      return 'Community Charts';
    }
    if (activeTab === 'genre') {
      return `Genre • ${currentGenreOption.label}`;
    }
    return 'Explore Albums';
  };

  return (
    <div className="search-view-root">
      {/* ── Search Header ── */}
      <div className="search-view-header">
        <h1 className="search-view-title">Discover</h1>
        <button
          id="search-origin-toggle"
          className={`search-origin-toggle ${onlyIndonesian ? 'active' : ''}`}
          onClick={() => setOnlyIndonesian(!onlyIndonesian)}
          aria-label={`Catalog: ${onlyIndonesian ? 'Indonesian' : 'Global'}`}
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

      {/* ── Unified Single Underline Tab Navigation Bar ── */}
      <nav ref={containerRef} className="search-tabs-section" aria-label="Explore Filters">
        <div className="search-tabs-track">
          {/* 1. All Picks (Discover & Recommendations) */}
          <button
            type="button"
            className={`search-underline-tab ${activeTab === 'all' && !query ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('all');
              setQuery('');
              setOpenDropdown('none');
            }}
          >
            <span>All Picks</span>
          </button>

          {/* 2. Sonic Preferences / Sonic Tuner */}
          <button
            type="button"
            className={`search-underline-tab ${activeTab === 'tuner' && !query ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('tuner');
              setQuery('');
              setOpenDropdown('none');
            }}
          >
            <span>Sonic Preferences</span>
          </button>

          {/* 3. Charts (New Section beside Sonic Preferences) */}
          <button
            type="button"
            className={`search-underline-tab ${activeTab === 'charts' && !query ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('charts');
              setQuery('');
              setOpenDropdown('none');
            }}
          >
            <span>Charts</span>
          </button>

          {/* 4. Genre Dropdown */}
          <button
            type="button"
            className={`search-underline-tab ${activeTab === 'genre' && !query ? 'active' : ''}`}
            onClick={() => setOpenDropdown(prev => prev === 'genre' ? 'none' : 'genre')}
            aria-haspopup="listbox"
            aria-expanded={openDropdown === 'genre'}
          >
            <span>
              {activeTab === 'genre' ? `Genre: ${currentGenreOption.label}` : 'Genre'}
            </span>
            <ChevronDown
              size={13}
              style={{
                transition: 'transform 0.2s ease',
                transform: openDropdown === 'genre' ? 'rotate(180deg)' : 'rotate(0deg)'
              }}
            />
          </button>
        </div>



        {/* Genre Dropdown Popover */}
        {openDropdown === 'genre' && (
          <div className="search-dropdown-popover align-right" role="listbox">
            <div className="search-dropdown-header">PILIH GENRE MUSIK</div>
            <div className="search-dropdown-list">
              {GENRE_OPTIONS.map(genre => {
                const isSelected = activeTab === 'genre' && selectedGenre === genre.id;
                return (
                  <button
                    key={genre.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`search-dropdown-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedGenre(genre.id);
                      setActiveTab('genre');
                      setQuery('');
                      setOpenDropdown('none');
                    }}
                  >
                    <span>{genre.label}</span>
                    {isSelected && <Check size={14} color="var(--gds-accent-citron)" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* ── For You Section OR Community Charts OR Search / Filter Results ── */}
      {isForYouMode ? (
        <RecommendationsView
          onOpenAlbum={onOpenAlbum}
          embedded
          activeSection={activeTab === 'tuner' ? 'tuner' : 'all'}
        />
      ) : (!query.trim() && activeTab === 'charts') ? (
        <CommunityCharts
          onOpenAlbum={onOpenAlbum}
          onOpenArtist={onOpenArtist}
        />
      ) : (
        <>
          {/* ── Results Header with View Mode Switcher ── */}
          <div className="search-results-header">
            <div className="search-results-title-wrap">
              <SlidersHorizontal size={14} className="search-results-icon" />
              <h2 className="search-results-title">
                {getResultsTitle()}
              </h2>
            </div>

            <div className="search-results-actions">
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

              <div className="search-view-toggle-wrap" role="group" aria-label="View layout toggle">
                <button
                  className={`search-view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                  aria-label="Grid View"
                >
                  <LayoutGrid size={13} />
                </button>
                <button
                  className={`search-view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                  aria-label="List View"
                >
                  <List size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* ── Top Artist Spotlight Card (when searching by artist) ── */}
          {matchedArtist && (
            <div
              className="search-artist-spotlight"
              onClick={() => {
                if (onOpenArtist) {
                  onOpenArtist(matchedArtist.name);
                } else {
                  setQuery(matchedArtist.name);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`View Artist Page: ${matchedArtist.name}`}
            >
              <div className="search-artist-avatar-wrap">
                <img
                  src={artistPhotoMap[matchedArtist.name.toLowerCase()] || matchedArtist.avatarUrl}
                  alt={matchedArtist.name}
                  className="search-artist-avatar-img"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== DEFAULT_COVER) target.src = DEFAULT_COVER;
                  }}
                />
              </div>
              <div className="search-artist-info">
                <div className="search-artist-badge-row">
                  <span className="search-artist-pill">Artist</span>
                  <span className="search-artist-origin-pill">
                    {matchedArtist.isIndonesian ? 'Indonesia' : 'International'}
                  </span>
                </div>
                <h3 className="search-artist-name">{matchedArtist.name}</h3>
                <p className="search-artist-meta">
                  <span>{matchedArtist.genre}</span>
                  <span className="search-artist-meta-dot">•</span>
                  <span>{matchedArtist.albumCount > 0 ? `${matchedArtist.albumCount} releases found` : 'Popular Artist'}</span>
                </p>
              </div>
            </div>
          )}

          {/* ── Album Grid / List View ── */}
          {filteredAlbums.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="search-album-grid">
                {filteredAlbums.map(album => {
                  const score = Number.isFinite(album.averageRating) && album.averageRating > 0
                    ? (album.averageRating <= 5 ? album.averageRating * 2 : album.averageRating).toFixed(1)
                    : null;

                  return (
                    <button
                      key={album.id}
                      id={`album-card-${album.id}`}
                      className="search-album-card"
                      onClick={() => onOpenAlbum(album.id)}
                      aria-label={`Open ${album.title} by ${album.artist}`}
                    >
                      {/* Artwork Sleeve */}
                      <div className="search-album-sleeve">
                        <img
                          src={album.coverUrl}
                          alt={`${album.title} cover`}
                          className="search-album-img"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (target.src !== DEFAULT_COVER) {
                              target.src = DEFAULT_COVER;
                            }
                          }}
                        />

                        {/* Origin Pill */}
                        <span className="search-album-origin-pill">
                          {album.isIndonesian ? 'Indo' : 'Global'}
                        </span>

                        {/* Score Badge */}
                        {score !== null && (
                          <div className="search-album-score-badge">
                            <Star size={10} fill="currentColor" />
                            <span>{score}</span>
                          </div>
                        )}
                      </div>

                      {/* Meta */}
                      <div className="search-album-meta">
                        <div className="search-album-title" title={album.title}>
                          {album.title}
                        </div>
                        <div
                          className="search-album-artist clickable-artist-link"
                          title={`View ${album.artist} artist profile`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onOpenArtist) {
                              onOpenArtist(album.artist);
                            } else {
                              setQuery(album.artist);
                            }
                          }}
                        >
                          {album.artist}
                        </div>
                        <div className="search-album-subinfo">
                          <span>{album.releaseYear}</span>
                          <span className="search-album-subinfo-dot">•</span>
                          <span>{album.trackCount} tracks</span>
                          {score ? (
                            <>
                              <span className="search-album-subinfo-dot">•</span>
                              <span className="search-album-rating-star">
                                ◎ {score} / 10
                              </span>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="search-album-list">
                {filteredAlbums.map((album, idx) => {
                  const score = Number.isFinite(album.averageRating) && album.averageRating > 0
                    ? (album.averageRating <= 5 ? album.averageRating * 2 : album.averageRating).toFixed(1)
                    : null;

                  return (
                    <button
                      key={album.id}
                      id={`album-row-${album.id}`}
                      className="search-album-row"
                      onClick={() => onOpenAlbum(album.id)}
                      aria-label={`Open ${album.title} by ${album.artist}`}
                    >
                      <span className="search-row-rank">{idx + 1}</span>

                      <div className="search-row-sleeve">
                        <img
                          src={album.coverUrl}
                          alt={`${album.title} cover`}
                          className="search-row-img"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (target.src !== DEFAULT_COVER) {
                              target.src = DEFAULT_COVER;
                            }
                          }}
                        />
                      </div>

                      <div className="search-row-info">
                        <div className="search-row-title-wrap">
                          <span className="search-row-title">{album.title}</span>
                          <span className="search-row-origin-badge">
                            {album.isIndonesian ? 'Indo' : 'Global'}
                          </span>
                        </div>
                        <div
                          className="search-row-artist clickable-artist-link"
                          title={`View ${album.artist} artist profile`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onOpenArtist) {
                              onOpenArtist(album.artist);
                            } else {
                              setQuery(album.artist);
                            }
                          }}
                        >
                          {album.artist}
                        </div>
                        <div className="search-row-details">
                          <span>{album.releaseYear}</span>
                          <span>•</span>
                          <span>{album.trackCount} tracks</span>
                          {album.genres && album.genres.length > 0 && (
                            <>
                              <span>•</span>
                              <span className="search-row-genre">{album.genres[0]}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="search-row-actions">
                        {score !== null && (
                          <div className="search-row-score">
                            <span className="search-row-score-num">{score}</span>
                            <span className="search-row-score-label">/ 10</span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )
          ) : (
            <div className="search-empty-state">
              <div className="search-empty-icon-wrap">
                <Disc3 size={32} />
              </div>
              <h3 className="search-empty-title">
                {isLoading ? 'Sedang memuat rilisan musik…' : (query ? `Tidak ada hasil untuk "${query}"` : 'Tidak ada rilisan yang cocok')}
              </h3>
              <p className="search-empty-desc">
                {isLoading
                  ? 'Menghubungkan ke Apple Music catalog...'
                  : (query
                      ? 'Coba periksa ejaan atau gunakan kata kunci nama album / artis lainnya.'
                      : 'Coba gunakan kata kunci lain atau ubah filter katalog di atas.')}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchView;
