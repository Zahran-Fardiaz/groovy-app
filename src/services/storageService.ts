import { Album, CommunityPost, CommunityReply, Playlist, Review, Scrobble, Track, User } from '../types/music';

export const CURRENT_USER: User = {
  id: 'user-me',
  username: 'dhea',
  displayName: 'Dhea Rizky',
  avatarUrl: '/default-avatar.svg',
  bio: '',
  followersCount: 0,
  followingCount: 0,
  topFourAlbumIds: ['', '', '', '']
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
  },
  {
    id: 'user-citra',
    username: 'citralestari',
    displayName: 'Citra Lestari',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    bio: 'Pencinta musik indie pop & gigs lokal Jakarta.',
    followersCount: 312,
    followingCount: 140,
    isFollowedByMe: false,
    topFourAlbumIds: []
  },
  {
    id: 'user-indra',
    username: 'indrawijaya',
    displayName: 'Indra Wijaya',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    bio: 'Arsiparis rilisan alternative rock & post-punk.',
    followersCount: 275,
    followingCount: 98,
    isFollowedByMe: false,
    topFourAlbumIds: []
  }
];

export const INITIAL_INDONESIAN_REVIEWS: Review[] = [
  {
    id: 'rev-bernadya-1',
    albumId: 'bernadya-sialnya',
    albumTitle: 'Sialnya, Hidup Harus Tetap Berjalan',
    albumCover: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/9c/9f/80/9c9f80d1-cb53-db64-9bca-03f06cd1000c/24UMGIM57224.rgb.jpg/600x600bb.jpg',
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
        userId: 'user-citra',
        userName: 'Citra Lestari',
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
    albumCover: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/fa/a8/4c/faa84c4f-0f09-3730-6460-8c53e9dc159d/cover.jpg/600x600bb.jpg',
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
    albumCover: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/f1/28/34/f12834cb-932f-cca6-58d7-3b5a790d83c2/cover.jpg/600x600bb.jpg',
    artist: '.Feast',
    userId: 'user-citra',
    userName: 'Citra Lestari',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    userHandle: 'citralestari',
    rating: 5.0,
    reviewText: '.Feast yang biasanya menggebu-gebu dengan kritik sosial kali ini merilis surat cinta paling lembut dan emosional untuk seorang anak. Chord progression bagian bridge selalu bikin merinding.',
    favoriteTrackTitle: 'Nina',
    tags: ['rock', 'emosional', 'parenting', 'lagu-wajib'],
    dateListened: '2026-09-06',
    createdAt: '5 jam lalu',
    likes: 38,
    likedByMe: false,
    isRelisten: true,
    comments: []
  }
];

export const INITIAL_GLOBAL_REVIEWS: Review[] = [
  {
    id: 'rev-gnx-1',
    albumId: 'itunes-1781316864',
    albumTitle: 'GNX',
    albumCover: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/54/28/14/54281424-eece-0935-299d-fdd2ab403f92/24UM1IM28978.rgb.jpg/600x600bb.jpg',
    artist: 'Kendrick Lamar',
    userId: 'user-bima',
    userName: 'Bima Santoso',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    userHandle: 'bima_nada',
    rating: 5.0,
    reviewText: 'Surprise drop paling gila! Produksi West Coast bounce di "squabble up" sama "luther" bareng SZA bener-bener level dewa. Kendrick balik ke akar Compton dengan storytelling yang luar biasa tajam.',
    favoriteTrackTitle: 'luther (feat. SZA)',
    tags: ['masterpiece', 'west-coast', 'hip-hop', 'album-tahun-ini'],
    dateListened: '2026-09-08',
    createdAt: '2 jam lalu',
    likes: 89,
    likedByMe: true,
    isRelisten: true,
    isIndonesian: false,
    comments: []
  },
  {
    id: 'rev-brat-1',
    albumId: 'itunes-1739079974',
    albumTitle: 'BRAT',
    albumCover: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/88/4e/63/884e6321-ad41-aab1-f6f0-20efcafcfd55/075679666130.jpg/600x600bb.jpg',
    artist: 'Charli xcx',
    userId: 'user-amanda',
    userName: 'Amanda Putri',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    userHandle: 'amanda_sound',
    rating: 5.0,
    reviewText: 'Brat summer is real! Dari "360", "Apple", sampai "Sympathy is a knife", beat club pop dan lirik vulnerablenya Charli bikin album ini jadi cultural moment paling berdampak.',
    favoriteTrackTitle: 'Sympathy is a knife',
    tags: ['hyperpop', 'club-classics', 'repeat-worthy', 'banger'],
    dateListened: '2026-09-07',
    createdAt: '4 jam lalu',
    likes: 112,
    likedByMe: true,
    isRelisten: true,
    isIndonesian: false,
    comments: []
  },
  {
    id: 'rev-weeknd-1',
    albumId: 'itunes-1793702595',
    albumTitle: 'Hurry Up Tomorrow',
    albumCover: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/13/fd/a3/13fda38d-fc63-ddc3-1cf2-c09251adc532/25UMGIM09489.rgb.jpg/600x600bb.jpg',
    artist: 'The Weeknd',
    userId: 'user-bima',
    userName: 'Bima Santoso',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    userHandle: 'bima_nada',
    rating: 4.8,
    reviewText: 'Penutup trilogi yang megah banget dari Abel. Transisi synth wave 80-an ke dark cinematic R&B di "Wake Me Up" dan "Dancing In The Flames" bener-bener mature.',
    favoriteTrackTitle: 'Wake Me Up',
    tags: ['synth-wave', 'cinematic', 'r&b', 'the-weeknd'],
    dateListened: '2026-09-09',
    createdAt: '3 jam lalu',
    likes: 74,
    likedByMe: false,
    isRelisten: true,
    isIndonesian: false,
    comments: []
  },
  {
    id: 'rev-tyler-1',
    albumId: 'itunes-1789446415',
    albumTitle: 'CHROMAKOPIA',
    albumCover: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/b6/ef/ee/b6efeefa-fc99-37d1-ad21-0d769b2a4958/196872796971.jpg/600x600bb.jpg',
    artist: 'Tyler, The Creator',
    userId: 'user-amanda',
    userName: 'Amanda Putri',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    userHandle: 'amanda_sound',
    rating: 4.9,
    reviewText: 'Evolusi Tyler makin tak terduga. Vibe paranoia, aransemen marching band brass yang raw di "St. Chroma", dan lirik introspektif di tiap lagu bener-bener solid.',
    favoriteTrackTitle: 'St. Chroma (feat. Daniel Caesar)',
    tags: ['hip-hop', 'experimental', 'brass', 'masterpiece'],
    dateListened: '2026-09-08',
    createdAt: '5 jam lalu',
    likes: 81,
    likedByMe: true,
    isRelisten: false,
    isIndonesian: false,
    comments: []
  },
  {
    id: 'rev-fontaines-1',
    albumId: 'itunes-1737990072',
    albumTitle: 'Romance',
    albumCover: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/4d/3a/76/4d3a7621-8b56-56a3-829f-545dde0b2b6a/191404143674.png/600x600bb.jpg',
    artist: 'Fontaines D.C.',
    userId: 'user-indra',
    userName: 'Indra Wijaya',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    userHandle: 'indrawijaya',
    rating: 4.9,
    reviewText: 'Post-punk era baru yang brilian. Beat hip-hop style drum dan vokal Grian Chatten yang intens di "Starburster" bikin album ini jadi salah satu rilisan rock terbaik tahun ini.',
    favoriteTrackTitle: 'Starburster',
    tags: ['post-punk', 'modern-rock', 'irish-rock', 'album-tahun-ini'],
    dateListened: '2026-09-08',
    createdAt: '1 jam lalu',
    likes: 67,
    likedByMe: true,
    isRelisten: true,
    isIndonesian: false,
    comments: []
  }
];

