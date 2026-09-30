import { Album, Review, Scrobble, User } from '../types/music';

export const CURRENT_USER: User = {
  id: 'user-me',
  username: 'zahran',
  displayName: 'Dhea Rizky',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  bio: 'Pencinta musik indie & pop Indonesia. Reviewing everything from local tape loops to modern drops.',
  followersCount: 184,
  followingCount: 95,
  topFourAlbumIds: []
};

export const SEED_USERS: User[] = [
  CURRENT_USER,
  {
    id: 'user-bima',
    username: 'bima_nada',
    displayName: 'Bima Santoso',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    bio: 'Kurator skena musik lokal Bandung & Jakarta. Koleksi vinyl & rilisan fisik.',
    followersCount: 540,
    followingCount: 210,
    isFollowedByMe: true,
    topFourAlbumIds: []
  },
  {
    id: 'user-amanda',
    username: 'amanda_sound',
    displayName: 'Amanda Putri',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    bio: 'Dengerin Bernadya, Hindia, Nadin Amizah, sampai pop 2000-an non-stop.',
    followersCount: 420,
    followingCount: 180,
    isFollowedByMe: true,
    topFourAlbumIds: []
  }
];

export const INITIAL_INDONESIAN_REVIEWS: Review[] = [
  {
    id: 'rev-bernadya-1',
    albumId: 'bernadya-sialnya',
    albumTitle: 'Sialnya, Hidup Harus Tetap Berjalan',
    albumCover: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/05/9a/59/059a5971-da5f-5182-e565-d41c9bfae348/cover.jpg/600x600bb.jpg',
    artist: 'Bernadya',
    userId: 'user-amanda',
    userName: 'Amanda Putri',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    userHandle: 'amanda_sound',
    rating: 5.0,
    reviewText: 'Lirik lagu "Untungnya, Hidup Harus Tetap Berjalan" sama "Kata Mereka Ini Berlebihan" bener-bener ngena buat fase quarter-life crisis. Vokal Bernadya yang tenang tapi menusuk bikin album ini jadi anthem 2024.',
    favoriteTrackTitle: 'Untungnya, Hidup Harus Tetap Berjalan',
    tags: ['masterpiece', 'galau-brutal', 'lirik-puisi', 'album-tahun-ini'],
    dateListened: '2026-09-05',
    createdAt: '3 jam lalu',
    likes: 64,
    likedByMe: true,
    isRelisten: true,
    isIndonesian: true,
    comments: [
      {
        id: 'c-ind-1',
        userId: 'user-me',
        userName: 'Dhea Rizky',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        text: 'Setuju banget, storytelling di track "Satu Bulan" juga relate parah.',
        createdAt: '1 jam lalu'
      }
    ]
  },
  {
    id: 'rev-sal-1',
    albumId: 'sal-markers',
    albumTitle: 'MARKERS AND SUCH PENS FLASHDISKS',
    albumCover: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/21/f4/ca/21f4cadc-9694-a953-eb89-397a6104c8f5/cover.jpg/600x600bb.jpg',
    artist: 'Sal Priadi',
    userId: 'user-bima',
    userName: 'Bima Santoso',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    userHandle: 'bima_nada',
    rating: 4.5,
    reviewText: 'Dari "Gala Bunga Matahari" yang menyayat hati sampai keunikan "Dari Planet Lain", Sal Priadi membuktikan kapasitasnya sebagai salah satu penulis lagu terbaik generasi ini. Eksplorasi aransemen yang sangat berani.',
    favoriteTrackTitle: 'Gala Bunga Matahari',
    tags: ['art-pop', 'indie-lokal', 'air-mata', 'rekomendasi'],
    dateListened: '2026-09-04',
    createdAt: 'Kemarin',
    likes: 51,
    likedByMe: true,
    isRelisten: false,
    isIndonesian: true,
    comments: []
  },
  {
    id: 'rev-feast-1',
    albumId: 'feast-nina',
    albumTitle: 'Nina - Single',
    albumCover: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a4/bc/f1/a4bcf1b5-31d7-2f64-d621-36ba595462cf/cover.jpg/600x600bb.jpg',
    artist: '.Feast',
    userId: 'user-me',
    userName: 'Dhea Rizky',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    userHandle: 'zahran',
    rating: 5.0,
    reviewText: '.Feast yang biasanya menggebu-gebu dengan kritik sosial kali ini merilis surat cinta paling lembut dan emosional untuk seorang anak. Chord progression bagian bridge selalu bikin merinding.',
    favoriteTrackTitle: 'Nina',
    tags: ['rock', 'emosional', 'parenting', 'lagu-wajib'],
    dateListened: '2026-09-06',
    createdAt: '5 jam lalu',
    likes: 38,
    likedByMe: false,
    isRelisten: true,
    isIndonesian: true,
    comments: []
  }
];

