import React, { useState, useMemo } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Recommendation, TasteTunerSettings } from '../types/music';
import { recommendationEngine } from '../services/recommendationEngine';
import { storageService } from '../services/storageService';
import { useScrobble } from '../context/ScrobbleContext';
import { TasteTuner } from '../components/recommendations/TasteTuner';
import './RecommendationsView.css';

interface RecommendationsViewProps {
  onOpenAlbum: (albumId: string) => void;
  embedded?: boolean;
  activeSection?: 'all' | 'tuner';
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  onOpenAlbum,
  embedded,
  activeSection = 'all'
}) => {
  const { scrobbles } = useScrobble();
  const albums = storageService.getAlbums();
  const reviews = storageService.getReviews();
  const [tunerSettings, setTunerSettings] = useState<TasteTunerSettings>({
    obscurity: 45,
    energy: 65,
    acousticness: 40,
    mood: 50
  });

  const recommendations = useMemo(
    () => recommendationEngine.getRecommendations(albums, reviews, scrobbles, tunerSettings),
    [albums, reviews, scrobbles, tunerSettings]
  );

  const featured = recommendations.indonesianSpotlight[0];

  const sections = [
    { id: 'spotlight', title: 'Indonesian Spotlight', items: recommendations.indonesianSpotlight.slice(1) },
    { id: 'reviews', title: 'Based on Your Top Reviews', items: recommendations.basedOnReviews },
    { id: 'radar', title: 'Discovery Radar', items: recommendations.basedOnHistory },
    { id: 'trending', title: 'Community Favorites', items: recommendations.trendingCommunity },
  ];

  const score = (item: Recommendation) => {
    if (typeof item.score !== 'number') return null;
    return (item.score / 10).toFixed(1);
  };

  const renderCard = (item: Recommendation) => (
    <button
      key={item.album.id}
      id={'recommendation-card-' + item.matchType + '-' + item.album.id}
      className="rec-album-card"
      onClick={() => onOpenAlbum(item.album.id)}
    >
      <div className="rec-album-sleeve">
        <img src={item.album.coverUrl} alt={item.album.title + ' cover'} loading="lazy" />
      </div>
      <span className="rec-album-artist" title={item.album.artist}>{item.album.artist}</span>
      <h4 className="rec-album-title" title={item.album.title}>{item.album.title}</h4>
      <div className="rec-album-score">
        {score(item) !== null && <span className="album-rating-badge">{score(item)}<span>/10</span></span>}
        <span className="rec-match-caption">Taste match</span>
      </div>
      <p className="rec-album-reason" title={item.reason}>{item.reason}</p>
    </button>
  );

  // Dedicated Sonic Tuner Section
  if (activeSection === 'tuner') {
    return (
      <div className={embedded ? 'recommendations-embedded' : 'recommendations-page'}>
        <section className="rec-section" style={{ marginTop: '8px' }}>
          <TasteTuner settings={tunerSettings} onChange={setTunerSettings} />
        </section>

        <section className="rec-section" aria-labelledby="rec-heading-tuner">
          <div className="goty-section-label">
            <h2 id="rec-heading-tuner">Tuned to Your Taste</h2>
            <span>{recommendations.tasteTunerPicks.length} picks</span>
          </div>
          {recommendations.tasteTunerPicks.length > 0 ? (
            <div className="rec-album-grid">
              {recommendations.tasteTunerPicks.map(renderCard)}
            </div>
          ) : (
            <div className="rec-empty-state">
              <h3>Belum ada rekomendasi yang cocok</h3>
              <p>Coba sesuaikan slider preferensi audio di atas untuk menjelajah spektrum musik baru.</p>
            </div>
          )}
        </section>
      </div>
    );
  }

  // Default All Picks Section
  return (
    <div className={embedded ? 'recommendations-embedded' : 'recommendations-page'}>
      {featured && (
        <section className="rec-section" aria-labelledby="rec-featured-heading">
          <div className="goty-section-label">
            <h2 id="rec-featured-heading">Your Next Favorite</h2>
            <span>Picked for you</span>
          </div>
          <button
            className="goty-banner"
            id={'featured-spotlight-' + featured.album.id}
            onClick={() => onOpenAlbum(featured.album.id)}
          >
            <div className="goty-content">
              <img className="goty-art" src={featured.album.coverUrl} alt={featured.album.title + ' cover'} />
              <div className="goty-text">
                <span className="goty-release-type">Indonesian selection</span>
                <h3 className="goty-title">{featured.album.title}</h3>
                <p className="goty-artist">{featured.album.artist}</p>
                <p className="goty-genres">{featured.album.genres.slice(0, 2).join(' · ')}</p>
              </div>
            </div>
            <div className="goty-footer">
              <div className="goty-score-row">
                {score(featured) !== null && <span className="goty-score">{score(featured)}<span>/10</span></span>}
                <div className="goty-rating-meta">
                  <span>Taste match</span>
                  <span>Based on your listening</span>
                </div>
              </div>
              <span className="goty-open">View release <ArrowUpRight size={15} /></span>
            </div>
          </button>
          <p className="rec-featured-note">{featured.reason}</p>
        </section>
      )}

      {sections.map(section => (
        <React.Fragment key={section.id}>
          {section.items.length > 0 ? (
            <section className="rec-section" aria-labelledby={'rec-heading-' + section.id}>
              <div className="goty-section-label">
                <h2 id={'rec-heading-' + section.id}>{section.title}</h2>
                <span>{section.items.length} picks</span>
              </div>
              <div className="rec-album-grid">{section.items.map(renderCard)}</div>
            </section>
          ) : (
            <div className="rec-empty-state">
              <h3>More music, more discoveries.</h3>
              <p>
                {section.id === 'reviews'
                  ? 'Rate a few favorites to find music inspired by your reviews.'
                  : section.id === 'radar'
                  ? 'Log your listening to start discovering related releases.'
                  : 'New picks will appear here as your music collection grows.'}
              </p>
            </div>
          )}
        </React.Fragment>
      ))}
      <p className="rec-page-note">Your picks evolve with every review and listen.</p>
    </div>
  );
};

export default RecommendationsView;
