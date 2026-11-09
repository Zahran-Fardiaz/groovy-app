import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Disc, Wifi, Battery } from 'lucide-react';
import { Capacitor } from '@capacitor/core';

interface MobileFrameProps {
  children: React.ReactNode;
}

export type DeviceMode = 'iphone' | 'pixel' | 'fullscreen';

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const isNative = Capacitor.isNativePlatform();
  const [isMobileDevice, setIsMobileDevice] = useState(() => {
    if (typeof window === 'undefined') return true;
    return (
      isNative ||
      window.innerWidth <= 768 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );
  });

  const [deviceMode, setDeviceMode] = useState<DeviceMode>('iphone');
  const [currentTimeStr, setCurrentTimeStr] = useState('9:41');
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobileDevice(
        isNative ||
        window.innerWidth <= 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      );
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isNative]);

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

  // When running on real Android APK or mobile browser, render 100% native fullscreen layout!
  // No fake device switcher bar, no fake phone bezel, and no fake status bar!
  if (isNative || isMobileDevice) {
    return <div className="native-mobile-container">{children}</div>;
  }

  // Desktop browser mode: provides device frame preview for testing
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

          {/* Apple Dynamic Island Notch */}
          <div className="dynamic-island">
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#1c1c24' }} />
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
