// ============================================================================
// Groovy Ingestion CLI Runner
// Usage: npx tsx src/worker/runSync.ts
// ============================================================================

import { RegistrySyncWorker } from './syncRegistry';
import { DiscoveryWorker } from './discoveryWorker';
import { VERIFIED_INDONESIAN_ARTISTS } from './registryData';

async function main() {
  console.log('===============================================================');
  console.log(' GROOVY INGESTION PIPELINE: SYNC & DISCOVERY ENGINE');
  console.log(' Upstream: Apple Music Catalog API');
  console.log('===============================================================\n');

  console.log(`[1/3] Initializing RegistrySyncWorker with ${VERIFIED_INDONESIAN_ARTISTS.length} verified Indonesian artists...`);
  const syncWorker = new RegistrySyncWorker(VERIFIED_INDONESIAN_ARTISTS);

  console.log('[2/3] Fetching and classifying latest releases from Apple Music...');
  const { stats, albums } = await syncWorker.syncAll((processed, total) => {
    process.stdout.write(`\r      Progress: ${processed}/${total} artists processed...`);
  });

  console.log('\n\n--- INGESTION SUMMARY ---');
  console.log(`Artists Processed:   ${stats.artistsProcessed}`);
  console.log(`Releases Fetched:    ${stats.releasesFetched}`);
  console.log(`Albums Ingested:     ${stats.albumsIngested}`);
  console.log(`Duplicates Avoided:  ${stats.skippedDuplicates}`);
  console.log(`Errors Encountered:  ${stats.errors}`);

  const lps = albums.filter((a) => a.releaseType === 'lp');
  const eps = albums.filter((a) => a.releaseType === 'ep');
  const singles = albums.filter((a) => a.releaseType === 'single');

  console.log(`  -> LPs (Full Albums): ${lps.length}`);
  console.log(`  -> EPs:               ${eps.length}`);
  console.log(`  -> Singles:           ${singles.length}`);

  console.log('\n--- TOP 8 NEWEST INGESTED RELEASES ---');
  albums.slice(0, 8).forEach((album, idx) => {
    const primary = album.credits.filter((c) => c.role === 'primary').map((c) => c.artistName).join(', ');
    console.log(
      `  ${idx + 1}. [${album.releaseType.toUpperCase()}] "${album.title}" by ${primary} (${album.releaseDate}) [Tracks: ${album.totalTracks}]`
    );
  });

  console.log('\n[3/3] Running DiscoveryWorker scan on ID Storefront...');
  const discoveryWorker = new DiscoveryWorker(VERIFIED_INDONESIAN_ARTISTS.map((a) => a.appleMusicId));
  const candidates = await discoveryWorker.scanStorefront(['indie indonesia', 'rock indonesia']);

  console.log(`\nDiscovered ${candidates.length} candidate releases with Indonesian heuristics:`);
  candidates.slice(0, 5).forEach((c, idx) => {
    console.log(`  ${idx + 1}. "${c.albumTitle}" by ${c.artistName} (Score: ${c.heuristicScore})`);
    console.log(`     Reasons: ${c.detectionReasons.join(', ')}`);
  });

  console.log('\n===============================================================');
  console.log(' SYNC & CLASSIFICATION COMPLETED SUCCESSFULLY');
  console.log('===============================================================\n');
}

main().catch((err) => {
  console.error('[Fatal Worker Error]:', err);
  process.exit(1);
});
