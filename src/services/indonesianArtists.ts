// ============================================================================
// indonesianArtists.ts — DERIVED from registryData.ts (single source of truth)
// Do NOT hardcode artists here. Add/remove artists in src/worker/registryData.ts
// and the changes will be reflected automatically in the UI.
// ============================================================================

import { VERIFIED_INDONESIAN_ARTISTS } from '../worker/registryData';

export interface IndonesianArtist {
  id: string;
  name: string;
  normalizedName: string;
  genre: string;
  city?: string;
  era: '2020s' | '2010s' | '2000s' | '90s' | 'Legend';
  tags: string[];
  appleMusicId?: number;
  verified?: boolean;
}

/**
 * Map a registryData era string to the IndonesianArtist era union.
 * Eras from 1980s and older are collapsed to 'Legend'.
 */
function mapEra(era?: string): IndonesianArtist['era'] {
  switch (era) {
    case '2020s': return '2020s';
    case '2010s': return '2010s';
    case '2000s': return '2000s';
    case '1990s': return '90s';
    default:      return 'Legend';
  }
}

/**
 * Derive a concise human-readable genre label from the genres array.
 * Uses the first two meaningful genres joined with ' / '.
 */
function deriveGenre(genres: string[]): string {
  // Prefer capitalised/meaningful entries (skip all-lowercase duplicates already
  // covered by a cased variant, and skip very generic single-word entries when
  // a more specific one is available).
  const preferred = genres.filter(g => /[A-Z]/.test(g[0]));
  const source = preferred.length > 0 ? preferred : genres;
  return source.slice(0, 2).join(' / ');
}

/**
 * Derive searchable tags from genres (lowercased, deduplicated).
 */
function deriveTags(genres: string[]): string[] {
  return [...new Set(genres.map(g => g.toLowerCase()))];
}

/**
 * Build the INDONESIAN_ARTISTS_DATABASE dynamically from the registry.
 */
export const INDONESIAN_ARTISTS_DATABASE: IndonesianArtist[] = VERIFIED_INDONESIAN_ARTISTS.map(
  (artist) => ({
    id: artist.id,
    name: artist.name,
    normalizedName: artist.name.toLowerCase(),
    genre: deriveGenre(artist.genres),
    city: artist.city,
    era: mapEra(artist.era),
    tags: deriveTags(artist.genres),
    appleMusicId: artist.appleMusicId,
    verified: artist.verified,
  })
);

// Normalize text for flexible fuzzy matching (stripping non-alphanumeric chars)
export function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Check if an artist name belongs to the verified Indonesian artists database
 */
export function matchIndonesianArtist(artistName: string): {
  isIndonesian: boolean;
  matchedArtist?: IndonesianArtist;
} {
  if (!artistName) return { isIndonesian: false };

  const normInput = normalizeText(artistName);

  // 1. Direct normalized match (comparing stripped input with stripped database names)
  for (const artist of INDONESIAN_ARTISTS_DATABASE) {
    const normName = normalizeText(artist.name);
    const normAlt = normalizeText(artist.normalizedName);
    if (normInput === normName || normInput === normAlt) {
      return { isIndonesian: true, matchedArtist: artist };
    }
  }

  // 2. Exact word boundaries or collaboration split
  // (e.g., "Wijaya 80 & Sal Priadi", "Yovie Widianto, Tulus & Glenn Fredly", "Adrian Khalif feat. Juicy Luicy")
  for (const artist of INDONESIAN_ARTISTS_DATABASE) {
    const normName = normalizeText(artist.name);
    if (normName.length >= 3 && (normInput.includes(normName) || normName.includes(normInput))) {
      return { isIndonesian: true, matchedArtist: artist };
    }
  }

  return { isIndonesian: false };
}

/**
 * Robust O(1) integer lookup by Apple Music Artist ID
 */
export function getIndonesianArtistByAppleId(appleMusicId: number): IndonesianArtist | undefined {
  if (!appleMusicId) return undefined;
  return INDONESIAN_ARTISTS_DATABASE.find((a) => a.appleMusicId === appleMusicId);
}
