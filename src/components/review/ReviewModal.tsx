import React, { useEffect, useState } from 'react';
import { X, Disc, Tag } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Album, Review } from '../../types/music';
import { StarRating } from '../common/StarRating';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useScrobble } from '../../context/ScrobbleContext';

interface ReviewModalProps {
  isOpen: boolean;
  album: Album | null;
  initialRating?: number;
  onClose: () => void;
  onReviewCreated: (newReview: Review) => void;
}

const COMMON_TAGS = ['masterpiece', 'late-night', 'melancholic', 'euphoric', 'driving-alone', 'headphones-only', 'repeat-worthy'];

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  album,
  initialRating = 4.0,
  onClose,
  onReviewCreated
}) => {
  const { currentUser } = useAuth();
  const { markAsReviewed } = useScrobble();

  const [rating, setRating] = useState<number>(initialRating);
  const [reviewText, setReviewText] = useState('');
  const [favoriteTrack, setFavoriteTrack] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isRelisten, setIsRelisten] = useState(false);
  const [listenDate, setListenDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !album) return null;

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    if (newRating === 5.0) {
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.6 },
          colors: ['#ffffff', '#f59e0b', '#cbd5e1']
        });
      } catch {
        // Fallback gracefully if canvas is blocked
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newReview: Review = {
      id: 'rev-' + Date.now(),
      albumId: album.id,
      albumTitle: album.title,
      albumCover: album.coverUrl,
      artist: album.artist,
      userId: currentUser.id,
      userName: currentUser.displayName,
      userAvatar: currentUser.avatarUrl,
      userHandle: currentUser.username,
      rating,
      reviewText: reviewText.trim() || `Rated ${rating} out of 5 stars.`,
      favoriteTrackTitle: favoriteTrack || undefined,
      tags: selectedTags,
      dateListened: listenDate,
      createdAt: 'Just now',
      likes: 0,
      likedByMe: false,
      comments: [],
      isRelisten
    };

    storageService.saveReview(newReview);
    markAsReviewed(album.title);
    onReviewCreated(newReview);
    onClose();
  };

  return (
    <div className="bottom-sheet-backdrop" onClick={onClose}>
      <div
        className="bottom-sheet-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
        onClick={e => e.stopPropagation()}
        style={{ maxHeight: '92vh' }}
      >
        <div className="sheet-handle" />

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <span id="review-modal-title" style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.01em' }}>
            Log or Review Album
          </span>
          <button
            onClick={onClose}
            aria-label="Close review dialog"
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Selected Album Banner */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', padding: '10px 12px', borderRadius: 0 }}>
          <img src={album.coverUrl} alt={album.title} style={{ width: '44px', height: '44px', borderRadius: 0, objectFit: 'cover' }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {album.title}
            </h4>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{album.artist} • {album.releaseYear}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Star Rating Selector */}
          <div style={{ textAlign: 'center', margin: '14px 0 18px', padding: '14px 12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 0, border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Tap or drag to rate
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <StarRating
                rating={rating}
                size={32}
                interactive={true}
                onChange={handleRatingChange}
              />
            </div>
          </div>

          {/* Review Text Input */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Your Review
            </label>
            <textarea
              className="textarea-input"
              rows={4}
              placeholder="What stood out to you? The production, mood, lyricism..."
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
            />
          </div>

          {/* Favorite Track Picker */}
          {album.tracklist && album.tracklist.length > 0 && (
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <Disc size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Favorite Track (Optional)
              </label>
              <select
                className="text-input"
                value={favoriteTrack}
                onChange={e => setFavoriteTrack(e.target.value)}
                style={{ appearance: 'auto' }}
              >
                <option value="">Select track highlight...</option>
                {album.tracklist.map(t => (
                  <option key={t.id} value={t.title}>
                    #{t.trackNumber} - {t.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Tags */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              <Tag size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Mood & Tags
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {COMMON_TAGS.map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    style={{
                      fontSize: '11px',
                      padding: '4px 10px',
                      borderRadius: 0,
                      border: isSelected ? '1px solid #ffffff' : '1px solid var(--border-subtle)',
                      background: isSelected ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                      color: isSelected ? '#ffffff' : 'var(--text-muted)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Listen Date & Relisten Row */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Date Listened
              </label>
              <input
                type="date"
                className="text-input"
                value={listenDate}
                onChange={e => setListenDate(e.target.value)}
                style={{ fontSize: '12px', padding: '6px 10px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '16px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                  type="checkbox"
                  checked={isRelisten}
                  onChange={e => setIsRelisten(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#ffffff' }}
                />
                Re-listen
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="btn-submit-review"
            type="submit"
            className="btn-primary"
            style={{ width: '100%', padding: '12px' }}
          >
            Save & Publish Review
          </button>
        </form>
      </div>
    </div>
  );
};
