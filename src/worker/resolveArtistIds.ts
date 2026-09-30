// ============================================================================
// Groovy Artist ID Resolver: Reconciles verified Apple Music Artist IDs
// ============================================================================

import { VERIFIED_INDONESIAN_ARTISTS } from './registryData';
import * as fs from 'fs';
import * as path from 'path';

async function resolveIds() {
  console.log(`Resolving exact Apple Music Artist IDs for ${VERIFIED_INDONESIAN_ARTISTS.length} artists...`);

  const updatedArtists = [];

  for (const artist of VERIFIED_INDONESIAN_ARTISTS) {
    try {
      const searchUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(artist.name)}&entity=album&country=ID&limit=5`;
      const res = await fetch(searchUrl);
      if (res.ok) {
        const data = await res.json();
        const firstMatch = (data.results || []).find((item: any) => {
          const itemArtist = (item.artistName || '').toLowerCase().replace(/\s+/g, '');
          const target = artist.name.toLowerCase().replace(/\s+/g, '');
          return itemArtist.includes(target) || target.includes(itemArtist);
        });

        if (firstMatch && firstMatch.artistId) {
          const resolvedId = firstMatch.artistId;
          console.log(`  ✓ ${artist.name}: resolved to ID ${resolvedId}`);
          updatedArtists.push({
            ...artist,
            appleMusicId: resolvedId
          });
          continue;
        }
      }
    } catch (e) {
      console.warn(`  ! Could not resolve for ${artist.name}:`, e);
    }

    updatedArtists.push(artist);
  }

  // Update registryData.ts
  const filePath = path.resolve('src/worker/registryData.ts');
  const fileContent = `// ============================================================================
// Groovy Verified Indonesian Artist Registry (Seed Data with Apple Music IDs)
// ============================================================================

import { RegisteredArtist } from './types';

export const VERIFIED_INDONESIAN_ARTISTS: RegisteredArtist[] = ${JSON.stringify(updatedArtists, null, 2)};
`;

  fs.writeFileSync(filePath, fileContent);
  console.log(`Successfully updated ${filePath}!`);
}

resolveIds();
