import React, { useState } from 'react';
import { Settings, Disc, Edit3, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { TopFourShowcase } from '../components/profile/TopFourShowcase';
import { RatingHistogram } from '../components/review/RatingHistogram';
import { StarRating } from '../components/common/StarRating';

interface ProfileViewProps {
  onOpenAlbum: (albumId: string) => void;
  onOpenScrobbleModal: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onOpenAlbum,
  onOpenScrobbleModal
}) => {
  const { currentUser, updateBio } = useAuth();
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(currentUser.bio);

  const allReviews = storageService.getReviews();
  const myReviews = allReviews.filter(r => r.userId === currentUser.id);
  const scrobbles = storageService.getScrobbles();

  const handleSaveBio = () => {
    updateBio(bioInput);
    setIsEditingBio(false);
  };

  return (
    <div style={{ padding: '0 16px' }}>
      {/* Profile Header */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 0,
        padding: '18px 16px 14px',
        margin: '14px 0 16px',
        position: 'relative',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
      }}>
        {/* Settings Button */}
        <button
          id="btn-profile-settings"
          onClick={onOpenScrobbleModal}
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px'
          }}
          title="Scrobble & Account Settings"
        >
          <Settings size={16} />
        </button>

        {/* Avatar & Identifiers */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '12px' }}>
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.displayName}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: 0,
              objectFit: 'cover',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.4)'
            }}
          />
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
              {currentUser.displayName}
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              @{currentUser.username}
            </span>
          </div>
        </div>

        {/* Bio */}
        <div style={{ marginBottom: '14px' }}>
          {isEditingBio ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="text-input"
                style={{ fontSize: '12px', padding: '6px 10px' }}
                value={bioInput}
                onChange={e => setBioInput(e.target.value)}
              />
              <button
                className="btn-primary"
                style={{ padding: '6px 12px', fontSize: '12px' }}
                onClick={handleSaveBio}
              >
                <Check size={13} />
              </button>
            </div>
          ) : (
            <p
              onClick={() => setIsEditingBio(true)}
              style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title="Click to edit bio"
            >
              <span>{currentUser.bio}</span>
              <Edit3 size={11} color="var(--text-muted)" />
            </p>
          )}
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
          textAlign: 'center',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '12px'
        }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>{myReviews.length}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Reviews</div>
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>{scrobbles.length}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Scrobbles</div>
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>{currentUser.followingCount}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Following</div>
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>{currentUser.followersCount}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Followers</div>
          </div>
        </div>
      </div>

      {/* Top 4 Albums Showcase */}
      <TopFourShowcase
        topAlbumIds={currentUser.topFourAlbumIds}
        isOwner={true}
        onOpenAlbum={onOpenAlbum}
      />

      {/* Ratings Distribution Histogram */}
      <RatingHistogram reviews={myReviews} />

      {/* Music Diary / History Section */}
      <section style={{ margin: '18px 0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Disc size={14} color="var(--text-secondary)" />
            <h3 style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff' }}>
              Listening Diary
            </h3>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {myReviews.length} logged
          </span>
        </div>

        {myReviews.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {myReviews.map(r => (
              <div
                key={r.id}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 0,
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'border-color var(--transition-fast)'
                }}
                onClick={() => onOpenAlbum(r.albumId)}
              >
                <img
                  src={r.albumCover}
                  alt={r.albumTitle}
                  style={{ width: '40px', height: '40px', borderRadius: 0, objectFit: 'cover', border: '1px solid rgba(255, 255, 255, 0.08)' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {r.albumTitle}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {r.artist}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <StarRating rating={r.rating} size={12} />
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {r.dateListened}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '12px' }}>
            No reviews logged yet. Tap '+' to write your first review!
          </div>
        )}
      </section>
    </div>
  );
};
