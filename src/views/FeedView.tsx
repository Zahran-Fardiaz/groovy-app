import React, { useState, useEffect, useMemo } from 'react';
import { musicApi } from '../services/musicApi';
import { storageService } from '../services/storageService';
import { Album } from '../types/music';

// Feed Subcomponents
import { CategoryCapsuleBar } from '../components/feed/CategoryCapsuleBar';
import { RecentAlbumsShelf } from '../components/feed/RecentAlbumsShelf';
import { NewCollectionBanner } from '../components/feed/NewCollectionBanner';
import { PlaylistShelf } from '../components/feed/PlaylistShelf';
import { GroovyOfTheYearBanner } from '../components/feed/GroovyOfTheYearBanner';

interface FeedViewProps {
  onOpenAlbum: (albumId: string) => void;
  onOpenQuickLog: (album?: Album) => void;
  onOpenScrobbleModal?: () => void;
}

// Peeling Tangerine – Welcome Home EP (hardcoded, Apple Music ID 6786807440)
const PEELING_TANGERINE_EP: Album = {
  id: 'peeling-tangerine-welcome-home-ep',
  title: 'Welcome Home - EP',
  artist: 'Peeling Tangerine',
  coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b5/ed/de/b5edde3b-9511-fa05-6410-ed97a180ee84/5064010768980_cover.jpg/600x600bb.jpg',
  releaseYear: 2026,
  releaseDate: '2026-05-16T07:00:00Z',
  albumType: 'ep',
  isIndonesian: true,
  origin: 'Indonesia',
  trackCount: 5,
  genres: ['Alternative', 'Rock', 'Pop'],
  averageRating: 5,
  totalRatings: 100000,
  totalReviews: 100000,
  tracklist: [
    {
      id: 'pt-tr-1',
      title: 'Now You\'re Alright',
      artist: 'Peeling Tangerine',
      albumTitle: 'Welcome Home - EP',
      albumId: 'peeling-tangerine-welcome-home-ep',
      durationMs: 140251,
      trackNumber: 1,
      previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/6a/73/79/6a7379ba-506c-24df-0461-118a99c73fe5/mzaf_6478667350279855629.plus.aac.p.m4a',
      isIndonesian: true
    },
    {
      id: 'pt-tr-2',
      title: 'Welcome Home',
      artist: 'Peeling Tangerine',
      albumTitle: 'Welcome Home - EP',
      albumId: 'peeling-tangerine-welcome-home-ep',
      durationMs: 292500,
      trackNumber: 2,
      previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/9e/9d/43/9e9d4361-6bf8-ebd7-d813-03b60b047fdb/mzaf_10399222544289710533.plus.aac.p.m4a',
      isIndonesian: true
    },
    {
      id: 'pt-tr-3',
      title: 'All-Nighter',
      artist: 'Peeling Tangerine',
      albumTitle: 'Welcome Home - EP',
      albumId: 'peeling-tangerine-welcome-home-ep',
      durationMs: 255656,
      trackNumber: 3,
      previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/b9/e6/44/b9e64467-d2d7-582d-43fb-412982190710/mzaf_10459915893269685902.plus.aac.p.m4a',
      isIndonesian: true
    },
    {
      id: 'pt-tr-4',
      title: "Goodman's Ballad",
      artist: 'Peeling Tangerine',
      albumTitle: 'Welcome Home - EP',
      albumId: 'peeling-tangerine-welcome-home-ep',
      durationMs: 214968,
      trackNumber: 4,
      previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/31/4c/8e/314c8e03-8270-3d75-d216-6cf078429d77/mzaf_1307077043893761622.plus.aac.p.m4a',
      isIndonesian: true
    },
    {
      id: 'pt-tr-5',
      title: 'Hey, Child',
      artist: 'Peeling Tangerine',
      albumTitle: 'Welcome Home - EP',
      albumId: 'peeling-tangerine-welcome-home-ep',
      durationMs: 231000,
      trackNumber: 5,
      previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/00/b2/87/00b28717-611d-f5eb-facc-289d6ccd2ef2/mzaf_4915679810718352102.plus.aac.p.m4a',
      isIndonesian: true
    }
  ]
};

