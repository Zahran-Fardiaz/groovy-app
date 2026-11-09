import React, { useState, useEffect } from 'react';
import { Feather, Check, X } from 'lucide-react';
import { CommunityPost } from '../../types/music';
import { storageService } from '../../services/storageService';
import { CommunityThreadCard } from './CommunityThreadCard';
import { CreateThreadModal } from './CreateThreadModal';
import { ThreadRepliesModal } from './ThreadRepliesModal';
import './Community.css';

interface CommunityFeedProps {
  onOpenAlbum: (albumId: string) => void;
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({ onOpenAlbum }) => {
  const [posts, setPosts] = useState<CommunityPost[]>(() => storageService.getCommunityPosts());
  const [activeSection, setActiveSection] = useState<'for_you' | 'following'>('for_you');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeThreadForReplies, setActiveThreadForReplies] = useState<CommunityPost | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setPosts(storageService.getCommunityPosts());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleLikeToggle = (postId: string) => {
    const updated = storageService.toggleLikeCommunityPost(postId);
    setPosts(updated);
  };

  const handleRepostToggle = (postId: string) => {
    const updated = storageService.toggleRepostCommunityPost(postId);
    setPosts(updated);
    showToast('Thread berhasil di-repost ke feed kamu!');
  };

  const handleShare = (post: CommunityPost) => {
    navigator.clipboard?.writeText(window.location.href);
    showToast(`Tautan thread @${post.userHandle} disalin!`);
  };

  const handlePostCreated = (newPost: CommunityPost) => {
    setPosts((prev) => [newPost, ...prev]);
    showToast('Thread kamu berhasil dipublikasikan!');
  };

  const handlePostUpdated = (updatedPost: CommunityPost) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
    );
    setActiveThreadForReplies(updatedPost);
  };

  // Filter users followed
  const followedUserIds = new Set(
    storageService
      .getUsers()
      .filter((u) => u.isFollowedByMe || u.id === 'user-me')
      .map((u) => u.id)
  );

  const filteredPosts = posts.filter((post) => {
    // 1. Tag Filter (if user clicked a hashtag in a post)
    if (selectedTag) {
      const match = post.tags?.some(
        (t) => t.toLowerCase() === selectedTag.toLowerCase()
      );
      if (!match) return false;
    }

    // 2. Section filter: For You vs Following
    if (activeSection === 'following') {
      return followedUserIds.has(post.userId);
    }
    return true;
  });

  return (
    <div className="community-view-root">
      {/* 1. Header: Clean Title only */}
      <header className="community-view-header">
        <h1 className="community-view-title">Community</h1>
      </header>

      {/* 2. Underline Tab Navigation: For You & Following (matching reference mockup) */}
      <nav className="community-tabs-bar" aria-label="Community Sections">
        <button
          type="button"
          className={`community-tab-btn ${activeSection === 'for_you' && !selectedTag ? 'active' : ''}`}
          onClick={() => {
            setActiveSection('for_you');
            setSelectedTag(null);
          }}
        >
          <span className="community-tab-label">For You</span>
        </button>

        <button
          type="button"
          className={`community-tab-btn ${activeSection === 'following' ? 'active' : ''}`}
          onClick={() => {
            setActiveSection('following');
            setSelectedTag(null);
          }}
        >
          <span className="community-tab-label">Following</span>
          <span className="community-following-count-badge">12</span>
        </button>

        {selectedTag && (
          <button
            type="button"
            className="community-tab-btn active"
            onClick={() => setSelectedTag(null)}
          >
            <span className="community-tab-label">#{selectedTag}</span>
            <span className="community-tab-tag-close" title="Hapus filter tag">
              <X size={11} />
            </span>
          </button>
        )}
      </nav>

      {/* 3. Stream of Community Threads */}
      <div className="community-threads-list">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <CommunityThreadCard
              key={post.id}
              post={post}
              onOpenAlbum={onOpenAlbum}
              onOpenReplies={(p) => setActiveThreadForReplies(p)}
              onLikeToggle={handleLikeToggle}
              onRepostToggle={handleRepostToggle}
              onShare={handleShare}
              onTagClick={(tag) => {
                setSelectedTag(tag);
                setActiveSection('for_you');
              }}
            />
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--gds-text-secondary)' }}>
            <p style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
              {selectedTag
                ? `Belum ada thread dengan #${selectedTag}`
                : activeSection === 'following'
                ? 'Belum ada thread dari orang yang kamu ikuti'
                : 'Belum ada thread di komunitas'}
            </p>
            <p style={{ fontSize: '12px', color: 'var(--gds-text-muted)', marginBottom: '18px' }}>
              {activeSection === 'following'
                ? 'Ikuti pengguna lain untuk melihat opini musik mereka di sini.'
                : 'Mulai obrolan skena musik pertama kamu sekarang.'}
            </p>
            <button
              type="button"
              className="publish-thread-btn"
              onClick={() => setIsCreateOpen(true)}
              style={{ margin: '0 auto' }}
            >
              <Feather size={13} />
              Mulai Thread Baru
            </button>
          </div>
        )}
      </div>

      {/* 4. Floating Action Button (FAB) */}
      <button
        type="button"
        className="community-fab-btn"
        onClick={() => setIsCreateOpen(true)}
        title="Tulis Thread Skena Baru"
        aria-label="Tulis Thread"
      >
        <Feather size={20} />
      </button>

      {/* 5. Modals */}
      <CreateThreadModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onPostCreated={handlePostCreated}
      />

      <ThreadRepliesModal
        isOpen={Boolean(activeThreadForReplies)}
        post={activeThreadForReplies}
        onClose={() => setActiveThreadForReplies(null)}
        onOpenAlbum={onOpenAlbum}
        onPostUpdated={handlePostUpdated}
      />

      {/* 6. Toast Notification */}
      {toastMessage && (
        <div className="community-toast">
          <Check size={14} color="var(--gds-accent-citron)" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default CommunityFeed;