export const INITIAL_ALBUMS: Album[] = [
  {
    id: 'itunes-6786637491',
    title: 'Setelah: Obrolan Jam 3 Pagi',
    artist: 'Lomba Sihir',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/8e/39/4e/8e394e92-d38e-daf3-96f9-0bd8ad39ceb4/26UMGIM84855.rgb.jpg/600x600bb.jpg',
    releaseYear: 2026,
    releaseDate: '2026-09-04T07:00:00Z',
    isIndonesian: true,
    origin: 'Indonesia',
    trackCount: 10,
    albumType: 'album',
    genres: ['Electropop', 'Indie', 'Alternative'],
    averageRating: 4.8,
    totalRatings: 180,
    totalReviews: 38,
    tracklist: []
  },
  {
    id: 'itunes-6799132111',
    title: 'Laika, Yang Ditinggalkan',
    artist: 'Nadin Amizah',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/41/e3/45/41e345f2-772f-2b3a-dda5-b09a90b07ab3/cover.jpg/600x600bb.jpg',
    releaseYear: 2026,
    releaseDate: '2026-08-28T07:00:00Z',
    isIndonesian: true,
    origin: 'Indonesia',
    trackCount: 9,
    albumType: 'album',
    genres: ['Folk Pop', 'Indie', 'Acoustic'],
    averageRating: 4.9,
    totalRatings: 310,
    totalReviews: 62,
    tracklist: []
  },
  {
    id: 'itunes-6801554707',
    title: 'Melankolia Radikal',
    artist: 'Dongker',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/d5/ac/da/d5acda9f-4319-7f9e-2088-a55c339dd6ae/823375369899_Cover.jpg/600x600bb.jpg',
    releaseYear: 2026,
    releaseDate: '2026-08-28T07:00:00Z',
    isIndonesian: true,
    origin: 'Indonesia',
    trackCount: 11,
    albumType: 'album',
    genres: ['Punk Rock', 'Indie Rock'],
    averageRating: 4.7,
    totalRatings: 240,
    totalReviews: 45,
    tracklist: []
  },
  {
    id: 'itunes-1892661800',
    title: 'Romantisasi Impulsif',
    artist: 'The Jansen',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/11/13/39/1113392a-dd89-beae-ad0d-6dba6a9fa8eb/cover.jpg/600x600bb.jpg',
    releaseYear: 2026,
    releaseDate: '2026-07-22T07:00:00Z',
    isIndonesian: true,
    origin: 'Indonesia',
    trackCount: 12,
    albumType: 'album',
    genres: ['Punk', 'Garage Rock'],
    averageRating: 4.6,
    totalRatings: 195,
    totalReviews: 32,
    tracklist: []
  },
  {
    id: 'itunes-1893822271',
    title: 'Semoga Hanya di Mimpi',
    artist: 'Bernadya',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/1d/c3/d8/1dc3d8e2-ef25-49d5-ace8-ffe0b3e78a8d/26UMGIM39840.rgb.jpg/600x600bb.jpg',
    releaseYear: 2026,
    releaseDate: '2026-06-24T07:00:00Z',
    isIndonesian: true,
    origin: 'Indonesia',
    trackCount: 10,
    albumType: 'album',
    genres: ['Indo Pop', 'Indie Pop', 'Melancholy'],
    averageRating: 4.9,
    totalRatings: 520,
    totalReviews: 98,
    tracklist: []
  },
  {
    id: 'itunes-1828867271',
    title: 'Who Knows Where Life Will Take You?',
    artist: 'Reality Club',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/7b/8d/75/7b8d75c0-b264-32e0-849c-d3cf8bd24335/25UMGIM95805.rgb.jpg/600x600bb.jpg',
    releaseYear: 2025,
    releaseDate: '2025-08-27T07:00:00Z',
    isIndonesian: true,
    origin: 'Indonesia',
    trackCount: 13,
    albumType: 'album',
    genres: ['Indie Rock', 'Alternative'],
    averageRating: 4.8,
    totalRatings: 410,
    totalReviews: 76,
    tracklist: []
  },
  {
    id: 'itunes-1830230456',
    title: 'Dalam Dinamika',
    artist: 'Perunggu',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/0b/a8/73/0ba8733c-7a06-2167-169d-87a21fcab951/cover.jpg/600x600bb.jpg',
    releaseYear: 2025,
    releaseDate: '2025-08-22T07:00:00Z',
    isIndonesian: true,
    origin: 'Indonesia',
    trackCount: 10,
    albumType: 'album',
    genres: ['Alternative Rock', 'Indie Rock'],
    averageRating: 4.7,
    totalRatings: 260,
    totalReviews: 48,
    tracklist: []
  },
  {
    id: 'itunes-1763133989',
    title: 'Galura Tropikalia - EP',
    artist: 'The Panturas',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/7e/43/33/7e433393-219d-7db0-d7d8-3a9a13a825e6/cover.jpg/600x600bb.jpg',
    releaseYear: 2024,
    releaseDate: '2024-11-22T08:00:00Z',
    isIndonesian: true,
    origin: 'Indonesia',
    trackCount: 6,
    albumType: 'ep',
    genres: ['Surf Rock', 'Indie Rock'],
    averageRating: 4.9,
    totalRatings: 320,
    totalReviews: 42,
    tracklist: []
  },
  {
    id: 'bernadya-sialnya',
    title: 'Sialnya, Hidup Harus Tetap Berjalan',
    artist: 'Bernadya',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/05/9a/59/059a5971-da5f-5182-e565-d41c9bfae348/cover.jpg/600x600bb.jpg',
    releaseYear: 2024,
    releaseDate: '2024-06-23T00:00:00Z',
    isIndonesian: true,
    origin: 'Indonesia',
    trackCount: 8,
    albumType: 'album',
    genres: ['Indo Pop', 'Indie Pop'],
    averageRating: 4.9,
    totalRatings: 340,
    totalReviews: 64,
    tracklist: []
  },
  {
    id: 'itunes-1789446415',
    title: 'CHROMAKOPIA',
    artist: 'Tyler, The Creator',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/b6/ef/ee/b6efeefa-fc99-37d1-ad21-0d769b2a4958/196872796971.jpg/600x600bb.jpg',
    releaseYear: 2024,
    releaseDate: '2024-10-28T07:00:00Z',
    isIndonesian: false,
    origin: 'International',
    trackCount: 14,
    albumType: 'album',
    genres: ['Hip-Hop/Rap', 'Alternative'],
    averageRating: 4.8,
    totalRatings: 850,
    totalReviews: 120,
    tracklist: []
  },
  {
    id: 'itunes-1752214909',
    title: "Short n' Sweet",
    artist: 'Sabrina Carpenter',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a1/1c/ca/a11ccab6-7d4c-e041-d028-998bcebeb709/24UMGIM61704.rgb.jpg/600x600bb.jpg',
    releaseYear: 2024,
    releaseDate: '2024-08-23T07:00:00Z',
    isIndonesian: false,
    origin: 'International',
    trackCount: 12,
    albumType: 'album',
    genres: ['Pop'],
    averageRating: 4.7,
    totalRatings: 920,
    totalReviews: 140,
    tracklist: []
  },
  {
    id: 'itunes-1739659134',
    title: 'HIT ME HARD AND SOFT',
    artist: 'Billie Eilish',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/92/9f/69/929f69f1-9977-3a44-d674-11f70c852d1b/24UMGIM36186.rgb.jpg/600x600bb.jpg',
    releaseYear: 2024,
    releaseDate: '2024-05-17T07:00:00Z',
    isIndonesian: false,
    origin: 'International',
    trackCount: 11,
    albumType: 'album',
    genres: ['Alternative', 'Pop'],
    averageRating: 4.9,
    totalRatings: 1140,
    totalReviews: 210,
    tracklist: []
  },
  {
    id: 'itunes-1707412988',
    title: 'The Rise and Fall of a Midwest Princess',
    artist: 'Chappell Roan',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/42/a0/c5/42a0c5e6-6b98-f1f9-7d6b-6d6c61aba562/23UMGIM84225.rgb.jpg/600x600bb.jpg',
    releaseYear: 2023,
    releaseDate: '2023-09-22T07:00:00Z',
    isIndonesian: false,
    origin: 'International',
    trackCount: 14,
    albumType: 'album',
    genres: ['Pop', 'Indie Pop'],
    averageRating: 4.8,
    totalRatings: 780,
    totalReviews: 95,
    tracklist: []
  }
];