export const INITIAL_REVIEWS: Review[] = [...INITIAL_INDONESIAN_REVIEWS, ...INITIAL_GLOBAL_REVIEWS];

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    userId: 'user-bima',
    userName: 'Bima Santoso',
    userHandle: 'bima_nada',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    content: "Hot take: 'All-Nighter' dari Peeling Tangerine punya bassline terbaik di rilisan indie lokal tahun ini. Transisi aransemennya bener-bener mature, pas banget diputer pas night drive jam 1 pagi. Siapa yang sepakat? 🍊🌃 #HotTake #SkenaLokal #NowPlaying",
    createdAt: '15m lalu',
    timestamp: Date.now() - 15 * 60 * 1000,
    likes: 42,
    likedByMe: true,
    reposts: 7,
    repostedByMe: false,
    replyCount: 2,
    isHotTake: true,
    tags: ['HotTake', 'SkenaLokal', 'NowPlaying'],
    musicTag: {
      id: 'peeling-tangerine-welcome-home-ep',
      title: 'Welcome Home - EP',
      artist: 'Peeling Tangerine',
      coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b5/ed/de/b5edde3b-9511-fa05-6410-ed97a180ee84/5064010768980_cover.jpg/600x600bb.jpg',
      rating: 5.0,
      type: 'album'
    },
    replies: [
      {
        id: 'rep-1-1',
        userId: 'user-amanda',
        userName: 'Amanda Putri',
        userHandle: 'amanda_sound',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
        content: "Fix setuju Mas Bima! Part outro pas drumnya mulai half-time itu goosebumps banget 😭",
        createdAt: '10m lalu',
        likes: 12,
        likedByMe: true
      },
      {
        id: 'rep-1-2',
        userId: 'user-citra',
        userName: 'Citra Lestari',
        userHandle: 'citralestari',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        content: "Gue malah kepincut sama Hey, Child! Vokal akustiknya calming bgt buat nemenin nugas.",
        createdAt: '5m lalu',
        likes: 5,
        likedByMe: false
      }
    ]
  },
  {
    id: 'post-2',
    userId: 'user-amanda',
    userName: 'Amanda Putri',
    userHandle: 'amanda_sound',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    content: "Album Bernadya 'Sialnya, Hidup Harus Tetap Berjalan' ini udah 3 bulan berturut-turut nongkrong di #1 Spotify On-Repeat gue. Liriknya kayak divalidasi habis-habisan. Lagu apa dari album ini yang paling sering bikin kalian nangis sesenggukan? 🥀💭 #ReviewJujur #GalauBrutal #Bernadya",
    createdAt: '1j lalu',
    timestamp: Date.now() - 60 * 60 * 1000,
    likes: 89,
    likedByMe: false,
    reposts: 18,
    repostedByMe: false,
    replyCount: 1,
    tags: ['ReviewJujur', 'GalauBrutal', 'Bernadya'],
    musicTag: {
      id: 'bernadya-sialnya',
      title: 'Sialnya, Hidup Harus Tetap Berjalan',
      artist: 'Bernadya',
      coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/9c/9f/80/9c9f80d1-cb53-db64-9bca-03f06cd1000c/24UMGIM57224.rgb.jpg/600x600bb.jpg',
      rating: 5.0,
      type: 'album'
    },
    replies: [
      {
        id: 'rep-2-1',
        userId: 'user-bima',
        userName: 'Bima Santoso',
        userHandle: 'bima_nada',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        content: "'Untungnya, Hidup Harus Tetap Berjalan' no debate. Liriknya menusuk tapi ngasih secercah harapan.",
        createdAt: '45m lalu',
        likes: 18,
        likedByMe: false
      }
    ]
  },
  {
    id: 'post-3',
    userId: 'user-indra',
    userName: 'Indra Wijaya',
    userHandle: 'indrawijaya',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    content: "Fontaines D.C. dengan album 'Romance' buktiin kalo post-punk ga pernah mati, justru berevolusi makin eklektik. Beat hip-hop di 'Starburster' dipadu vokal raw Grian Chatten bener-bener gila. Rilisan rock internasional terbaik 2024. 🎸⚡ #PostPunk #ModernRock #VinylClub",
    createdAt: '3j lalu',
    timestamp: Date.now() - 3 * 3600 * 1000,
    likes: 64,
    likedByMe: true,
    reposts: 12,
    repostedByMe: true,
    replyCount: 1,
    isHotTake: false,
    tags: ['PostPunk', 'ModernRock', 'VinylClub'],
    musicTag: {
      id: 'itunes-1737990072',
      title: 'Romance',
      artist: 'Fontaines D.C.',
      coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/4d/3a/76/4d3a7621-8b56-56a3-829f-545dde0b2b6a/191404143674.png/600x600bb.jpg',
      rating: 4.8,
      type: 'album'
    },
    replies: [
      {
        id: 'rep-3-1',
        userId: 'user-bima',
        userName: 'Bima Santoso',
        userHandle: 'bima_nada',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        content: "Vinyl pressing-nya juga bersih banget suaranya Ndra. Wajib koleksi rilisan fisik!",
        createdAt: '2j lalu',
        likes: 8,
        likedByMe: false
      }
    ]
  },
  {
    id: 'post-4',
    userId: 'user-citra',
    userName: 'Citra Lestari',
    userHandle: 'citralestari',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    content: "Bridge di lagu 'Nina' dari .Feast itu definisi masterclass songwriting emosional. Ada rekomendasi lagu lokal lain yang chord progression-nya se-melankolis ini? Pengen dengerin buat playlist malam. 🕯️🎼 #SkenaLokal #Rekomendasi #Feast",
    createdAt: '5j lalu',
    timestamp: Date.now() - 5 * 3600 * 1000,
    likes: 53,
    likedByMe: false,
    reposts: 5,
    repostedByMe: false,
    replyCount: 0,
    tags: ['SkenaLokal', 'Rekomendasi', 'Feast'],
    musicTag: {
      id: 'feast-nina',
      title: 'Nina - Single',
      artist: '.Feast',
      coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/f1/28/34/f12834cb-932f-cca6-58d7-3b5a790d83c2/cover.jpg/600x600bb.jpg',
      rating: 5.0,
      type: 'album'
    },
    replies: []
  }
];

