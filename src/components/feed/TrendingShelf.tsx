import React from 'react';
import { Star, Flame } from 'lucide-react';
import { Album } from '../../types/music';

interface TrendingShelfProps {
  albums: Album[];
  onOpenAlbum: (albumId: string) => void;
  onOpenQuickLog: (album: Album) => void;
  title?: string;
  badge?: string;
}

export const TrendingShelf: React.FC<TrendingShelfProps> = ({
  albums,
  onOpenAlbum,
  onOpenQuickLog,
  title = 'Trending on Groovy',
  badge = 'Hot Picks'
}) => {
  if (!albums || albums.length === 0) return null;

  return (
    <section className="feed-shelf-section">
      <div className="feed-shelf-header">
        <div className="feed-shelf-title-wrap">
          <Flame size={15} color="var(--accent-amber)" />
          <h3 className="feed-shelf-title">{title}</h3>
          <span className="feed-shelf-badge">{badge}</span>
        </div>
      </div>

      <div className="horizontal-scroll-container">
        {albums.map((album, idx) => {
          const rank = idx + 1;
          const isTop3 = rank <= 3;

          return (
            <div
              key={album.id}
              className="shelf-album-card"
              onClick={() => onOpenAlbum(album.id)}
              id={`trending-card-${album.id}`}
            >
              <div className="shelf-cover-wrap">
                <img
                  src={album.coverUrl}
                  alt={album.title}
                  className="shelf-cover-img"
                  loading="lazy"
                />

                {/* Ranked Badge */}
                <div className={`shelf-rank-badge ${isTop3 ? 'top-3' : ''}`}>
                  #{rank}
                </div>

                {/* Quick Log Button */}
                <button
                  className="shelf-quick-rate"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenQuickLog(album);
                  }}
                  title="Quick rate & review"
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
                  <span>{album.totalReviews} logs</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
