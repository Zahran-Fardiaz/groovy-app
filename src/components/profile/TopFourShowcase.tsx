import React, { useState } from 'react';
import { Award, Plus } from 'lucide-react';
import { Album } from '../../types/music';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';

interface TopFourShowcaseProps {
  topAlbumIds: string[];
  isOwner?: boolean;
  onOpenAlbum: (albumId: string) => void;
}

export const TopFourShowcase: React.FC<TopFourShowcaseProps> = ({
  topAlbumIds,
  isOwner = true,
  onOpenAlbum
}) => {
  const { updateTopFour } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const allAlbums = storageService.getAlbums();

  const slots = [0, 1, 2, 3];
  const selectedAlbums: (Album | undefined)[] = slots.map(index => {
    const id = topAlbumIds[index];
    return id ? storageService.getAlbumById(id) : undefined;
  });

  const handleSelectAlbumForSlot = (slotIndex: number, albumId: string) => {
    const newIds = [...topAlbumIds];
    newIds[slotIndex] = albumId;
    updateTopFour(newIds);
  };

  return (
    <section style={{ margin: '18px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Award size={14} color="var(--star-gold)" />
          <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>
            Top 4 Favorites
          </h3>
        </div>
        {isOwner && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            {isEditing ? 'Done' : 'Edit Showcase'}
          </button>
        )}
      </div>

      {/* 4 Album Cover Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        {slots.map(index => {
          const album = selectedAlbums[index];

          return (
            <div
              key={index}
              id={`top-four-slot-${index}`}
              style={{
                position: 'relative',
                aspectRatio: '1/1',
                borderRadius: 0,
                overflow: 'hidden',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                cursor: album ? 'pointer' : 'default'
              }}
              onClick={() => album && !isEditing && onOpenAlbum(album.id)}
            >
              {album ? (
                <>
                  <img
                    src={album.coverUrl}
                    alt={album.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 0 }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '6px 4px 3px',
                    background: 'linear-gradient(0deg, rgba(9, 10, 13, 0.85) 0%, transparent 100%)',
                    fontSize: '9px',
                    fontWeight: 500,
                    color: '#ffffff',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    textAlign: 'center'
                  }}>
                    {album.title}
                  </div>
                </>
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)'
                }}>
                  <Plus size={18} strokeWidth={1.5} />
                </div>
              )}

              {/* Slot Number Badge */}
              <div style={{
                position: 'absolute',
                top: '4px',
                left: '4px',
                width: '15px',
                height: '15px',
                borderRadius: 0,
                background: 'rgba(9, 10, 13, 0.7)',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontSize: '9px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {index + 1}
              </div>

              {/* Edit overlay dropdown trigger */}
              {isEditing && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0, 0, 0, 0.75)',
                  backdropFilter: 'blur(2px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '6px'
                }}>
                  <select
                    id={`select-top-four-${index}`}
                    style={{ width: '100%', fontSize: '9px', background: '#12141a', color: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: 0, padding: '2px' }}
                    value={album?.id || ''}
                    onChange={(e) => handleSelectAlbumForSlot(index, e.target.value)}
                  >
                    <option value="">Choose...</option>
                    {allAlbums.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
