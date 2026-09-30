import React from 'react';
import { Radio, ArrowRight } from 'lucide-react';
import { useScrobble } from '../../context/ScrobbleContext';

interface LiveScrobblePulseProps {
  onOpenScrobbleModal: () => void;
}

export const LiveScrobblePulse: React.FC<LiveScrobblePulseProps> = ({
  onOpenScrobbleModal
}) => {
  const { isSimulating, scrobbles } = useScrobble();
  const latestScrobble = scrobbles?.[0];

  return (
    <div
      className="live-scrobble-pulse-bar"
      onClick={onOpenScrobbleModal}
      id="feed-live-scrobble-pulse"
      title="Open Auto-Logging & Scrobble Daemon"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
        <div style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          background: isSimulating ? 'var(--accent)' : 'var(--text-muted)',
          boxShadow: isSimulating ? '0 0 10px var(--accent-glow)' : 'none',
          flexShrink: 0
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
          <Radio size={12} color={isSimulating ? 'var(--accent)' : 'var(--text-muted)'} />
          <span style={{
            fontSize: '11.5px',
            color: 'var(--text-secondary)',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {isSimulating ? (
              latestScrobble ? (
                <span>Syncing live: <strong style={{ color: '#ffffff' }}>{latestScrobble.trackTitle}</strong> by {latestScrobble.artist}</span>
              ) : (
                'Live Spotify Sync Active'
              )
            ) : (
              'Auto-Logger Ready • Tap to sync Last.fm & Spotify'
            )}
          </span>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '11px',
        fontWeight: 600,
        color: '#ffffff',
        flexShrink: 0,
        paddingLeft: '8px'
      }}>
        <span>Sync</span>
        <ArrowRight size={12} />
      </div>
    </div>
  );
};
