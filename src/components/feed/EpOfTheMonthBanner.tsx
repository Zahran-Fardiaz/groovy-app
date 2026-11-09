import React from 'react';
import { Album } from '../../types/music';

interface EpOfTheMonthBannerProps {
  album: Album;
  onOpenAlbum: (albumId: string) => void;
  badgeText?: string;
  score?: string | number;
  tagline?: string;
  kicker?: string;
  headline?: string;
}

export const EpOfTheMonthBanner: React.FC<EpOfTheMonthBannerProps> = ({
  album,
  onOpenAlbum,
  badgeText = 'EP OF THE MONTH',
  score,
  tagline,
  kicker = 'GOOD EVENING',
  headline = 'Find your next\nfavorite sound.'
}) => {
  const cleanTitle = album.title.replace(/\s*-\s*EP$/i, '');
  const displayScore = score !== undefined
    ? score
    : (album.averageRating
        ? (album.averageRating <= 5 ? (album.averageRating * 2).toFixed(1) : album.averageRating.toFixed(1))
        : '10.0');

  const displayTagline =
    tagline ||
    (album.title.toLowerCase().includes('welcome home')
      ? 'A shimmering, raw indie breakthrough that refuses to sit still.'
      : album.title.toLowerCase().includes('after hours')
      ? 'A neon-lit triumph that refuses to sit still.'
      : 'A breakthrough release that captures the pulse of modern music.');

  const coverUrl =
    album.coverUrl ||
    'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=1000&auto=format&fit=crop&q=80';

  return (
    <section className="ep-month-section" aria-label="EP of the Month Showcase">
      {/* ── Headline Header matching the Reference Design ── */}
      <div className="ep-month-header">
        <span className="ep-month-kicker">{kicker}</span>
        <h1 className="ep-month-headline">
          {headline.split('\n').map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              {idx < headline.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </h1>
      </div>

      {/* ── Featured Showcase Card ── */}
      <button
        type="button"
        className="ep-month-card"
        onClick={() => onOpenAlbum(album.id)}
        aria-label={`Open ${cleanTitle} by ${album.artist}`}
      >
        {/* Background Artwork */}
        <img
          src={coverUrl}
          alt={`${album.title} cover`}
          className="ep-month-bg-img"
          loading="eager"
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=1000&auto=format&fit=crop&q=80';
          }}
        />

        {/* Cinematic Scrim & Amber Radial Glow */}
        <div className="ep-month-scrim" />

        {/* Top Row: Direct Text Overlay (no pill) + Glowing Score Circle */}
        <div className="ep-month-top-row">
          <div className="ep-month-badge-wrap">
            <span className="ep-month-badge-dot" aria-hidden="true" />
            <span className="ep-month-badge-text">{badgeText}</span>
          </div>
          <div className="ep-month-score-circle">{displayScore}</div>
        </div>

        {/* Bottom Area: Artist Kicker, Title, Tagline */}
        <div className="ep-month-bottom-area">
          <span className="ep-month-artist">{album.artist}</span>
          <h2 className="ep-month-title">{cleanTitle}</h2>
          <p className="ep-month-tagline">{displayTagline}</p>
        </div>
      </button>
    </section>
  );
};

export default EpOfTheMonthBanner;

