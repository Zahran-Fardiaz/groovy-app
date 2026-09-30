import React, { useState } from 'react';
import { Radio, RefreshCw, X, Check, Zap, Globe, Music } from 'lucide-react';
import { useScrobble } from '../../context/ScrobbleContext';

interface ScrobbleSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScrobbleSimulatorModal: React.FC<ScrobbleSimulatorModalProps> = ({ isOpen, onClose }) => {
  const { isSimulating, toggleSimulation, triggerInstantScrobble, syncLastFm } = useScrobble();
  const [lastfmUsername, setLastfmUsername] = useState('groover_demo');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResultMsg, setSyncResultMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncResultMsg(null);
    try {
      const count = await syncLastFm(lastfmUsername);
      setSyncResultMsg(`Successfully synced ${count} recent scrobbles!`);
    } catch (e) {
      setSyncResultMsg('Failed to sync. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="bottom-sheet-backdrop" onClick={onClose}>
      <div className="bottom-sheet-content" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: 0, background: 'rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Radio size={14} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>Auto-Logging & Sync</h3>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Live listening stream settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Section 1: Live Background Simulator */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: 0,
          padding: '14px',
          marginBottom: '14px',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={14} color="var(--star-gold)" />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff' }}>Background Listening Stream</span>
            </div>
            <button
              id="btn-toggle-scrobble-simulation"
              onClick={toggleSimulation}
              style={{
                background: isSimulating ? '#ffffff' : 'rgba(255, 255, 255, 0.08)',
                color: isSimulating ? '#090a0d' : 'var(--text-muted)',
                border: 'none',
                borderRadius: 0,
                padding: '3px 10px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {isSimulating ? 'Active' : 'Off'}
            </button>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '10px' }}>
            Simulates a live music listening session, automatically logging tracks to your diary in the background.
          </p>
          <button
            id="btn-trigger-instant-scrobble"
            className="btn-secondary"
            style={{ width: '100%', fontSize: '12px', padding: '8px' }}
            onClick={() => {
              triggerInstantScrobble();
              setSyncResultMsg('New track auto-logged right now!');
            }}
          >
            <Music size={13} /> Log 1 Track Now
          </button>
        </div>

        {/* Section 2: Last.fm Sync */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: 0,
          padding: '14px',
          marginBottom: '16px',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Globe size={14} color="var(--text-secondary)" />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff' }}>Last.fm Integration</span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '10px' }}>
            Import your listening history from Last.fm to populate your profile stats and recommendations.
          </p>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input
              type="text"
              className="text-input"
              value={lastfmUsername}
              onChange={e => setLastfmUsername(e.target.value)}
              placeholder="Last.fm Username"
              style={{ flex: 1 }}
            />
            <button
              id="btn-sync-lastfm"
              className="btn-primary"
              style={{ padding: '0 14px', fontSize: '12px' }}
              onClick={handleSync}
              disabled={isSyncing}
            >
              {isSyncing ? <RefreshCw size={13} className="spinning" /> : 'Sync'}
            </button>
          </div>

          {syncResultMsg && (
            <div style={{ fontSize: '11px', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
              <Check size={12} /> {syncResultMsg}
            </div>
          )}
        </div>

        {/* Close button */}
        <button
          className="btn-secondary"
          style={{ width: '100%' }}
          onClick={onClose}
        >
          Done
        </button>
      </div>
    </div>
  );
};
