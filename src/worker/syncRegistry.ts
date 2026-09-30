// ============================================================================
// Groovy Ingestion Worker: Registry Sync Engine
// Upstream: Apple Music Catalog (via Lookup API by Apple Music Artist ID)
// ============================================================================

import {
  RegisteredArtist,
  RawItunesAlbum,
  NormalizedAlbum,
  NormalizedArtistCredit,
  ReleaseType,
  SyncStats
} from './types';

// Rate limiting & batching constants
const BATCH_SIZE = 5;
const REQUEST_DELAY_MS = 250;

export class RegistrySyncWorker {
  private knownArtistIds = new Map<number, RegisteredArtist>();
  private albumRegistry = new Map<number, NormalizedAlbum>();

  constructor(artists: RegisteredArtist[]) {
    for (const artist of artists) {
      this.knownArtistIds.set(artist.appleMusicId, artist);
    }
  }

  /**
   * Helper delay for polite rate limiting against Apple's endpoints
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Classify release type according to industry standards
   */
  public classifyReleaseType(raw: RawItunesAlbum): ReleaseType {
    const title = (raw.collectionName || '').toLowerCase();
    const tracks = raw.trackCount || 1;

    if (title.includes(' - single') || title.endsWith('- single') || tracks <= 3) {
      return 'single';
    }
    if (title.includes(' - ep') || title.endsWith('- ep') || (tracks >= 4 && tracks <= 5)) {
      return 'ep';
    }
    if (title.includes('greatest hits') || title.includes('the best of') || raw.collectionType === 'Compilation') {
      return 'compilation';
    }
    return 'lp';
  }

  /**
   * Parse collaboration credits from Apple Music artist string
   */
  public parseArtistCredits(
    rawArtistName: string,
    primaryArtist: RegisteredArtist
  ): NormalizedArtistCredit[] {
    const credits: NormalizedArtistCredit[] = [];

    // Always record the primary registered artist at index 0
    credits.push({
      artistId: primaryArtist.appleMusicId,
      artistName: primaryArtist.name,
      role: 'primary',
      orderIndex: 0,
      isIndonesian: primaryArtist.isIndonesian
    });

    // Check if there are featured artists (e.g., "Artist A feat. Artist B")
    const featMatch = rawArtistName.match(/(?:feat\.|featuring|ft\.)\s*(.+)/i);
    if (featMatch && featMatch[1]) {
      const featNames = featMatch[1].split(/,|&|\band\b/).map((s) => s.trim()).filter(Boolean);
      featNames.forEach((featName, index) => {
        // Find if this collaborator is also in our Indonesian registry
        const knownCollaborator = Array.from(this.knownArtistIds.values()).find(
          (a) => a.name.toLowerCase() === featName.toLowerCase()
        );

        credits.push({
          artistId: knownCollaborator ? knownCollaborator.appleMusicId : 0,
          artistName: featName,
          role: 'featured',
          orderIndex: index + 1,
          isIndonesian: knownCollaborator ? knownCollaborator.isIndonesian : false
        });
      });
    }

    return credits;
  }

  /**
   * Normalize raw Apple Music catalog album into standardized Groovy entity
   */
  public normalizeAlbum(raw: RawItunesAlbum, primaryArtist: RegisteredArtist): NormalizedAlbum {
    const highResArtwork = raw.artworkUrl100
      ? raw.artworkUrl100.replace('100x100bb.jpg', '600x600bb.jpg')
      : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';

    const credits = this.parseArtistCredits(raw.artistName || primaryArtist.name, primaryArtist);
    const releaseType = this.classifyReleaseType(raw);
    const releaseDate = raw.releaseDate ? raw.releaseDate.split('T')[0] : '2024-01-01';
    const releaseYear = new Date(raw.releaseDate || '2024-01-01').getFullYear();

    // Collaboration rule: Release is Indonesian if at least one primary credited artist is Indonesian
    const hasIndonesianPrimary = credits.some((c) => c.role === 'primary' && c.isIndonesian);

    return {
      id: `am-${raw.collectionId}`,
      appleMusicId: raw.collectionId,
      title: raw.collectionName,
      releaseDate,
      releaseYear: isNaN(releaseYear) ? 2024 : releaseYear,
      artworkUrl: highResArtwork,
      releaseType,
      totalTracks: raw.trackCount || 1,
      recordLabel: raw.copyright,
      primaryGenre: raw.primaryGenreName || primaryArtist.genres[0] || 'Alternative',
      isIndonesian: hasIndonesianPrimary,
      credits
    };
  }

  /**
   * Fetch catalog releases for a specific Apple Music Artist ID
   */
  public async fetchArtistReleases(artist: RegisteredArtist): Promise<NormalizedAlbum[]> {
    const url = `https://itunes.apple.com/lookup?id=${artist.appleMusicId}&entity=album&country=ID&limit=25`;

    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      const results: any[] = data.results || [];

      // First item in lookup is usually the artist metadata, subsequent items are collections
      const rawAlbums: RawItunesAlbum[] = results.filter(
        (item) => item.wrapperType === 'collection' && item.collectionType === 'Album'
      );

      const normalizedList: NormalizedAlbum[] = [];

      for (const raw of rawAlbums) {
        // Deduplicate against already ingested albums
        if (!this.albumRegistry.has(raw.collectionId)) {
          const normalized = this.normalizeAlbum(raw, artist);
          this.albumRegistry.set(raw.collectionId, normalized);
          normalizedList.push(normalized);
        }
      }

      return normalizedList;
    } catch (error) {
      console.error(`[Worker] Failed to fetch releases for ${artist.name} (${artist.appleMusicId}):`, error);
      return [];
    }
  }

  /**
   * Run full sync across all registered artists with batching and rate limiting
   */
  public async syncAll(onProgress?: (processed: number, total: number) => void): Promise<{
    stats: SyncStats;
    albums: NormalizedAlbum[];
  }> {
    const artists = Array.from(this.knownArtistIds.values());
    const total = artists.length;
    let processed = 0;
    let errorCount = 0;
    let releasesFetched = 0;

    for (let i = 0; i < total; i += BATCH_SIZE) {
      const batch = artists.slice(i, i + BATCH_SIZE);

      await Promise.all(
        batch.map(async (artist) => {
          try {
            const albums = await this.fetchArtistReleases(artist);
            releasesFetched += albums.length;
          } catch {
            errorCount++;
          } finally {
            processed++;
            if (onProgress) onProgress(processed, total);
          }
        })
      );

      if (i + BATCH_SIZE < total) {
        await this.delay(REQUEST_DELAY_MS);
      }
    }

    const allAlbums = Array.from(this.albumRegistry.values()).sort(
      (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
    );

    const stats: SyncStats = {
      artistsProcessed: processed,
      releasesFetched,
      albumsIngested: allAlbums.length,
      skippedDuplicates: releasesFetched - allAlbums.length,
      errors: errorCount,
      timestamp: new Date().toISOString()
    };

    return { stats, albums: allAlbums };
  }
}