// Helper to get consistent timestamp for chronological sorting
export const getAlbumTimestamp = (a: Album): number => {
  if (a.releaseDate) {
    const t = new Date(a.releaseDate).getTime();
    if (!isNaN(t) && t > 0) return t;
  }
  if (a.releaseYear) {
    const t = new Date(`${a.releaseYear}-01-01T00:00:00Z`).getTime();
    if (!isNaN(t) && t > 0) return t;
  }
  return 0;
};

// LocalStorage Keys
const KEYS = {
  ALBUMS: 'groovy_live_albums_v3',
  REVIEWS: 'groovy_reviews_v3',
  SCROBBLES: 'groovy_scrobbles_v3',
  USERS: 'groovy_users_v3',
  CURRENT_USER: 'groovy_current_user_v3'
};

export const storageService = {
  getAlbums(): Album[] {
    const raw = localStorage.getItem(KEYS.ALBUMS);
    const albums: Album[] = raw ? JSON.parse(raw) : INITIAL_ALBUMS;
    // Strictly sort descending by release timestamp (newest/most recent first)
    return albums.sort((a, b) => getAlbumTimestamp(b) - getAlbumTimestamp(a));
  },

  saveAlbum(album: Album): void {
    const albums = this.getAlbums();
    const index = albums.findIndex(a => a.id === album.id);
    if (index >= 0) {
      albums[index] = { ...albums[index], ...album };
    } else {
      albums.unshift(album);
    }
    albums.sort((a, b) => getAlbumTimestamp(b) - getAlbumTimestamp(a));
    localStorage.setItem(KEYS.ALBUMS, JSON.stringify(albums));
  },

  saveLiveAlbums(liveAlbums: Album[]): void {
    const existing = this.getAlbums();
    const existingMap = new Map(existing.map(a => [a.id, a]));

    for (const album of liveAlbums) {
      if (existingMap.has(album.id)) {
        const prev = existingMap.get(album.id)!;
        existingMap.set(album.id, {
          ...album,
          averageRating: prev.totalReviews > 0 ? prev.averageRating : album.averageRating,
          totalReviews: Math.max(prev.totalReviews, album.totalReviews),
          tracklist: prev.tracklist && prev.tracklist.length > 0 ? prev.tracklist : album.tracklist
        });
      } else {
        existingMap.set(album.id, album);
      }
    }

    const merged = Array.from(existingMap.values()).sort((a, b) => getAlbumTimestamp(b) - getAlbumTimestamp(a));
    localStorage.setItem(KEYS.ALBUMS, JSON.stringify(merged));
  },

  getAlbumById(id: string): Album | undefined {
    return this.getAlbums().find(a => a.id === id);
  },

  getReviews(): Review[] {
    const raw = localStorage.getItem(KEYS.REVIEWS);
    if (!raw) {
      localStorage.setItem(KEYS.REVIEWS, JSON.stringify(INITIAL_INDONESIAN_REVIEWS));
      return INITIAL_INDONESIAN_REVIEWS;
    }
    return JSON.parse(raw);
  },

  saveReview(review: Review): void {
    const reviews = this.getReviews();
    const index = reviews.findIndex(r => r.id === review.id);
    if (index >= 0) {
      reviews[index] = review;
    } else {
      reviews.unshift(review);
    }
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify(reviews));

    const album = this.getAlbumById(review.albumId);
    if (album) {
      const albumReviews = reviews.filter(r => r.albumId === album.id);
      const totalReviews = albumReviews.length;
      const sumRatings = albumReviews.reduce((sum, r) => sum + r.rating, 0);
      album.averageRating = Number((sumRatings / totalReviews).toFixed(1));
      album.totalReviews = totalReviews;
      this.saveAlbum(album);
    }
  },

  toggleLikeReview(reviewId: string): Review[] {
    const reviews = this.getReviews().map(r => {
      if (r.id === reviewId) {
        return {
          ...r,
          likedByMe: !r.likedByMe,
          likes: r.likedByMe ? r.likes - 1 : r.likes + 1
        };
      }
      return r;
    });
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify(reviews));
    return reviews;
  },

  addCommentToReview(reviewId: string, text: string, user: User): Review | undefined {
    const reviews = this.getReviews();
    const review = reviews.find(r => r.id === reviewId);
    if (review) {
      review.comments.push({
        id: 'c-' + Date.now(),
        userId: user.id,
        userName: user.displayName,
        userAvatar: user.avatarUrl,
        text,
        createdAt: 'Baru saja'
      });
      localStorage.setItem(KEYS.REVIEWS, JSON.stringify(reviews));
      return review;
    }
    return undefined;
  },

  getScrobbles(): Scrobble[] {
    const raw = localStorage.getItem(KEYS.SCROBBLES);
    if (!raw) {
      return [
        {
          id: 'scrob-bernadya',
          trackTitle: 'Untungnya, Hidup Harus Tetap Berjalan',
          artist: 'Bernadya',
          albumTitle: 'Sialnya, Hidup Harus Tetap Berjalan',
          albumCover: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/05/9a/59/059a5971-da5f-5182-e565-d41c9bfae348/cover.jpg/600x600bb.jpg',
          timestamp: '12m lalu',
          source: 'spotify',
          reviewed: true,
          isIndonesian: true
        },
        {
          id: 'scrob-sal',
          trackTitle: 'Gala Bunga Matahari',
          artist: 'Sal Priadi',
          albumTitle: 'MARKERS AND SUCH PENS FLASHDISKS',
          albumCover: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/21/f4/ca/21f4cadc-9694-a953-eb89-397a6104c8f5/cover.jpg/600x600bb.jpg',
          timestamp: '45m lalu',
          source: 'spotify',
          reviewed: true,
          isIndonesian: true
        }
      ];
    }
    return JSON.parse(raw);
  },

  addScrobble(scrobble: Omit<Scrobble, 'id' | 'timestamp'>): Scrobble {
    const scrobbles = this.getScrobbles();
    const newScrobble: Scrobble = {
      ...scrobble,
      id: 'scrob-' + Date.now(),
      timestamp: 'Baru saja'
    };
    scrobbles.unshift(newScrobble);
    const trimmed = scrobbles.slice(0, 50);
    localStorage.setItem(KEYS.SCROBBLES, JSON.stringify(trimmed));
    return newScrobble;
  },

  markScrobbleReviewed(albumTitle: string): void {
    const scrobbles = this.getScrobbles().map(s => {
      if (s.albumTitle.toLowerCase() === albumTitle.toLowerCase()) {
        return { ...s, reviewed: true };
      }
      return s;
    });
    localStorage.setItem(KEYS.SCROBBLES, JSON.stringify(scrobbles));
  },

  getCurrentUser(): User {
    const raw = localStorage.getItem(KEYS.CURRENT_USER);
    if (!raw) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(CURRENT_USER));
      return CURRENT_USER;
    }
    const parsed = JSON.parse(raw);
    if (parsed.displayName === 'Zahran F.' || parsed.displayName === 'Zahran Fardiaz' || !parsed.displayName) {
      parsed.displayName = CURRENT_USER.displayName;
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(parsed));
    }
    return parsed;
  },

  saveCurrentUser(user: User): void {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
  },

  getUsers(): User[] {
    const raw = localStorage.getItem(KEYS.USERS);
    if (!raw) {
      localStorage.setItem(KEYS.USERS, JSON.stringify(SEED_USERS));
      return SEED_USERS;
    }
    return JSON.parse(raw);
  },

  toggleFollowUser(userId: string): User[] {
    const users = this.getUsers().map(u => {
      if (u.id === userId) {
        const isFollowed = !u.isFollowedByMe;
        return {
          ...u,
          isFollowedByMe: isFollowed,
          followersCount: isFollowed ? u.followersCount + 1 : u.followersCount - 1
        };
      }
      return u;
    });
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));

    const me = this.getCurrentUser();
    const target = users.find(u => u.id === userId);
    if (target) {
      me.followingCount = target.isFollowedByMe ? me.followingCount + 1 : Math.max(0, me.followingCount - 1);
      this.saveCurrentUser(me);
    }

    return users;
  }
};
