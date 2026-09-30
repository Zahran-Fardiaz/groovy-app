import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, Disc, Plus, Share2 } from 'lucide-react';
import { Album, Review } from '../types/music';
import { musicApi } from '../services/musicApi';
import { storageService } from '../services/storageService';
import { StarRating } from '../components/common/StarRating';
import { ReviewCard } from '../components/review/ReviewCard';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { useScrobble } from '../context/ScrobbleContext';

interface AlbumDetailViewProps {
  albumId: string;
  onBack: () => void;
  onOpenReviewModal: (album: Album) => void;
}

export const AlbumDetailView: React.FC<AlbumDetailViewProps> = ({
  albumId,
  onBack,
  onOpenReviewModal
}) => {
  const [album, setAlbum] = useState<Album | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { currentTrack, isPlaying, playTrack } = useMusicPlayer();
  const { recordTrackPlay } = useScrobble();

  useEffect(() => {
    let isMounted = true;
    const fetchDetails = async () => {
      setIsLoading(true);
      const data = await musicApi.getAlbumDetails(albumId);
      if (isMounted && data) {
        setAlbum(data);
        const allReviews = storageService.getReviews().filter(r => r.albumId === albumId);
        setReviews(allReviews);
      }
      if (isMounted) setIsLoading(false);
    };

    fetchDetails();
    return () => { isMounted = false; };
  }, [albumId]);

  if (isLoading || !album) {
    return (
      <div style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
        Loading album details...
      </div>
    );
  }

  const formatDuration = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div style={{ paddingBottom: '20px' }}>
      {/* Top Back Navigation Bar */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        background: 'rgba(9, 10, 13, 0.85)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '44px 16px 10px',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <button
          id="btn-album-back"
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: album.title, text: `Check out ${album.title} on Groovy`, url: window.location.href });
            } else {
              alert('Album link copied to clipboard!');
            }
          }}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
        >
          <Share2 size={16} />
        </button>
      </div>

      {/* Hero Header with Soft Ambient Backdrop */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '24px 16px 16px', textAlign: 'center' }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${album.coverUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(40px) brightness(0.18)',
          transform: 'scale(1.2)',
          zIndex: 0
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Cover Art */}
          <div style={{
            width: '150px',
            height: '150px',
            margin: '0 auto 16px',
            borderRadius: 0,
            overflow: 'hidden',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.12)'
          }}>
            <img src={album.coverUrl} alt={album.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 0 }} />
          </div>

          {/* Title & Artist */}
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff', marginBottom: '4px', letterSpacing: '-0.02em' }}>
            {album.title}
          </h2>
          <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>
            {album.artist}
          </div>

          {/* Metadata Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            <span style={{
              background: 'rgba(255, 255, 255, 0.06)',
              color: '#ffffff',
              border: '1px solid var(--border-subtle)',
              padding: '2px 8px',
              borderRadius: 0,
              fontWeight: 500
            }}>
              {album.isIndonesian ? 'Indonesian' : 'Global'}
            </span>
            <span>•</span>
            <span>{album.releaseYear}</span>
            <span>•</span>
            <span>{album.genres[0]}</span>
          </div>

          {/* Rating Summary Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.04)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--border-subtle)',
            padding: '5px 12px',
            borderRadius: 0,
            marginBottom: '16px'
          }}>
            <StarRating rating={album.averageRating} size={14} />
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              ({album.totalRatings.toLocaleString()} ratings)
            </span>
          </div>

          {/* Primary Action Button */}
          <div>
            <button
              id="btn-log-review-album"
              className="btn-primary"
              style={{ width: '100%', maxWidth: '240px', padding: '11px 16px' }}
              onClick={() => onOpenReviewModal(album)}
            >
              <Plus size={15} /> Log or Review
            </button>
          </div>
        </div>
      </div>

      {/* Description if available */}
      {album.description && (
        <div style={{ padding: '0 16px', margin: '6px 0 16px' }}>
          <p style={{ fontSize: '12px', lineHeight: 1.6, color: 'var(--text-secondary)', fontStyle: 'italic', background: 'rgba(255, 255, 255, 0.02)', padding: '12px 14px', borderRadius: 0, borderLeft: '2px solid rgba(255, 255, 255, 0.2)' }}>
            "{album.description}"
          </p>
        </div>
      )}

      {/* Tracklist & Previews */}
      <section style={{ padding: '0 16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Disc size={14} color="var(--text-secondary)" />
            <h3 style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff' }}>
              Tracklist
            </h3>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {album.tracklist?.length || 0} tracks
          </span>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 0, overflow: 'hidden' }}>
          {album.tracklist && album.tracklist.length > 0 ? (
            album.tracklist.map((track, idx) => {
              const isCurrentPlaying = isPlaying && currentTrack?.id === track.id;

              return (
                <div
                  key={track.id || idx}
                  id={`track-item-${track.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderBottom: idx < album.tracklist.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    background: isCurrentPlaying ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                    transition: 'background var(--transition-fast)'
                  }}
                >
                  {/* Play Button */}
                  <button
                    onClick={() => {
                      playTrack(track);
                      recordTrackPlay(track);
                    }}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: 0,
                      background: isCurrentPlaying ? '#ffffff' : 'rgba(255, 255, 255, 0.06)',
                      border: 'none',
                      color: isCurrentPlaying ? '#090a0d' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      flexShrink: 0,
                      transition: 'all 0.15s ease'
                    }}
                    aria-label={`Play preview for ${track.title}`}
                  >
                    {isCurrentPlaying ? <Pause size={12} fill="#090a0d" /> : <Play size={12} fill="#ffffff" style={{ marginLeft: '1px' }} />}
                  </button>

                  {/* Track Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: isCurrentPlaying ? '#ffffff' : '#e2e8f0',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {track.trackNumber}. {track.title}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      {track.previewUrl ? '30s Preview • Tap to play' : 'Audio Track'}
                    </div>
                  </div>

                  {/* Duration */}
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {formatDuration(track.durationMs)}
                  </span>
                </div>
              );
            })
          ) : (
            <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
              No track preview metadata found.
            </div>
          )}
        </div>
      </section>

      {/* Community Reviews Section */}
      <section style={{ padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff' }}>
            Community Reviews ({reviews.length})
          </h3>
        </div>

        {reviews.length > 0 ? (
          reviews.map(review => (
            <ReviewCard
              key={review.id}
              review={review}
              onOpenAlbum={() => {}}
              onLikeToggle={() => {
                setReviews(storageService.getReviews().filter(r => r.albumId === albumId));
              }}
            />
          ))
        ) : (
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px dashed var(--border-subtle)',
            borderRadius: 0,
            padding: '24px 16px',
            textAlign: 'center',
            color: 'var(--text-muted)'
          }}>
            <p style={{ fontSize: '13px', marginBottom: '8px', color: 'var(--text-secondary)' }}>Be the first to review {album.title}!</p>
            <button
              className="btn-secondary"
              style={{ fontSize: '12px', padding: '6px 14px', borderRadius: 0 }}
              onClick={() => onOpenReviewModal(album)}
            >
              Write Review
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
