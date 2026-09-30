import React, { useState } from 'react';
import { Heart, MessageSquare, Share2, Disc, Send, RotateCw } from 'lucide-react';
import { Review } from '../../types/music';
import { StarRating } from '../common/StarRating';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';

interface ReviewCardProps {
  review: Review;
  onOpenAlbum: (albumId: string) => void;
  onLikeToggle?: () => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onOpenAlbum,
  onLikeToggle
}) => {
  const { currentUser } = useAuth();
  const [isLiked, setIsLiked] = useState(review.likedByMe);
  const [likesCount, setLikesCount] = useState(review.likes);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(review.comments || []);
  const [newCommentText, setNewCommentText] = useState('');

  const handleLike = () => {
    storageService.toggleLikeReview(review.id);
    setIsLiked(!isLiked);
    setLikesCount(prev => (isLiked ? prev - 1 : prev + 1));
    if (onLikeToggle) onLikeToggle();
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const updated = storageService.addCommentToReview(review.id, newCommentText.trim(), currentUser);
    if (updated) {
      setComments([...updated.comments]);
      setNewCommentText('');
    }
  };

  return (
    <article className="review-card" id={`review-card-${review.id}`}>
      {/* Header: User Info & Timestamp */}
      <div className="review-card-header">
        <div className="user-badge-row">
          <img src={review.userAvatar} alt={review.userName} className="user-avatar-sm" />
          <div>
            <div className="user-name-text">{review.userName}</div>
            <div className="user-handle-text">@{review.userHandle}</div>
          </div>
        </div>
        <div className="review-date-badge">
          {review.isRelisten && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: 'var(--text-muted)', marginRight: '4px' }}>
              <RotateCw size={10} /> Re-listen
            </span>
          )}
          {review.createdAt}
        </div>
      </div>

      {/* Album Preview & Rating */}
      <div className="review-album-grid">
        <div
          className="album-thumb-wrap"
          onClick={() => onOpenAlbum(review.albumId)}
        >
          <img src={review.albumCover} alt={review.albumTitle} className="album-thumb-img" />
        </div>

        <div className="review-main-content">
          <div
            className="review-album-title"
            onClick={() => onOpenAlbum(review.albumId)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{review.albumTitle}</span>
            {(review.isIndonesian ?? storageService.getAlbumById(review.albumId)?.isIndonesian) && (
              <span style={{
                background: 'rgba(255, 255, 255, 0.06)',
                color: '#ffffff',
                border: '1px solid var(--border-subtle)',
                padding: '1px 5px',
                borderRadius: '9999px',
                fontSize: '9px',
                fontWeight: 600,
                flexShrink: 0
              }}>
                Indo
              </span>
            )}
          </div>
          <div className="review-artist-name">{review.artist}</div>

          <div style={{ marginBottom: '6px' }}>
            <StarRating rating={review.rating} size={14} />
          </div>

          {review.favoriteTrackTitle && (
            <div className="review-fav-track-badge">
              <Disc size={11} /> Favorite: {review.favoriteTrackTitle}
            </div>
          )}
        </div>
      </div>

      {/* Review Text */}
      <p className="review-body-text">{review.reviewText}</p>

      {/* Tags */}
      {review.tags && review.tags.length > 0 && (
        <div className="review-tags-wrap">
          {review.tags.map((tag, idx) => (
            <span key={idx} className="tag-pill">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer: Social Actions */}
      <div className="review-card-footer">
        <div style={{ display: 'flex', gap: '16px' }}>
          <button
            className={`card-action-btn ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
            aria-label="Like review"
          >
            <Heart size={15} fill={isLiked ? 'var(--accent)' : 'none'} color={isLiked ? 'var(--accent)' : 'currentColor'} />
            <span style={{ fontSize: '11px', fontWeight: 500 }}>{likesCount}</span>
          </button>

          <button
            className="card-action-btn"
            onClick={() => setShowComments(!showComments)}
            aria-label="Comment on review"
          >
            <MessageSquare size={15} />
            <span style={{ fontSize: '11px', fontWeight: 500 }}>{comments.length}</span>
          </button>
        </div>

        <button
          className="card-action-btn"
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: review.albumTitle, text: review.reviewText, url: window.location.href });
            } else {
              alert('Review link copied to clipboard!');
            }
          }}
          aria-label="Share review"
        >
          <Share2 size={15} />
        </button>
      </div>

      {/* Expandable Comment Section */}
      {showComments && (
        <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
          {comments.map(c => (
            <div key={c.id} style={{ display: 'flex', gap: '8px', marginBottom: '8px', fontSize: '12px' }}>
              <img src={c.userAvatar} alt={c.userName} style={{ width: '22px', height: '22px', borderRadius: 0 }} />
              <div style={{ flex: 1, background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', padding: '6px 10px', borderRadius: 0 }}>
                <span style={{ fontWeight: 600, color: '#ffffff', marginRight: '6px' }}>{c.userName}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{c.text}</span>
              </div>
            </div>
          ))}

          {/* Quick Comment Input */}
          <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <input
              type="text"
              className="text-input"
              style={{ fontSize: '12px', padding: '6px 10px' }}
              placeholder="Leave a thought..."
              value={newCommentText}
              onChange={e => setNewCommentText(e.target.value)}
            />
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '6px 12px', borderRadius: 0 }}
            >
              <Send size={12} />
            </button>
          </form>
        </div>
      )}
    </article>
  );
};
