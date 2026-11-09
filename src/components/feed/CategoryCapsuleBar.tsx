import React from 'react';

export interface VibeCategory {
  id: string;
  label: string;
}

const PRIMARY_CATEGORIES: VibeCategory[] = [
  { id: 'all', label: 'All' },
  { id: 'hiphop', label: 'Hip-Hop' },
  { id: 'indie', label: 'Indie' },
  { id: 'party', label: 'Electronic' },
  { id: 'indonesian', label: 'Indonesian' },
  { id: 'global', label: 'Global' },
  { id: 'rock', label: 'Rock' }
];

interface CategoryCapsuleBarProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryCapsuleBar: React.FC<CategoryCapsuleBarProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <nav className="feed-category-section" aria-label="Music categories">
      <div className="feed-capsule-track">
        {PRIMARY_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`cat-capsule-${cat.id}`}
              type="button"
              className={`feed-vibe-capsule ${isActive ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default CategoryCapsuleBar;
