import React, { useState, useMemo } from 'react';
import { X, Search, Disc3, Star, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Album, CommunityPost } from '../../types/music';
import { storageService } from '../../services/storageService';

interface CreateThreadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: CommunityPost) => void;
}

const QUICK_HASHTAGS = [
  'HotTake',
  'SkenaLokal',
  'NowPlaying',
  'ReviewJujur',
  'VinylClub',
  'GalauBrutal'
];

export const CreateThreadModal: React.FC<CreateThreadModalProps> = ({
  isOpen,
  onClose,
  onPostCreated
}) => {
  const { currentUser } = useAuth();
  const [content, setContent] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [albumRating, setAlbumRating] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchingMusic, setIsSearchingMusic] = useState(false);

  // Catalog albums for tagging
  const catalogAlbums = useMemo(() => storageService.getAlbums(), []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return catalogAlbums.filter(
      (a) => a.title.toLowerCase().includes(q) || a.artist.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [catalogAlbums, searchQuery]);

  if (!isOpen) return null;

  const MAX_CHARS = 280;
  const charsLeft = MAX_CHARS - content.length;

  const handleAddHashtag = (tag: string) => {
    const formatted = `#${tag}`;
    if (!content.includes(formatted)) {
      setContent((prev) => (prev ? `${prev} ${formatted}` : formatted));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || content.length > MAX_CHARS) return;

    // Extract hashtags
    const matchedTags = content.match(/#[a-zA-Z0-9_]+/g) || [];
    const cleanTags = matchedTags.map((t) => t.slice(1));

    const newPost: CommunityPost = {
      id: 'post-' + Date.now(),
      userId: currentUser?.id || 'user-me',
      userName: currentUser?.displayName || 'Dhea Rizky',
      userHandle: currentUser?.username || 'dhea',
      userAvatar: currentUser?.avatarUrl || '/default-avatar.svg',
      content: content.trim(),
      createdAt: 'Baru saja',
      timestamp: Date.now(),
      likes: 0,
      likedByMe: false,
      reposts: 0,
      repostedByMe: false,
      replyCount: 0,
      replies: [],
      tags: cleanTags,
      musicTag: selectedAlbum
        ? {
            id: selectedAlbum.id,
            title: selectedAlbum.title,
            artist: selectedAlbum.artist,
            coverUrl: selectedAlbum.coverUrl,
            rating: albumRating > 0 ? albumRating : undefined,
            type: 'album'
          }
        : undefined
    };

    storageService.saveCommunityPost(newPost);
    onPostCreated(newPost);

    // Reset state & close
    setContent('');
    setSelectedAlbum(null);
    setAlbumRating(0);
    setSearchQuery('');
    setIsSearchingMusic(false);
    onClose();
  };

  return (
    <div className="create-thread-overlay" onClick={onClose}>
      <div className="create-thread-card" onClick={(e) => e.stopPropagation()}>
        {/* Mobile Sheet Handle */}
        <div className="modal-sheet-handle" />

        {/* Header */}
        <div className="create-thread-header">
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--gds-accent-citron)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '3px' }}>
              KOMUNITAS SKENA
            </div>
            <div className="create-thread-title">Tulis Thread Baru</div>
          </div>
          <button
            type="button"
            className="create-thread-close-btn"
            onClick={onClose}
            aria-label="Tutup modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* User Identity */}
        <div className="create-thread-user">
          <img
            src={currentUser?.avatarUrl || '/default-avatar.svg'}
            alt={currentUser?.displayName || 'You'}
            className="composer-user-avatar"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `data:image/svg+xml,${encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"><rect width="36" height="36" rx="18" fill="#242a3a"/><text x="18" y="22" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#fff">${(currentUser?.displayName || 'D')[0]}</text></svg>`
              )}`;
            }}
          />
          <div>
            <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#ffffff' }}>
              {currentUser?.displayName || 'Dhea Rizky'}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--gds-text-muted)' }}>
              @{currentUser?.username || 'dhea'} • Membagikan ke Komunitas
            </div>
          </div>
        </div>

        {/* Text Area */}
        <textarea
          className="create-thread-textarea"
          placeholder="Ada opini musik apa hari ini? Tulis thread atau hot take..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          autoFocus
          rows={4}
        />

        {/* Tagged Music Preview or Music Selector */}
        <div className="music-tag-section">
          {selectedAlbum ? (
            <div className="music-tag-selected-badge">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <img
                  src={selectedAlbum.coverUrl}
                  alt={selectedAlbum.title}
                  style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover' }}
                />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {selectedAlbum.title}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--gds-text-secondary)' }}>
                    {selectedAlbum.artist}
                  </div>
                </div>
              </div>

              {/* Optional Rating Stars inside tag */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      style={{ cursor: 'pointer' }}
                      fill={star <= albumRating ? 'var(--gds-accent-citron)' : 'none'}
                      color={star <= albumRating ? 'var(--gds-accent-citron)' : 'var(--gds-text-muted)'}
                      onClick={() => setAlbumRating(star === albumRating ? 0 : star)}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAlbum(null);
                    setAlbumRating(0);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--gds-text-muted)',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                  title="Hapus album yang di-tag"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ) : isSearchingMusic ? (
            <div>
              <div className="music-tag-search-box">
                <Search size={14} color="var(--gds-text-muted)" />
                <input
                  type="text"
                  className="music-tag-input"
                  placeholder="Ketik judul album atau artis..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchingMusic(false);
                    setSearchQuery('');
                  }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--gds-text-muted)', cursor: 'pointer' }}
                >
                  <X size={14} />
                </button>
              </div>

              {searchResults.length > 0 && (
                <div className="music-tag-dropdown">
                  {searchResults.map((album) => (
                    <div
                      key={album.id}
                      className="music-tag-item"
                      onClick={() => {
                        setSelectedAlbum(album);
                        setIsSearchingMusic(false);
                        setSearchQuery('');
                      }}
                    >
                      <img
                        src={album.coverUrl}
                        alt={album.title}
                        style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff' }}>
                          {album.title}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--gds-text-secondary)' }}>
                          {album.artist}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              className="community-filter-pill"
              onClick={() => setIsSearchingMusic(true)}
              style={{ alignSelf: 'flex-start' }}
            >
              <Disc3 size={13} color="var(--gds-accent-citron)" />
              + Tag Album / Musik
            </button>
          )}
        </div>

        {/* Quick Hashtags */}
        <div style={{ marginTop: '6px' }}>
          <div style={{ fontSize: '11px', color: 'var(--gds-text-muted)', marginBottom: '4px' }}>
            Saran Hashtag:
          </div>
          <div className="hashtag-chips-row">
            {QUICK_HASHTAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                className="hashtag-chip"
                onClick={() => handleAddHashtag(tag)}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="create-thread-footer">
          <span
            className={`char-counter ${
              charsLeft < 20 ? (charsLeft < 0 ? 'danger' : 'warning') : ''
            }`}
          >
            {charsLeft} karakter tersisa
          </span>

          <button
            type="button"
            className="publish-thread-btn"
            disabled={!content.trim() || charsLeft < 0}
            onClick={handleSubmit}
          >
            <Send size={13} />
            Posting Thread
          </button>
        </div>
      </div>
    </div>
  );
};