export const PEELING_TANGERINE_EP: Album = {
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
      title: "Now You're Alright",
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

// Fictional community activity for the album detail demo.
export const DEMO_EP_REVIEWS: Review[] = [
  { name: 'Naya', handle: 'nayadengerin', rating: 5, track: 'Welcome Home', text: 'niatnya cuma denger satu lagu sebelum tidur, malah muter satu EP 4 kali 😭 welcome home tuh rasanya kayak dipeluk abis hari yang panjang.', tags: ['repeat-worthy', 'late-night'], likes: 128, time: '28 menit lalu', relisten: true },
  { name: 'Bagas', handle: 'bagasmutermusik', rating: 4.5, track: "Now You're Alright", text: 'opening-nya langsung bikin ngangguk wkwk. gitar sama vokalnya pas banget, ga ada yang maksa pengen paling depan. pendek tapi padet, suka.', tags: ['indie-lokal', 'headphones-only'], likes: 76, time: '1 jam lalu', relisten: false },
  { name: 'Caca', handle: 'cacapulangmalem', rating: 5, track: 'All-Nighter', text: 'all-nighter + jalan pulang malem + lampu kota = berasa jadi tokoh utama. padahal cuma pulang beli seblak 😭', tags: ['driving-alone', 'on-repeat'], likes: 203, time: '2 jam lalu', relisten: true },
  { name: 'Rafi', handle: 'rafisideb', rating: 3.5, track: "Goodman's Ballad", text: 'enak sih, cuma beberapa bagian masih agak mirip di kuping gue. goodman’s ballad paling nyangkut. kayaknya perlu denger lagi pas ga sambil ngerjain tugas.', tags: ['first-listen', 'indie-lokal'], likes: 24, time: '3 jam lalu', relisten: false },
  { name: 'Dinda', handle: 'dindabikinplaylist', rating: 4.5, track: 'Hey, Child', text: 'hey, child masuk playlist nyaman dulu ya. ga semua lagu harus bikin heboh, kadang yang kalem gini justru nemenin banget. EP-nya abis terlalu cepet 🥲', tags: ['comfort-music', 'melancholic'], likes: 91, time: '5 jam lalu', relisten: false },
  { name: 'Adit', handle: 'aditbukanreviewer', rating: 4, track: 'Welcome Home', text: 'nemu dari rekomendasi temen, ternyata cocok juga. welcome home favorit sejauh ini. bukan tipe yang langsung wah, tapi makin diputer makin kerasa enaknya.', tags: ['slow-burn', 'repeat-worthy'], likes: 42, time: 'Kemarin', relisten: true }
].map((item, index) => ({
  id: `demo-pt-review-${index + 1}`,
  isDemo: true,
  albumId: PEELING_TANGERINE_EP.id,
  albumTitle: PEELING_TANGERINE_EP.title,
  albumCover: PEELING_TANGERINE_EP.coverUrl,
  artist: PEELING_TANGERINE_EP.artist,
  userId: `demo-user-${item.handle}`,
  userName: item.name,
  userHandle: item.handle,
  userAvatar: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" rx="40" fill="${['#584778', '#365950', '#79515e', '#4c627b', '#80653e', '#535e44'][index]}"/><text x="40" y="49" text-anchor="middle" font-family="sans-serif" font-size="30" fill="white">${item.name[0]}</text></svg>`)}`,
  rating: item.rating,
  reviewText: item.text,
  favoriteTrackTitle: item.track,
  tags: item.tags,
  dateListened: '2026-09-30',
  createdAt: item.time,
  likes: item.likes,
  likedByMe: false,
  isRelisten: item.relisten,
  isIndonesian: true,
  comments: []
}));

export const INITIAL_INDONESIAN_ALBUMS: Album[] = [
  PEELING_TANGERINE_EP,
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
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/9c/9f/80/9c9f80d1-cb53-db64-9bca-03f06cd1000c/24UMGIM57224.rgb.jpg/600x600bb.jpg',
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
    id: 'feast-nina',
    title: 'Nina - Single',
    artist: '.Feast',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/f1/28/34/f12834cb-932f-cca6-58d7-3b5a790d83c2/cover.jpg/600x600bb.jpg',
    releaseYear: 2024,
    releaseDate: '2024-07-05T00:00:00Z',
    isIndonesian: true,
    origin: 'Indonesia',
    trackCount: 1,
    albumType: 'single',
    genres: ['Indie Rock', 'Indonesian Indie'],
    averageRating: 5.0,
    totalRatings: 180,
    totalReviews: 38,
    tracklist: [
      {
        id: 'track-feast-nina',
        title: 'Nina',
        artist: '.Feast',
        albumTitle: 'Nina - Single',
        albumId: 'feast-nina',
        durationMs: 278000,
        trackNumber: 1,
        averageRating: 5.0,
        isIndonesian: true
      }
    ]
  }
];

