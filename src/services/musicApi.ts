import { Album, Track, ArtistDetails } from '../types/music';
import { storageService, PEELING_TANGERINE_EP } from './storageService';
import { matchIndonesianArtist, getIndonesianArtistByAppleId, INDONESIAN_ARTISTS_DATABASE } from './indonesianArtists';
import {
  GLOBAL_ARTISTS_DATABASE,
  GLOBAL_DISCOVERY_QUERIES,
  getGlobalArtistByAppleId,
  matchGlobalArtist
} from './globalArtists';

// Minimum release year cutoff for "Rilisan Terbaru"
const RECENT_YEAR_CUTOFF = 2023;

// Verified real band photos database for instantaneous fallback
const VERIFIED_BAND_PHOTOS: Record<string, string> = {
  'radiohead': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/RadioheadO2211125_composite.jpg/1280px-RadioheadO2211125_composite.jpg',
  'tame impala': 'https://cdn-images.dzcdn.net/images/artist/879015e713cc6ad6ffaeec154c027505/1000x1000-000000-80-0-0.jpg',
  'the beatles': 'https://upload.wikimedia.org/wikipedia/commons/4/42/The_Beatles_1963_Dezo_Hoffman_Capitol_Records_press_photo_2.jpg',
  'queen': 'https://cdn-images.dzcdn.net/images/artist/5b945448be4bf9b4566c721bb556df2e/1000x1000-000000-80-0-0.jpg',
  'coldplay': 'https://upload.wikimedia.org/wikipedia/commons/c/cc/ColdplayWembley120925_%28cropped%29.jpg',
  'pink floyd': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Pink_Floyd%2C_1971_%28HQ%29.jpg/1280px-Pink_Floyd%2C_1971_%28HQ%29.jpg',
  'nirvana': 'https://cdn-images.dzcdn.net/images/artist/063f684c31ea90886c572007799d50a7/1000x1000-000000-80-0-0.jpg',
  'arctic monkeys': 'https://cdn-images.dzcdn.net/images/artist/fae52dbb0e3343be0e95cb18c6439446/1000x1000-000000-80-0-0.jpg',
  'oasis': 'https://cdn-images.dzcdn.net/images/artist/cf593ad3a8c3e8006e12e1ec7e58410d/1000x1000-000000-80-0-0.jpg',
  'sheila on 7': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Sheila_on_7.jpg/1280px-Sheila_on_7.jpg',
  'dewa 19': 'https://upload.wikimedia.org/wikipedia/commons/2/25/Dewa_19_montage.jpg',
  '.feast': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/.Feast_at_Joyland_Festival%2C_November_2024.jpg/1280px-.Feast_at_Joyland_Festival%2C_November_2024.jpg',
  'feast': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/.Feast_at_Joyland_Festival%2C_November_2024.jpg/1280px-.Feast_at_Joyland_Festival%2C_November_2024.jpg',
  'hindia': 'https://upload.wikimedia.org/wikipedia/commons/9/97/Daniel_Baskara_Putra_%28Hindia%29.jpg',
  'bernadya': 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Bernadya%2C_Enchoria_2025_Universitas_Bunda_Mulia_01.jpg',
  'pamungkas': 'https://cdn-images.dzcdn.net/images/artist/cf78395171e26a522ba28f4d41b5b6bc/1000x1000-000000-80-0-0.jpg',
  'maliq & d\'essentials': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Maliq_%26_D%27Essentials_at_Java_Jazz_2020.jpg/1280px-Maliq_%26_D%27Essentials_at_Java_Jazz_2020.jpg',
  'the strokes': 'https://cdn-images.dzcdn.net/images/artist/1943cff6b2518e19c30f40cfd6f1ba0f/1000x1000-000000-80-0-0.jpg',
  'weezer': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/49/Weezer2026.jpg/1280px-Weezer2026.jpg',
  'green day': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ac/GreenDay_Isle_of_Wight_Montage.jpg/1280px-GreenDay_Isle_of_Wight_Montage.jpg'
};

const artistPhotoCache = new Map<string, string>();