// Guaranteed fallback spotlight album
const FALLBACK_SPOTLIGHT: Album = {
  id: 'bernadya-sialnya',
  title: 'Sialnya, Hidup Harus Tetap Berjalan',
  artist: 'Bernadya',
  coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/05/9a/59/059a5971-da5f-5182-e565-d41c9bfae348/cover.jpg/600x600bb.jpg',
  releaseYear: 2024,
  releaseDate: '2024-06-23T00:00:00Z',
  isIndonesian: true,
  origin: 'Indonesia',
  trackCount: 8,
  genres: ['Indo Pop', 'Indie Pop'],
  averageRating: 4.9,
  totalRatings: 340,
  totalReviews: 64,
  tracklist: [
    {
      id: 'bernadya-tr-1',
      title: 'Untungnya, Hidup Harus Tetap Berjalan',
      artist: 'Bernadya',
      albumTitle: 'Sialnya, Hidup Harus Tetap Berjalan',
      albumId: 'bernadya-sialnya',
      durationMs: 30000,
      trackNumber: 1,
      previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/c3/0d/18/c30d18cb-09a8-e1fa-b7cb-00e9ecbe8f0e/mzaf_13508197175402633010.plus.aac.p.m4a',
      isIndonesian: true
    }
  ]
};

export const FeedView: React.FC<FeedViewProps> = ({
  onOpenAlbum,
  onOpenQuickLog
}) => {
  const [recentReleases, setRecentReleases] = useState<Album[]>([]);
  const [_isLoadingReleases, setIsLoadingReleases] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Load albums from live iTunes API and local cache
  useEffect(() => {
    let isMounted = true;
    const loadLiveReleases = async () => {
      setIsLoadingReleases(true);
      try {
        const liveAlbums = await musicApi.fetchRecentReleases('ID');
        if (isMounted && liveAlbums.length > 0) {
          setRecentReleases(liveAlbums);
        } else if (isMounted) {
          const cached = storageService.getAlbums();
          setRecentReleases(cached.length > 0 ? cached : [FALLBACK_SPOTLIGHT]);
        }
      } catch (err) {
        console.error('Failed to load releases', err);
        if (isMounted) {
          const cached = storageService.getAlbums();
          setRecentReleases(cached.length > 0 ? cached : [FALLBACK_SPOTLIGHT]);
        }
      } finally {
        if (isMounted) setIsLoadingReleases(false);
      }
    };

    loadLiveReleases();
    return () => { isMounted = false; };
  }, []);

  // Spotlight album
  const spotlightAlbum = useMemo<Album>(() => {
    if (recentReleases.length === 0) return FALLBACK_SPOTLIGHT;
    const topIndo = recentReleases.find(a => a.isIndonesian && a.averageRating >= 4.5);
    return topIndo || recentReleases[0] || FALLBACK_SPOTLIGHT;
  }, [recentReleases]);

  // Strictly chronologically sorted recent releases (most recent release date at index 0, on the left)
  // Peeling Tangerine EP is always pinned first regardless of fetch results
  const recentAlbums = useMemo<Album[]>(() => {
    // Deduplicate: remove any fetched version that matches our hardcoded EP id
    const fetched = recentReleases.filter(a => a.id !== PEELING_TANGERINE_EP.id);
    let list = [PEELING_TANGERINE_EP, ...fetched];

    // Filter by category while preserving recency
    if (selectedCategory === 'indonesian' || selectedCategory === 'nusantara') {
      const indo = list.filter(a => a.isIndonesian || a.origin === 'Indonesia');
      if (indo.length > 0) list = indo;
    } else if (selectedCategory === 'global') {
      const globalList = list.filter(a => !a.isIndonesian || a.origin === 'International');
      if (globalList.length > 0) list = globalList;
    } else if (selectedCategory === 'party') {
      const partyKeywords = ['rock', 'dance', 'electronic', 'disco', 'funk', 'surf', 'punk', 'electropop'];
      const matched = list.filter(a =>
        a.genres?.some(g => partyKeywords.some(kw => g.toLowerCase().includes(kw)))
      );
      if (matched.length > 0) list = matched;
    } else if (selectedCategory === 'blues') {
      const bluesKeywords = ['blues', 'jazz', 'soul', 'r&b', 'bossa'];
      const matched = list.filter(a =>
        a.genres?.some(g => bluesKeywords.some(kw => g.toLowerCase().includes(kw)))
      );
      if (matched.length > 0) list = matched;
    } else if (selectedCategory === 'sad') {
      const sadKeywords = ['pop', 'folk', 'indie pop', 'ballad', 'acoustic', 'melancholy', 'sad', 'galau'];
      const matched = list.filter(a =>
        a.genres?.some(g => sadKeywords.some(kw => g.toLowerCase().includes(kw)))
      );
      if (matched.length > 0) list = matched;
    } else if (selectedCategory === 'hiphop') {
      const hiphopKeywords = ['hip hop', 'hip-hop', 'rap', 'r&b', 'trap'];
      const matched = list.filter(a =>
        a.genres?.some(g => hiphopKeywords.some(kw => g.toLowerCase().includes(kw)))
      );
      if (matched.length > 0) list = matched;
    } else if (selectedCategory === 'indie') {
      const indieKeywords = ['indie', 'alternative', 'folk', 'rock'];
      const matched = list.filter(a =>
        a.genres?.some(g => indieKeywords.some(kw => g.toLowerCase().includes(kw)))
      );
      if (matched.length > 0) list = matched;
    } else if (selectedCategory === 'vinyl') {
      const classic = list.filter(a => a.releaseYear <= 2024 || a.genres?.some(g => g.toLowerCase().includes('rock') || g.toLowerCase().includes('pop')));
      if (classic.length > 0) list = classic;
    }

    // Sort everything EXCEPT the pinned EP chronologically, then re-pin it first.
    // This guarantees PEELING_TANGERINE_EP is always position 0 regardless of
    // how recent other fetched albums are.
    const pinned = list.filter(a => a.id === PEELING_TANGERINE_EP.id);
    const rest = list
      .filter(a => a.id !== PEELING_TANGERINE_EP.id)
      .sort((a, b) => {
        const timeA = a.releaseDate ? new Date(a.releaseDate).getTime() : (a.releaseYear ? new Date(`${a.releaseYear}-01-01T00:00:00Z`).getTime() : 0);
        const timeB = b.releaseDate ? new Date(b.releaseDate).getTime() : (b.releaseYear ? new Date(`${b.releaseYear}-01-01T00:00:00Z`).getTime() : 0);
        return timeB - timeA;
      });
    return [...pinned, ...rest];
  }, [recentReleases, selectedCategory]);

  return (
    <div style={{ paddingBottom: '32px' }}>
      {/* 1. Select Categories Capsule Bar */}
      <CategoryCapsuleBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* 2. Groovy of the Year Banner */}
      <GroovyOfTheYearBanner
        album={PEELING_TANGERINE_EP}
        onOpenAlbum={onOpenAlbum}
      />

      {/* 3. Recent Albums (Chronologically sorted: leftmost is truly the most recent release) */}
      <RecentAlbumsShelf
        albums={recentAlbums}
        onOpenAlbum={onOpenAlbum}
        onOpenQuickLog={onOpenQuickLog}
      />

      {/* 3. New Collection Curator Showcase Canvas */}
      <NewCollectionBanner
        spotlightAlbum={spotlightAlbum}
        onOpenAlbum={onOpenAlbum}
      />

      {/* 4. Playlists Shelf - Page ends here */}
      <PlaylistShelf
        albums={recentReleases}
        onOpenAlbum={onOpenAlbum}
      />
    </div>
  );
};
export default FeedView;
