import { Album, Track } from '../types/music';
import { storageService } from './storageService';
import { matchIndonesianArtist, getIndonesianArtistByAppleId, INDONESIAN_ARTISTS_DATABASE } from './indonesianArtists';

// Minimum release year cutoff for "Rilisan Terbaru"
const RECENT_YEAR_CUTOFF = 2023;

export const musicApi = {
  // Automated classifier: uses verified Indonesian artists database + store metadata
  detectIsIndonesian(item: any): { isIndonesian: boolean; city?: string; genre?: string } {
    // 1. PRIMARY CHECK: Apple Music Artist ID (O(1) robust integer lookup)
    if (item.artistId) {
      const idMatch = getIndonesianArtistByAppleId(Number(item.artistId));
      if (idMatch) {
        return {
          isIndonesian: true,
          city: idMatch.city,
          genre: idMatch.genre
        };
      }
    }

    // 2. SECONDARY CHECK: Normalized name matching (fallback)
    const artistName = item.artistName || '';
    const match = matchIndonesianArtist(artistName);

    if (match.isIndonesian && match.matchedArtist) {
      return {
        isIndonesian: true,
        city: match.matchedArtist.city,
        genre: match.matchedArtist.genre
      };
    }

    // Secondary checks: iTunes Store region & local genre tags
    if (item.country === 'IDN' || item.currency === 'IDR') {
      return { isIndonesian: true };
    }

    const genre = (item.primaryGenreName || '').toLowerCase();
    if (genre.includes('indo') || genre.includes('dangdut') || genre.includes('koplo')) {
      return { isIndonesian: true };
    }

    const copyright = (item.copyright || '').toLowerCase();
    if (copyright.includes('indonesia') || copyright.includes('musica') || copyright.includes('sun eater') || copyright.includes('juni records')) {
      return { isIndonesian: true };
    }

    return { isIndonesian: false };
  },

  // Transform raw iTunes item into standardized Groovy Album
  mapItunesAlbum(item: any): Album {
    const detection = this.detectIsIndonesian(item);
    const isIndonesian = detection.isIndonesian;

    const highResCover = item.artworkUrl100
      ? item.artworkUrl100.replace('100x100bb.jpg', '600x600bb.jpg')
      : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';

    const rawDate = item.releaseDate || '2024-01-01T00:00:00Z';
    const releaseYear = new Date(rawDate).getFullYear();
    const trackCount = item.trackCount || 1;
    const titleLower = (item.collectionName || '').toLowerCase();
    const isSingle = titleLower.includes(' - single') || titleLower.endsWith('- single') || trackCount <= 3;
    const isEp = titleLower.includes(' - ep') || (trackCount >= 4 && trackCount <= 5);
    const albumType: 'album' | 'ep' | 'single' = isSingle ? 'single' : (isEp ? 'ep' : 'album');

    return {
      id: `itunes-${item.collectionId}`,
      title: item.collectionName || 'Unknown Album',
      artist: item.artistName || 'Unknown Artist',
      coverUrl: highResCover,
      releaseYear: isNaN(releaseYear) ? 2024 : releaseYear,
      releaseDate: rawDate,
      isIndonesian,
      origin: isIndonesian ? 'Indonesia' : 'International',
      trackCount,
      albumType,
      genres: [detection.genre || item.primaryGenreName || (isIndonesian ? 'Indo Pop' : 'Music')],
      averageRating: Number((4.1 + Math.random() * 0.8).toFixed(1)),
      totalRatings: Math.floor(trackCount * 80 + Math.random() * 800) + 40,
      totalReviews: Math.floor(Math.random() * 40) + 8,
      label: item.copyright,
      tracklist: []
    };
  },

  // Pull ALL NEWEST FULL ALBUMS automatically (strictly full album releases, no singles/remixes)
  async fetchRecentReleases(countryCode: string = 'ID'): Promise<Album[]> {
    try {
      const albumMap = new Map<string, Album>();

      // 1. Fetch catalog using batch Apple Music Artist IDs (High Performance & Resilient)
      const registeredIds = INDONESIAN_ARTISTS_DATABASE
        .map((a) => a.appleMusicId)
        .filter((id): id is number => typeof id === 'number');

      const idChunks: number[][] = [];
      for (let i = 0; i < registeredIds.length; i += 12) {
        idChunks.push(registeredIds.slice(i, i + 12));
      }

      const batchLookupPromises = idChunks.map(async (chunk) => {
        try {
          const res = await fetch(
            `https://itunes.apple.com/lookup?id=${chunk.join(',')}&entity=album&country=ID&limit=25`,
            { signal: AbortSignal.timeout(7000) }
          );
          if (res.ok) {
            const data = await res.json();
            return (data.results || [])
              .filter((item: any) => item.wrapperType === 'collection')
              .map((item: any) => this.mapItunesAlbum(item));
          }
        } catch {
          return [];
        }
        return [];
      });

      // 2. Also fetch broader discovery terms for Indonesian indie & rock
      const discoveryQueries = ['indie indonesia', 'rock indonesia'];
      const fetchDiscoveryPromises = discoveryQueries.map(async (term) => {
        try {
          const res = await fetch(
            `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=album&country=ID&limit=8`,
            { signal: AbortSignal.timeout(6000) }
          );
          if (res.ok) {
            const data = await res.json();
            return (data.results || []).map((item: any) => this.mapItunesAlbum(item));
          }
        } catch {
          return [];
        }
        return [];
      });

      // 3. Global new albums for global tab
      const globalPromise = (async () => {
        const globalTerms = [
          'tyler the creator chromakopia',
          'sabrina carpenter short n sweet',
          'billie eilish hit me hard and soft',
          'charli xcx brat',
          'chappell roan midwest princess'
        ];
        try {
          const promises = globalTerms.map(async (t) => {
            try {
              const res = await fetch(
                `https://itunes.apple.com/search?term=${encodeURIComponent(t)}&entity=album&limit=1`,
                { signal: AbortSignal.timeout(5000) }
              );
              if (res.ok) {
                const data = await res.json();
                return (data.results || []).map((item: any) => this.mapItunesAlbum(item));
              }
            } catch {
              return [];
            }
            return [];
          });
          const results = await Promise.all(promises);
          return results.flat();
        } catch {
          return [];
        }
      })();

      const [artistResultsArrays, discoveryArrays, globalResults] = await Promise.all([
        Promise.all(batchLookupPromises),
        Promise.all(fetchDiscoveryPromises),
        globalPromise
      ]);

      const allFetched = [...artistResultsArrays.flat(), ...discoveryArrays.flat(), ...globalResults];

      // 3. STRICT FULL ALBUM FILTER:
      // Must have >= 6 tracks, must not be a single/remix, and must be recent (2022-2026)
      for (const album of allFetched) {
        const titleLower = album.title.toLowerCase();
        const hasEnoughTracks = (album.trackCount || 0) >= 6;
        const isSingleOrRemix = titleLower.includes(' - single') ||
                               titleLower.includes('- single') ||
                               titleLower.includes('(remix)') ||
                               titleLower.includes('[remix]');

        const isFullAlbum = hasEnoughTracks && !isSingleOrRemix;

        if (isFullAlbum && album.releaseYear >= 2022) {
          albumMap.set(album.id, album);
        }
      }

      const cleanRecentAlbums = Array.from(albumMap.values());

      // 4. Sort strictly descending by exact releaseDate (newest first)
      cleanRecentAlbums.sort((a, b) => {
        const timeA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
        const timeB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
        return timeB - timeA;
      });

      // Save to local cache
      storageService.saveLiveAlbums(cleanRecentAlbums);
      return cleanRecentAlbums;
    } catch (e) {
      console.warn('Failed to fetch newest full albums, using cached', e);
    }

    // Fallback to cached albums filtered by year
    const cached = storageService.getAlbums().filter(a => a.releaseYear >= RECENT_YEAR_CUTOFF);
    cached.sort((a, b) => {
      const timeA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
      const timeB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
      return timeB - timeA;
    });
    return cached;
  },

  // Live search across iTunes
  async searchAlbums(query: string, countryCode: string = 'ID'): Promise<Album[]> {
    const trimmed = query.trim();
    if (!trimmed) {
      return this.fetchRecentReleases(countryCode);
    }

    try {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(trimmed)}&entity=album&country=${countryCode}&limit=25`,
        { signal: AbortSignal.timeout(6000) }
      );

      if (response.ok) {
        const data = await response.json();
        const results: Album[] = (data.results || []).map((item: any) => this.mapItunesAlbum(item));
        results.forEach(album => storageService.saveAlbum(album));
        return results;
      }
    } catch (e) {
      console.warn('Live search network error, querying cached database', e);
    }

    return storageService.getAlbums().filter(album =>
      album.title.toLowerCase().includes(trimmed.toLowerCase()) ||
      album.artist.toLowerCase().includes(trimmed.toLowerCase())
    );
  },

  // Fetch full tracklist with 30s audio previews
  async getAlbumDetails(albumId: string): Promise<Album | undefined> {
    let album = storageService.getAlbumById(albumId);

    if (album && album.tracklist && album.tracklist.length > 0) {
      return album;
    }

    if (albumId.startsWith('itunes-')) {
      const collectionId = albumId.replace('itunes-', '');
      try {
        const response = await fetch(
          `https://itunes.apple.com/lookup?id=${collectionId}&entity=song`,
          { signal: AbortSignal.timeout(6000) }
        );

        if (response.ok) {
          const data = await response.json();
          const items = data.results || [];
          const albumMeta = items.find((i: any) => i.wrapperType === 'collection');
          const songItems = items.filter((i: any) => i.wrapperType === 'track');

          const tracklist: Track[] = songItems.map((song: any, idx: number) => ({
            id: `track-${song.trackId || idx}`,
            title: song.trackName,
            artist: song.artistName,
            albumTitle: song.collectionName || album?.title || '',
            albumId,
            durationMs: song.trackTimeMillis || 210000,
            trackNumber: song.trackNumber || idx + 1,
            previewUrl: song.previewUrl,
            isIndonesian: album?.isIndonesian ?? true
          }));

          if (!album && albumMeta) {
            album = this.mapItunesAlbum(albumMeta);
          }

          if (album) {
            album.tracklist = tracklist;
            storageService.saveAlbum(album);
            return album;
          }
        }
      } catch (e) {
        console.warn('Error fetching tracklist from iTunes lookup:', e);
      }
    }

    return album;
  }
};