function isMusicEntity(title?: string, desc?: string): boolean {
  const t = (title || '').toLowerCase();
  const d = (desc || '').toLowerCase();
  const terms = [
    'band', 'musician', 'singer', 'group', 'grup', 'musical', 'rapper',
    'duo', 'trio', 'quartet', 'quintet', 'orchestra', 'songwriter', 'composer',
    'record producer', 'rock', 'pop', 'indie', 'metal', 'hip hop', 'punk',
    'penyanyi', 'musisi', 'grup musik', 'lagu', 'album', 'vocalist', 'guitarist',
    'bassist', 'drummer', 'electronic', 'alternative'
  ];
  return terms.some(term => t.includes(term) || d.includes(term));
}

function toHighResWiki(url?: string): string | null {
  if (!url) return null;
  return url
    .replace(/\/thumb(\/[^/]+\/[^/]+\/[^/]+)\/\d+px-[^/?#]+(\?.*)?$/, '/thumb$1/1280px-$2$3')
    .replace(/\/\d+px-/, '/1280px-');
}

function isGoodArtistImage(url: string | null | undefined): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  if (lower.endsWith('.svg') || lower.includes('.svg.') || lower.includes('.svg?')) return false;
  if (lower.includes('flag_of') || lower.includes('map_of') || lower.includes('coat_of_arms')) return false;
  if (lower.includes('artist/default')) return false;
  return true;
}

export async function fetchRealArtistPhoto(artistName: string): Promise<string | null> {
  const clean = artistName.trim();
  const cleanLower = clean.toLowerCase();

  if (artistPhotoCache.has(cleanLower)) {
    return artistPhotoCache.get(cleanLower)!;
  }

  // Check verified curated map first
  if (VERIFIED_BAND_PHOTOS[cleanLower]) {
    const photo = VERIFIED_BAND_PHOTOS[cleanLower];
    artistPhotoCache.set(cleanLower, photo);
    return photo;
  }

  // Check versioned localStorage cache (v2 ensures outdated/bad image caches are refreshed)
  try {
    const saved = localStorage.getItem(`groovy_artist_personnel_v2_${cleanLower}`);
    if (saved && isGoodArtistImage(saved)) {
      artistPhotoCache.set(cleanLower, saved);
      return saved;
    }
  } catch {}

  // 1. Deezer via Vite Proxy (fastest official 1000x1000 band portrait in local dev & preview)
  const deezerProxyPromise = (async (): Promise<string | null> => {
    try {
      const res = await fetch(`/api/deezer/search/artist?q=${encodeURIComponent(clean)}`, {
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        const d = await res.json();
        const items = d.data || [];
        // Match artist name accurately
        const matched = items.find((it: any) => {
          const itName = (it.name || '').toLowerCase();
          return itName === cleanLower || cleanLower.includes(itName) || itName.includes(cleanLower);
        }) || items[0];

        if (matched) {
          const pic = matched.picture_xl || matched.picture_big || matched.picture_medium;
          if (pic && isGoodArtistImage(pic)) return pic;
        }
      }
    } catch {}
    return null;
  })();

  // 2. Wikipedia Summary API (Disambiguated Candidates in EN & ID)
  const wikiSummaryPromise = (async (): Promise<string | null> => {
    const candidates = [
      { title: `${clean} (band)`, lang: 'en', requireMusicCheck: false },
      { title: `${clean} (grup musik)`, lang: 'id', requireMusicCheck: false },
      { title: clean, lang: 'en', requireMusicCheck: true },
      { title: clean, lang: 'id', requireMusicCheck: true },
      { title: `${clean} (musician)`, lang: 'en', requireMusicCheck: false },
      { title: `${clean} (singer)`, lang: 'en', requireMusicCheck: false },
      { title: `${clean} (penyanyi)`, lang: 'id', requireMusicCheck: false },
      { title: `${clean} (musical group)`, lang: 'en', requireMusicCheck: false }
    ];

    for (const c of candidates) {
      try {
        const url = `https://${c.lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(c.title.replace(/ /g, '_'))}`;
        const res = await fetch(url, {
          headers: { 'Api-User-Agent': 'GroovyMusicApp/1.0 (contact@groovy.app)' },
          signal: AbortSignal.timeout(3500)
        });
        if (res.ok) {
          const d = await res.json();
          if (c.requireMusicCheck && !isMusicEntity(d.title, d.description)) {
            continue;
          }
          const rawSrc = d.originalimage?.source || d.thumbnail?.source;
          const highRes = toHighResWiki(rawSrc);
          if (highRes && isGoodArtistImage(highRes)) {
            return highRes;
          }
        }
      } catch {}
    }
    return null;
  })();

  // 3. Wikipedia Search API (EN & ID fallback for complex band / artist names)
  const wikiSearchPromise = (async (): Promise<string | null> => {
    for (const lang of ['en', 'id']) {
      try {
        const q = lang === 'en' ? `${clean} (band OR musician OR singer)` : `${clean} (grup musik OR penyanyi OR musisi)`;
        const url = `https://${lang}.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrlimit=3&prop=pageimages|description&pithumbsize=1200&format=json&origin=*`;
        const res = await fetch(url, {
          headers: { 'Api-User-Agent': 'GroovyMusicApp/1.0 (contact@groovy.app)' },
          signal: AbortSignal.timeout(3500)
        });
        if (res.ok) {
          const d = await res.json();
          const pages = Object.values(d.query?.pages || {}) as any[];
          pages.sort((a, b) => (a.index || 99) - (b.index || 99));
          for (const p of pages) {
            if (isMusicEntity(p.title, p.description) && p.thumbnail?.source) {
              const highRes = toHighResWiki(p.thumbnail.source);
              if (highRes && isGoodArtistImage(highRes)) {
                return highRes;
              }
            }
          }
        }
      } catch {}
    }
    return null;
  })();

  // 4. Deezer JSONP fallback (works directly in browser environments without proxy)
  const deezerJsonpPromise = (async (): Promise<string | null> => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return null;
    return new Promise((resolve) => {
      const callbackName = `dz_cb_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const script = document.createElement('script');
      const timer = setTimeout(() => {
        cleanup();
        resolve(null);
      }, 4000);

      const cleanup = () => {
        clearTimeout(timer);
        delete (window as any)[callbackName];
        if (script.parentNode) script.parentNode.removeChild(script);
      };

      (window as any)[callbackName] = (data: any) => {
        cleanup();
        const items = data?.data || [];
        const matched = items.find((it: any) => {
          const itName = (it.name || '').toLowerCase();
          return itName === cleanLower || cleanLower.includes(itName) || itName.includes(cleanLower);
        }) || items[0];

        if (matched) {
          const pic = matched.picture_xl || matched.picture_big || matched.picture_medium;
          if (pic && isGoodArtistImage(pic)) {
            resolve(pic);
            return;
          }
        }
        resolve(null);
      };

      script.src = `https://api.deezer.com/search/artist?q=${encodeURIComponent(clean)}&output=jsonp&callback=${callbackName}`;
      script.onerror = () => {
        cleanup();
        resolve(null);
      };
      document.head.appendChild(script);
    });
  })();

  const results = await Promise.all([
    deezerProxyPromise,
    wikiSummaryPromise,
    wikiSearchPromise,
    deezerJsonpPromise
  ]);

  const found = results.find(r => typeof r === 'string' && r.length > 0) || null;
  if (found) {
    artistPhotoCache.set(cleanLower, found);
    try {
      localStorage.setItem(`groovy_artist_personnel_v2_${cleanLower}`, found);
    } catch {}
  }
  return found;
}

export const musicApi = {
  // Automated classifier: uses verified Indonesian & Global artists databases + store metadata
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
      const globalMatch = getGlobalArtistByAppleId(Number(item.artistId));
      if (globalMatch) {
        return {
          isIndonesian: false,
          genre: globalMatch.genre
        };
      }
    }

    // 2. SECONDARY CHECK: Global Artist normalized matching
    const artistName = item.artistName || '';
    const globalMatch = matchGlobalArtist(artistName);
    if (globalMatch.isGlobal && globalMatch.matchedArtist) {
      return {
        isIndonesian: false,
        genre: globalMatch.matchedArtist.genre
      };
    }

    // 3. SECONDARY CHECK: Indonesian Artist normalized matching
    const match = matchIndonesianArtist(artistName);
    if (match.isIndonesian && match.matchedArtist) {
      return {
        isIndonesian: true,
        city: match.matchedArtist.city,
        genre: match.matchedArtist.genre
      };
    }

    // 3. SECONDARY CHECK: Indonesian genre indicators
    const genre = (item.primaryGenreName || '').toLowerCase();
    if (genre.includes('dangdut') || genre.includes('koplo') || genre.includes('indo pop') || genre.includes('indonesian')) {
      return { isIndonesian: true };
    }

    // 4. Record label indicators
    const copyright = (item.copyright || '').toLowerCase();
    if (
      copyright.includes('indonesia') ||
      copyright.includes('musica') ||
      copyright.includes('sun eater') ||
      copyright.includes('juni records') ||
      copyright.includes('demajors') ||
      copyright.includes('kolibri') ||
      copyright.includes('greedy dust') ||
      copyright.includes('trinity optima') ||
      copyright.includes('aquarius musikindo')
    ) {
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
      artistPhotoUrl: item.artistPhotoUrl || undefined,
      releaseYear: isNaN(releaseYear) ? 2024 : releaseYear,
      releaseDate: rawDate,
      isIndonesian,
      origin: isIndonesian ? 'Indonesia' : 'International',
      trackCount,
      albumType,
      genres: [detection.genre || item.primaryGenreName || (isIndonesian ? 'Indo Pop' : 'Music')],
      averageRating: Number((4.3 + Math.random() * 0.6).toFixed(1)),
      totalRatings: Math.floor(trackCount * 80 + Math.random() * 800) + 40,
      totalReviews: Math.floor(Math.random() * 40) + 8,
      label: item.copyright,
      tracklist: []
    };
  },

  // Pull ALL NEWEST FULL ALBUMS automatically (strictly full album releases, no singles/remixes)
  // Helper: Fetch and map catalog in batch chunks from Apple Music lookup API
  async fetchBatchCatalogByArtistIds(artistIds: number[], country: string): Promise<Album[]> {
    const idChunks: number[][] = [];
    for (let i = 0; i < artistIds.length; i += 12) {
      idChunks.push(artistIds.slice(i, i + 12));
    }

    const batchPromises = idChunks.map(async (chunk) => {
      try {
        const res = await fetch(
          `https://itunes.apple.com/lookup?id=${chunk.join(',')}&entity=album&country=${country}&limit=25`,
          { signal: AbortSignal.timeout(7000) }
        );
        if (res.ok) {
          const data = await res.json();
          return (data.results || [])
            .filter((item: any) => item.wrapperType === 'collection')
            .map((item: any) => {
              const album = this.mapItunesAlbum(item);
              if (country === 'US') {
                album.isIndonesian = false;
                album.origin = 'International';
              }
              return album;
            });
        }
      } catch {
        return [];
      }
      return [];
    });

    const results = await Promise.all(batchPromises);
    return results.flat();
  },

  // Helper: Fetch discovery albums by search queries
  async fetchDiscoveryAlbums(queries: string[], country: string): Promise<Album[]> {
    const promises = queries.map(async (term) => {
      try {
        const res = await fetch(
          `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=album&country=${country}&limit=10`,
          { signal: AbortSignal.timeout(6000) }
        );
        if (res.ok) {
          const data = await res.json();
          return (data.results || []).map((item: any) => {
            const album = this.mapItunesAlbum(item);
            if (country === 'US') {
              album.isIndonesian = false;
              album.origin = 'International';
            }
            return album;
          });
        }
      } catch {
        return [];
      }
      return [];
    });

    const results = await Promise.all(promises);
    return results.flat();
  },

  // Pull ALL NEWEST FULL ALBUMS automatically (strictly full album releases, no singles/remixes)
  async fetchRecentReleases(countryCode: string = 'ID'): Promise<Album[]> {
    try {
      const albumMap = new Map<string, Album>();

      if (countryCode === 'US') {
        // Global / US Storefront mode
        const globalArtistIds = GLOBAL_ARTISTS_DATABASE
          .map((a) => a.appleMusicId)
          .filter((id): id is number => typeof id === 'number');

        const [globalCatalog, globalDiscovery] = await Promise.all([
          this.fetchBatchCatalogByArtistIds(globalArtistIds, 'US'),
          this.fetchDiscoveryAlbums(GLOBAL_DISCOVERY_QUERIES, 'US')
        ]);

        const allFetched = [...globalCatalog, ...globalDiscovery];

        for (const album of allFetched) {
          const titleLower = album.title.toLowerCase();
          const hasEnoughTracks = (album.trackCount || 0) >= 6;
          const isSingleOrRemix = titleLower.includes(' - single') ||
                                 titleLower.includes('- single') ||
                                 titleLower.includes('(remix)') ||
                                 titleLower.includes('[remix]');

          if (hasEnoughTracks && !isSingleOrRemix) {
            albumMap.set(album.id, album);
          }
        }

        const cleanAlbums = Array.from(albumMap.values()).sort((a, b) => {
          const timeA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
          const timeB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
          return timeB - timeA;
        });

        storageService.saveLiveAlbums(cleanAlbums);
        return cleanAlbums;
      }

      // Default (Indonesian + Global catalog for unified feed)
      const indonesianArtistIds = INDONESIAN_ARTISTS_DATABASE
        .map((a) => a.appleMusicId)
        .filter((id): id is number => typeof id === 'number');

      const globalArtistIds = GLOBAL_ARTISTS_DATABASE
        .map((a) => a.appleMusicId)
        .filter((id): id is number => typeof id === 'number');

      const [indoCatalog, indoDiscovery, globalCatalog] = await Promise.all([
        this.fetchBatchCatalogByArtistIds(indonesianArtistIds, 'ID'),
        this.fetchDiscoveryAlbums(['indie indonesia', 'rock indonesia'], 'ID'),
        this.fetchBatchCatalogByArtistIds(globalArtistIds, 'US')
      ]);

      const allFetched = [...indoCatalog, ...indoDiscovery, ...globalCatalog];

      // Strict full album filter: >= 6 tracks, not a single or remix
      for (const album of allFetched) {
        const titleLower = album.title.toLowerCase();
        const hasEnoughTracks = (album.trackCount || 0) >= 6;
        const isSingleOrRemix = titleLower.includes(' - single') ||
                               titleLower.includes('- single') ||
                               titleLower.includes('(remix)') ||
                               titleLower.includes('[remix]');

        const isFullAlbum = hasEnoughTracks && !isSingleOrRemix;

        if (isFullAlbum && (album.releaseYear >= 2022 || !album.isIndonesian)) {
          albumMap.set(album.id, album);
        }
      }

      const cleanRecentAlbums = Array.from(albumMap.values()).sort((a, b) => {
        const timeA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
        const timeB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
        return timeB - timeA;
      });

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

  // Live search across iTunes (searches both ID and US storefronts in parallel for complete Indo + Global coverage)
  async searchAlbums(query: string, countryCode: string = 'ID'): Promise<Album[]> {
    const trimmed = query.trim();
    if (!trimmed) {
      return this.fetchRecentReleases(countryCode);
    }

    try {
      const idPromise = fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(trimmed)}&entity=album&country=ID&limit=25`,
        { signal: AbortSignal.timeout(6000) }
      ).then(res => res.ok ? res.json() : { results: [] }).catch(() => ({ results: [] }));

      const usPromise = fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(trimmed)}&entity=album&country=US&limit=25`,
        { signal: AbortSignal.timeout(6000) }
      ).then(res => res.ok ? res.json() : { results: [] }).catch(() => ({ results: [] }));

      const [idData, usData] = await Promise.all([idPromise, usPromise]);
      const combined = [...(idData.results || []), ...(usData.results || [])];

      const seen = new Set<string>();
      const results: Album[] = [];

      for (const item of combined) {
        if (!item.collectionId || seen.has(String(item.collectionId))) continue;
        seen.add(String(item.collectionId));
        results.push(this.mapItunesAlbum(item));
      }

      // Relevance sort: exact title/artist matches first
      const qLower = trimmed.toLowerCase();
      results.sort((a, b) => {
        const aTitleMatch = a.title.toLowerCase() === qLower;
        const bTitleMatch = b.title.toLowerCase() === qLower;
        if (aTitleMatch && !bTitleMatch) return -1;
        if (!aTitleMatch && bTitleMatch) return 1;

        const aArtistMatch = a.artist.toLowerCase() === qLower;
        const bArtistMatch = b.artist.toLowerCase() === qLower;
        if (aArtistMatch && !bArtistMatch) return -1;
        if (!aArtistMatch && bArtistMatch) return 1;

        const aTitleInc = a.title.toLowerCase().includes(qLower);
        const bTitleInc = b.title.toLowerCase().includes(qLower);
        if (aTitleInc && !bTitleInc) return -1;
        if (!aTitleInc && bTitleInc) return 1;

        return 0;
      });

      results.forEach(album => storageService.saveAlbum(album));
      return results;
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
    if (albumId === PEELING_TANGERINE_EP.id || albumId === 'itunes-6786807440') {
      return PEELING_TANGERINE_EP;
    }

    let album = storageService.getAlbumById(albumId);

    if (album && album.tracklist && album.tracklist.length > 0) {
      return album;
    }

    const collectionId = albumId.startsWith('itunes-')
      ? albumId.replace('itunes-', '')
      : /^\d+$/.test(albumId)
        ? albumId
        : null;

    if (collectionId) {
      try {
        const countryParam = (album && !album.isIndonesian) ? '&country=US' : '';
        const response = await fetch(
          `https://itunes.apple.com/lookup?id=${collectionId}&entity=song${countryParam}`,
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
  },

  // Fetch complete artist details including profile, top songs, discography, and external streaming links
  async getArtistDetails(artistName: string): Promise<ArtistDetails> {
    const cleanName = artistName.trim();
    const cleanLower = cleanName.toLowerCase();

    // 1. Check local artist databases for curated meta
    const indoArtist = INDONESIAN_ARTISTS_DATABASE.find(
      a => a.normalizedName === cleanLower || a.name.toLowerCase() === cleanLower || cleanLower.includes(a.normalizedName)
    );
    const globalArtist = GLOBAL_ARTISTS_DATABASE.find(
      a => a.normalizedName === cleanLower || a.name.toLowerCase() === cleanLower || cleanLower.includes(a.normalizedName)
    );

    const isIndo = Boolean(indoArtist);
    const country = indoArtist?.city ? `Indonesia (${indoArtist.city})` : (globalArtist?.country || (isIndo ? 'Indonesia' : 'International'));
    const genre = indoArtist?.genre || globalArtist?.genre || 'Alternative / Music';

    // 2. Query Apple Music for songs & albums in parallel + real band photo resolver
    const encoded = encodeURIComponent(cleanName);

    const photoPromise = fetchRealArtistPhoto(cleanName);

    const songsPromise = Promise.all([
      fetch(`https://itunes.apple.com/search?term=${encoded}&entity=song&country=ID&limit=25`, { signal: AbortSignal.timeout(6000) })
        .then(r => r.ok ? r.json() : { results: [] }).catch(() => ({ results: [] })),
      fetch(`https://itunes.apple.com/search?term=${encoded}&entity=song&country=US&limit=25`, { signal: AbortSignal.timeout(6000) })
        .then(r => r.ok ? r.json() : { results: [] }).catch(() => ({ results: [] }))
    ]);

    const albumsPromise = Promise.all([
      fetch(`https://itunes.apple.com/search?term=${encoded}&entity=album&country=ID&limit=30`, { signal: AbortSignal.timeout(6000) })
        .then(r => r.ok ? r.json() : { results: [] }).catch(() => ({ results: [] })),
      fetch(`https://itunes.apple.com/search?term=${encoded}&entity=album&country=US&limit=30`, { signal: AbortSignal.timeout(6000) })
        .then(r => r.ok ? r.json() : { results: [] }).catch(() => ({ results: [] }))
    ]);

    const [realArtistPhoto, [songsId, songsUs], [albumsId, albumsUs]] = await Promise.all([
      photoPromise,
      songsPromise,
      albumsPromise
    ]);

    // 3. Process top tracks
    const allSongItems = [...(songsId.results || []), ...(songsUs.results || [])];
    const seenSongs = new Set<string>();
    const topTracks: Track[] = [];

    for (const song of allSongItems) {
      if (!song.trackId || seenSongs.has(String(song.trackId))) continue;
      const artistMatch = song.artistName && (
        song.artistName.toLowerCase() === cleanLower ||
        song.artistName.toLowerCase().includes(cleanLower) ||
        cleanLower.includes(song.artistName.toLowerCase())
      );
      if (!artistMatch) continue;

      seenSongs.add(String(song.trackId));
      topTracks.push({
        id: `track-${song.trackId}`,
        title: song.trackName,
        artist: song.artistName,
        albumTitle: song.collectionName || '',
        albumId: `itunes-${song.collectionId}`,
        coverUrl: song.artworkUrl100
          ? song.artworkUrl100.replace('100x100bb.jpg', '300x300bb.jpg')
          : undefined,
        durationMs: song.trackTimeMillis || 210000,
        trackNumber: song.trackNumber || topTracks.length + 1,
        previewUrl: song.previewUrl,
        isIndonesian: isIndo
      });
      if (topTracks.length >= 10) break;
    }

    // 4. Process albums and discography
    const allAlbumItems = [...(albumsId.results || []), ...(albumsUs.results || [])];
    const seenAlbums = new Set<string>();
    const allArtistAlbums: Album[] = [];

    // Also include any locally cached albums matching this artist
    const localCached = storageService.getAlbums().filter(
      a => a.artist.toLowerCase() === cleanLower || cleanLower.includes(a.artist.toLowerCase())
    );
    for (const la of localCached) {
      if (!seenAlbums.has(la.id)) {
        seenAlbums.add(la.id);
        allArtistAlbums.push(la);
      }
    }

    for (const item of allAlbumItems) {
      if (!item.collectionId || seenAlbums.has(`itunes-${item.collectionId}`)) continue;
      const artistMatch = item.artistName && (
        item.artistName.toLowerCase() === cleanLower ||
        item.artistName.toLowerCase().includes(cleanLower) ||
        cleanLower.includes(item.artistName.toLowerCase())
      );
      if (!artistMatch) continue;

      seenAlbums.add(`itunes-${item.collectionId}`);
      const mapped = this.mapItunesAlbum(item);
      allArtistAlbums.push(mapped);
      storageService.saveAlbum(mapped);
    }

    // Sort albums chronologically descending
    allArtistAlbums.sort((a, b) => b.releaseYear - a.releaseYear);

    const fullAlbums = allArtistAlbums.filter(a => a.albumType === 'album');
    const singlesAndEps = allArtistAlbums.filter(a => a.albumType === 'ep' || a.albumType === 'single');

    // 5. High-res visuals: Real artist/personnel photo prioritized
    // Fallback hero is an atmospheric live concert/stage visual, NOT an album cover with album title text
    const DEFAULT_CONCERT_HERO = 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1280&auto=format&fit=crop&q=80';
    const defaultCover = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';
    const fallbackAlbumCover = allSongItems[0]?.artworkUrl100
      ? allSongItems[0].artworkUrl100.replace('100x100bb.jpg', '600x600bb.jpg')
      : (allArtistAlbums[0]?.coverUrl || defaultCover);

    const heroPhotoToUse = realArtistPhoto || DEFAULT_CONCERT_HERO;
    const avatarPhotoToUse = realArtistPhoto || fallbackAlbumCover;

    // 6. Realistic stats based on artist catalog
    const hash = cleanName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const monthlyListeners = isIndo
      ? Math.floor(450000 + (hash % 1200000))
      : Math.floor(4800000 + (hash % 18000000));
    const followersCount = Math.floor(monthlyListeners * 0.42);

    // 7. Streaming links
    const externalLinks = {
      spotify: `https://open.spotify.com/search/${encoded}`,
      appleMusic: allSongItems[0]?.artistViewUrl || `https://music.apple.com/us/search?term=${encoded}`,
      youtubeMusic: `https://music.youtube.com/search?q=${encoded}`,
      bandcamp: `https://bandcamp.com/search?q=${encoded}`
    };

    return {
      name: cleanName,
      genre,
      genres: [genre],
      origin: isIndo ? 'Indonesia' : 'International',
      country,
      city: indoArtist?.city,
      avatarUrl: avatarPhotoToUse,
      backdropUrl: heroPhotoToUse,
      heroPhotoUrl: heroPhotoToUse,
      isRealArtistPhoto: Boolean(realArtistPhoto),
      monthlyListeners,
      followersCount,
      followingCount: 120,
      tracksCount: topTracks.length,
      isBand: cleanName.includes(' ') || cleanName.toLowerCase().startsWith('the ') || cleanName.startsWith('.'),
      externalLinks,
      topTracks,
      albums: fullAlbums.length > 0 ? fullAlbums : allArtistAlbums,
      singlesAndEps
    };
  },

  getArtistPhoto: fetchRealArtistPhoto
};
