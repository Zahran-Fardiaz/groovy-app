// ============================================================================
// Groovy Ingestion Worker: Types & Interfaces
// ============================================================================

export type ReleaseType = 'lp' | 'ep' | 'single' | 'compilation';
export type ArtistRole = 'primary' | 'featured' | 'producer';

export interface RegisteredArtist {
  id: string; // internal UUID or slug
  name: string;
  appleMusicId: number;
  isIndonesian: boolean;
  country: string;
  verified: boolean;
  city?: string;
  era?: string;
  genres: string[];
}

export interface RawItunesAlbum {
  wrapperType?: string;
  collectionType?: string;
  artistId: number;
  collectionId: number;
  amgArtistId?: number;
  artistName: string;
  collectionName: string;
  collectionCensoredName?: string;
  artistViewUrl?: string;
  collectionViewUrl?: string;
  artworkUrl60?: string;
  artworkUrl100?: string;
  collectionPrice?: number;
  trackCount: number;
  country: string;
  currency: string;
  releaseDate: string;
  primaryGenreName: string;
  copyright?: string;
}

export interface NormalizedArtistCredit {
  artistId: number;
  artistName: string;
  role: ArtistRole;
  orderIndex: number;
  isIndonesian: boolean;
}

export interface NormalizedAlbum {
  id: string; // generated uuid or internal id
  appleMusicId: number;
  title: string;
  releaseDate: string; // YYYY-MM-DD
  releaseYear: number;
  artworkUrl: string; // 600x600 high-res
  releaseType: ReleaseType;
  totalTracks: number;
  recordLabel?: string;
  primaryGenre: string;
  isIndonesian: boolean;
  credits: NormalizedArtistCredit[];
}

export interface CandidateRelease {
  appleMusicCollectionId: number;
  appleMusicArtistId: number;
  artistName: string;
  albumTitle: string;
  releaseDate: string;
  recordLabel?: string;
  isrcCode?: string;
  heuristicScore: number;
  detectionReasons: string[];
  status: 'pending' | 'approved' | 'rejected';
}

export interface SyncStats {
  artistsProcessed: number;
  releasesFetched: number;
  albumsIngested: number;
  skippedDuplicates: number;
  errors: number;
  timestamp: string;
}
