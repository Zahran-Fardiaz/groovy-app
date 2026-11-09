import React from 'react';
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

  const getSliderTrackBg = (val: number) =>
    `linear-gradient(to right, var(--gds-accent-citron, #d4ff32) 0%, var(--gds-accent-citron, #d4ff32) ${val}%, rgba(255, 255, 255, 0.14) ${val}%, rgba(255, 255, 255, 0.14) 100%)`;

  return (
    <div className="taste-tuner-card">
      <div className="taste-tuner-header">
        <div>
          <h4 className="taste-tuner-title">Sonic Preferences</h4>
          <p className="taste-tuner-subtitle">
            Sesuaikan parameter audio untuk memodulasi kurva rekomendasi musikmu.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange({ obscurity: 40, energy: 60, acousticness: 45, mood: 50 })}
          className="taste-tuner-reset-btn"
          title="Reset parameter ke default"
        >
          Reset
        </button>
      </div>

      <div className="tuner-sliders-grid">
        {/* 1. Obscurity Slider */}
        <div className="tuner-slider-item">
          <div className="tuner-slider-meta">
            <span className="tuner-label-left">Mainstream</span>
            <span className="tuner-label-val">{settings.obscurity}% Underground</span>
          </div>
          <input
            type="range"
            aria-label="Underground preference"
            min="0"
            max="100"
            value={settings.obscurity}
            style={{ background: getSliderTrackBg(settings.obscurity) }}
            onChange={(e) => handleSlider('obscurity', Number(e.target.value))}
            className="tuner-range-input"
          />
        </div>

        {/* 2. Energy Slider */}
        <div className="tuner-slider-item">
          <div className="tuner-slider-meta">
            <span className="tuner-label-left">Ambient / Chill</span>
            <span className="tuner-label-val">{settings.energy}% High Energy</span>
          </div>
          <input
            type="range"
            aria-label="Energy preference"
            min="0"
            max="100"
            value={settings.energy}
            style={{ background: getSliderTrackBg(settings.energy) }}
            onChange={(e) => handleSlider('energy', Number(e.target.value))}
            className="tuner-range-input"
          />
        </div>

        {/* 3. Acousticness */}
        <div className="tuner-slider-item">
          <div className="tuner-slider-meta">
            <span className="tuner-label-left">Synthetic / Electronic</span>
            <span className="tuner-label-val">{settings.acousticness}% Organic</span>
          </div>
          <input
            type="range"
            aria-label="Acoustic preference"
            min="0"
            max="100"
            value={settings.acousticness}
            style={{ background: getSliderTrackBg(settings.acousticness) }}
            onChange={(e) => handleSlider('acousticness', Number(e.target.value))}
            className="tuner-range-input"
          />
        </div>

        {/* 4. Mood */}
        <div className="tuner-slider-item">
          <div className="tuner-slider-meta">
            <span className="tuner-label-left">Melancholic</span>
            <span className="tuner-label-val">{settings.mood}% Euphoric</span>
          </div>
          <input
            type="range"
            aria-label="Mood preference"
            min="0"
            max="100"
            value={settings.mood}
            style={{ background: getSliderTrackBg(settings.mood) }}
            onChange={(e) => handleSlider('mood', Number(e.target.value))}
            className="tuner-range-input"
          />
        </div>
      </div>
    </div>
  );
};

export default TasteTuner;
