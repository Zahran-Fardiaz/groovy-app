import React, { createContext, useContext, useState } from 'react';
import { User, Playlist, Track, Album } from '../types/music';
import { storageService } from '../services/storageService';

interface AuthContextType {
  currentUser: User;
  users: User[];
  playlists: Playlist[];
  favoriteAlbumIds: string[];
  favoriteTrackIds: string[];
  toggleFollow: (userId: string) => void;
  updateTopFour: (albumIds: string[]) => void;
  updateBio: (bio: string) => void;
  // Playlists
  createPlaylist: (title: string, description?: string) => Playlist;
  deletePlaylist: (playlistId: string) => void;
  addTrackToPlaylist: (playlistId: string, track: Track, albumCover?: string) => boolean;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  addAlbumToPlaylist: (playlistId: string, album: Album) => number;
  // Favorites
  toggleFavoriteAlbum: (albumId: string) => boolean;
  isFavoriteAlbum: (albumId: string) => boolean;
  toggleFavoriteTrack: (trackId: string) => boolean;
  isFavoriteTrack: (trackId: string) => boolean;
  refreshData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => storageService.getCurrentUser());
  const [users, setUsers] = useState<User[]>(() => storageService.getUsers());
  const [playlists, setPlaylists] = useState<Playlist[]>(() => storageService.getPlaylists());
  const [favoriteAlbumIds, setFavoriteAlbumIds] = useState<string[]>(() => storageService.getFavoriteAlbumIds());
  const [favoriteTrackIds, setFavoriteTrackIds] = useState<string[]>(() => storageService.getFavoriteTrackIds());

  const refreshData = () => {
    setCurrentUser(storageService.getCurrentUser());
    setUsers(storageService.getUsers());
    setPlaylists(storageService.getPlaylists());
    setFavoriteAlbumIds(storageService.getFavoriteAlbumIds());
    setFavoriteTrackIds(storageService.getFavoriteTrackIds());
  };

  const toggleFollow = (userId: string) => {
    const updatedUsers = storageService.toggleFollowUser(userId);
    setUsers([...updatedUsers]);
    setCurrentUser(storageService.getCurrentUser());
  };

  const updateTopFour = (albumIds: string[]) => {
    const updated: User = {
      ...currentUser,
      topFourAlbumIds: albumIds.slice(0, 4)
    };
    storageService.saveCurrentUser(updated);
    setCurrentUser(updated);
  };

  const updateBio = (bio: string) => {
    const updated: User = { ...currentUser, bio };
    storageService.saveCurrentUser(updated);
    setCurrentUser(updated);
  };

  const createPlaylist = (title: string, description?: string): Playlist => {
    const newPl = storageService.createPlaylist(title, description);
    setPlaylists(storageService.getPlaylists());
    return newPl;
  };

  const deletePlaylist = (playlistId: string) => {
    storageService.deletePlaylist(playlistId);
    setPlaylists(storageService.getPlaylists());
  };

  const addTrackToPlaylist = (playlistId: string, track: Track, albumCover?: string): boolean => {
    const success = storageService.addTrackToPlaylist(playlistId, track, albumCover);
    setPlaylists(storageService.getPlaylists());
    return success;
  };

  const removeTrackFromPlaylist = (playlistId: string, trackId: string) => {
    storageService.removeTrackFromPlaylist(playlistId, trackId);
    setPlaylists(storageService.getPlaylists());
  };

  const addAlbumToPlaylist = (playlistId: string, album: Album): number => {
    const count = storageService.addAlbumToPlaylist(playlistId, album);
    setPlaylists(storageService.getPlaylists());
    return count;
  };

  const toggleFavoriteAlbum = (albumId: string): boolean => {
    const isFav = storageService.toggleFavoriteAlbum(albumId);
    setFavoriteAlbumIds(storageService.getFavoriteAlbumIds());
    return isFav;
  };

  const isFavoriteAlbum = (albumId: string): boolean => {
    return favoriteAlbumIds.includes(albumId);
  };

  const toggleFavoriteTrack = (trackId: string): boolean => {
    const isFav = storageService.toggleFavoriteTrack(trackId);
    setFavoriteTrackIds(storageService.getFavoriteTrackIds());
    return isFav;
  };

  const isFavoriteTrack = (trackId: string): boolean => {
    return favoriteTrackIds.includes(trackId);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        playlists,
        favoriteAlbumIds,
        favoriteTrackIds,
        toggleFollow,
        updateTopFour,
        updateBio,
        createPlaylist,
        deletePlaylist,
        addTrackToPlaylist,
        removeTrackFromPlaylist,
        addAlbumToPlaylist,
        toggleFavoriteAlbum,
        isFavoriteAlbum,
        toggleFavoriteTrack,
        isFavoriteTrack,
        refreshData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
