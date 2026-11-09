import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number; // 0 to 5.0 (steps of 0.5) or 0 to 10
  maxStars?: number;
  size?: number;
  interactive?: boolean;
  showScore?: boolean;
  scoreScale?: 5 | 10;
  onChange?: (rating: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 15,
  interactive = false,
  showScore = true,
  scoreScale = 10,
  onChange
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const displayRating = hoverRating !== null ? hoverRating : rating;
  const scoreText = scoreScale === 10
    ? (displayRating <= 5 ? displayRating * 2 : displayRating).toFixed(1)
    : displayRating.toFixed(1);

  const handleClick = (starIndex: number, isHalf: boolean) => {
    if (!interactive || !onChange) return;
    const newRating = isHalf ? starIndex - 0.5 : starIndex;
    onChange(newRating);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, starIndex: number) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isHalf = x < rect.width / 2;
    setHoverRating(isHalf ? starIndex - 0.5 : starIndex);
  };

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '3px',
        lineHeight: 0,
        flexShrink: 0,
        cursor: interactive ? 'pointer' : 'default'
      }}
      onMouseLeave={() => interactive && setHoverRating(null)}
    >
      {Array.from({ length: maxStars }, (_, i) => {
        const starIndex = i + 1;
        const fillAmount = Math.max(0, Math.min(1, displayRating - (starIndex - 1)));

        return (
          <div
            key={i}
            style={{ position: 'relative', width: size, height: size, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const isHalf = (e.clientX - rect.left) < rect.width / 2;
              handleClick(starIndex, isHalf);
            }}
            onMouseMove={(e) => handleMouseMove(e, starIndex)}
          >
            {/* Background Empty Star */}
            <Star
              size={size}
              color="rgba(255, 255, 255, 0.18)"
              fill="rgba(255, 255, 255, 0.04)"
              strokeWidth={1.2}
              style={{ display: 'block', flexShrink: 0 }}
            />

            {/* Filled Star with clip-path for half-stars */}
            {fillAmount > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  clipPath: `inset(0 ${100 - fillAmount * 100}% 0 0)`,
                  width: size,
                  pointerEvents: 'none'
                }}
              >
                <Star
                  size={size}
                  color="var(--star-gold, #f59e0b)"
                  fill="var(--star-gold, #f59e0b)"
                  strokeWidth={1.2}
                  style={{ display: 'block', flexShrink: 0 }}
                />
              </div>
            )}
          </div>
        );
      })}

      {showScore && displayRating > 0 && (
        <span
          style={{
            marginLeft: '5px',
            fontSize: `${Math.max(11, size - 2)}px`,
            fontWeight: 700,
            color: 'var(--gds-accent-citron, #d4ff32)',
            fontFamily: 'var(--font-sans)',
            letterSpacing: '0.01em'
          }}
        >
          {scoreText} <small style={{ opacity: 0.5, fontWeight: 500, fontSize: '0.85em' }}>/ {scoreScale}</small>
        </span>
      )}
    </div>
  );
};
