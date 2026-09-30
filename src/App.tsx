import React, { useState } from 'react';
import { Radio } from 'lucide-react';
import { TabType, Album, Review } from './types/music';
import { storageService } from './services/storageService';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MusicPlayerProvider } from './context/MusicPlayerContext';
import { ScrobbleProvider, useScrobble } from './context/ScrobbleContext';

// Components
import { MobileFrame } from './components/common/MobileFrame';
import { MiniPlayer } from './components/common/MiniPlayer';
import { BottomNav } from './components/common/BottomNav';
import { AutoLogBanner } from './components/scrobble/AutoLogBanner';
import { ScrobbleSimulatorModal } from './components/scrobble/ScrobbleSimulatorModal';
import { ReviewModal } from './components/review/ReviewModal';

// Views
import { FeedView } from './views/FeedView';
import { SearchView } from './views/SearchView';
import { AlbumDetailView } from './views/AlbumDetailView';
import { RecommendationsView } from './views/RecommendationsView';
import { ProfileView } from './views/ProfileView';

const MainAppContent: React.FC = () => {
  const { currentUser } = useAuth();
  const [currentTab, setCurrentTab] = useState<TabType>('feed');
  const [activeAlbumId, setActiveAlbumId] = useState<string | null>(null);

  // Modals state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedAlbumForReview, setSelectedAlbumForReview] = useState<Album | null>(null);
  const [isScrobbleModalOpen, setIsScrobbleModalOpen] = useState(false);

  const { isSimulating } = useScrobble();
  const [isScrolled, setIsScrolled] = useState(false);

  const handleOpenAlbum = (albumId: string) => {
    setActiveAlbumId(albumId);
  };

  const handleBackToTab = () => {
    setActiveAlbumId(null);
  };

  const handleQuickLog = (album?: Album) => {
    const target = album || storageService.getAlbums()[0];
    setSelectedAlbumForReview(target);
    setIsReviewModalOpen(true);
  };

  const handleQuickReviewFromScrobble = (albumTitle: string, artist: string, cover: string) => {
    let album = storageService.getAlbums().find(a => a.title.toLowerCase() === albumTitle.toLowerCase());
    if (!album) {
      album = {
        id: 'scrob-album-' + Date.now(),
        title: albumTitle,
        artist: artist,
        coverUrl: cover,
        releaseYear: 2024,
        genres: ['Alternative'],
        averageRating: 4.5,
        totalRatings: 1,
        totalReviews: 1,
        tracklist: []
      };
      storageService.saveAlbum(album);
    }
    setSelectedAlbumForReview(album);
    setIsReviewModalOpen(true);
  };

  const handleReviewCreated = (newReview: Review) => {
    // Refresh or stay on current tab
    if (activeAlbumId) {
      // Re-trigger view update
      setActiveAlbumId(newReview.albumId);
    }
  };

  return (
    <>
      {/* Screen Content with Scroll Listener for Header Blur */}
      <main
        className="app-screen-content"
        onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 4)}
      >
        {/* Top Header with dynamic scroll blur - sticky inside scroll container */}
        {!activeAlbumId && (
          <header className={`app-top-header sonic-header ${isScrolled ? 'scrolled-blur' : ''}`}>
            <div
              className="brand-logo-wrap"
              onClick={() => { setActiveAlbumId(null); setCurrentTab('feed'); }}
              style={{ cursor: 'pointer' }}
            >
              <div className="sonic-greeting">
                <span>Hello,&nbsp;</span><span className="sonic-user-name">{currentUser?.displayName || 'Dhea Rizky'}</span>
              </div>
            </div>

            {/* Circular Scrobble Action Button */}
            <button
              id="header-btn-scrobbler"
              className={`sonic-circle-btn ${isSimulating ? 'active-green' : ''}`}
              onClick={() => setIsScrobbleModalOpen(true)}
              title="Auto-Logging & Scrobble Daemon"
              aria-label="Scrobble Daemon"
            >
              <Radio size={16} />
              {isSimulating && <span className="live-indicator-dot" />}
            </button>
          </header>
        )}

        {/* Real-time Auto-Log Banner */}
        <AutoLogBanner onQuickReview={handleQuickReviewFromScrobble} />

        {activeAlbumId ? (
          <AlbumDetailView
            albumId={activeAlbumId}
            onBack={handleBackToTab}
            onOpenReviewModal={(album) => handleQuickLog(album)}
          />
        ) : (
          <>
            {currentTab === 'feed' && (
              <FeedView
                onOpenAlbum={handleOpenAlbum}
                onOpenQuickLog={(album) => handleQuickLog(album)}
                onOpenScrobbleModal={() => setIsScrobbleModalOpen(true)}
              />
            )}
            {currentTab === 'search' && (
              <SearchView onOpenAlbum={handleOpenAlbum} />
            )}
            {currentTab === 'recommendations' && (
              <RecommendationsView onOpenAlbum={handleOpenAlbum} />
            )}
            {currentTab === 'profile' && (
              <ProfileView
                onOpenAlbum={handleOpenAlbum}
                onOpenScrobbleModal={() => setIsScrobbleModalOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Floating Mini Player */}
      <MiniPlayer onOpenAlbum={handleOpenAlbum} />

      {/* Bottom Navigation with Liquid Notch */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onQuickLogClick={() => handleQuickLog()}
      />
      <ReviewModal
        isOpen={isReviewModalOpen}
        album={selectedAlbumForReview}
        onClose={() => setIsReviewModalOpen(false)}
        onReviewCreated={handleReviewCreated}
      />

      {/* Scrobble Simulator / Last.fm Sync Modal */}
      <ScrobbleSimulatorModal
        isOpen={isScrobbleModalOpen}
        onClose={() => setIsScrobbleModalOpen(false)}
      />
    </>
  );
};

export function App() {
  return (
    <AuthProvider>
      <ScrobbleProvider>
        <MusicPlayerProviderWrapper>
          <MobileFrame>
            <MainAppContent />
          </MobileFrame>
        </MusicPlayerProviderWrapper>
      </ScrobbleProvider>
    </AuthProvider>
  );
}

// Wrapper to wire music player scrobbles directly into ScrobbleProvider
const MusicPlayerProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { recordTrackPlay } = useScrobble();
  return (
    <MusicPlayerProvider onScrobbleTrack={recordTrackPlay}>
      {children}
    </MusicPlayerProvider>
  );
};

export default App;
