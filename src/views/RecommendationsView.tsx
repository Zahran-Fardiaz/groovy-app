import React, { useState, useMemo } from 'react';
import { Sparkles, Radio, Heart, Award, ArrowRight, Disc } from 'lucide-react';
import { Recommendation, TasteTunerSettings } from '../types/music';
import { recommendationEngine } from '../services/recommendationEngine';
import { storageService } from '../services/storageService';
import { useScrobble } from '../context/ScrobbleContext';
import { TasteTuner } from '../components/recommendations/TasteTuner';

interface RecommendationsViewProps {
  onOpenAlbum: (albumId: string) => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({ onOpenAlbum }) => {
  const { scrobbles } = useScrobble();
  const albums = storageService.getAlbums();
  const reviews = storageService.getReviews();

  const [tunerSettings, setTunerSettings] = useState<TasteTunerSettings>({
    obscurity: 45,
    energy: 65,
    acousticness: 40,
    mood: 50
  });

  const recommendations = useMemo(() => {
    return recommendationEngine.getRecommendations(albums, reviews, scrobbles, tunerSettings);
  }, [albums, reviews, scrobbles, tunerSettings]);

  const renderRecommendationCard = (item: Recommendation) => (
    <div
      key={item.album.id}
      id={`recommendation-card-${item.album.id}`}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 0,
        padding: '12px',
        marginBottom: '10px',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'transform var(--transition-fast), border-color var(--transition-fast)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
      }}
      onClick={() => onOpenAlbum(item.album.id)}
    >
      <img
        src={item.album.coverUrl}
        alt={item.album.title}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: 0,
          objectFit: 'cover',
          flexShrink: 0,
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Reasoning Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border-subtle)',
          color: 'var(--text-secondary)',
          fontSize: '10px',
          fontWeight: 500,
          padding: '2px 8px',
          borderRadius: 0,
          marginBottom: '4px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '100%'
        }}>
          <Sparkles size={9} /> {item.reason}
        </div>

        <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {item.album.title}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {item.album.artist} • {item.album.genres[0]}
        </div>
      </div>

      <div style={{ color: 'var(--text-muted)' }}>
        <ArrowRight size={15} />
      </div>
    </div>
  );

  return (
    <div style={{ padding: '0 16px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 0,
        padding: '16px',
        margin: '14px 0 18px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Sparkles size={16} color="#ffffff" />
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.01em' }}>
            Taste Intelligence
          </h3>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Personalized selections synthesized from your top ratings, active listening scrobbles, and sonic preferences.
        </p>
      </div>

      {/* Section 1: Indonesian Music Spotlight */}
      {recommendations.indonesianSpotlight.length > 0 && (
        <section style={{ marginBottom: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <Disc size={14} color="var(--accent)" />
            <h4 style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff' }}>
              Indonesian Spotlight
            </h4>
          </div>
          {recommendations.indonesianSpotlight.map(renderRecommendationCard)}
        </section>
      )}

      {/* Section 2: Based on Your Top Reviews */}
      <section style={{ marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <Award size={14} color="var(--accent)" />
          <h4 style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff' }}>
            Because You Loved Your 5-Star Reviews
          </h4>
        </div>
        {recommendations.basedOnReviews.map(renderRecommendationCard)}
      </section>

      {/* Section 3: Interactive Taste Tuner Sliders */}
      <section style={{ marginBottom: '22px' }}>
        <TasteTuner settings={tunerSettings} onChange={setTunerSettings} />

        <div style={{ marginTop: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Tuner Matches
          </div>
          {recommendations.tasteTunerPicks.map(renderRecommendationCard)}
        </div>
      </section>

      {/* Section 4: Based on Listening History / Scrobbles */}
      <section style={{ marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <Radio size={14} color="var(--accent)" />
          <h4 style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff' }}>
            Discovery Radar
          </h4>
        </div>
        {recommendations.basedOnHistory.map(renderRecommendationCard)}
      </section>

      {/* Section 5: Community Favorites */}
      <section style={{ marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <Heart size={14} color="var(--accent)" />
          <h4 style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff' }}>
            Trending in Community
          </h4>
        </div>
        {recommendations.trendingCommunity.map(renderRecommendationCard)}
      </section>
    </div>
  );
};
