import React from 'react';
import { Radio, Star, X } from 'lucide-react';
import { useScrobble } from '../../context/ScrobbleContext';

interface AutoLogBannerProps {
  onQuickReview: (albumTitle: string, artist: string, cover: string) => void;
}

export const AutoLogBanner: React.FC<AutoLogBannerProps> = ({ onQuickReview }) => {
  const { recentAutoLogged, clearAutoLogNotification } = useScrobble();

  if (!recentAutoLogged) return null;

  return (
    <div
      id="auto-log-banner-notification"
      style={{
        margin: '8px 14px 12px',
        padding: '10px 12px',
        background: 'rgba(18, 20, 26, 0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
        animation: 'slide-up 0.25s ease-out'
      }}
    >
      {/* Album Cover Thumbnail */}
      <img
        src={recentAutoLogged.albumCover}
        alt={recentAutoLogged.albumTitle}
        style={{
          width: '36px',
          height: '36px',
          borderRadius: 0,
          objectFit: 'cover',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      />

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '2px' }}>
          <div style={{ width: '5px', height: '5px', borderRadius: 0, background: 'var(--accent-emerald)' }} />
          <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--accent-emerald)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
            Auto-Logged ({recentAutoLogged.source})
          </span>
        </div>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {recentAutoLogged.trackTitle}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {recentAutoLogged.artist} • {recentAutoLogged.albumTitle}
        </div>
      </div>

      {/* Action Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          id="btn-auto-log-review"
          onClick={() => {
            onQuickReview(recentAutoLogged.albumTitle, recentAutoLogged.artist, recentAutoLogged.albumCover);
            clearAutoLogNotification();
          }}
          style={{
            background: '#ffffff',
            border: 'none',
            color: '#090a0d',
            fontSize: '11px',
            fontWeight: 600,
            padding: '5px 10px',
            borderRadius: 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
          }}
        >
          <Star size={10} fill="#090a0d" /> Review
        </button>

        <button
          onClick={clearAutoLogNotification}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px'
          }}
          aria-label="Dismiss notification"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
