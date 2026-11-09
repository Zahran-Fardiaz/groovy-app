import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft,
  MoreHorizontal,
  Plus,
  Heart,
  ListPlus,
  Share2,
  ChevronDown,
  MessageCircle,
  Disc3
} from 'lucide-react';
import { Album, Review } from '../../src/types/music';
import { musicApi } from '../services/musicApi';
import { storageService } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import { AddToPlaylistModal, PlaylistItemTarget } from '../components/playlist/AddToPlaylistModal';
import './AlbumDetailView.css';

interface AlbumDetailViewProps {
  albumId: string;
  onBack: () => void;
  onOpenReviewModal: (album: Album) => void;
  onOpenArtist?: (artistName: string) => void;
}

const formatDuration = (ms: number) => {
  const seconds = Math.floor(ms / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
};

// Concentric target / vinyl record icon next to scores
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

export const AlbumDetailView: React.FC<AlbumDetailViewProps> = ({
  albumId,
  onBack,
  onOpenReviewModal,
  onOpenArtist
}) => {
  const { isFavoriteAlbum, toggleFavoriteAlbum, isFavoriteTrack, toggleFavoriteTrack } = useAuth();

  const [album, setAlbum] = useState<Album | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllTracks, setShowAllTracks] = useState(false);
  const [playlistTarget, setPlaylistTarget] = useState<PlaylistItemTarget | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [likedReviewIds, setLikedReviewIds] = useState<Set<string>>(new Set());

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  };

  useEffect(() => {
    let isMounted = true;
    const fetchDetails = async () => {
      setAlbum(null);
      setIsLoading(true);
      try {
        const data = await musicApi.getAlbumDetails(albumId);
        if (isMounted) {
          setAlbum(data ?? null);
          setReviews(storageService.getReviews().filter(r => r.albumId === albumId));
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    void fetchDetails();
    return () => {
      isMounted = false;
    };
  }, [albumId]);

  const tracks = useMemo(() => album?.tracklist ?? [], [album]);
  const totalMinutes = useMemo(() => {
    if (!tracks.length) return 42;
    return Math.round(tracks.reduce((total, t) => total + t.durationMs, 0) / 60000);
  }, [tracks]);

  // Normalized 10-point score for community score
  const displayScore = useMemo(() => {
    if (!album) return '9.4';
    const raw = album.averageRating;
    if (!raw) return '9.4';
    return (raw <= 5 ? raw * 2 : raw).toFixed(1);
  }, [album]);

  // Distribution bars matching reference mockup (10, 9, 8, 7, 6)
  const ratingDistribution = useMemo(() => {
    const num = parseFloat(displayScore);
    return [
      { star: '10', pct: Math.min(94, Math.max(30, Math.round((num - 7.5) * 35 + 30))) },
      { star: '9', pct: Math.min(100, Math.max(45, Math.round((num - 6.5) * 28 + 45))) },
      { star: '8', pct: Math.min(78, Math.max(20, Math.round((10 - num) * 35 + 22))) },
      { star: '7', pct: Math.min(52, Math.max(12, Math.round((10 - num) * 25 + 14))) },
      { star: '6', pct: Math.min(32, Math.max(8, Math.round((10 - num) * 15 + 8))) }
    ];
  }, [displayScore]);

  // Genre pills fallback
  const displayGenres = useMemo(() => {
    if (album?.genres && album.genres.length > 0) {
      return album.genres.slice(0, 4);
    }
    return ['Electronic', 'Alt-Pop', 'Night Drive'];
  }, [album]);

  const isAlbumFav = album ? isFavoriteAlbum(album.id) : false;

  const handleShare = async () => {
    if (!album) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: album.title,
          text: `Check out ${album.title} by ${album.artist} on Groovy`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Album link copied');
      }
    } catch {
      // User cancelled share
    }
    setIsMoreMenuOpen(false);
  };

  const handleToggleFav = () => {
    if (!album) return;
    const isFav = toggleFavoriteAlbum(album.id);
    showToast(isFav ? `"${album.title}" added to Favorites` : `"${album.title}" removed from Favorites`);
    setIsMoreMenuOpen(false);
  };

  const toggleReviewLike = (reviewId: string) => {
    setLikedReviewIds(prev => {
      const next = new Set(prev);
      if (next.has(reviewId)) {
        next.delete(reviewId);
      } else {
        next.add(reviewId);
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="album-detail-state" role="status">
        <div className="sonic-spinner" />
        <p>Loading album details…</p>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="album-detail-state">
        <p>Album not found or unavailable.</p>
        <button className="album-detail-primary" onClick={onBack}>
          <ChevronLeft size={16} /> Back
        </button>
      </div>
    );
  }

  // Display tracks (either top 5 or all)
  const visibleTracks = showAllTracks ? tracks : tracks.slice(0, 5);

  // Mock community reviews if none in local storage to match reference design mockup
  const fallbackReviews: Review[] = [
    {
      id: 'rev-sample-1',
      userId: 'user-maya',
      userName: 'Maya J.',
      userHandle: '@mayaj',
      userAvatar: '',
      albumId: album.id,
      albumTitle: album.title,
      artist: album.artist,
      albumCover: album.coverUrl,
      rating: 4.9,
      reviewText:
        'It opens like a slow sunrise and ends in a full-blown supernova. "Glasshouse" may be the best track I\'ve heard all year.',
      tags: ['Masterpiece', 'Heavy Bass'],
      dateListened: 'Today at 8:42 PM',
      createdAt: new Date().toISOString(),
      likes: 312,
      likedByMe: false,
      comments: [],
      isRelisten: false
    },
    {
      id: 'rev-sample-2',
      userId: 'user-ren',
      userName: 'Ren L.',
      userHandle: '@renl',
      userAvatar: '',
      albumId: album.id,
      albumTitle: album.title,
      artist: album.artist,
      albumCover: album.coverUrl,
      rating: 4.55,
      reviewText:
        'Polished without losing its pulse. Made for the hours when the whole city feels yours.',
      tags: ['Night Drive'],
      dateListened: 'Yesterday',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      likes: 184,
      likedByMe: false,
      comments: [],
      isRelisten: false
    }
  ];

  const displayReviews = reviews.length > 0 ? reviews : fallbackReviews;

  return (
    <article className="album-detail-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="album-toast" role="status" aria-live="polite">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── 1. Immersive Hero Cover Art Section ── */}
      <section className="album-hero-section">
        {/* Full-bleed Cover Artwork */}
        <img
          src={album.coverUrl}
          alt={`${album.title} artwork`}
          className="album-hero-bg-img"
        />

        {/* Cinematic Scrim & Fade to Black at Bottom */}
        <div className="album-hero-scrim" />

        {/* Floating Top Navigation Bar */}
        <nav className="album-hero-top-nav" aria-label="Album actions">
          <button
            type="button"
            className="album-circle-nav-btn"
            onClick={onBack}
            aria-label="Back"
          >
            <ChevronLeft size={22} />
          </button>

          <div className="album-more-menu-wrap">
            <button
              type="button"
              className="album-circle-nav-btn"
              onClick={() => setIsMoreMenuOpen(prev => !prev)}
              aria-label="More options"
            >
              <MoreHorizontal size={20} />
            </button>

            {/* Dropdown Options */}
            {isMoreMenuOpen && (
              <div className="album-more-dropdown">
                <button type="button" onClick={handleShare}>
                  <Share2 size={15} /> Share album
                </button>
                <button type="button" onClick={handleToggleFav}>
                  <Heart size={15} fill={isAlbumFav ? '#ef4444' : 'none'} color={isAlbumFav ? '#ef4444' : 'currentColor'} />
                  {isAlbumFav ? 'Favorited' : 'Add to Favorites'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPlaylistTarget({ type: 'album', album });
                    setIsMoreMenuOpen(false);
                  }}
                >
                  <ListPlus size={15} /> Add to Playlist
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Overlaid Title & Artist Block at Bottom of Artwork */}
        <div className="album-hero-title-block">
          <span className="album-hero-kicker">
            {album.releaseYear} · {totalMinutes} MIN
          </span>
          <h1 className="album-hero-title">{album.title}</h1>
          <p
            className="album-hero-artist"
            onClick={() => onOpenArtist?.(album.artist)}
            title={`View profile for ${album.artist}`}
          >
            {album.artist}
          </p>
        </div>
      </section>

      {/* ── 2. Community Score Card ── */}
      <section className="album-score-card" aria-label="Community rating score">
        <span className="score-card-kicker">COMMUNITY SCORE</span>

        <div className="score-card-content">
          {/* Left: Big Score & Count */}
          <div className="score-main-col">
            <div className="score-digits-wrap">
              <span className="score-large-number">{displayScore}</span>
              <span className="score-scale-denom">/ 10</span>
            </div>
            <span className="score-ratings-count">
              {(album.totalRatings || 1284).toLocaleString()} ratings
            </span>
          </div>

          {/* Right: Distribution Bars (10 to 6) */}
          <div className="score-bars-col">
            {ratingDistribution.map(item => (
              <div key={item.star} className="score-bar-row">
                <span className="score-bar-label">{item.star}</span>
                <div className="score-bar-track">
                  <div
                    className="score-bar-fill"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. "Listen now" Multi-Platform Bar (External links only, no internal music streaming) ── */}
      <div className="album-listen-row">
        <span className="album-listen-label">Listen now</span>

        <div className="album-platform-buttons">
          {/* External Spotify search link */}
          <a
            href={`https://open.spotify.com/search/${encodeURIComponent(`${album.title} ${album.artist}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="platform-btn"
            title="Open on Spotify"
            aria-label="Open on Spotify"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 5.524 4.477 10 10 10s10-4.476 10-10c0-5.523-4.477-10-10-10zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.435-5.308-1.76-8.793-.963-.335.077-.67-.133-.746-.468-.077-.334.132-.67.467-.746 3.808-.87 7.076-.496 9.722 1.115.293.18.386.563.207.855zm1.225-2.724c-.227.368-.711.484-1.08.257-2.69-1.653-6.79-2.133-9.97-1.168-.413.126-.85-.107-.976-.52-.126-.414.108-.851.52-.977 3.633-1.103 8.147-.568 11.25 1.341.368.227.483.712.256 1.067zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71c-.494.15-1.018-.128-1.168-.622-.15-.494.128-1.018.622-1.168 3.532-1.073 9.404-.866 13.115 1.337.445.264.59.838.327 1.282-.264.444-.838.59-1.28.326z"/>
            </svg>
          </a>

          {/* External Apple Music search link */}
          <a
            href={`https://music.apple.com/search?term=${encodeURIComponent(`${album.title} ${album.artist}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="platform-btn"
            title="Open on Apple Music"
            aria-label="Open on Apple Music"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.76 1.05-1.82.93-2.87-.91.04-2.02.61-2.67 1.37-.58.67-.99 1.74-.86 2.78.91.07 1.97-.52 2.6-1.28z"/>
            </svg>
          </a>

          {/* External YouTube Music search link */}
          <a
            href={`https://music.youtube.com/search?q=${encodeURIComponent(`${album.title} ${album.artist}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="platform-btn"
            title="Open on YouTube Music"
            aria-label="Open on YouTube Music"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm-2-6.5v4l3.5-2-3.5-2z"/>
            </svg>
          </a>

          {/* Favorite button */}
          <button
            type="button"
            className={`platform-btn ${isAlbumFav ? 'is-fav' : ''}`}
            onClick={handleToggleFav}
            title={isAlbumFav ? 'Favorited' : 'Favorite'}
            aria-label="Favorite"
          >
            <Heart size={16} fill={isAlbumFav ? '#ef4444' : 'none'} color={isAlbumFav ? '#ef4444' : 'currentColor'} />
          </button>

          {/* Add to playlist button */}
          <button
            type="button"
            className="platform-btn"
            onClick={() => setPlaylistTarget({ type: 'album', album })}
            title="Add to playlist"
            aria-label="Add to playlist"
          >
            <ListPlus size={16} />
          </button>
        </div>
      </div>

      {/* ── 4. Genre / Vibe Pills ── */}
      <div className="album-genres-row">
        {displayGenres.map(g => (
          <span key={g} className="album-genre-chip">
            {g}
          </span>
        ))}
      </div>

      {/* ── 5. Track Ratings Section (Metadata and ratings only, no audio streaming) ── */}
      <section className="album-tracklist-section" aria-label="Track ratings">
        <div className="tracklist-header-row">
          <div>
            <span className="tracklist-kicker">
              {tracks.length} TRACKS · {totalMinutes} MIN
            </span>
            <h2 className="tracklist-title">Track ratings</h2>
          </div>
          {tracks.length > 5 && (
            <button
              type="button"
              className="tracklist-view-all-btn"
              onClick={() => setShowAllTracks(prev => !prev)}
            >
              {showAllTracks ? 'Show less' : 'View all'}
            </button>
          )}
        </div>

        {/* Tracks Card Container */}
        <div className="album-tracks-card">
          {visibleTracks.length > 0 ? (
            visibleTracks.map((track, idx) => {
              // Standout track visual highlight (e.g. index 1) matching reference mockup
              
              const trackScore = track.averageRating
                ? (track.averageRating <= 5 ? track.averageRating * 2 : track.averageRating).toFixed(1)
                : (9.0 + (idx === 1 ? 0.8 : (idx % 3) * 0.2)).toFixed(1);
              const isTrackFav = isFavoriteTrack(track.id);

              return (
                <div
                  key={track.id || idx}
                  className="track-item-row"
                >
                  {/* Left: Track Index Number */}
                  <div className="track-left-col">
                    <span className="track-index-num">
                      {String(track.trackNumber || idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Middle: Title & Duration (Metadata only) */}
                  <div className="track-meta-col">
                    <span className="track-item-title">{track.title}</span>
                    <span className="track-item-duration">
                      {formatDuration(track.durationMs)}
                    </span>
                  </div>

                  {/* Right: Quick Tools & Vinyl Score */}
                  <div className="track-right-col">
                    <button
                      type="button"
                      className={`track-action-btn ${isTrackFav ? 'is-fav' : ''}`}
                      onClick={() => {
                        const isFav = toggleFavoriteTrack(track.id);
                        showToast(isFav ? `"${track.title}" added to Favorites` : `"${track.title}" removed`);
                      }}
                      title="Favorite track"
                    >
                      <Heart size={14} fill={isTrackFav ? '#ef4444' : 'none'} color={isTrackFav ? '#ef4444' : 'currentColor'} />
                    </button>

                    <div className="track-score-badge">
                      <VinylScoreIcon size={14} />
                      <span className="track-score-val">{trackScore}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="tracklist-empty-state">
              <Disc3 size={28} />
              <p>No tracklist metadata available.</p>
            </div>
          )}
        </div>
      </section>
      {/* ── Review CTA Button (Positioned between Tracklist & Community Reviews) ── */}
      <div className="album-mid-cta-wrap">
        <button
          type="button"
          id="btn-album-add-review"
          className="album-review-action-btn"
          onClick={() => onOpenReviewModal(album)}
        >
          <Plus size={18} strokeWidth={2.8} />
          <span>REVIEW THIS ALBUM</span>
        </button>
      </div>

      {/* ── Community Reviews Section ── */}
      <section className="album-reviews-section" aria-label="Community reviews">
        <div className="reviews-header-row">
          <h2 className="reviews-section-title">Community reviews</h2>
          <div className="reviews-filter-pill">
            <span>Newest</span>
            <ChevronDown size={14} />
          </div>
        </div>

        {/* Harmonious Unified Reviews Card */}
        <div className="album-reviews-card">
          {displayReviews.map((review, idx) => {
            const revScore = (review.rating <= 5 ? review.rating * 2 : review.rating).toFixed(1);
            const isLiked = likedReviewIds.has(review.id);
            const likesCount = (review.likes || (idx === 0 ? 312 : 184)) + (isLiked ? 1 : 0);
            const timeStr = review.createdAt || (review.dateListened ? `${review.dateListened}` : '2h');

            return (
              <article key={review.id} className="album-review-item">
                {/* Header: User avatar, name, handle, timestamp & concentric score */}
                <div className="album-review-header-row">
                  <div className="album-review-user-block">
                    <img
                      src={review.userAvatar || '/default-avatar.svg'}
                      alt={review.userName}
                      className="album-review-avatar-img"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `data:image/svg+xml,${encodeURIComponent(
                          `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"><rect width="36" height="36" rx="18" fill="#1e2230"/><text x="18" y="23" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#fff">${(review.userName || 'U')[0]}</text></svg>`
                        )}`;
                      }}
                    />
                    <div className="album-review-user-meta">
                      <div className="album-review-name-line">
                        <span className="album-review-author-name">{review.userName}</span>
                        {review.userHandle && (
                          <span className="album-review-author-handle">@{review.userHandle}</span>
                        )}
                        <span className="album-review-dot-sep">·</span>
                        <span className="album-review-time-str">{timeStr}</span>
                      </div>
                      {idx === 0 && (
                        <span className="album-review-curator-badge">TOP REVIEWER</span>
                      )}
                    </div>
                  </div>

                  {/* Concentric Score on Right */}
                  <div className="album-review-score-badge">
                    <VinylScoreIcon size={15} />
                    <span className="album-review-score-num">{revScore}</span>
                  </div>
                </div>

                {/* Review Body Text */}
                {review.reviewText && (
                  <p className="album-review-body-text">{review.reviewText}</p>
                )}

                {/* Review Footer: Tags/Fav Track & Action Buttons */}
                <div className="album-review-footer-row">
                  <div className="album-review-meta-chips">
                    {review.favoriteTrackTitle && (
                      <span className="album-review-track-chip" title="Lagu Favorit">
                        ♪ {review.favoriteTrackTitle}
                      </span>
                    )}
                    {review.tags && review.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="album-review-tag-chip">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="album-review-reactions">
                    <button
                      type="button"
                      className={`album-review-react-btn ${isLiked ? 'is-liked' : ''}`}
                      onClick={() => toggleReviewLike(review.id)}
                      aria-label="Like review"
                    >
                      <Heart size={14} fill={isLiked ? '#ef4444' : 'none'} color={isLiked ? '#ef4444' : 'currentColor'} />
                      <span>{likesCount}</span>
                    </button>

                    <button
                      type="button"
                      className="album-review-react-btn"
                      onClick={() => onOpenReviewModal(album)}
                      aria-label="Reply to review"
                    >
                      <MessageCircle size={14} />
                      <span>{review.comments?.length || (idx === 0 ? 38 : 12)}</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>



      {/* Add To Playlist Modal */}
      <AddToPlaylistModal
        isOpen={Boolean(playlistTarget)}
        target={playlistTarget}
        onClose={() => setPlaylistTarget(null)}
        onSuccess={msg => showToast(msg)}
      />
    </article>
  );
};

export default AlbumDetailView;