export const NOVA_SAINT_ALBUM: Album = {
  id: 'nova-after-hours',
  title: 'After Hours',
  artist: 'Nova Saint',
  coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&auto=format&fit=crop&q=80',
  releaseYear: 2025,
  releaseDate: '2025-02-14T00:00:00Z',
  isIndonesian: false,
  origin: 'International',
  trackCount: 12,
  albumType: 'album',
  genres: ['Electronic', 'Alt-Pop', 'Night Drive'],
  averageRating: 4.7,
  totalRatings: 1284,
  totalReviews: 64,
  tracklist: [
    {
      id: 'nova-tr-1',
      title: 'Neon Weather',
      artist: 'Nova Saint',
      albumTitle: 'After Hours',
      albumId: 'nova-after-hours',
      durationMs: 222000,
      trackNumber: 1,
      averageRating: 4.55
    },
    {
      id: 'nova-tr-2',
      title: 'Glasshouse',
      artist: 'Nova Saint',
      albumTitle: 'After Hours',
      albumId: 'nova-after-hours',
      durationMs: 248000,
      trackNumber: 2,
      averageRating: 4.9
    },
    {
      id: 'nova-tr-3',
      title: 'Porcelain Sky',
      artist: 'Nova Saint',
      albumTitle: 'After Hours',
      albumId: 'nova-after-hours',
      durationMs: 215000,
      trackNumber: 3,
      averageRating: 4.75
    },
    {
      id: 'nova-tr-4',
      title: 'Mercury',
      artist: 'Nova Saint',
      albumTitle: 'After Hours',
      albumId: 'nova-after-hours',
      durationMs: 198000,
      trackNumber: 4,
      averageRating: 4.45
    }
  ]
};

export const NOVA_SILVER_LINING_ALBUM: Album = {
  id: 'nova-silver-lining',
  title: 'Silver Lining',
  artist: 'Nova Saint',
  coverUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=80',
  releaseYear: 2023,
  releaseDate: '2023-05-18T00:00:00Z',
  isIndonesian: false,
  origin: 'International',
  trackCount: 10,
  albumType: 'album',
  genres: ['Indie', 'Synth-Pop'],
  averageRating: 4.4,
  totalRatings: 840,
  totalReviews: 42,
  tracklist: [
    {
      id: 'nova-sl-1',
      title: 'Porcelain Sky',
      artist: 'Nova Saint',
      albumTitle: 'Silver Lining',
      albumId: 'nova-silver-lining',
      durationMs: 215000,
      trackNumber: 1,
      averageRating: 4.75
    }
  ]
};

export const NOVA_STATIC_BLOOM_ALBUM: Album = {
  id: 'nova-static-bloom',
  title: 'Static Bloom',
  artist: 'Nova Saint',
  coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
  releaseYear: 2021,
  releaseDate: '2021-10-12T00:00:00Z',
  isIndonesian: false,
  origin: 'International',
  trackCount: 9,
  albumType: 'album',
  genres: ['Electronic', 'Ambient Pop'],
  averageRating: 4.45,
  totalRatings: 610,
  totalReviews: 29,
  tracklist: [
    {
      id: 'nova-sb-1',
      title: 'Mercury',
      artist: 'Nova Saint',
      albumTitle: 'Static Bloom',
      albumId: 'nova-static-bloom',
      durationMs: 198000,
      trackNumber: 1,
      averageRating: 4.45
    }
  ]
};

