import { Scrobble } from '../types/music';
import { storageService } from './storageService';

// Public test demo Last.fm tracks for quick 1-click sync
const DEMO_LASTFM_TRACKS = [
  { track: 'All I Need', artist: 'Radiohead', album: 'In Rainbows', cover: 'https://upload.wikimedia.org/wikipedia/en/2/2e/In_Rainbows_Official_Cover.jpg' },
  { track: 'King Kunta', artist: 'Kendrick Lamar', album: 'To Pimp a Butterfly', cover: 'https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png' },
  { track: 'Pink + White', artist: 'Frank Ocean', album: 'Blonde', cover: 'https://upload.wikimedia.org/wikipedia/en/a/a0/Blonde_-_Frank_Ocean.jpeg' },
  { track: 'Only Shallow', artist: 'My Bloody Valentine', album: 'Loveless', cover: 'https://upload.wikimedia.org/wikipedia/en/4/4b/My_Bloody_Valentine_-_Loveless.png' },
  { track: 'Harder, Better, Faster, Stronger', artist: 'Daft Punk', album: 'Discovery', cover: 'https://upload.wikimedia.org/wikipedia/en/a/ae/Daft_Punk_-_Discovery.jpg' },
  { track: 'Andromeda', artist: 'Weyes Blood', album: 'Titanic Rising', cover: 'https://upload.wikimedia.org/wikipedia/en/9/90/Weyes_Blood_-_Titanic_Rising.png' }
];

export const lastfmApi = {
  async syncUserScrobbles(username: string): Promise<Scrobble[]> {
    // In production with Last.fm API Key:
    // const res = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${API_KEY}&format=json&limit=10`);
    
    // Simulate real network fetch delay for realistic UX
    await new Promise(r => setTimeout(r, 900));

    // Generate synced scrobbles for the user
    const syncedScrobbles: Scrobble[] = [];
    const randomized = [...DEMO_LASTFM_TRACKS].sort(() => 0.5 - Math.random()).slice(0, 3);

    for (const item of randomized) {
      const scrobble = storageService.addScrobble({
        trackTitle: item.track,
        artist: item.artist,
        albumTitle: item.album,
        albumCover: item.cover,
        source: 'lastfm',
        reviewed: false
      });
      syncedScrobbles.push(scrobble);
    }

    return syncedScrobbles;
  }
};
