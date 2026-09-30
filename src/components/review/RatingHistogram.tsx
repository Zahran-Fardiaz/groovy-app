import React from 'react';
import { Star } from 'lucide-react';
import { Review } from '../../types/music';

interface RatingHistogramProps {
  reviews: Review[];
}

export const RatingHistogram: React.FC<RatingHistogramProps> = ({ reviews }) => {
  // Buckets: 0.5 to 5.0 (10 buckets)
  const buckets: { rating: number; count: number }[] = [
    { rating: 0.5, count: 0 },
    { rating: 1.0, count: 0 },
    { rating: 1.5, count: 0 },
    { rating: 2.0, count: 0 },
    { rating: 2.5, count: 0 },
    { rating: 3.0, count: 0 },
    { rating: 3.5, count: 0 },
    { rating: 4.0, count: 0 },
    { rating: 4.5, count: 0 },
    { rating: 5.0, count: 0 }
  ];

  reviews.forEach(r => {
    const bucket = buckets.find(b => Math.abs(b.rating - r.rating) < 0.25);
    if (bucket) {
      bucket.count += 1;
    }
  });

  const maxCount = Math.max(...buckets.map(b => b.count), 1);

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 0,
      padding: '16px',
      margin: '14px 0'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Star size={13} color="var(--star-gold)" fill="var(--star-gold)" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>Ratings Distribution</span>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {reviews.length} rated
        </span>
      </div>

      {/* Histogram Bar Chart */}
      <div style={{ display: 'flex', alignItems: 'flex-end', height: '60px', gap: '5px', padding: '0 2px' }}>
        {buckets.map(b => {
          const heightPercent = Math.max(6, (b.count / maxCount) * 100);
          const isHighlight = b.rating >= 4.5;

          return (
            <div
              key={b.rating}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                justifyContent: 'flex-end'
              }}
              title={`${b.rating} Stars: ${b.count} reviews`}
            >
              <div
                style={{
                  width: '100%',
                  height: `${heightPercent}%`,
                  background: isHighlight
                    ? 'linear-gradient(180deg, var(--accent) 0%, rgba(245, 158, 11, 0.4) 100%)'
                    : 'rgba(255, 255, 255, 0.12)',
                  borderRadius: '2px',
                  transition: 'height 0.3s ease',
                  position: 'relative'
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '10px', color: 'var(--text-muted)' }}>
        <span>0.5 Stars</span>
        <span>2.5 Stars</span>
        <span>5.0 Stars</span>
      </div>
    </div>
  );
};
