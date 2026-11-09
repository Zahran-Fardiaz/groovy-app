// ============================================================================
// globalArtists.ts — Verified International Artists Registry & Classification
// Operates symmetrically to indonesianArtists.ts: provides Apple Music artist IDs
// for dynamic live catalog ingestion from the US storefront.
// ============================================================================

export interface GlobalArtist {
  id: string;
  name: string;
  normalizedName: string;
  genre: string;
  country: string;
  appleMusicId: number;
  tags: string[];
}

export const GLOBAL_ARTISTS_DATABASE: GlobalArtist[] = [
  {
    id: 'nova-saint',
    name: 'Nova Saint',
    normalizedName: 'nova saint',
    genre: 'Alt-Pop / Electronic',
    country: 'JP',
    appleMusicId: 99999901,
    tags: ['alt-pop', 'electronic', 'tokyo', 'night drive', 'after hours']
  },
  {
    id: 'kendrick-lamar',
    name: 'Kendrick Lamar',
    normalizedName: 'kendrick lamar',
    genre: 'Hip-Hop/Rap',
    country: 'US',
    appleMusicId: 368183298,
    tags: ['hip-hop', 'rap', 'west coast', 'pulitzer']
  },
  {
    id: 'charli-xcx',
    name: 'Charli xcx',
    normalizedName: 'charli xcx',
    genre: 'Pop / Electronic',
    country: 'GB',
    appleMusicId: 432942256,
    tags: ['hyperpop', 'electronic', 'club', 'dance pop']
  },
  {
    id: 'the-weeknd',
    name: 'The Weeknd',
    normalizedName: 'the weeknd',
    genre: 'R&B/Soul / Pop',
    country: 'CA',
    appleMusicId: 479756766,
    tags: ['r&b', 'synthwave', 'pop', 'contemporary r&b']
  },
  {
    id: 'tyler-the-creator',
    name: 'Tyler, The Creator',
    normalizedName: 'tyler the creator',
    genre: 'Hip-Hop/Rap / Alternative',
    country: 'US',
    appleMusicId: 420368335,
    tags: ['alternative hip hop', 'rap', 'neo soul']
  },
  {
    id: 'the-cure',
    name: 'The Cure',
    normalizedName: 'the cure',
    genre: 'Alternative / Gothic Rock',
    country: 'GB',
    appleMusicId: 566519,
    tags: ['post-punk', 'goth rock', 'new wave', 'legend']
  },
  {
    id: 'fontaines-dc',
    name: 'Fontaines D.C.',
    normalizedName: 'fontaines dc',
    genre: 'Alternative / Post-Punk',
    country: 'IE',
    appleMusicId: 1341828470,
    tags: ['post-punk', 'indie rock', 'irish rock']
  },
  {
    id: 'magdalena-bay',
    name: 'Magdalena Bay',
    normalizedName: 'magdalena bay',
    genre: 'Indie Pop / Synthpop',
    country: 'US',
    appleMusicId: 1119954914,
    tags: ['synthpop', 'indie pop', 'dream pop', 'electronic']
  },
  {
    id: 'billie-eilish',
    name: 'Billie Eilish',
    normalizedName: 'billie eilish',
    genre: 'Alternative / Pop',
    country: 'US',
    appleMusicId: 1065981054,
    tags: ['alt-pop', 'electropop', 'indie pop']
  },
  {
    id: 'sabrina-carpenter',
    name: 'Sabrina Carpenter',
    normalizedName: 'sabrina carpenter',
    genre: 'Pop',
    country: 'US',
    appleMusicId: 390647681,
    tags: ['pop', 'dance-pop', 'teen pop']
  },
  {
    id: 'chappell-roan',
    name: 'Chappell Roan',
    normalizedName: 'chappell roan',
    genre: 'Pop / Synthpop',
    country: 'US',
    appleMusicId: 1264818718,
    tags: ['synthpop', 'camp', 'indie pop', 'glam']
  },
  {
    id: 'frank-ocean',
    name: 'Frank Ocean',
    normalizedName: 'frank ocean',
    genre: 'R&B / Soul',
    country: 'US',
    appleMusicId: 442122051,
    tags: ['neo soul', 'r&b', 'indie r&b', 'masterpiece']
  },
  {
    id: 'radiohead',
    name: 'Radiohead',
    normalizedName: 'radiohead',
    genre: 'Alternative / Art Rock',
    country: 'GB',
    appleMusicId: 657515,
    tags: ['art rock', 'alternative', 'experimental rock', 'legend']
  },
  {
    id: 'clairo',
    name: 'Clairo',
    normalizedName: 'clairo',
    genre: 'Alternative / Bedroom Pop',
    country: 'US',
    appleMusicId: 1187613837,
    tags: ['bedroom pop', 'indie pop', 'soft rock']
  },
  {
    id: 'arctic-monkeys',
    name: 'Arctic Monkeys',
    normalizedName: 'arctic monkeys',
    genre: 'Alternative / Indie Rock',
    country: 'GB',
    appleMusicId: 62820413,
    tags: ['indie rock', 'garage rock', 'post-punk revival']
  },
  {
    id: 'phoebe-bridgers',
    name: 'Phoebe Bridgers',
    normalizedName: 'phoebe bridgers',
    genre: 'Alternative / Indie Folk',
    country: 'US',
    appleMusicId: 697833299,
    tags: ['indie folk', 'indie rock', 'boygenius']
  },
  {
    id: 'dua-lipa',
    name: 'Dua Lipa',
    normalizedName: 'dua lipa',
    genre: 'Pop / Dance',
    country: 'GB',
    appleMusicId: 1031397873,
    tags: ['disco', 'pop', 'dance-pop', 'nudisco']
  },
  {
    id: 'sza',
    name: 'SZA',
    normalizedName: 'sza',
    genre: 'R&B/Soul',
    country: 'US',
    appleMusicId: 605800394,
    tags: ['contemporary r&b', 'neo soul', 'hip hop']
  },
  {
    id: 'taylor-swift',
    name: 'Taylor Swift',
    normalizedName: 'taylor swift',
    genre: 'Pop',
    country: 'US',
    appleMusicId: 159260351,
    tags: ['pop', 'folk pop', 'synth-pop', 'singer-songwriter']
  },
  {
    id: 'olivia-rodrigo',
    name: 'Olivia Rodrigo',
    normalizedName: 'olivia rodrigo',
    genre: 'Pop / Pop Punk',
    country: 'US',
    appleMusicId: 979458609,
    tags: ['pop rock', 'pop punk', 'alt-pop']
  },
  {
    id: 'vampire-weekend',
    name: 'Vampire Weekend',
    normalizedName: 'vampire weekend',
    genre: 'Alternative / Indie Rock',
    country: 'US',
    appleMusicId: 259437105,
    tags: ['indie pop', 'art pop', 'baroque pop']
  },
  {
    id: 'mitski',
    name: 'Mitski',
    normalizedName: 'mitski',
    genre: 'Alternative / Indie Rock',
    country: 'US',
    appleMusicId: 497546276,
    tags: ['art pop', 'indie rock', 'baroque pop']
  },
  {
    id: 'lana-del-rey',
    name: 'Lana Del Rey',
    normalizedName: 'lana del rey',
    genre: 'Alternative / Baroque Pop',
    country: 'US',
    appleMusicId: 464296584,
    tags: ['cinematic', 'baroque pop', 'sadcore', 'dream pop']
  }
];

export const GLOBAL_DISCOVERY_QUERIES: string[] = [
  'indie rock',
  'alternative pop',
  'post punk',
  'hip hop',
  'modern rock'
];

export function normalizeGlobalText(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Robust integer lookup by Apple Music Artist ID
 */
export function getGlobalArtistByAppleId(appleMusicId: number): GlobalArtist | undefined {
  if (!appleMusicId) return undefined;
  return GLOBAL_ARTISTS_DATABASE.find((a) => a.appleMusicId === appleMusicId);
}

/**
 * Check if an artist name belongs to the global verified artists database
 */
export function matchGlobalArtist(artistName: string): {
  isGlobal: boolean;
  matchedArtist?: GlobalArtist;
} {
  if (!artistName) return { isGlobal: false };
  const normInput = normalizeGlobalText(artistName);

  for (const artist of GLOBAL_ARTISTS_DATABASE) {
    const normName = normalizeGlobalText(artist.name);
    if (normInput === normName || normInput.includes(normName) || normName.includes(normInput)) {
      return { isGlobal: true, matchedArtist: artist };
    }
  }

  return { isGlobal: false };
}
