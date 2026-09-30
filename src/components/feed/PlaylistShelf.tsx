import React from 'react';
import { ChevronRight, ListMusic } from 'lucide-react';
import { Album } from '../../types/music';

interface PlaylistShelfProps {
  albums: Album[];
  onOpenAlbum: (albumId: string) => void;
  onSeeAll?: () => void;
}

interface CuratedPlaylist {
  id: string;
  title: string;
  description: string;
  songCount: number;
  coverUrls: string[];
}

export const PlaylistShelf: React.FC<PlaylistShelfProps> = ({
  albums,
  onOpenAlbum,
  onSeeAll
}) => {
  const covers = albums.map(a => a.coverUrl).filter(Boolean);

  const playlists: CuratedPlaylist[] = [
    {
      id: 'pl-late-night',
      title: 'Late Night Driving',
      description: 'Dream pop, indie soul, and midnight melancholia',
      songCount: 42,
      coverUrls: covers.slice(0, 4)
    },
    {
      id: 'pl-skena-pop',
      title: 'Indo Indie Wave',
      description: 'The golden generation of Nusantara alternative',
      songCount: 65,
      coverUrls: covers.slice(2, 6)
    },
    {
      id: 'pl-vinyl-grooves',
      title: 'Hi-Fi Vinyl Lounge',
      description: 'Warm analog warmth and crate-dug rare cuts',
      songCount: 38,
      coverUrls: covers.slice(4, 8)
    }
  ];

  return (
    <section className="feed-playlist-section" aria-label="Playlists">
      <div className="feed-playlist-header">
        <h2 className="feed-playlist-title">Playlist</h2>
        {onSeeAll && (
          <button
            className="feed-see-all-btn"
            onClick={onSeeAll}
            title="View all playlists"
          >
            <span>See all</span>
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      <div className="feed-playlist-scroll">
        {playlists.map((pl) => (
          <div
            key={pl.id}
            className="feed-playlist-card"
            onClick={() => albums[0] && onOpenAlbum(albums[0].id)}
            role="button"
            tabIndex={0}
          >
            {/* 2x2 Collage Cover Sleeve */}
            <div className="playlist-cover-grid">
              {pl.coverUrls.slice(0, 4).map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt=""
                  className="playlist-grid-thumb"
                  loading="lazy"
                />
              ))}
            </div>

            <div className="playlist-meta">
              <h3 className="playlist-card-title">{pl.title}</h3>
              <div className="playlist-card-sub">
                <ListMusic size={11} />
                <span>{pl.songCount} songs</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default PlaylistShelf;
