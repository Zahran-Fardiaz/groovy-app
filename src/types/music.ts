export interface Track {
  id: string;
  title: string;
  artist: string;
  albumTitle: string;
  albumId: string;
  durationMs: number;
  trackNumber: number;
  previewUrl?: string; // 30s playable audio
  isIndonesian?: boolean;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
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

export type TabType = 'feed' | 'search' | 'recommendations' | 'profile';
