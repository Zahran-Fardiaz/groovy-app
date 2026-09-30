import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Disc, Wifi, Battery } from 'lucide-react';
import { useMusicPlayer } from '../../context/MusicPlayerContext';

interface MobileFrameProps {
  children: React.ReactNode;
}

export type DeviceMode = 'iphone' | 'pixel' | 'fullscreen';

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('iphone');
  const [currentTimeStr, setCurrentTimeStr] = useState('9:41');
  const { currentTrack, isPlaying, togglePlayPause } = useMusicPlayer();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTimeStr(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="desktop-preview-container">
      {/* Device Switcher Top Bar for testing responsive mobile dimensions */}
      <div className="device-switcher-bar">
        <span className="device-switcher-title">
          <Disc size={13} /> Groovy Frame
        </span>
        <button
          className={`device-btn ${deviceMode === 'iphone' ? 'active' : ''}`}
          onClick={() => setDeviceMode('iphone')}
          title="iPhone 16 Pro (393px × 844px)"
        >
          <Smartphone size={13} /> iPhone 16 Pro
        </button>
        <button
          className={`device-btn ${deviceMode === 'pixel' ? 'active' : ''}`}
          onClick={() => setDeviceMode('pixel')}
          title="Pixel 9 (412px × 860px)"
        >
          <Smartphone size={13} /> Pixel 9
        </button>
        <button
          className={`device-btn ${deviceMode === 'fullscreen' ? 'active' : ''}`}
          onClick={() => setDeviceMode('fullscreen')}
          title="Fullscreen Mobile Viewport"
        >
          <Monitor size={13} /> Fullscreen
        </button>
      </div>

      {/* Phone Shell */}
      <div className={`mobile-device-shell ${deviceMode}`}>
        {/* Status Bar */}
        <div className="phone-status-bar">
          <span style={{ letterSpacing: '-0.02em' }}>{currentTimeStr}</span>

          {/* Apple Dynamic Island (Interactive & Expands when audio is playing) */}
          <div
            className={`dynamic-island ${isPlaying && currentTrack ? 'playing' : ''}`}
            onClick={() => currentTrack && togglePlayPause()}
            title={currentTrack ? `${isPlaying ? 'Pause' : 'Play'}: ${currentTrack.title}` : 'Dynamic Island'}
          >
            {isPlaying && currentTrack ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <img
                    src={currentTrack.albumTitle ? 'https://upload.wikimedia.org/wikipedia/en/2/2e/In_Rainbows_Official_Cover.jpg' : ''}
                    alt=""
                    style={{ width: '16px', height: '16px', borderRadius: 0 }}
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                  <span style={{ fontSize: '10px', color: '#cbd5e1', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentTrack.title}
                  </span>
                </div>
                <div className="dynamic-island-waveform">
                  <div className="waveform-bar" />
                  <div className="waveform-bar" />
                  <div className="waveform-bar" />
                  <div className="waveform-bar" />
                </div>
              </>
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: 0, background: '#1c1c24' }} />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Wifi size={14} />
            <Battery size={15} />
          </div>
        </div>

        {/* Inner App Container */}
        <div className="app-viewport">
          {children}
        </div>
      </div>
    </div>
  );
};
