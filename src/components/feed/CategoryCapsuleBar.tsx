import React from 'react';

export interface VibeCategory {
  id: string;
  label: string;
  icon?: string;
  badge?: string;
}

const VIBE_CATEGORIES: VibeCategory[] = [
  { id: 'all', label: 'All' },
  { id: 'indonesian', label: 'Indonesian' },
  { id: 'global', label: 'Global' },
  { id: 'party', label: 'Party' },
  { id: 'blues', label: 'Blues' },
  { id: 'sad', label: 'Sad' },
  { id: 'hiphop', label: 'Hip Hop' },
  { id: 'indie', label: 'Indie Pop' },
  { id: 'vinyl', label: 'Vinyl Classics' },
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
    <section className="feed-category-section" aria-label="Select Categories">
      <div className="feed-category-header">
        <h2 className="feed-category-title">Select Categories</h2>
      </div>

      <div className="feed-capsule-track">
        {VIBE_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`cat-capsule-${cat.id}`}
              className={`feed-vibe-capsule ${isActive ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              <span>{cat.label}</span>
              {cat.badge && <span className="feed-capsule-badge">{cat.badge}</span>}
            </button>
          );
        })}
      </div>
    </section>
  );
};
export default CategoryCapsuleBar;
