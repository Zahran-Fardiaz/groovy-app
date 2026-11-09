import React, { useState } from 'react';
import { X, Send, Disc3, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CommunityPost, CommunityReply } from '../../types/music';
import { storageService } from '../../services/storageService';
import { StarRating } from '../common/StarRating';

interface ThreadRepliesModalProps {
  post: CommunityPost | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenAlbum: (albumId: string) => void;
  onPostUpdated: (updatedPost: CommunityPost) => void;
}

export const ThreadRepliesModal: React.FC<ThreadRepliesModalProps> = ({
  post,
  isOpen,
  onClose,
  onOpenAlbum,
  onPostUpdated
}) => {
  const { currentUser } = useAuth();
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState<CommunityReply[]>(post?.replies || []);

  // Sync replies when post changes
  React.useEffect(() => {
    if (post) {
      setReplies(post.replies || []);
    }
  }, [post]);

  if (!isOpen || !post) return null;

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const user = currentUser || {
      id: 'user-me',
      displayName: 'Dhea Rizky',
      username: 'dhea',
      avatarUrl: '/default-avatar.svg',
      bio: '',
      followersCount: 0,
      followingCount: 0,
      topFourAlbumIds: []
    };

    const updated = storageService.addReplyToCommunityPost(post.id, replyText, user);
    if (updated) {
      setReplies(updated.replies);
      onPostUpdated(updated);
      setReplyText('');
    }
  };

  return (
    <div className="thread-replies-overlay" onClick={onClose}>
      <div className="thread-replies-card" onClick={(e) => e.stopPropagation()}>
        {/* Mobile Sheet Handle */}
        <div className="modal-sheet-handle" />

        {/* Header */}
        <div className="create-thread-header">
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--gds-accent-citron)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '3px' }}>
              DISKUSI SKENA
            </div>
            <div className="create-thread-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageCircle size={18} color="var(--gds-accent-citron)" />
              Thread & Balasan
            </div>
          </div>
          <button
            type="button"
            className="create-thread-close-btn"
            onClick={onClose}
            aria-label="Tutup thread"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="thread-replies-scroll">
          {/* Main Parent Post */}
          <div style={{ display: 'flex', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <img
              src={post.userAvatar || '/default-avatar.svg'}
              alt={post.userName}
              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--gds-border-subtle)', flexShrink: 0 }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = `data:image/svg+xml,${encodeURIComponent(
                  `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" rx="20" fill="#242a3a"/><text x="20" y="25" text-anchor="middle" font-family="sans-serif" font-size="15" fill="#fff">${(post.userName || 'U')[0]}</text></svg>`
                )}`;
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '14px', fontWeight: 750, color: '#ffffff' }}>{post.userName}</span>
                <span style={{ fontSize: '12px', color: 'var(--gds-text-secondary)' }}>@{post.userHandle}</span>
                <span style={{ fontSize: '11px', color: 'var(--gds-text-muted)' }}>• {post.createdAt}</span>
              </div>

              <div style={{ fontSize: '14px', lineHeight: 1.55, color: '#e2e8f0', marginTop: '6px', whiteSpace: 'pre-line' }}>
                {post.content}
              </div>

              {/* Music Tag Embed */}
              {post.musicTag && (
                <div
                  className="thread-music-embed"
                  onClick={() => onOpenAlbum(post.musicTag!.id)}
                  style={{ marginTop: '10px' }}
                >
                  <div className="thread-music-thumb-wrap">
                    <img
                      src={post.musicTag.coverUrl}
                      alt={post.musicTag.title}
                      className="thread-music-thumb-img"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>
                  <div className="thread-music-details">
                    <div className="thread-music-title">{post.musicTag.title}</div>
                    <div className="thread-music-artist">{post.musicTag.artist}</div>
                    {post.musicTag.rating !== undefined && (
                      <div style={{ marginTop: '3px' }}>
                        <StarRating rating={post.musicTag.rating} size={12} showScore={true} />
                      </div>
                    )}
                  </div>
                  <div className="thread-music-open-tag">
                    <Disc3 size={16} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* List of Replies */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gds-text-secondary)', margin: '10px 0 12px' }}>
              Balasan ({replies.length})
            </div>

            {replies.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '28px 0', color: 'var(--gds-text-muted)', fontSize: '13px' }}>
                Belum ada balasan. Jadilah yang pertama menanggapi thread ini!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {replies.map((reply) => (
                  <div key={reply.id} className="single-reply-item">
                    <img
                      src={reply.userAvatar || '/default-avatar.svg'}
                      alt={reply.userName}
                      style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1px solid var(--gds-border-subtle)' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `data:image/svg+xml,${encodeURIComponent(
                          `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34"><rect width="34" height="34" rx="17" fill="#242a3a"/><text x="17" y="22" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#fff">${(reply.userName || 'U')[0]}</text></svg>`
                        )}`;
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>{reply.userName}</span>
                        <span style={{ fontSize: '11.5px', color: 'var(--gds-text-secondary)' }}>@{reply.userHandle}</span>
                        <span style={{ fontSize: '10.5px', color: 'var(--gds-text-muted)' }}>• {reply.createdAt}</span>
                      </div>
                      <div style={{ fontSize: '13px', lineHeight: 1.45, color: '#cbd5e1', marginTop: '4px' }}>
                        {reply.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Input Bar at bottom */}
        <form onSubmit={handleSendReply} className="reply-input-bar">
          <input
            type="text"
            className="reply-input-field"
            placeholder={`Balas ke @${post.userHandle}...`}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button
            type="submit"
            className="reply-send-btn"
            disabled={!replyText.trim()}
          >
            <Send size={12} style={{ display: 'inline', marginRight: '4px' }} />
            Kirim
          </button>
        </form>
      </div>
    </div>
  );
};

export default ThreadRepliesModal;
