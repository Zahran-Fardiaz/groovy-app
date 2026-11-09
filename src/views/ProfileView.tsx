import React, { useState, useMemo } from 'react';
import {
  Settings,
  Edit3,
  Check,
  X,
  Disc3,
  Share2,
  Radio,
  Plus,
  Trash2,
  ListMusic,
  Heart,
  Disc,
  ChevronDown,
  MoreHorizontal
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { TopFourShowcase } from '../components/profile/TopFourShowcase';
import { RatingHistogram } from '../components/review/RatingHistogram';
import { StarRating } from '../components/common/StarRating';
import { PlaylistDetailModal } from '../components/playlist/PlaylistDetailModal';
import { Playlist, Album } from '../types/music';
import './ProfileView.css';

interface ProfileViewProps {
  onOpenAlbum: (albumId: string) => void;
  onOpenScrobbleModal: () => void;
}

type TabType = 'reviews' | 'playlists' | 'taste' | 'scrobbles';

export const ProfileView: React.FC<ProfileViewProps> = ({
  onOpenAlbum,
  onOpenScrobbleModal
}) => {
  const {
    currentUser,
    updateBio,
    playlists,
    createPlaylist,
    favoriteAlbumIds
  } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>('reviews');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(currentUser.bio || '');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Playlists interactive state
  const [selectedPlaylistForModal, setSelectedPlaylistForModal] = useState<Playlist | null>(null);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');

  // Local reviews version trigger
  const [reviewsVersion, setReviewsVersion] = useState(0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  };

  // User reviews & scrobbles
  const myReviews = useMemo(
    () => storageService.getReviews().filter(r => r.userId === currentUser.id),
    [currentUser.id, reviewsVersion]
  );
  const scrobbles = useMemo(() => storageService.getScrobbles(), []);

  // Top 4 count
  const topFourCount = useMemo(
    () => (currentUser.topFourAlbumIds || []).filter(Boolean).length,
    [currentUser.topFourAlbumIds]
  );

  // Favorite Albums objects
  const favoriteAlbums = useMemo(() => {
    return favoriteAlbumIds
      .map(id => storageService.getAlbumById(id))
      .filter((a): a is Album => Boolean(a));
  }, [favoriteAlbumIds]);

  // Compute User Initials for Avatar Squircle
  const userInitials = useMemo(() => {
    const name = (currentUser.displayName || 'Dhea Rizky').trim();
    const parts = name.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }, [currentUser.displayName]);

  const handleShareProfile = () => {
    if (navigator.share) {
      navigator.share({
        title: `${currentUser.displayName} on Groovy`,
        text: `Check out ${currentUser.displayName}'s music profile on Groovy.`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Profile link copied');
    }
  };

  const handleSaveBio = (e: React.FormEvent) => {
    e.preventDefault();
    updateBio(bioInput);
    setIsEditingBio(false);
    showToast('Bio updated');
  };

  const handleDeleteReview = (reviewId: string) => {
    storageService.deleteReview(reviewId);
    setReviewsVersion(v => v + 1);
    showToast('Review dihapus');
  };

  const handleCreatePlaylistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistTitle.trim()) return;
    const pl = createPlaylist(newPlaylistTitle.trim());
    setNewPlaylistTitle('');
    setIsCreatingPlaylist(false);
    showToast(`Playlist "${pl.title}" berhasil dibuat`);
  };

  const tabsList: { id: TabType; label: string; count?: number }[] = [
    { id: 'reviews', label: 'Reviews', count: myReviews.length },
    { id: 'playlists', label: 'Lists', count: playlists.length },
    { id: 'taste', label: 'Liked', count: favoriteAlbums.length + topFourCount },
    { id: 'scrobbles', label: 'Scrobbles', count: scrobbles.length }
  ];

  return (
    <div className="profile-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="profile-toast" role="status" aria-live="polite">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── 1. User Identity Section (Inspiration Layout) ── */}
      <section className="profile-inspo-identity-section" aria-label="Curator Identity">
        <div className="profile-inspo-row">
          {/* Squircle Avatar with Warm Ember Initials & Green Status Dot */}
          <div className="profile-squircle-avatar-wrap">
            <div className="profile-squircle-avatar">
              {currentUser.avatarUrl && !currentUser.avatarUrl.includes('data:image/svg') ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.displayName}
                  className="profile-squircle-img"
                />
              ) : (
                <span className="profile-initials-text">{userInitials}</span>
              )}
            </div>
            <span className="profile-status-dot" title="Active listening" />
          </div>

          {/* User Details Block */}
          <div className="profile-inspo-meta">
            <span className="profile-inspo-handle">@{currentUser.username}</span>
            <h1 className="profile-inspo-name">{currentUser.displayName}</h1>
            <p className="profile-inspo-bio">
              {currentUser.bio || 'Chasing perfect bridges and basslines.'}
            </p>
            <span className="profile-inspo-subtitle">
              Jakarta · listening since 2024
            </span>
          </div>
        </div>

        {/* Inline Bio Editor */}
        {isEditingBio ? (
          <form className="profile-bio-editor" onSubmit={handleSaveBio}>
            <textarea
              id="profile-bio-textarea"
              className="profile-bio-input"
              value={bioInput}
              onChange={e => setBioInput(e.target.value)}
              rows={3}
              placeholder="Tell other listeners about your taste in music..."
              autoFocus
            />
            <div className="profile-bio-btn-row">
              <button
                type="button"
                className="profile-bio-cancel-btn"
                onClick={() => {
                  setBioInput(currentUser.bio || '');
                  setIsEditingBio(false);
                }}
              >
                <X size={14} /> Batal
              </button>
              <button type="submit" className="profile-bio-save-btn">
                <Check size={14} /> Simpan
              </button>
            </div>
          </form>
        ) : (
          /* Full-width "Edit profile" Button */
          <div className="profile-inspo-btn-row">
            <button
              id="btn-profile-edit"
              type="button"
              className="profile-inspo-edit-btn"
              onClick={() => {
                setBioInput(currentUser.bio || '');
                setIsEditingBio(true);
              }}
            >
              <Edit3 size={16} /> Edit profile
            </button>
            <button
              type="button"
              className="profile-inspo-icon-btn"
              onClick={handleShareProfile}
              aria-label="Share profile"
              title="Share profile"
            >
              <Share2 size={16} />
            </button>
            <button
              type="button"
              className="profile-inspo-icon-btn"
              onClick={onOpenScrobbleModal}
              aria-label="Settings"
              title="Settings"
            >
              <Settings size={16} />
            </button>
          </div>
        )}
      </section>

      {/* ── 2. Stats Dashboard Card ── */}
      <div className="profile-inspo-stats-card" role="navigation" aria-label="Curator statistics">
        <button
          type="button"
          className="profile-inspo-stat-col"
          onClick={() => setActiveTab('reviews')}
        >
          <strong className="profile-inspo-stat-val">{myReviews.length}</strong>
          <span className="profile-inspo-stat-lbl">REVIEWS</span>
        </button>
        <div className="profile-inspo-stat-divider" />
        <div className="profile-inspo-stat-col">
          <strong className="profile-inspo-stat-val">
            {currentUser.followersCount ? `${(currentUser.followersCount / 1000).toFixed(1)}k` : '2.4k'}
          </strong>
          <span className="profile-inspo-stat-lbl">FOLLOWERS</span>
        </div>
        <div className="profile-inspo-stat-divider" />
        <div className="profile-inspo-stat-col">
          <strong className="profile-inspo-stat-val">{currentUser.followingCount || '384'}</strong>
          <span className="profile-inspo-stat-lbl">FOLLOWING</span>
        </div>
      </div>

      {/* ── 4. Underline Segmented Tabs (Ember Accent) ── */}
      <div className="profile-inspo-tabs-track" role="tablist" aria-label="Profile tabs">
        {tabsList.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`profile-inspo-tab-btn ${isActive ? 'is-active' : ''}`}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className="profile-inspo-tab-count">{tab.count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── 5. Tab Content Stages ── */}

      {/* Tab 1: Reviews (Activity Feed Style) */}
      {activeTab === 'reviews' && (
        <section className="profile-tab-content" aria-label="Recent activity and reviews">
          <div className="profile-activity-header">
            <h3 className="profile-activity-title">Recent activity</h3>
            <div className="profile-activity-filter">
              <span>Latest</span>
              <ChevronDown size={16} />
            </div>
          </div>

          {myReviews.length > 0 ? (
            <div className="profile-activity-stack">
              {myReviews.map(review => (
                <article key={review.id} className="profile-activity-card">
                  {/* Card Header: User avatar, action, menu */}
                  <div className="activity-card-user-row">
                    <div className="activity-user-avatar">
                      {userInitials}
                    </div>
                    <div className="activity-user-info">
                      <span className="activity-user-name">You</span>
                      <span className="activity-user-action">
                        reviewed an album · {review.dateListened || 'recent'}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="activity-menu-btn"
                      onClick={() => handleDeleteReview(review.id)}
                      title="Delete review"
                      aria-label="Delete review"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </div>

                  {/* Embedded Album Card */}
                  <div
                    className="activity-album-embed"
                    onClick={() => onOpenAlbum(review.albumId)}
                    role="button"
                    tabIndex={0}
                  >
                    <img
                      src={review.albumCover}
                      alt={review.albumTitle}
                      className="activity-album-art"
                      loading="lazy"
                      onError={e => {
                        const alb = storageService.getAlbumById(review.albumId);
                        if (alb && alb.coverUrl && e.currentTarget.src !== alb.coverUrl) {
                          e.currentTarget.src = alb.coverUrl;
                        } else {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';
                        }
                      }}
                    />
                    <div className="activity-album-meta">
                      <span className="activity-artist-name">{review.artist}</span>
                      <h4 className="activity-album-title">{review.albumTitle}</h4>

                      <div className="activity-rating-row">
                        <StarRating rating={review.rating} size={12} showScore={false} />
                        <span className="activity-rating-score">
                          {(review.rating <= 5 ? review.rating * 2 : review.rating).toFixed(1)} / 10
                        </span>
                      </div>

                      {review.reviewText && (
                        <p className="activity-review-quote">"{review.reviewText}"</p>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="profile-empty-canvas">
              <Disc3 size={32} className="empty-disc-icon" />
              <h3>Belum ada review</h3>
              <p>Akun barumu belum memiliki catatan review. Dengarkan album dan bagikan penilaianmu untuk mulai mengisi aktivitas musik ini.</p>
            </div>
          )}
        </section>
      )}

      {/* Tab 2: Lists / Playlists */}
      {activeTab === 'playlists' && (
        <section className="profile-tab-content playlists-tab-stage" aria-label="Curator playlists">
          <div className="section-header-row">
            <div>
              <h2 className="profile-section-title">Playlist Kamu</h2>
              <span className="profile-section-subtitle">{playlists.length} koleksi</span>
            </div>
            <button
              className="profile-curator-action-btn"
              onClick={() => setIsCreatingPlaylist(!isCreatingPlaylist)}
            >
              <Plus size={16} /> Buat Playlist
            </button>
          </div>

          {/* Inline Playlist Creation */}
          {isCreatingPlaylist && (
            <form onSubmit={handleCreatePlaylistSubmit} className="profile-new-playlist-form">
              <input
                type="text"
                className="profile-new-playlist-input"
                placeholder="Nama playlist baru..."
                value={newPlaylistTitle}
                onChange={e => setNewPlaylistTitle(e.target.value)}
                autoFocus
                maxLength={40}
              />
              <div className="profile-new-playlist-actions">
                <button
                  type="button"
                  className="profile-new-playlist-cancel"
                  onClick={() => {
                    setIsCreatingPlaylist(false);
                    setNewPlaylistTitle('');
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="profile-new-playlist-submit"
                  disabled={!newPlaylistTitle.trim()}
                >
                  Simpan
                </button>
              </div>
            </form>
          )}

          {playlists.length > 0 ? (
            <div className="playlists-grid">
              {playlists.map(pl => (
                <button
                  key={pl.id}
                  type="button"
                  className="playlist-card"
                  onClick={() => setSelectedPlaylistForModal(pl)}
                >
                  <div className="playlist-card-art">
                    {pl.coverUrl ? (
                      <img src={pl.coverUrl} alt={pl.title} loading="lazy" />
                    ) : (
                      <div className="playlist-card-art-fallback">
                        <Disc size={32} />
                      </div>
                    )}
                  </div>
                  <div className="playlist-card-info">
                    <span className="playlist-card-title">{pl.title}</span>
                    <span className="playlist-card-tracks">{pl.tracks.length} trek</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="profile-empty-canvas">
              <ListMusic size={32} className="empty-disc-icon" />
              <h3>Belum ada playlist</h3>
              <p>Buat playlist pertamamu dan kumpulkan lagu favorit dari berbagai rilisan indie dan internasional.</p>
              <button
                type="button"
                className="album-detail-primary"
                onClick={() => setIsCreatingPlaylist(true)}
                style={{ marginTop: '16px' }}
              >
                <Plus size={16} /> Buat Playlist Sekarang
              </button>
            </div>
          )}
        </section>
      )}

      {/* Tab 3: Liked (Top 4 & Favorite Albums & DNA Equalizer) */}
      {activeTab === 'taste' && (
        <section className="profile-tab-content taste-tab-stage" aria-label="Curator taste and top favorites">
          {/* Top 4 Vinyl Showcase */}
          <TopFourShowcase
            topAlbumIds={currentUser.topFourAlbumIds}
            isOwner
            onOpenAlbum={onOpenAlbum}
          />

          {/* Favorite Albums Shelf */}
          <section className="favorite-albums-section" aria-labelledby="fav-albums-heading">
            <div className="section-header-row">
              <div>
                <h2 id="fav-albums-heading" className="profile-section-title">
                  Album Favorit
                </h2>
                <span className="profile-section-subtitle">
                  {favoriteAlbums.length} album disukai
                </span>
              </div>
            </div>

            {favoriteAlbums.length > 0 ? (
              <div className="favorite-albums-grid">
                {favoriteAlbums.map(album => (
                  <button
                    key={album.id}
                    type="button"
                    className="favorite-album-card"
                    onClick={() => onOpenAlbum(album.id)}
                  >
                    <img src={album.coverUrl} alt={album.title} loading="lazy" />
                    <span className="favorite-album-name">{album.title}</span>
                    <span className="favorite-album-artist">{album.artist}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="profile-empty-card-mini">
                <Heart size={24} className="empty-mini-icon" />
                <p>Belum ada album favorit.</p>
                <small>Ketuk ikon ❤️ pada halaman album untuk menyematkannya di sini.</small>
              </div>
            )}
          </section>

          {/* Equalizer Rating Spectrum */}
          <RatingHistogram reviews={myReviews} />
        </section>
      )}

      {/* Tab 4: Live Scrobbles */}
      {activeTab === 'scrobbles' && (
        <section className="profile-tab-content scrobbles-tab-stage" aria-label="Recent listening history">
          <div className="section-header-row">
            <div>
              <h2 className="profile-section-title">Recent Scrobbles</h2>
              <span className="profile-section-subtitle">{scrobbles.length} plays recorded</span>
            </div>
            <button
              className="profile-curator-action-btn"
              onClick={onOpenScrobbleModal}
            >
              Sync Service
            </button>
          </div>

          <div className="scrobbles-stream-card">
            {scrobbles.length > 0 ? (
              <div className="scrobbles-list">
                {scrobbles.map(item => (
                  <div key={item.id} className="scrobble-row">
                    <img
                      src={item.albumCover}
                      alt={item.albumTitle}
                      className="scrobble-art"
                      loading="lazy"
                      onError={e => {
                        const alb = storageService.getAlbums().find(
                          a => a.title.toLowerCase() === item.albumTitle.toLowerCase()
                        );
                        if (alb && alb.coverUrl && e.currentTarget.src !== alb.coverUrl) {
                          e.currentTarget.src = alb.coverUrl;
                        } else {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';
                        }
                      }}
                    />
                    <div className="scrobble-copy">
                      <h4 className="scrobble-title">{item.trackTitle}</h4>
                      <p className="scrobble-artist-album">
                        {item.artist} — {item.albumTitle}
                      </p>
                      <div className="scrobble-meta-row">
                        <span className={`scrobble-source-badge source-${item.source}`}>
                          {item.source === 'spotify' ? 'Spotify' : item.source === 'lastfm' ? 'Last.fm' : 'Groovy'}
                        </span>
                        <time className="scrobble-time">{item.timestamp}</time>
                      </div>
                    </div>

                    <div className="scrobble-row-actions">
                      {item.reviewed ? (
                        <span className="scrobble-reviewed-tag">Reviewed</span>
                      ) : (
                        <button
                          type="button"
                          className="scrobble-rate-btn"
                          onClick={() => {
                            const album = storageService.getAlbums().find(
                              a => a.title.toLowerCase() === item.albumTitle.toLowerCase()
                            );
                            if (album) onOpenAlbum(album.id);
                          }}
                        >
                          + Review
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="profile-empty-canvas">
                <Radio size={32} className="empty-disc-icon" />
                <h3>No scrobbles recorded</h3>
                <p>Putar lagu di Groovy atau hubungkan akun Spotify untuk mulai mencatat riwayat dengar.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Playlist Detail Modal */}
      <PlaylistDetailModal
        playlist={selectedPlaylistForModal}
        isOpen={Boolean(selectedPlaylistForModal)}
        onClose={() => setSelectedPlaylistForModal(null)}
        onOpenAlbum={onOpenAlbum}
        onToast={msg => showToast(msg)}
      />
    </div>
  );
};

export default ProfileView;

