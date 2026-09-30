import React from 'react';
import { Trophy, Star } from 'lucide-react';
import { Album } from '../../types/music';

interface GroovyOfTheYearBannerProps {
  album: Album;
  onOpenAlbum: (albumId: string) => void;
}

export const GroovyOfTheYearBanner: React.FC<GroovyOfTheYearBannerProps> = ({
  album,
  onOpenAlbum,
}) => {
  return (
    <section className="goty-section" aria-label="Groovy of the Year">
      {/* Section label above */}
      <div className="goty-section-label">
        <Trophy size={13} strokeWidth={2.5} />
        <span>Groovy of the Year</span>
      </div>

      {/* Main banner card */}
      <div
        className="goty-banner"
        onClick={() => onOpenAlbum(album.id)}
        role="button"
        tabIndex={0}
        aria-label={`Open ${album.title} by ${album.artist}`}
        onKeyDown={(e) => e.key === 'Enter' && onOpenAlbum(album.id)}
      >
        {/* Blurred cover art backdrop */}
        <div
          className="goty-backdrop"
          style={{ backgroundImage: `url(${album.coverUrl})` }}
        />
        {/* Dark overlay for legibility */}
        <div className="goty-overlay" />
        {/* Animated shimmer sweep */}
        <div className="goty-shimmer" />

        {/* Content layout */}
        <div className="goty-content">
          {/* Left: text info */}
          <div className="goty-text">
            <span className="goty-badge">
              <Trophy size={11} strokeWidth={2.5} />
              EP OF THE YEAR
            </span>

            <h3 className="goty-title">{album.title}</h3>
            <p className="goty-artist">{album.artist}</p>

            {/* Score row */}
            <div className="goty-score-row">
              <span className="goty-score">100<span>/100</span></span>
              <div className="goty-stars">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={11} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <span className="goty-rating-count">100K ratings</span>
            </div>

            <div className="goty-genres">
              {album.genres.slice(0, 3).map((g) => (
                <span key={g} className="goty-genre-pill">{g}</span>
              ))}
            </div>
          </div>

          {/* Right: floating album art */}
          <div className="goty-art-wrap">
            <img
              src={album.coverUrl}
              alt={album.title}
              className="goty-art"
              draggable={false}
            />
            {/* Gold trophy glow ring */}
            <div className="goty-art-ring" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default GroovyOfTheYearBanner;
