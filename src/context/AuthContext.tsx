import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/music';
import { storageService } from '../services/storageService';

interface AuthContextType {
  currentUser: User;
  users: User[];
  toggleFollow: (userId: string) => void;
  updateTopFour: (albumIds: string[]) => void;
  updateBio: (bio: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => storageService.getCurrentUser());
  const [users, setUsers] = useState<User[]>(() => storageService.getUsers());

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

  return (
    <AuthContext.Provider value={{ currentUser, users, toggleFollow, updateTopFour, updateBio }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
