import React from 'react';
import { Sliders, RotateCcw } from 'lucide-react';
import { TasteTunerSettings } from '../../types/music';

interface TasteTunerProps {
  settings: TasteTunerSettings;
  onChange: (settings: TasteTunerSettings) => void;
}

export const TasteTuner: React.FC<TasteTunerProps> = ({ settings, onChange }) => {
  const handleSlider = (key: keyof TasteTunerSettings, value: number) => {
    onChange({
      ...settings,
      [key]: value
    });
  };

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 0,
      padding: '16px',
      margin: '14px 0',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sliders size={14} color="var(--text-secondary)" />
          <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.01em' }}>
            Sonic Preferences
          </h4>
        </div>
        <button
          onClick={() => onChange({ obscurity: 40, energy: 60, acousticness: 45, mood: 50 })}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '11px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'color var(--transition-fast)'
          }}
          title="Reset to defaults"
        >
          <RotateCcw size={11} /> Reset
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* 1. Obscurity Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px', color: 'var(--text-secondary)' }}>
            <span>Mainstream</span>
            <span style={{ color: '#ffffff', fontWeight: 500 }}>{settings.obscurity}% Underground</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.obscurity}
            onChange={e => handleSlider('obscurity', Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        {/* 2. Energy Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px', color: 'var(--text-secondary)' }}>
            <span>Ambient / Chill</span>
            <span style={{ color: '#ffffff', fontWeight: 500 }}>{settings.energy}% High Energy</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.energy}
            onChange={e => handleSlider('energy', Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        {/* 3. Acousticness */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px', color: 'var(--text-secondary)' }}>
            <span>Synthetic / Electronic</span>
            <span style={{ color: '#ffffff', fontWeight: 500 }}>{settings.acousticness}% Organic</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.acousticness}
            onChange={e => handleSlider('acousticness', Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        {/* 4. Mood */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px', color: 'var(--text-secondary)' }}>
            <span>Melancholic</span>
            <span style={{ color: '#ffffff', fontWeight: 500 }}>{settings.mood}% Euphoric</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.mood}
            onChange={e => handleSlider('mood', Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};