export const SOL_ARC_HEATWAVE_ALBUM: Album = {
  id: 'sol-arc-heatwave',
  title: 'HEATWAVE',
  artist: 'Sol Arc',
  coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
  releaseYear: 2024,
  releaseDate: '2024-07-19T00:00:00Z',
  isIndonesian: false,
  origin: 'International',
  trackCount: 10,
  albumType: 'album',
  genres: ['Hip-Hop', 'Electronic'],
  averageRating: 4.6,
  totalRatings: 1140,
  totalReviews: 82,
  tracklist: []
};

export const VELA_NIGHT_SWIM_ALBUM: Album = {
  id: 'vela-night-swim',
  title: 'Night Swim',
  artist: 'Vela',
  coverUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=80',
  releaseYear: 2023,
  releaseDate: '2023-08-11T00:00:00Z',
  isIndonesian: false,
  origin: 'International',
  trackCount: 8,
  albumType: 'album',
  genres: ['Indie', 'Alternative'],
  averageRating: 4.35,
  totalRatings: 860,
  totalReviews: 44,
  tracklist: []
};

export const INITIAL_GLOBAL_ALBUMS: Album[] = [
  NOVA_SAINT_ALBUM,
  SOL_ARC_HEATWAVE_ALBUM,
  VELA_NIGHT_SWIM_ALBUM,
  NOVA_SILVER_LINING_ALBUM,
  NOVA_STATIC_BLOOM_ALBUM,
  {
    id: 'itunes-1793702595',
    title: 'Hurry Up Tomorrow',
    artist: 'The Weeknd',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/13/fd/a3/13fda38d-fc63-ddc3-1cf2-c09251adc532/25UMGIM09489.rgb.jpg/600x600bb.jpg',
    releaseYear: 2025,
    releaseDate: '2025-01-31T08:00:00Z',
    isIndonesian: false,
    origin: 'International',
    trackCount: 22,
    albumType: 'album',
    genres: ['R&B/Soul', 'Pop'],
    averageRating: 4.8,
    totalRatings: 1250,
    totalReviews: 180,
    tracklist: []
  },
  {
    id: 'itunes-1781316864',
    title: 'GNX',
    artist: 'Kendrick Lamar',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/54/28/14/54281424-eece-0935-299d-fdd2ab403f92/24UM1IM28978.rgb.jpg/600x600bb.jpg',
    releaseYear: 2024,
    releaseDate: '2024-11-22T08:00:00Z',
    isIndonesian: false,
    origin: 'International',
    trackCount: 12,
    albumType: 'album',
    genres: ['Hip-Hop/Rap'],
    averageRating: 4.9,
    totalRatings: 1840,
    totalReviews: 310,
    tracklist: []
  },
  {
    id: 'itunes-1739079974',
    title: 'BRAT',
    artist: 'Charli xcx',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/88/4e/63/884e6321-ad41-aab1-f6f0-20efcafcfd55/075679666130.jpg/600x600bb.jpg',
    releaseYear: 2024,
    releaseDate: '2024-06-07T07:00:00Z',
    isIndonesian: false,
    origin: 'International',
    trackCount: 15,
    albumType: 'album',
    genres: ['Electronic', 'Pop'],
    averageRating: 4.9,
    totalRatings: 2100,
    totalReviews: 420,
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
    totalRatings: 1420,
    totalReviews: 240,
    tracklist: []
  },
  {
    id: 'itunes-1768728131',
    title: 'Songs Of A Lost World',
    artist: 'The Cure',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/5b/25/d9/5b25d98e-3734-a7fd-c198-69ffd088d10f/24UMGIM94240.rgb.jpg/600x600bb.jpg',
    releaseYear: 2024,
    releaseDate: '2024-11-01T07:00:00Z',
    isIndonesian: false,
    origin: 'International',
    trackCount: 8,
    albumType: 'album',
    genres: ['Alternative', 'Goth Rock'],
    averageRating: 4.9,
    totalRatings: 890,
    totalReviews: 175,
    tracklist: []
  },
  {
    id: 'itunes-1737990072',
    title: 'Romance',
    artist: 'Fontaines D.C.',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/4d/3a/76/4d3a7621-8b56-56a3-829f-545dde0b2b6a/191404143674.png/600x600bb.jpg',
    releaseYear: 2024,
    releaseDate: '2024-08-23T07:00:00Z',
    isIndonesian: false,
    origin: 'International',
    trackCount: 11,
    albumType: 'album',
    genres: ['Alternative', 'Post-Punk'],
    averageRating: 4.8,
    totalRatings: 960,
    totalReviews: 145,
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
    totalRatings: 1840,
    totalReviews: 320,
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
    totalRatings: 1120,
    totalReviews: 160,
    tracklist: []
  },
  {
    id: 'itunes-1146195596',
    title: 'Blonde',
    artist: 'Frank Ocean',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/bb/45/68/bb4568f3-68cd-619d-fbcb-4e179916545d/BlondCover-Final.jpg/600x600bb.jpg',
    releaseYear: 2016,
    releaseDate: '2016-08-20T07:00:00Z',
    isIndonesian: false,
    origin: 'International',
    trackCount: 17,
    albumType: 'album',
    genres: ['Pop', 'R&B/Soul'],
    averageRating: 5.0,
    totalRatings: 3400,
    totalReviews: 610,
    tracklist: []
  },
  {
    id: 'itunes-1109714933',
    title: 'In Rainbows',
    artist: 'Radiohead',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/dd/50/c7/dd50c790-99ac-d3d0-5ab8-e3891fb8fd52/634904032463.png/600x600bb.jpg',
    releaseYear: 2007,
    releaseDate: '2007-10-10T07:00:00Z',
    isIndonesian: false,
    origin: 'International',
    trackCount: 10,
    albumType: 'album',
    genres: ['Alternative Rock'],
    averageRating: 5.0,
    totalRatings: 2800,
    totalReviews: 480,
    tracklist: []
  }
];

