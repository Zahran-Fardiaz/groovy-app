import React from 'react';
import { ChevronRight, Star } from 'lucide-react';
import { Album } from '../../types/music';
import { OverflowText } from '../common/OverflowText';

interface RecentAlbumsShelfProps {
  albums: Album[];
  onOpenAlbum: (albumId: string) => void;
  onOpenQuickLog: (album: Album) => void;
  onSeeAll?: () => void;
}

export const RecentAlbumsShelf: React.FC<RecentAlbumsShelfProps> = ({
  albums,
  onOpenAlbum,
  onOpenQuickLog,
  onSeeAll
}) => {
  // Order is controlled entirely by the parent (FeedView).
  // Do NOT re-sort here — the pinned Peeling Tangerine EP must stay at position 0.
  if (!albums || albums.length === 0) return null;

  const getScoreData = (album: Album) => {
    return Number.isFinite(album.averageRating) && album.averageRating > 0
      ? Math.min(100, Math.round(album.averageRating * 20))
      : null;
  };

  return (
    <section className="feed-recent-albums-section" aria-label="Recent Albums">
      {/* Header with Title & AOTY-inspired See All */}
      <div className="feed-recent-albums-header">
        <h2 className="feed-recent-albums-title">Recent Albums</h2>
        {onSeeAll && (
          <button
            className="feed-see-all-btn"
            onClick={onSeeAll}
            title="View all albums"
          >
            <span>See all</span>
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      {/* Horizontal Scroll of Albums: Leftmost is the most recent album */}
      <div className="recent-albums-scroll">
        {albums.map((album) => {
          const score = getScoreData(album);
          const ratingCount = album.totalRatings;

          return (
            <div
              key={album.id}
              className="recent-album-card"
              onClick={() => onOpenAlbum(album.id)}
              id={`recent-album-${album.id}`}
            >
              {/* Album Cover Sleeve with clean artwork */}
              <div className="recent-album-sleeve">
                <img
                  src={album.coverUrl}
                  alt={album.title}
                  className="recent-album-img"
                  loading="lazy"
                />

                {/* Quick Log star action */}
                <button
                  className="recent-album-rate-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenQuickLog(album);
                  }}
                  title="Rate or review"
                  aria-label="Rate or review"
                >
                  <Star size={11} fill="#ffffff" color="#ffffff" />
                </button>
              </div>

              {/* Album Details (Artist, Title, AOTY-style Scores - Reference Styled) */}
              <div className="recent-album-info">
                {/* Artist Name */}
                <span
                  className="recent-album-artist"
                  title={album.artist}
                >
                  <OverflowText text={album.artist} />
                </span>

                <h3
                  className="recent-album-title"
                  title={album.title}
                >
                  <button className="recent-album-title-link" onClick={(event) => {
                    event.stopPropagation();
                    onOpenAlbum(album.id);
                  }}>
                    <OverflowText text={album.title} />
                  </button>
                </h3>

                <div className="recent-album-scores">
                  {score !== null ? (
                    <>
                      <span className="album-rating-badge" aria-label={`${score} out of 100`}>
                        {score}<span>/100</span>
                      </span>
                      <span className="album-rating-caption">
                        <span>Listener score</span>
                        {ratingCount > 0 && <span>{new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(ratingCount)} {ratingCount === 1 ? 'rating' : 'ratings'}</span>}
                      </span>
                    </>
                  ) : <span className="album-rating-caption">Not rated</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
export default RecentAlbumsShelf;
