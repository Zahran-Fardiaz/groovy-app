import React, { useState, useMemo } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Album } from '../../types/music';
import { storageService } from '../../services/storageService';
import './CommunityCharts.css';

interface CommunityChartsProps {
  onOpenAlbum: (albumId: string) => void;
  onOpenArtist?: (artistName: string) => void;
}

// Concentric target / vinyl record icon next to scores (exact match from Album & Artist Details)
const VinylScoreIcon: React.FC<{ size?: number }> = ({ size = 15 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    className="vinyl-score-icon"
    aria-hidden="true"
  >
    <circle cx="8" cy="8" r="7" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1.2" />
    <circle cx="8" cy="8" r="4.2" stroke="rgba(255, 255, 255, 0.55)" strokeWidth="1" />
    <circle cx="8" cy="8" r="1.8" fill="var(--gds-accent-citron, #d4ff32)" />
  </svg>
);

const QUICK_TIME_PILLS = [
  { id: 'all_time', label: 'All time' },
  { id: 'this_year', label: 'This year' },
  { id: '2020s', label: '2020s' },
  { id: '2010s', label: '2010s' }
];

const GENRE_OPTIONS = [
  'All genres',
  'Electronic',
  'Hip-Hop',
  'Indie',
  'Rock',
  'Pop',
  'Alternative',
  'R&B/Soul',
  'Punk'
];

export const CommunityCharts: React.FC<CommunityChartsProps> = ({
  onOpenAlbum,
  onOpenArtist
}) => {
  const [selectedGenre, setSelectedGenre] = useState('All genres');
  const [selectedTimeRange, setSelectedTimeRange] = useState('all_time');
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);

  const allAlbums = useMemo(() => {
    return storageService.getAlbums();
  }, []);

  // Filter & rank albums
  const rankedAlbums = useMemo(() => {
    let list = [...allAlbums];

    // Filter by Genre
    if (selectedGenre !== 'All genres') {
      const gLower = selectedGenre.toLowerCase();
      list = list.filter(a =>
        a.genres?.some(g => g.toLowerCase().includes(gLower))
      );
    }

    // Filter by Time Range
    if (selectedTimeRange === 'this_year') {
      list = list.filter(a => a.releaseYear === 2026 || a.releaseYear === 2025);
    } else if (selectedTimeRange === '2020s') {
      list = list.filter(a => a.releaseYear >= 2020 && a.releaseYear <= 2029);
    } else if (selectedTimeRange === '2010s') {
      list = list.filter(a => a.releaseYear >= 2010 && a.releaseYear <= 2019);
    }

    // Sort by rating descending (normalized 10-point scale)
    list.sort((a, b) => {
      const scoreA = a.averageRating ? (a.averageRating <= 5 ? a.averageRating * 2 : a.averageRating) : 8.0;
      const scoreB = b.averageRating ? (b.averageRating <= 5 ? b.averageRating * 2 : b.averageRating) : 8.0;
      if (Math.abs(scoreB - scoreA) > 0.05) return scoreB - scoreA;
      return (b.totalRatings || 0) - (a.totalRatings || 0);
    });

    return list;
  }, [allAlbums, selectedGenre, selectedTimeRange]);

  const getTimeRangeLabel = (id: string) => {
    const found = QUICK_TIME_PILLS.find(p => p.id === id);
    return found ? found.label : 'All time';
  };

  return (
    <section className="community-charts-section" aria-label="Community Charts">
      {/* ── 1. Header with Eyebrow and Title ── */}
      <div className="charts-header-row">
        <div>
          <span className="charts-kicker">COMMUNITY CHARTS</span>
          <h2 className="charts-title">Highest rated</h2>
        </div>
      </div>

      {/* ── 2. Two Dropdown Selector Boxes (GENRE & TIME RANGE) ── */}
      <div className="charts-filter-boxes-row">
        {/* Genre Selector Box */}
        <div className="charts-select-wrap">
          <button
            type="button"
            className="charts-select-box"
            onClick={() => {
              setIsGenreDropdownOpen(prev => !prev);
              setIsTimeDropdownOpen(false);
            }}
            aria-expanded={isGenreDropdownOpen}
          >
            <span className="charts-select-label">GENRE</span>
            <div className="charts-select-val-row">
              <span className="charts-select-val">{selectedGenre}</span>
              <ChevronDown size={14} className={isGenreDropdownOpen ? 'rotated' : ''} />
            </div>
          </button>

          {isGenreDropdownOpen && (
            <div className="charts-dropdown-menu">
              {GENRE_OPTIONS.map(genre => (
                <button
                  key={genre}
                  type="button"
                  className={`charts-dropdown-item ${selectedGenre === genre ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedGenre(genre);
                    setIsGenreDropdownOpen(false);
                  }}
                >
                  <span>{genre}</span>
                  {selectedGenre === genre && <Check size={13} color="var(--gds-accent-citron, #d4ff32)" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Time Range Selector Box */}
        <div className="charts-select-wrap">
          <button
            type="button"
            className="charts-select-box"
            onClick={() => {
              setIsTimeDropdownOpen(prev => !prev);
              setIsGenreDropdownOpen(false);
            }}
            aria-expanded={isTimeDropdownOpen}
          >
            <span className="charts-select-label">TIME RANGE</span>
            <div className="charts-select-val-row">
              <span className="charts-select-val">{getTimeRangeLabel(selectedTimeRange)}</span>
              <ChevronDown size={14} className={isTimeDropdownOpen ? 'rotated' : ''} />
            </div>
          </button>

          {isTimeDropdownOpen && (
            <div className="charts-dropdown-menu">
              {QUICK_TIME_PILLS.map(pill => (
                <button
                  key={pill.id}
                  type="button"
                  className={`charts-dropdown-item ${selectedTimeRange === pill.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedTimeRange(pill.id);
                    setIsTimeDropdownOpen(false);
                  }}
                >
                  <span>{pill.label}</span>
                  {selectedTimeRange === pill.id && <Check size={13} color="var(--gds-accent-citron, #d4ff32)" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── 3. Quick Time Range Pills Row ── */}
      <div className="charts-pills-row" role="tablist" aria-label="Time range quick filters">
        {QUICK_TIME_PILLS.map(pill => {
          const isActive = selectedTimeRange === pill.id;
          return (
            <button
              key={pill.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`charts-pill-btn ${isActive ? 'active' : ''}`}
              onClick={() => setSelectedTimeRange(pill.id)}
            >
              {pill.label}
            </button>
          );
        })}
      </div>

      {/* ── 4. Ranked List Card (Matching reference mockup 01, 02, 03) ── */}
      <div className="charts-card-container">
        {rankedAlbums.length > 0 ? (
          rankedAlbums.map((album, idx) => {
            const rankStr = String(idx + 1).padStart(2, '0');
            const scoreVal = (
              album.averageRating
                ? (album.averageRating <= 5 ? album.averageRating * 2 : album.averageRating)
                : (9.4 - idx * 0.2)
            ).toFixed(1);
            const primaryGenre = album.genres?.[0] || 'Music';

            return (
              <div
                key={album.id || idx}
                className="charts-item-row"
                onClick={() => onOpenAlbum(album.id)}
                role="button"
                tabIndex={0}
              >
                {/* Rank Number (01, 02, 03) */}
                <span className="charts-rank-number">{rankStr}</span>

                {/* Album Cover Thumbnail */}
                <img
                  src={album.coverUrl}
                  alt={album.title}
                  className="charts-album-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&auto=format&fit=crop&q=80';
                  }}
                />

                {/* Meta Column (Title & Artist / Year / Genre) */}
                <div className="charts-album-meta">
                  <span className="charts-album-title">{album.title}</span>
                  <span className="charts-album-sub">
                    <span
                      className="charts-artist-link"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenArtist?.(album.artist);
                      }}
                    >
                      {album.artist}
                    </span>
                    {' · '}
                    {album.releaseYear}
                    {' · '}
                    {primaryGenre}
                  </span>
                </div>

                {/* Score Badge (Vinyl concentric icon + score) */}
                <div className="charts-score-badge">
                  <VinylScoreIcon size={15} />
                  <span className="charts-score-num">{scoreVal}</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="charts-empty-state">
            <p>Tidak ada rilisan yang cocok dengan filter saat ini.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CommunityCharts;

