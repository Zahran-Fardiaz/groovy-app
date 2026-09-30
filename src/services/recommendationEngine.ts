import { Album, Recommendation, Review, Scrobble, TasteTunerSettings } from '../types/music';

export const recommendationEngine = {
  getRecommendations(
    albums: Album[],
    reviews: Review[],
    scrobbles: Scrobble[],
    tunerSettings?: TasteTunerSettings
  ): {
    indonesianSpotlight: Recommendation[];
    basedOnReviews: Recommendation[];
    basedOnHistory: Recommendation[];
    tasteTunerPicks: Recommendation[];
    trendingCommunity: Recommendation[];
  } {
    if (!albums || albums.length === 0) {
      return {
        indonesianSpotlight: [],
        basedOnReviews: [],
        basedOnHistory: [],
        tasteTunerPicks: [],
        trendingCommunity: []
      };
    }

    const reviewedAlbumIds = new Set(reviews.filter(r => r.userId === 'user-me').map(r => r.albumId));

    // 1. INDONESIAN SPOTLIGHT (Highlighted modern & iconic Indonesian music)
    const indonesianAlbums = albums.filter(a => a.isIndonesian && !reviewedAlbumIds.has(a.id));
    const indonesianSpotlight: Recommendation[] = indonesianAlbums.slice(0, 4).map(album => ({
      album,
      score: 98,
      reason: `Rilisan Pilihan Musik Indonesia • ${album.genres[0] || 'Indo Pop'}`,
      matchType: 'indonesian_spotlight' as const
    }));

    // 2. RECOMMENDATIONS BASED ON HIGH-RATED REVIEWS (4.0+ Stars)
    const favoriteReviews = reviews.filter(r => r.userId === 'user-me' && r.rating >= 4.0);
    const basedOnReviews: Recommendation[] = [];

    if (favoriteReviews.length > 0) {
      const topReview = favoriteReviews[0];
      const sourceAlbum = albums.find(a => a.id === topReview.albumId);

      if (sourceAlbum) {
        const candidates = albums.filter(a => a.id !== sourceAlbum.id && !reviewedAlbumIds.has(a.id));
        for (const candidate of candidates) {
          const commonGenres = candidate.genres.filter(g =>
            sourceAlbum.genres.some(sg => sg.toLowerCase().includes(g.toLowerCase()) || g.toLowerCase().includes(sg.toLowerCase()))
          );
          if (commonGenres.length > 0 || (candidate.isIndonesian && sourceAlbum.isIndonesian)) {
            basedOnReviews.push({
              album: candidate,
              score: Math.round(88 + Math.random() * 10),
              reason: `Berdasarkan ulasan rating ${topReview.rating} untuk "${sourceAlbum.title}"`,
              matchType: 'high_rating',
              basedOnItem: sourceAlbum.title
            });
          }
        }
      }
    }

    if (basedOnReviews.length === 0) {
      albums.slice(0, 3).forEach(album => {
        basedOnReviews.push({
          album,
          score: 92,
          reason: `Rekomendasi terpopuler kategori ${album.genres[0] || 'Musik'}`,
          matchType: 'high_rating'
        });
      });
    }

    // 3. RECOMMENDATIONS BASED ON LISTENING HISTORY / SCROBBLES
    const basedOnHistory: Recommendation[] = [];
    const recentArtists = Array.from(new Set(scrobbles.map(s => s.artist)));

    for (const artist of recentArtists) {
      const artistAlbums = albums.filter(a => a.artist.toLowerCase() === artist.toLowerCase() && !reviewedAlbumIds.has(a.id));
      for (const album of artistAlbums) {
        basedOnHistory.push({
          album,
          score: 95,
          reason: `Sering kamu dengar minggu ini: ${artist}`,
          matchType: 'listening_history',
          basedOnItem: artist
        });
      }
    }

    // Add candidate diversity
    const remaining = albums.filter(a => !basedOnHistory.some(r => r.album.id === a.id));
    for (const album of remaining.slice(0, 3)) {
      basedOnHistory.push({
        album,
        score: Math.round(82 + Math.random() * 12),
        reason: album.isIndonesian ? 'Eksplorasi Skena Musik Lokal' : 'Discovered from listening habits',
        matchType: 'listening_history'
      });
    }

    // 4. TASTE TUNER PICKS
    const tasteTunerPicks: Recommendation[] = [];
    if (tunerSettings) {
      const scored = albums.map(album => {
        let matchScore = 80;
        if (tunerSettings.obscurity > 60 && album.totalRatings < 200) matchScore += 15;
        if (tunerSettings.energy > 60 && (album.genres.some(g => g.toLowerCase().includes('rock') || g.toLowerCase().includes('dance')))) matchScore += 12;
        if (tunerSettings.mood > 60 && (album.genres.some(g => g.toLowerCase().includes('pop')))) matchScore += 10;
        return { album, matchScore: Math.min(99, matchScore) };
      });

      scored.sort((a, b) => b.matchScore - a.matchScore);
      for (const item of scored.slice(0, 4)) {
        tasteTunerPicks.push({
          album: item.album,
          score: item.matchScore,
          reason: `Cocok dengan selera getaran audio (${item.matchScore}% affinity)`,
          matchType: 'taste_tuner'
        });
      }
    }

    // 5. TRENDING COMMUNITY
    const trendingCommunity: Recommendation[] = [...albums]
      .sort((a, b) => (b.averageRating || 0) * (b.totalReviews || 1) - (a.averageRating || 0) * (a.totalReviews || 1))
      .slice(0, 4)
      .map(album => ({
        album,
        score: Math.round((album.averageRating || 4.5) * 20),
        reason: `${album.isIndonesian ? 'Favorit Komunitas Lokal' : 'Trending'} • Rating ${album.averageRating || 4.5}`,
        matchType: 'trending'
      }));

    return {
      indonesianSpotlight: indonesianSpotlight.slice(0, 4),
      basedOnReviews: basedOnReviews.slice(0, 4),
      basedOnHistory: basedOnHistory.slice(0, 4),
      tasteTunerPicks: tasteTunerPicks.slice(0, 4),
      trendingCommunity
    };
  }
};
