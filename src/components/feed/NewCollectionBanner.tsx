import React from 'react';
import { ArrowRight, Disc3 } from 'lucide-react';
import { Album } from '../../types/music';

interface NewCollectionBannerProps {
  onOpenAlbum?: (albumId: string) => void;
  spotlightAlbum?: Album;
}

export const NewCollectionBanner: React.FC<NewCollectionBannerProps> = ({
  onOpenAlbum,
  spotlightAlbum
}) => {
  return (
    <section className="feed-collection-section" aria-label="New Collections">
      <div className="feed-collection-header">
        <h2 className="feed-collection-title">New Collection</h2>
      </div>

      <div className="collection-carousel">
        {/* Card 1: High-Contrast Porcelain White Card */}
        <div
          className="collection-banner-card card-porcelain"
          onClick={() => spotlightAlbum && onOpenAlbum && onOpenAlbum(spotlightAlbum.id)}
          role="button"
          tabIndex={0}
        >
          {/* Card Left Copy */}
          <div className="collection-copy">
            <span className="collection-kicker">TOP PICKS</span>
            <h3 className="collection-heading">
              TOP INDONESIA<br />ALBUMS
            </h3>
            <p className="collection-subtext">The finest Indonesian albums, curated</p>

            <button
              className="collection-action-pill"
              onClick={(e) => {
                e.stopPropagation();
                if (spotlightAlbum && onOpenAlbum) onOpenAlbum(spotlightAlbum.id);
              }}
              aria-label="Browse top Indonesian albums"
            >
              <ArrowRight size={16} strokeWidth={2.4} />
            </button>
          </div>

          {/* Card Right Stage: Vinyl Peek & Visual */}
          <div className="collection-art-stage">
            <div className="collection-vinyl-peek">
              <div className="vinyl-ridges" />
              <div className="vinyl-center-label">
                <Disc3 size={18} color="#ffffff" />
              </div>
            </div>
            {spotlightAlbum?.coverUrl && (
              <img
                src={spotlightAlbum.coverUrl}
                alt="Featured Artist"
                className="collection-cover-thumb"
              />
            )}
          </div>
        </div>

        {/* Card 2: Ice Cyan Card (Peeking) */}
        <div
          className="collection-banner-card card-ice"
          onClick={() => spotlightAlbum && onOpenAlbum && onOpenAlbum(spotlightAlbum.id)}
          role="button"
          tabIndex={0}
        >
          <div className="collection-copy">
            <span className="collection-kicker">SKENA NUSANTARA</span>
            <h3 className="collection-heading">
              TOP INDONESIAN<br />SONGS
            </h3>
            <p className="collection-subtext">Best tracks from the Indonesian skena</p>

            <button
              className="collection-action-pill"
              onClick={(e) => {
                e.stopPropagation();
                if (spotlightAlbum && onOpenAlbum) onOpenAlbum(spotlightAlbum.id);
              }}
              aria-label="Browse top Indonesian songs"
            >
              <ArrowRight size={16} strokeWidth={2.4} />
            </button>
          </div>

          <div className="collection-art-stage">
            <div className="collection-vinyl-peek ice-vinyl">
              <div className="vinyl-ridges" />
              <div className="vinyl-center-label">
                <div className="vinyl-amber-dot" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default NewCollectionBanner;
