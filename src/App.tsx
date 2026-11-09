import React, { useState, useEffect, useRef, useCallback } from 'react';
import { App as CapApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Radio } from 'lucide-react';
import { TabType, Album, Review } from './types/music';
import { storageService } from './services/storageService';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MusicPlayerProvider } from './context/MusicPlayerContext';
import { ScrobbleProvider, useScrobble } from './context/ScrobbleContext';

// Components
import { MobileFrame } from './components/common/MobileFrame';
import { BottomNav } from './components/common/BottomNav';
import { AutoLogBanner } from './components/scrobble/AutoLogBanner';
import { ScrobbleSimulatorModal } from './components/scrobble/ScrobbleSimulatorModal';
import { ReviewModal } from './components/review/ReviewModal';

// Views
import { FeedView } from './views/FeedView';
import { CommunityView } from './views/CommunityView';
import { SearchView } from './views/SearchView';
import { AlbumDetailView } from './views/AlbumDetailView';
import { ArtistDetailView } from './views/ArtistDetailView';
import { ProfileView } from './views/ProfileView';

const MainAppContent: React.FC = () => {
  const { currentUser } = useAuth();
  const [currentTab, setCurrentTab] = useState<TabType>('feed');
  const [activeAlbumId, setActiveAlbumId] = useState<string | null>(null);
  const [activeArtistName, setActiveArtistName] = useState<string | null>(null);

  // Modals state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedAlbumForReview, setSelectedAlbumForReview] = useState<Album | null>(null);
  const [isScrobbleModalOpen, setIsScrobbleModalOpen] = useState(false);

  const { isSimulating } = useScrobble();
  const [isScrolled, setIsScrolled] = useState(false);

  // Keep latest state in refs for back button listeners
  const currentTabRef = useRef(currentTab);
  const activeAlbumIdRef = useRef(activeAlbumId);
  const activeArtistNameRef = useRef(activeArtistName);
  const isReviewModalOpenRef = useRef(isReviewModalOpen);
  const isScrobbleModalOpenRef = useRef(isScrobbleModalOpen);

  useEffect(() => {
    currentTabRef.current = currentTab;
    activeAlbumIdRef.current = activeAlbumId;
    activeArtistNameRef.current = activeArtistName;
    isReviewModalOpenRef.current = isReviewModalOpen;
    isScrobbleModalOpenRef.current = isScrobbleModalOpen;
  }, [currentTab, activeAlbumId, activeArtistName, isReviewModalOpen, isScrobbleModalOpen]);

  // Universal In-App Back Navigation Handler
  // Returns true if an in-app layer was popped, false if already at root
  const handleInAppBack = useCallback((): boolean => {
    if (isReviewModalOpenRef.current) {
      setIsReviewModalOpen(false);
      return true;
    }
    if (isScrobbleModalOpenRef.current) {
      setIsScrobbleModalOpen(false);
      return true;
    }
    if (activeArtistNameRef.current) {
      setActiveArtistName(null);
      return true;
    }
    if (activeAlbumIdRef.current) {
      setActiveAlbumId(null);
      return true;
    }
    if (currentTabRef.current !== 'feed') {
      setCurrentTab('feed');
      return true;
    }
    return false;
  }, []);

  // 1. Native Mobile Back Button Support (Android Hardware & Gesture Back via Capacitor)
  useEffect(() => {
    let lastBackPressTime = 0;
    let removeListener: (() => void) | null = null;

    if (Capacitor.isNativePlatform()) {
      CapApp.addListener('backButton', () => {
        const handled = handleInAppBack();
        if (!handled) {
          // Already at root (feed tab with no modals or subviews open)
          const now = Date.now();
          if (now - lastBackPressTime < 2000) {
            CapApp.exitApp();
          } else {
            lastBackPressTime = now;
            // Native Android double-back to exit feedback toast
            const existingToast = document.querySelector('.groovy-back-exit-toast');
            if (!existingToast) {
              const toastEl = document.createElement('div');
              toastEl.className = 'groovy-back-exit-toast';
              toastEl.innerText = 'Tekan sekali lagi untuk keluar';
              document.body.appendChild(toastEl);
              setTimeout(() => toastEl.remove(), 2000);
            }
          }
        }
      }).then(handle => {
        removeListener = () => handle.remove();
      });
    }

    return () => {
      removeListener?.();
    };
  }, [handleInAppBack]);

  // 2. Mobile Browser & PWA Back Button Support via popstate
  useEffect(() => {
    const onPopState = () => {
      handleInAppBack();
    };

    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, [handleInAppBack]);

  const pushNavHistory = () => {
    try {
      window.history.pushState({ inAppBack: true, timestamp: Date.now() }, '');
    } catch {}
  };

  const handleOpenAlbum = (albumId: string) => {
    pushNavHistory();
    setActiveAlbumId(albumId);
  };

  const handleOpenArtist = (artistName: string) => {
    pushNavHistory();
    setActiveArtistName(artistName);
  };

  const handleBackToTab = () => {
    if (window.history.state?.inAppBack) {
      window.history.back();
    } else {
      setActiveAlbumId(null);
    }
  };

  const handleBackFromArtist = () => {
    if (window.history.state?.inAppBack) {
      window.history.back();
    } else {
      setActiveArtistName(null);
    }
  };

  const handleQuickLog = (album?: Album) => {
    const target = album || storageService.getAlbums()[0];
    setSelectedAlbumForReview(target);
    pushNavHistory();
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
        className={`app-screen-content ${currentTab === 'profile' ? 'profile-active' : ''}`}
        onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 4)}
      >
        {/* Top Header with dynamic scroll blur - sticky inside scroll container */}
        {!activeAlbumId && !activeArtistName && (
          <header className={`app-top-header sonic-header ${isScrolled ? 'scrolled-blur' : ''} ${currentTab === 'profile' ? 'profile-header' : ''}`}>
            <div
              className="brand-logo-wrap"
              onClick={() => { setActiveAlbumId(null); setActiveArtistName(null); setCurrentTab('feed'); }}
              style={{ cursor: 'pointer' }}
            >
              <div className="sonic-greeting" style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                <img
                  src="/brand/groovy-brandmark.png"
                  alt="Groovy"
                  style={{ width: '24px', height: '24px', objectFit: 'contain', flexShrink: 0 }}
                />
                <span className="profile-page-nav-title" style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.025em' }}>
                  Groovy
                </span>
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

        {activeArtistName ? (
          <ArtistDetailView
            artistName={activeArtistName}
            onBack={handleBackFromArtist}
            onOpenAlbum={handleOpenAlbum}
          />
        ) : activeAlbumId ? (
          <AlbumDetailView
            albumId={activeAlbumId}
            onBack={handleBackToTab}
            onOpenReviewModal={(album) => handleQuickLog(album)}
            onOpenArtist={handleOpenArtist}
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
            {currentTab === 'community' && (
              <CommunityView onOpenAlbum={handleOpenAlbum} />
            )}
            {currentTab === 'search' && (
              <SearchView onOpenAlbum={handleOpenAlbum} onOpenArtist={handleOpenArtist} />
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

      
      {/* Bottom Navigation with Liquid Notch */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={(tab) => {
          setActiveAlbumId(null);
          setActiveArtistName(null);
          setCurrentTab(tab);
        }}
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