export const INITIAL_ALBUMS: Album[] = [...INITIAL_INDONESIAN_ALBUMS, ...INITIAL_GLOBAL_ALBUMS];

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
  ALBUMS: 'groovy_live_albums_v4',
  REVIEWS: 'groovy_reviews_v4',
  SCROBBLES: 'groovy_scrobbles_v3',
  USERS: 'groovy_users_v3',
  CURRENT_USER: 'groovy_current_user_v3',
  PROFILE_DEFAULTS_VERSION: 'groovy_profile_defaults_v3',
  TRACK_RATINGS: 'groovy_track_ratings_v1',
  PLAYLISTS: 'groovy_playlists_v3',
  FAVORITE_ALBUMS: 'groovy_favorite_albums_v3',
  FAVORITE_TRACKS: 'groovy_favorite_tracks_v3',
  FOLLOWED_ARTISTS: 'groovy_followed_artists_v1',
  COMMUNITY_POSTS: 'groovy_community_posts_v1',
  FRESH_ACCOUNT_INIT: 'groovy_fresh_account_flag_v5'
};

export const storageService = {
  getTrackRatings(): Record<string, number> {
    const raw = localStorage.getItem(KEYS.TRACK_RATINGS);
    return raw ? JSON.parse(raw) : {};
  },

  saveTrackRating(trackId: string, rating: number): void {
    const ratings = this.getTrackRatings();
    if (rating <= 0) {
      delete ratings[trackId];
    } else {
      ratings[trackId] = Math.min(5, Math.max(0, rating));
    }
    localStorage.setItem(KEYS.TRACK_RATINGS, JSON.stringify(ratings));
  },
  getAlbums(): Album[] {
    const raw = localStorage.getItem(KEYS.ALBUMS);
    let albums: Album[] = raw ? JSON.parse(raw) : [...INITIAL_ALBUMS];
    const albumMap = new Map(albums.map(a => [a.id, a]));
    for (const initAlbum of INITIAL_ALBUMS) {
      if (!albumMap.has(initAlbum.id)) {
        albumMap.set(initAlbum.id, initAlbum);
      } else {
        const existing = albumMap.get(initAlbum.id)!;
        existing.isIndonesian = initAlbum.isIndonesian;
        existing.origin = initAlbum.origin;
        if ((!existing.tracklist || existing.tracklist.length === 0) && initAlbum.tracklist && initAlbum.tracklist.length > 0) {
          existing.tracklist = initAlbum.tracklist;
        }
      }
    }
    albums = Array.from(albumMap.values());
    if (!albums.some(a => a.id === PEELING_TANGERINE_EP.id)) {
      albums = [PEELING_TANGERINE_EP, ...albums];
    }
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
    if (id === PEELING_TANGERINE_EP.id || id === 'itunes-6786807440') {
      const stored = this.getAlbums().find(a => a.id === PEELING_TANGERINE_EP.id);
      return stored && stored.tracklist && stored.tracklist.length > 0 ? stored : PEELING_TANGERINE_EP;
    }
    const fromStorage = this.getAlbums().find(a => a.id === id);
    if (fromStorage) return fromStorage;
    return INITIAL_ALBUMS.find(a => a.id === id);
  },

  getReviews(): Review[] {
    const raw = localStorage.getItem(KEYS.REVIEWS);
    const reviews: Review[] = raw ? JSON.parse(raw) : [...INITIAL_REVIEWS];
    const existingIds = new Set(reviews.map(review => review.id));
    const missingDemos = DEMO_EP_REVIEWS.filter(review => !existingIds.has(review.id));
    const missingInitials = INITIAL_REVIEWS.filter(review => !existingIds.has(review.id));

    // Auto-heal any stale mzstatic image hashes in stored reviews
    let updatedUrls = false;
    reviews.forEach(r => {
      if (r.albumCover && r.albumCover.includes('059a5971-da5f-5182-e565-d41c9bfae348')) {
        r.albumCover = 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/9c/9f/80/9c9f80d1-cb53-db64-9bca-03f06cd1000c/24UMGIM57224.rgb.jpg/600x600bb.jpg';
        updatedUrls = true;
      }
      if (r.albumCover && r.albumCover.includes('21f4cadc-9694-a953-eb89-397a6104c8f5')) {
        r.albumCover = 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/fa/a8/4c/faa84c4f-0f09-3730-6460-8c53e9dc159d/cover.jpg/600x600bb.jpg';
        updatedUrls = true;
      }
      if (r.albumId === 'feast-nina' || (r.albumCover && r.albumCover.includes('a4bcf1b5-31d7-2f64-d621-36ba595462cf'))) {
        r.albumCover = 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/f1/28/34/f12834cb-932f-cca6-58d7-3b5a790d83c2/cover.jpg/600x600bb.jpg';
        updatedUrls = true;
      }
    });

    if (!raw || missingDemos.length > 0 || missingInitials.length > 0 || updatedUrls) {
      if (missingDemos.length > 0 || missingInitials.length > 0) {
        reviews.push(...missingDemos, ...missingInitials);
      }
      localStorage.setItem(KEYS.REVIEWS, JSON.stringify(reviews));
    }
    return reviews;
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

  deleteReview(reviewId: string): void {
    const reviews = this.getReviews();
    const target = reviews.find(r => r.id === reviewId);
    const updated = reviews.filter(r => r.id !== reviewId);
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify(updated));

    if (target) {
      const album = this.getAlbumById(target.albumId);
      if (album) {
        const remaining = updated.filter(r => r.albumId === album.id);
        album.totalReviews = remaining.length;
        if (remaining.length > 0) {
          const sumRatings = remaining.reduce((sum, r) => sum + r.rating, 0);
          album.averageRating = Number((sumRatings / remaining.length).toFixed(1));
        }
        this.saveAlbum(album);
      }
    }
  },

  initializeFreshAccount(): void {
    if (localStorage.getItem(KEYS.FRESH_ACCOUNT_INIT) !== 'v5') {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(CURRENT_USER));
      localStorage.setItem(KEYS.SCROBBLES, JSON.stringify([]));
      localStorage.setItem(KEYS.PLAYLISTS, JSON.stringify([]));
      localStorage.setItem(KEYS.FAVORITE_ALBUMS, JSON.stringify([]));
      localStorage.setItem(KEYS.FAVORITE_TRACKS, JSON.stringify([]));

      const rawReviews = localStorage.getItem(KEYS.REVIEWS);
      if (rawReviews) {
        try {
          const parsedReviews: Review[] = JSON.parse(rawReviews);
          const communityOnly = parsedReviews.filter(r => r.userId !== 'user-me');
          localStorage.setItem(KEYS.REVIEWS, JSON.stringify(communityOnly));
        } catch {
          localStorage.removeItem(KEYS.REVIEWS);
        }
      }
      localStorage.setItem(KEYS.FRESH_ACCOUNT_INIT, 'v5');
    }
  },

  getScrobbles(): Scrobble[] {
    this.initializeFreshAccount();
    const raw = localStorage.getItem(KEYS.SCROBBLES);
    let scrobbles: Scrobble[] = raw ? JSON.parse(raw) : [];

    // Auto-heal any stale mzstatic image hashes in stored scrobbles
    let updatedUrls = false;
    scrobbles = scrobbles.map(s => {
      if (s.albumCover && s.albumCover.includes('059a5971-da5f-5182-e565-d41c9bfae348')) {
        updatedUrls = true;
        return {
          ...s,
          albumCover: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/9c/9f/80/9c9f80d1-cb53-db64-9bca-03f06cd1000c/24UMGIM57224.rgb.jpg/600x600bb.jpg'
        };
      }
      if (s.albumCover && s.albumCover.includes('21f4cadc-9694-a953-eb89-397a6104c8f5')) {
        updatedUrls = true;
        return {
          ...s,
          albumCover: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/fa/a8/4c/faa84c4f-0f09-3730-6460-8c53e9dc159d/cover.jpg/600x600bb.jpg'
        };
      }
      return s;
    });

    if (updatedUrls) {
      localStorage.setItem(KEYS.SCROBBLES, JSON.stringify(scrobbles));
    }
    return scrobbles;
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
    this.initializeFreshAccount();
    const raw = localStorage.getItem(KEYS.CURRENT_USER);
    const parsed: User = raw ? JSON.parse(raw) : { ...CURRENT_USER };
    if (!parsed.displayName) {
      parsed.displayName = CURRENT_USER.displayName;
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
  },

  // Playlists Management
  getPlaylists(): Playlist[] {
    this.initializeFreshAccount();
    const raw = localStorage.getItem(KEYS.PLAYLISTS);
    return raw ? JSON.parse(raw) : [];
  },

  getPlaylistById(id: string): Playlist | undefined {
    return this.getPlaylists().find(p => p.id === id);
  },

  savePlaylists(playlists: Playlist[]): void {
    localStorage.setItem(KEYS.PLAYLISTS, JSON.stringify(playlists));
  },

  createPlaylist(title: string, description?: string): Playlist {
    const playlists = this.getPlaylists();
    const newPlaylist: Playlist = {
      id: 'pl-' + Date.now(),
      title: title.trim() || 'Playlist Baru',
      description: description?.trim() || '',
      coverUrl: '',
      tracks: [],
      createdAt: 'Baru saja',
      updatedAt: 'Baru saja'
    };
    playlists.unshift(newPlaylist);
    this.savePlaylists(playlists);
    return newPlaylist;
  },

  deletePlaylist(playlistId: string): void {
    const playlists = this.getPlaylists().filter(p => p.id !== playlistId);
    this.savePlaylists(playlists);
  },

  addTrackToPlaylist(playlistId: string, track: Track, albumCover?: string): boolean {
    const playlists = this.getPlaylists();
    const pl = playlists.find(p => p.id === playlistId);
    if (!pl) return false;

    if (pl.tracks.some(t => t.id === track.id)) {
      return false; // Already in playlist
    }

    const trackToAdd: Track = {
      ...track,
      albumId: track.albumId || '',
      albumTitle: track.albumTitle || ''
    };
    pl.tracks.push(trackToAdd);
    if (!pl.coverUrl && albumCover) {
      pl.coverUrl = albumCover;
    }
    pl.updatedAt = 'Baru saja';
    this.savePlaylists(playlists);
    return true;
  },

  removeTrackFromPlaylist(playlistId: string, trackId: string): void {
    const playlists = this.getPlaylists();
    const pl = playlists.find(p => p.id === playlistId);
    if (!pl) return;
    pl.tracks = pl.tracks.filter(t => t.id !== trackId);
    if (pl.tracks.length === 0) {
      pl.coverUrl = '';
    }
    pl.updatedAt = 'Baru saja';
    this.savePlaylists(playlists);
  },

  addAlbumToPlaylist(playlistId: string, album: Album): number {
    const playlists = this.getPlaylists();
    const pl = playlists.find(p => p.id === playlistId);
    if (!pl) return 0;

    let addedCount = 0;
    const tracks = album.tracklist || [];
    tracks.forEach(tr => {
      if (!pl.tracks.some(t => t.id === tr.id)) {
        pl.tracks.push({
          ...tr,
          albumId: album.id,
          albumTitle: album.title
        });
        addedCount++;
      }
    });

    if (!pl.coverUrl && album.coverUrl) {
      pl.coverUrl = album.coverUrl;
    }
    pl.updatedAt = 'Baru saja';
    this.savePlaylists(playlists);
    return addedCount;
  },

  // Favorites Management
  getFavoriteAlbumIds(): string[] {
    this.initializeFreshAccount();
    const raw = localStorage.getItem(KEYS.FAVORITE_ALBUMS);
    return raw ? JSON.parse(raw) : [];
  },

  toggleFavoriteAlbum(albumId: string): boolean {
    const favorites = this.getFavoriteAlbumIds();
    const idx = favorites.indexOf(albumId);
    let isFav = false;
    if (idx >= 0) {
      favorites.splice(idx, 1);
      isFav = false;
    } else {
      favorites.unshift(albumId);
      isFav = true;
    }
    localStorage.setItem(KEYS.FAVORITE_ALBUMS, JSON.stringify(favorites));
    return isFav;
  },

  isFavoriteAlbum(albumId: string): boolean {
    return this.getFavoriteAlbumIds().includes(albumId);
  },

  getFavoriteTrackIds(): string[] {
    this.initializeFreshAccount();
    const raw = localStorage.getItem(KEYS.FAVORITE_TRACKS);
    return raw ? JSON.parse(raw) : [];
  },

  toggleFavoriteTrack(trackId: string): boolean {
    const favorites = this.getFavoriteTrackIds();
    const idx = favorites.indexOf(trackId);
    let isFav = false;
    if (idx >= 0) {
      favorites.splice(idx, 1);
      isFav = false;
    } else {
      favorites.unshift(trackId);
      isFav = true;
    }
    localStorage.setItem(KEYS.FAVORITE_TRACKS, JSON.stringify(favorites));
    return isFav;
  },

  isFavoriteTrack(trackId: string): boolean {
    return this.getFavoriteTrackIds().includes(trackId);
  },

  // Followed Artists Management
  getFollowedArtists(): string[] {
    const raw = localStorage.getItem(KEYS.FOLLOWED_ARTISTS);
    return raw ? JSON.parse(raw) : [];
  },

  isFollowingArtist(artistName: string): boolean {
    const list = this.getFollowedArtists();
    return list.some(a => a.toLowerCase() === artistName.toLowerCase());
  },

  toggleFollowArtist(artistName: string): boolean {
    const list = this.getFollowedArtists();
    const idx = list.findIndex(a => a.toLowerCase() === artistName.toLowerCase());
    let isFollowed = false;
    if (idx >= 0) {
      list.splice(idx, 1);
      isFollowed = false;
    } else {
      list.unshift(artistName);
      isFollowed = true;
    }
    localStorage.setItem(KEYS.FOLLOWED_ARTISTS, JSON.stringify(list));
    return isFollowed;
  },

  // Community / Threads Management
  getCommunityPosts(): CommunityPost[] {
    const raw = localStorage.getItem(KEYS.COMMUNITY_POSTS);
    if (!raw) {
      localStorage.setItem(KEYS.COMMUNITY_POSTS, JSON.stringify(INITIAL_COMMUNITY_POSTS));
      return INITIAL_COMMUNITY_POSTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_COMMUNITY_POSTS;
    }
  },

  saveCommunityPost(post: CommunityPost): CommunityPost {
    const posts = this.getCommunityPosts();
    posts.unshift(post);
    localStorage.setItem(KEYS.COMMUNITY_POSTS, JSON.stringify(posts));
    return post;
  },

  toggleLikeCommunityPost(postId: string): CommunityPost[] {
    const posts = this.getCommunityPosts().map(p => {
      if (p.id === postId) {
        const isLiked = !p.likedByMe;
        return {
          ...p,
          likedByMe: isLiked,
          likes: isLiked ? p.likes + 1 : Math.max(0, p.likes - 1)
        };
      }
      return p;
    });
    localStorage.setItem(KEYS.COMMUNITY_POSTS, JSON.stringify(posts));
    return posts;
  },

  toggleRepostCommunityPost(postId: string): CommunityPost[] {
    const posts = this.getCommunityPosts().map(p => {
      if (p.id === postId) {
        const isReposted = !p.repostedByMe;
        return {
          ...p,
          repostedByMe: isReposted,
          reposts: isReposted ? p.reposts + 1 : Math.max(0, p.reposts - 1)
        };
      }
      return p;
    });
    localStorage.setItem(KEYS.COMMUNITY_POSTS, JSON.stringify(posts));
    return posts;
  },

  addReplyToCommunityPost(postId: string, text: string, user: User): CommunityPost | undefined {
    const posts = this.getCommunityPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
      const newReply: CommunityReply = {
        id: 'reply-' + Date.now(),
        userId: user.id,
        userName: user.displayName,
        userHandle: user.username,
        userAvatar: user.avatarUrl,
        content: text.trim(),
        createdAt: 'Baru saja',
        likes: 0,
        likedByMe: false
      };
      post.replies = [newReply, ...(post.replies || [])];
      post.replyCount = post.replies.length;
      localStorage.setItem(KEYS.COMMUNITY_POSTS, JSON.stringify(posts));
      return post;
    }
    return undefined;
  }
};
