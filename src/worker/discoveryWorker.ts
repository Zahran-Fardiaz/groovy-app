// ============================================================================
// Groovy Candidate Discovery Worker
// Scans Apple Music ID Storefront & Scores Emerging Artists with Heuristics
// ============================================================================

import { CandidateRelease } from './types';

// Curated list of Indonesian record labels and distributors
export const KNOWN_INDONESIAN_LABELS = [
  'sun eater',
  'greedy dust',
  'kolibri',
  'demajors',
  'musica',
  'juni records',
  'trinity optima',
  'warner music indonesia',
  'universal music indonesia',
  'sony music indonesia',
  'massive music',
  'aquarius musikindo',
  'vibes labs',
  'sinjitu'
];

export interface HeuristicEvaluation {
  score: number;
  reasons: string[];
  isLikelyIndonesian: boolean;
}

export class DiscoveryWorker {
  private knownArtistIds: Set<number>;

  constructor(knownArtistIds: number[] = []) {
    this.knownArtistIds = new Set(knownArtistIds);
  }

  /**
   * Evaluate whether a candidate release is Indonesian using heuristic scoring
   */
  public evaluateCandidate(item: {
    artistName: string;
    albumTitle: string;
    recordLabel?: string;
    isrc?: string;
    country?: string;
    primaryGenreName?: string;
  }): HeuristicEvaluation {
    let score = 0;
    const reasons: string[] = [];

    // 1. Label check (+50 points)
    const labelLower = (item.recordLabel || '').toLowerCase();
    for (const knownLabel of KNOWN_INDONESIAN_LABELS) {
      if (labelLower.includes(knownLabel)) {
        score += 50;
        reasons.push(`Record label match: "${knownLabel}"`);
        break;
      }
    }

    // 2. ISRC country prefix check (+50 points)
    if (item.isrc && item.isrc.toUpperCase().startsWith('ID')) {
      score += 50;
      reasons.push(`Indonesian ISRC code prefix detected: "${item.isrc.slice(0, 2)}"`);
    }

    // 3. Storefront region confirmation (+15 points)
    if (item.country === 'ID' || item.country === 'IDN') {
      score += 15;
      reasons.push('Available in ID Storefront');
    }

    // 4. Genre indicators (+20 points)
    const genre = (item.primaryGenreName || '').toLowerCase();
    if (genre.includes('indo') || genre.includes('dangdut') || genre.includes('koplo')) {
      score += 20;
      reasons.push(`Indonesian genre tag: "${item.primaryGenreName}"`);
    }

    return {
      score,
      reasons,
      isLikelyIndonesian: score >= 50
    };
  }

  /**
   * Scan Apple Music ID Storefront Top Releases
   */
  public async scanStorefront(queryTerms: string[] = ['indie', 'rock', 'pop']): Promise<CandidateRelease[]> {
    const candidates: CandidateRelease[] = [];
    const seenCollectionIds = new Set<number>();

    for (const term of queryTerms) {
      try {
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=album&country=ID&limit=15`;
        const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
        if (!res.ok) continue;

        const data = await res.json();
        const results = data.results || [];

        for (const item of results) {
          // Skip if already in known verified registry
          if (this.knownArtistIds.has(item.artistId) || seenCollectionIds.has(item.collectionId)) {
            continue;
          }

          seenCollectionIds.add(item.collectionId);

          const evaluation = this.evaluateCandidate({
            artistName: item.artistName || '',
            albumTitle: item.collectionName || '',
            recordLabel: item.copyright,
            country: item.country,
            primaryGenreName: item.primaryGenreName
          });

          if (evaluation.score > 0) {
            candidates.push({
              appleMusicCollectionId: item.collectionId,
              appleMusicArtistId: item.artistId,
              artistName: item.artistName,
              albumTitle: item.collectionName,
              releaseDate: item.releaseDate ? item.releaseDate.split('T')[0] : '2024-01-01',
              recordLabel: item.copyright,
              heuristicScore: evaluation.score,
              detectionReasons: evaluation.reasons,
              status: evaluation.isLikelyIndonesian ? 'approved' : 'pending'
            });
          }
        }
      } catch (err) {
        console.error(`[DiscoveryWorker] Error querying term "${term}":`, err);
      }
    }

    return candidates.sort((a, b) => b.heuristicScore - a.heuristicScore);
  }
}
