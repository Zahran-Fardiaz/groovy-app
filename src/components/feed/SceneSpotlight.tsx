import React from 'react';
import { Compass, Star } from 'lucide-react';
import { Album } from '../../types/music';

interface SceneSpotlightProps {
  albums: Album[];
  onOpenAlbum: (albumId: string) => void;
  onOpenQuickLog: (album: Album) => void;
}

export const SceneSpotlight: React.FC<SceneSpotlightProps> = ({
  albums,
  onOpenAlbum,
  onOpenQuickLog
}) => {
  const indonesianAlbums = albums.filter(a => a.isIndonesian);

  if (indonesianAlbums.length === 0) return null;

  return (
    <section className="feed-shelf-section">
      <div className="feed-shelf-header">
        <div className="feed-shelf-title-wrap">
          <Compass size={15} color="var(--accent)" />
          <h3 className="feed-shelf-title">Skena Musik Indonesia</h3>
          <span className="feed-shelf-badge" style={{ color: 'var(--accent)', background: 'var(--accent-muted)', border: '1px solid var(--accent-border)' }}>
            ID Scene
          </span>
        </div>
      </div>

      <div className="horizontal-scroll-container">
        {indonesianAlbums.map((album) => (
          <div
            key={album.id}
            className="shelf-album-card"
            style={{ flex: '0 0 134px' }}
            onClick={() => onOpenAlbum(album.id)}
            id={`scene-card-${album.id}`}
          >
            <div className="shelf-cover-wrap">
              <img
                src={album.coverUrl}
                alt={album.title}
                className="shelf-cover-img"
                loading="lazy"
              />

              <div style={{
                position: 'absolute',
                top: '6px',
                left: '6px',
                background: 'rgba(10, 11, 15, 0.85)',
                backdropFilter: 'blur(8px)',
                color: '#ffffff',
                fontSize: '9px',
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: '9999px',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}>
                ID • {album.genres?.[0] || 'Indie'}
              </div>

              <button
                className="shelf-quick-rate"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenQuickLog(album);
                }}
                title="Rate or review"
              >
                <Star size={11} fill="#090a0d" />
              </button>
            </div>

            <div className="shelf-album-details">
              <div>
                <div className="shelf-title" title={album.title}>
                  {album.title}
                </div>
                <div className="shelf-artist" title={album.artist}>
                  {album.artist}
                </div>
              </div>

              <div className="shelf-meta-row">
                <span className="shelf-rating">
                  <Star size={10} fill="var(--accent-amber)" strokeWidth={0} />
                  {album.averageRating.toFixed(1)}
                </span>
                <span>{album.releaseYear}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
