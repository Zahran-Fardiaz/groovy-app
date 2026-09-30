import React, { useState } from 'react';
import { MessageSquare, Users, PenTool } from 'lucide-react';
import { Review, Album } from '../../types/music';
import { storageService } from '../../services/storageService';
import { ReviewCard } from '../review/ReviewCard';

interface CommunityStreamProps {
  onOpenAlbum: (albumId: string) => void;
  onOpenQuickLog: (album?: Album) => void;
}

export const CommunityStream: React.FC<CommunityStreamProps> = ({
  onOpenAlbum,
  onOpenQuickLog
}) => {
  const [reviews, setReviews] = useState<Review[]>(() => storageService.getReviews());
  const [filterMode, setFilterMode] = useState<'all' | 'following'>('all');

  const users = storageService.getUsers();
  const followedUserIds = new Set(
    users.filter(u => u.isFollowedByMe || u.id === 'user-me').map(u => u.id)
  );

  const filteredReviews = reviews.filter(r => {
    if (filterMode === 'following') {
      return followedUserIds.has(r.userId);
    }
    return true;
  });

  const handleRefresh = () => {
    setReviews(storageService.getReviews());
  };

  return (
    <div style={{ padding: '0 16px', marginBottom: '24px' }}>
      {/* Header & Sub-filter */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '14px',
        padding: '0 2px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MessageSquare size={14} color="var(--accent)" />
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.015em', margin: 0 }}>
            Community Logs & Reviews
          </h3>
        </div>

        {/* Following vs All Pill */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '2px',
          borderRadius: '9999px',
          border: '1px solid var(--border-subtle)',
          gap: '2px'
        }}>
          <button
            onClick={() => setFilterMode('all')}
            style={{
              fontSize: '10.5px',
              fontWeight: filterMode === 'all' ? 600 : 500,
              padding: '4px 9px',
              borderRadius: '9999px',
              border: 'none',
              background: filterMode === 'all' ? '#ffffff' : 'transparent',
              color: filterMode === 'all' ? '#090a0d' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            All
          </button>
          <button
            onClick={() => setFilterMode('following')}
            style={{
              fontSize: '10.5px',
              fontWeight: filterMode === 'following' ? 600 : 500,
              padding: '4px 9px',
              borderRadius: '9999px',
              border: 'none',
              background: filterMode === 'following' ? '#ffffff' : 'transparent',
              color: filterMode === 'following' ? '#090a0d' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Following
          </button>
        </div>
      </div>

      {/* Share / Log prompt bar */}
      <div
        onClick={() => onOpenQuickLog()}
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'border-color var(--transition-fast)'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PenTool size={13} color="var(--accent-amber)" />
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Listened to something today? Write a review...
          </span>
        </div>
        <span style={{
          fontSize: '11px',
          fontWeight: 600,
          background: '#ffffff',
          color: '#090a0d',
          padding: '3px 9px',
          borderRadius: '9999px'
        }}>
          + Log
        </span>
      </div>

      {/* Reviews Stream */}
      {filteredReviews.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onOpenAlbum={onOpenAlbum}
              onLikeToggle={handleRefresh}
            />
          ))}
        </div>
      ) : (
        <div className="feed-empty-box">
          <Users size={24} style={{ margin: '0 auto 8px', color: 'var(--text-muted)' }} />
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            {filterMode === 'following'
              ? "None of the users you follow have posted reviews yet."
              : "No reviews found yet."}
          </p>
          <button
            className="btn-primary"
            style={{ fontSize: '11px', padding: '6px 14px' }}
            onClick={() => onOpenQuickLog()}
          >
            Be the first to review
          </button>
        </div>
      )}
    </div>
  );
};
