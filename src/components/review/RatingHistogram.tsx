import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Review } from '../../types/music';

interface RatingHistogramProps {
  reviews: Review[];
}

export const RatingHistogram: React.FC<RatingHistogramProps> = ({ reviews }) => {
  const [hoveredBucket, setHoveredBucket] = useState<{ rating: number; count: number } | null>(null);

  const buckets = Array.from({ length: 10 }, (_, index) => ({
    rating: (index + 1) / 2,
    count: 0
  }));

  reviews.forEach(review => {
    const bucket = buckets.find(item => Math.abs(item.rating - review.rating) < 0.25);
    if (bucket) bucket.count++;
  });

  const maxCount = Math.max(...buckets.map(item => item.count), 1);
  const totalCount = reviews.length;
  const average = totalCount
    ? ((reviews.reduce((sum, review) => sum + review.rating, 0) / totalCount) * 2).toFixed(1)
    : null;

  const highRatingsCount = reviews.filter(r => r.rating >= 4.0).length;
  const highRatingPercentage = totalCount > 0 ? Math.round((highRatingsCount / totalCount) * 100) : 0;

  return (
    <section className="profile-ratings-section" aria-labelledby="profile-ratings-heading">
      <div className="section-header-row">
        <div>
          <h2 id="profile-ratings-heading" className="profile-section-title">
            Rating Distribution
          </h2>
          <span className="profile-section-subtitle">
            {totalCount} {totalCount === 1 ? 'record' : 'records'} logged
          </span>
        </div>
      </div>

      <div className="rating-spectrum-card">
        {/* Metric Row */}
        <div className="spectrum-summary-row">
          <div className="spectrum-average-wrap">
            <div className="spectrum-average-badge">
              <Star size={18} className="spectrum-star-icon" fill="currentColor" />
              <span className="spectrum-average-value">{average ?? '—'}</span>
              <span className="spectrum-average-denom">/ 10</span>
            </div>
            <span className="spectrum-label">
              {average ? 'Average Rating' : 'No ratings recorded'}
            </span>
          </div>

          {totalCount > 0 && (
            <div className="spectrum-insight-pill">
              <span>{highRatingPercentage}% rated 8.0+</span>
            </div>
          )}
        </div>

        {/* Hovered bar tooltip indicator */}
        <div className="spectrum-tooltip-space">
          {hoveredBucket ? (
            <div className="spectrum-hover-indicator">
              <strong>{(hoveredBucket.rating * 2).toFixed(1)} / 10</strong>
              <span>
                {hoveredBucket.count} {hoveredBucket.count === 1 ? 'review' : 'reviews'} (
                {Math.round((hoveredBucket.count / Math.max(totalCount, 1)) * 100)}%)
              </span>
            </div>
          ) : (
            <div className="spectrum-hover-hint">
              Tap bars to inspect distribution
            </div>
          )}
        </div>

        {/* Equalizer Frequency Bars */}
        <div
          className="spectrum-bars-stage"
          role="img"
          aria-label={
            'Rating distribution: ' +
            buckets.map(item => `${item.rating} stars: ${item.count}`).join(', ')
          }
        >
          {buckets.map(item => {
            const heightPercent = item.count ? Math.max((item.count / maxCount) * 100, 8) : 4;
            const isHovered = hoveredBucket?.rating === item.rating;

            return (
              <div
                key={item.rating}
                className={`spectrum-bar-column ${item.count === 0 ? 'is-empty' : 'has-reviews'} ${
                  isHovered ? 'is-active' : ''
                }`}
                onMouseEnter={() => setHoveredBucket(item)}
                onMouseLeave={() => setHoveredBucket(null)}
                onClick={() => setHoveredBucket(item)}
              >
                <div className="spectrum-bar-track">
                  <span
                    className="spectrum-bar-fill"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="spectrum-bar-rating-label">
                  {item.rating % 1 === 0 ? item.rating : ''}
                </span>
              </div>
            );
          })}
        </div>

        {/* Axis Labels */}
        <div className="spectrum-axis-labels">
          <span>0.5 ★ Min</span>
          <span>2.5 ★ Med</span>
          <span>5.0 ★ Max</span>
        </div>
      </div>
    </section>
  );
};
