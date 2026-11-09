import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft,
  MoreHorizontal,
  Check,
  Share2,
  Heart,
  ExternalLink,
  Disc3
} from 'lucide-react';
import { ArtistDetails, Album, Track } from '../types/music';
import { musicApi } from '../services/musicApi';
import { storageService } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import './ArtistDetailView.css';

interface ArtistDetailViewProps {
  artistName: string;
  onBack: () => void;
  onOpenAlbum: (albumId: string) => void;
}

// Concentric target / vinyl record icon next to scores (exact match from Album Details)
const VinylScoreIcon: React.FC<{ size?: number }> = ({ size = 15 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    className="vinyl-score-icon"
    aria-hidden="true"
  >
    <circle cx="8" cy="8" r="7" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1.2" />
    <circle cx="8" cy="8" r="4.2" stroke="rgba(255, 255, 255, 0.55)" strokeWidth="1" />
    <circle cx="8" cy="8" r="1.8" fill="var(--gds-accent-citron, #d4ff32)" />
  </svg>
);

const formatNumber = (num: number): string => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'k';
  }
  return num.toLocaleString();
};

export const ArtistDetailView: React.FC<ArtistDetailViewProps> = ({
  artistName,
  onBack,
  onOpenAlbum
}) => {
  const { isFavoriteTrack, toggleFavoriteTrack } = useAuth();

  const [artist, setArtist] = useState<ArtistDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showAllSongs, setShowAllSongs] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [heroImgSrc, setHeroImgSrc] = useState<string>('');

  const DEFAULT_CONCERT_HERO = 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1280&auto=format&fit=crop&q=80';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    musicApi.getArtistDetails(artistName)
      .then(data => {
        if (isMounted) {
          // If artist is Nova Saint, provide rich mockup-matching catalog
          if (artistName.toLowerCase().includes('nova saint')) {
            const novaAlbums: Album[] = [
              {
                id: 'nova-after-hours',
                title: 'After Hours',
                artist: 'Nova Saint',
                coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&auto=format&fit=crop&q=80',
                releaseYear: 2025,
                genres: ['Alt-Pop', 'Electronic', 'Night Drive'],
                averageRating: 4.7,
                totalRatings: 1284,
                totalReviews: 64,
                tracklist: []
              },
              {
                id: 'nova-silver-lining',
                title: 'Silver Lining',
                artist: 'Nova Saint',
                coverUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=80',
                releaseYear: 2023,
                genres: ['Indie', 'Synth-Pop'],
                averageRating: 4.4,
                totalRatings: 840,
                totalReviews: 42,
                tracklist: []
              },
              {
                id: 'nova-static-bloom',
                title: 'Static Bloom',
                artist: 'Nova Saint',
                coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
                releaseYear: 2021,
                genres: ['Electronic', 'Ambient Pop'],
                averageRating: 4.45,
                totalRatings: 610,
                totalReviews: 29,
                tracklist: []
              }
            ];

            const novaTopTracks: Track[] = [
              {
                id: 'nova-tr-1',
                title: 'Glasshouse',
                artist: 'Nova Saint',
                albumTitle: 'After Hours',
                albumId: 'nova-after-hours',
                durationMs: 248000,
                trackNumber: 1,
                coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&auto=format&fit=crop&q=80',
                averageRating: 4.9
              },
              {
                id: 'nova-tr-2',
                title: 'Porcelain Sky',
                artist: 'Nova Saint',
                albumTitle: 'Silver Lining',
                albumId: 'nova-silver-lining',
                durationMs: 215000,
                trackNumber: 2,
                coverUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&auto=format&fit=crop&q=80',
                averageRating: 4.75
              },
              {
                id: 'nova-tr-3',
                title: 'Neon Weather',
                artist: 'Nova Saint',
                albumTitle: 'After Hours',
                albumId: 'nova-after-hours',
                durationMs: 222000,
                trackNumber: 3,
                coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&auto=format&fit=crop&q=80',
                averageRating: 4.55
              },
              {
                id: 'nova-tr-4',
                title: 'Mercury',
                artist: 'Nova Saint',
                albumTitle: 'Static Bloom',
                albumId: 'nova-static-bloom',
                durationMs: 198000,
                trackNumber: 4,
                coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80',
                averageRating: 4.45
              }
            ];

            setArtist({
              ...data,
              name: 'Nova Saint',
              heroPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&auto=format&fit=crop&q=80',
              monthlyListeners: 2800000,
              followersCount: 18400,
              bio: 'Nova Saint turns restless nights into kinetic alt-pop—layering widescreen synths, intimate vocals, and basslines built for motion.',
              city: 'Tokyo',
              genres: ['Alt-Pop', 'Electronic', 'Tokyo'],
              albums: novaAlbums,
              singlesAndEps: [],
              topTracks: novaTopTracks
            });
          } else {
            setArtist(data);
          }
          const initialHero = (artistName.toLowerCase().includes('nova saint'))
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&auto=format&fit=crop&q=80'
            : (data.heroPhotoUrl || data.avatarUrl || DEFAULT_CONCERT_HERO);
          setHeroImgSrc(initialHero);
          setIsFollowing(storageService.isFollowingArtist(data.name));
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.error('Failed to load artist details', err);
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, [artistName]);

  const handleToggleFollow = () => {
    if (!artist) return;
    const nextState = storageService.toggleFollowArtist(artist.name);
    setIsFollowing(nextState);
    showToast(nextState ? `Following ${artist.name}` : `Unfollowed ${artist.name}`);
    setIsMoreOpen(false);
  };

  const handleShare = async () => {
    if (!artist) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: artist.name,
          text: `Check out ${artist.name} on Groovy`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Artist link copied to clipboard!');
      }
    } catch {
      // User cancelled share
    }
    setIsMoreOpen(false);
  };

  // Discography list
  const allAlbums = useMemo<Album[]>(() => {
    if (!artist) return [];
    const list = [...artist.albums, ...artist.singlesAndEps];
    return list.length > 0 ? list : [
      {
        id: 'sample-disc-1',
        title: 'After Hours',
        artist: artist.name,
        coverUrl: artist.avatarUrl,
        releaseYear: 2025,
        genres: ['Alt-Pop'],
        averageRating: 4.7,
        totalRatings: 1284,
        totalReviews: 24,
        tracklist: []
      }
    ];
  }, [artist]);

  // Overall Score (Normalized 10-point scale)
  const overallScore = useMemo(() => {
    if (!artist) return '9.1';
    if (artist.name.toLowerCase().includes('nova saint')) return '9.1';
    if (artist.name.toLowerCase().includes('peeling tangerine')) return '9.4';
    if (allAlbums.length > 0 && allAlbums[0].averageRating) {
      const r = allAlbums[0].averageRating;
      return (r <= 5 ? r * 2 : r).toFixed(1);
    }
    return '9.1';
  }, [artist, allAlbums]);

  const ratingsCount = useMemo(() => {
    if (!artist) return '18.4k';
    if (artist.followersCount > 0) {
      return formatNumber(artist.followersCount);
    }
    return '18.4k';
  }, [artist]);

  const criticsQuote = useMemo(() => {
    if (!artist) return 'A restless architect of the modern night.';
    if (artist.name.toLowerCase().includes('nova saint')) {
      return 'A restless architect of the modern night.';
    }
    if (artist.name.toLowerCase().includes('peeling tangerine')) {
      return 'A raw, shimmering indie breakthrough that refuses to sit still.';
    }
    if (artist.bio && artist.bio.length > 15) {
      return artist.bio.slice(0, 72) + '…';
    }
    return 'A captivating sonic architect redefining contemporary sound.';
  }, [artist]);

  const aboutHeadline = useMemo(() => {
    if (!artist) return 'Sound after sundown.';
    if (artist.name.toLowerCase().includes('nova saint')) return 'Sound after sundown.';
    if (artist.name.toLowerCase().includes('peeling tangerine')) return 'Raw textures & bedroom tape hiss.';
    return 'The Sound & Vision.';
  }, [artist]);

  const aboutBio = useMemo(() => {
    if (!artist) return '';
    return (
      artist.bio ||
      `${artist.name} crafts vivid atmospheric soundscapes, blending dynamic rhythms, intimate melodies, and textures built for movement.`
    );
  }, [artist]);

  const aboutTags = useMemo(() => {
    if (!artist) return ['Alt-Pop', 'Electronic', 'Night Drive'];
    const tags: string[] = [];
    if (artist.genres && artist.genres.length > 0) {
      tags.push(...artist.genres.slice(0, 3));
    } else if (artist.genre) {
      tags.push(artist.genre);
    }
    if (artist.city && !tags.includes(artist.city)) {
      tags.push(artist.city);
    } else if (artist.country && !tags.includes(artist.country)) {
      tags.push(artist.country);
    }
    return tags.length > 0 ? tags : ['Alt-Pop', 'Electronic', 'Tokyo'];
  }, [artist]);

  if (isLoading) {
    return (
      <div className="artist-view-state" role="status">
        <div className="sonic-spinner" />
        <p>Loading artist profile…</p>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="artist-view-state">
        <p>Artist profile not found.</p>
        <button className="artist-back-btn" onClick={onBack}>
          <ChevronLeft size={16} /> Back
        </button>
      </div>
    );
  }

  const displayedSongs = showAllSongs ? artist.topTracks : artist.topTracks.slice(0, 4);

  return (
    <article className="artist-detail-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="artist-toast" role="status" aria-live="polite">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── 1. Immersive Hero Section with Floating Top Nav ── */}
      <section className="artist-hero-section">
        <img
          src={heroImgSrc || artist.heroPhotoUrl || artist.avatarUrl || DEFAULT_CONCERT_HERO}
          alt={`${artist.name} portrait`}
          className="artist-hero-bg-img"
          onError={() => setHeroImgSrc(DEFAULT_CONCERT_HERO)}
        />

        {/* Cinematic Scrim & Fade to Black at Bottom */}
        <div className="artist-hero-scrim" />

        {/* Floating Top Navigation Bar */}
        <nav className="artist-floating-nav-bar" aria-label="Artist navigation">
          <button
            type="button"
            className="artist-circle-nav-btn"
            onClick={onBack}
            aria-label="Back"
          >
            <ChevronLeft size={22} />
          </button>

          <div className="artist-more-wrap">
            <button
              type="button"
              className="artist-circle-nav-btn"
              onClick={() => setIsMoreOpen(prev => !prev)}
              aria-label="More options"
            >
              <MoreHorizontal size={20} />
            </button>

            {isMoreOpen && (
              <div className="artist-more-dropdown">
                <button type="button" onClick={handleShare}>
                  <Share2 size={15} /> Share artist
                </button>
                <button type="button" onClick={handleToggleFollow}>
                  <Check size={15} /> {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Overlaid Title & Meta at Bottom Left of Artwork */}
        <div className="artist-hero-info-block">
          <div className="artist-verified-badge">
            <span className="artist-verified-check-circle">
              <Check size={11} strokeWidth={3.5} />
            </span>
            <span className="artist-verified-text">VERIFIED ARTIST</span>
          </div>

          <h1 className="artist-hero-name">{artist.name}</h1>
          <p className="artist-hero-listeners">
            {formatNumber(artist.monthlyListeners)} monthly listeners
          </p>
        </div>
      </section>

      {/* ── 2. Action Buttons Row (Follow & Share) ── */}
      <div className="artist-actions-row">
        <button
          type="button"
          className={`artist-follow-pill-btn ${isFollowing ? 'is-following' : ''}`}
          onClick={handleToggleFollow}
          aria-pressed={isFollowing}
        >
          {isFollowing ? 'FOLLOWING' : 'FOLLOW'}
        </button>

        <button
          type="button"
          className="artist-action-circle-btn"
          onClick={handleShare}
          title="Share artist"
          aria-label="Share artist"
        >
          <Share2 size={17} />
        </button>
      </div>

      {/* ── 3. Overall Rating & Critics' Pick Card (Split 2-Column) ── */}
      <section className="artist-critics-card" aria-label="Artist rating and critics pick">
        <div className="artist-critics-col col-left">
          <span className="critics-kicker">OVERALL RATING</span>
          <div className="critics-score-val">{overallScore}</div>
          <span className="critics-ratings-count">from {ratingsCount} ratings</span>
        </div>

        <div className="artist-critics-divider" />

        <div className="artist-critics-col col-right">
          <span className="critics-kicker">CRITICS' PICK</span>
          <blockquote className="critics-quote">
            "{criticsQuote}"
          </blockquote>
        </div>
      </section>

      {/* ── 4. Top Songs Section ── */}
      {artist.topTracks.length > 0 && (
        <section className="artist-top-songs-section" aria-label="Top songs">
          <div className="artist-section-header-row">
            <h2 className="artist-section-title">Top songs</h2>
            {artist.topTracks.length > 4 && (
              <button
                type="button"
                className="artist-see-all-btn"
                onClick={() => setShowAllSongs(prev => !prev)}
              >
                {showAllSongs ? 'Show less' : 'See all'}
              </button>
            )}
          </div>

          <div className="artist-songs-card">
            {displayedSongs.map((track, idx) => {
              const isTrackFav = isFavoriteTrack(track.id);
              const trackScore = (
                track.averageRating
                  ? (track.averageRating <= 5 ? track.averageRating * 2 : track.averageRating)
                  : (9.8 - idx * 0.3)
              ).toFixed(1);
              const cover = track.coverUrl || artist.albums[0]?.coverUrl || artist.avatarUrl;

              return (
                <div
                  key={track.id || idx}
                  className="artist-song-item-row"
                  onClick={() => track.albumId && onOpenAlbum(track.albumId)}
                  role="button"
                  tabIndex={0}
                >
                  {/* Left: Rank & Artwork */}
                  <div className="artist-song-left">
                    <span className="artist-song-rank-num">{idx + 1}</span>
                    <img
                      src={cover}
                      alt={track.title}
                      className="artist-song-thumb"
                      loading="lazy"
                    />
                  </div>

                  {/* Middle: Title & Album */}
                  <div className="artist-song-meta">
                    <span className="artist-song-title">{track.title}</span>
                    <span className="artist-song-album">{track.albumTitle || artist.name}</span>
                  </div>

                  {/* Right: Concentric vinyl score badge */}
                  <div className="artist-song-right">
                    <div className="artist-song-score-badge">
                      <VinylScoreIcon size={14} />
                      <span className="artist-song-score-num">{trackScore}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── 5. Discography Section ── */}
      {allAlbums.length > 0 && (
        <section className="artist-discography-section" aria-label="Discography">
          <div className="artist-section-header-row">
            <div>
              <span className="discography-kicker">{allAlbums.length} RELEASES</span>
              <h2 className="artist-section-title">Discography</h2>
            </div>
            <button
              type="button"
              className="artist-see-all-btn"
              onClick={() => {
                if (allAlbums.length > 0) onOpenAlbum(allAlbums[0].id);
              }}
            >
              View all
            </button>
          </div>

          <div className="artist-discography-scroll">
            {allAlbums.map((album, idx) => {
              const albumScore = album.averageRating
                ? (album.averageRating <= 5 ? album.averageRating * 2 : album.averageRating).toFixed(1)
                : (9.4 - idx * 0.6).toFixed(1);

              return (
                <button
                  key={album.id}
                  type="button"
                  className="artist-disc-card"
                  onClick={() => onOpenAlbum(album.id)}
                  aria-label={`Open ${album.title}`}
                >
                  <div className="artist-disc-art-wrap">
                    <img
                      src={album.coverUrl}
                      alt={album.title}
                      className="artist-disc-art"
                      loading="lazy"
                    />
                    <div className="artist-disc-score-badge">
                      {albumScore}
                    </div>
                  </div>

                  <div className="artist-disc-meta">
                    <span className="artist-disc-title">{album.title}</span>
                    <span className="artist-disc-subtitle">
                      {album.releaseYear} · {album.trackCount && album.trackCount <= 6 ? 'EP' : 'Album'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* ── 6. About Section ── */}
      <section className="artist-about-card" aria-label="About artist">
        <span className="about-kicker">ABOUT</span>
        <h3 className="about-headline">{aboutHeadline}</h3>
        <p className="about-paragraph">{aboutBio}</p>
        <div className="about-pills-row">
          {aboutTags.map(tag => (
            <span key={tag} className="about-tag-pill">
              {tag}
            </span>
          ))}
        </div>
      </section>
    </article>
  );
};

export default ArtistDetailView;
