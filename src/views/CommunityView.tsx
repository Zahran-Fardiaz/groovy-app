import React from 'react';
import { CommunityFeed } from '../components/community/CommunityFeed';

interface CommunityViewProps {
  onOpenAlbum: (albumId: string) => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({ onOpenAlbum }) => {
  return (
    <div className="community-view-container">
      <CommunityFeed onOpenAlbum={onOpenAlbum} />
    </div>
  );
};

export default CommunityView;
