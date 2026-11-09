export interface Track {
  id: string;
  title: string;
  artist: string;
  albumTitle: string;
  albumId: string;
  coverUrl?: string;
  durationMs: number;
  trackNumber: number;
  /** Overall listener score, when available from the catalog. */
  averageRating?: number;
  previewUrl?: string; // 30s playable audio
  isIndonesian?: boolean;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  /** Artist portrait for the detail header. Omit when no artist photo is available. */
  artistPhotoUrl?: string;
  releaseYear: number;
  releaseDate?: string; // ISO format e.g. "2026-09-04T07:00:00Z"
  isIndonesian?: boolean;
  origin?: 'Indonesia' | 'International';
  trackCount?: number;
  albumType?: 'album' | 'ep' | 'single';
  genres: string[];
  tracklist: Track[];
  averageRating: number;
  totalRatings: number;
  totalReviews: number;
  label?: string;
  description?: string;
}

export interface ReviewComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: string;
}

export interface Review {
  id: string;
  isDemo?: boolean;
  albumId: string;
  albumTitle: string;
  albumCover: string;
  artist: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userHandle: string;
  rating: number; // 0.5 to 5.0
  reviewText: string;
  favoriteTrackTitle?: string;
  /** Individual song ratings saved with this listen, keyed by track ID. */
  trackRatings?: Record<string, number>;
  tags: string[];
  dateListened: string;
  createdAt: string;
  likes: number;
  likedByMe: boolean;
  comments: ReviewComment[];
  isRelisten: boolean;
  isIndonesian?: boolean;
}

export interface Scrobble {
  id: string;
  trackTitle: string;
  artist: string;
  albumTitle: string;
  albumCover: string;
  timestamp: string;
  source: 'spotify' | 'lastfm' | 'preview' | 'simulated';
  reviewed?: boolean;
  isIndonesian?: boolean;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  isFollowedByMe?: boolean;
  topFourAlbumIds: string[];
}

export interface Recommendation {
  album: Album;
  score: number;
  reason: string;
  matchType: 'high_rating' | 'listening_history' | 'taste_tuner' | 'trending' | 'indonesian_spotlight';
  basedOnItem?: string;
}

export interface TasteTunerSettings {
  obscurity: number; // 0: Mainstream, 100: Obscure
  energy: number;    // 0: Chill/Ambient, 100: High Energy
  acousticness: number; // 0: Electronic/Synthetic, 100: Organic/Acoustic
  mood: number;      // 0: Melancholic, 100: Euphoric
  genre?: string;
}

export interface Playlist {
  id: string;
  title: string;
  description?: string;
  coverUrl?: string;
  tracks: Track[];
  createdAt: string;
  updatedAt: string;
}

export interface ArtistDetails {
  id?: string;
  name: string;
  appleMusicId?: number;
  genre: string;
  genres: string[];
  origin: 'Indonesia' | 'International';
  country?: string;
  city?: string;
  bio?: string;
  avatarUrl: string;
  backdropUrl?: string;
  heroPhotoUrl?: string;
  isRealArtistPhoto?: boolean;
  followingCount?: number;
  tracksCount?: number;
  monthlyListeners: number;
  followersCount: number;
  isBand?: boolean;
  externalLinks: {
    spotify: string;
    appleMusic: string;
    youtubeMusic: string;
    bandcamp?: string;
  };
  topTracks: Track[];
  albums: Album[];
  singlesAndEps: Album[];
}

export interface CommunityReply {
  id: string;
  userId: string;
  userName: string;
  userHandle: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
  likedByMe: boolean;
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userHandle: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  timestamp: number;
  likes: number;
  likedByMe: boolean;
  reposts: number;
  repostedByMe?: boolean;
  replyCount: number;
  replies: CommunityReply[];
  musicTag?: {
    id: string;
    title: string;
    artist: string;
    coverUrl: string;
    rating?: number;
    type?: 'album' | 'track';
  };
  tags?: string[];
  isHotTake?: boolean;
}

export type TabType = 'feed' | 'community' | 'search' | 'recommendations' | 'profile';
