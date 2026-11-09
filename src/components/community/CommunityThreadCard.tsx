import React from 'react';
import { Heart, MessageCircle, Repeat, Share2, Star } from 'lucide-react';
import { CommunityPost } from '../../types/music';

interface CommunityThreadCardProps {
  post: CommunityPost;
  onOpenAlbum: (albumId: string) => void;
  onOpenReplies: (post: CommunityPost) => void;
  onLikeToggle: (postId: string) => void;
  onRepostToggle: (postId: string) => void;
  onShare: (post: CommunityPost) => void;
  onTagClick?: (tag: string) => void;
}

export const CommunityThreadCard: React.FC<CommunityThreadCardProps> = ({
  post,
  onOpenAlbum,
  onOpenReplies,
  onLikeToggle,
  onRepostToggle,
  onShare,
  onTagClick
}) => {
  // Render body text with interactive hashtags
  const renderFormattedText = (text: string) => {
    const parts = text.split(/(#[a-zA-Z0-9_]+)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('#')) {
        const cleanTag = part.slice(1);
        return (
          <span
            key={idx}
            className="thread-hashtag"
            onClick={(e) => {
              e.stopPropagation();
              onTagClick?.(cleanTag);
            }}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <article
      className="community-thread-row"
      id={`thread-item-${post.id}`}
      onClick={() => onOpenReplies(post)}
    >
      {/* ── Left Column: User Avatar ── */}
      <div className="thread-avatar-col">
        <img
          src={post.userAvatar || '/default-avatar.svg'}
          alt={post.userName}
          className="thread-avatar-img"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `data:image/svg+xml,${encodeURIComponent(
              `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" rx="20" fill="#1e2230"/><text x="20" y="25" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#fff">${(post.userName || 'U')[0]}</text></svg>`
            )}`;
          }}
        />
      </div>

      {/* ── Right Column: Thread Content & Actions (Threads / X / Reddit style) ── */}
      <div className="thread-content-col">
        {/* Header: Author Name, Handle, Timestamp */}
        <div className="thread-meta-row">
          <div className="thread-user-info">
            <span className="thread-author-name">{post.userName}</span>
            <span className="thread-author-handle">@{post.userHandle}</span>
            <span className="thread-meta-sep">·</span>
            <span className="thread-timestamp">{post.createdAt}</span>
          </div>
        </div>

        {/* Text body */}
        <div className="thread-text-body">
          {renderFormattedText(post.content)}
        </div>

        {/* Embedded Music Card (Minimalist Rounded Embed) */}
        {post.musicTag && (
          <div
            className="thread-music-embed-card"
            onClick={(e) => {
              e.stopPropagation();
              onOpenAlbum(post.musicTag!.id);
            }}
            title={`Lihat album ${post.musicTag.title}`}
          >
            <img
              src={post.musicTag.coverUrl}
              alt={post.musicTag.title}
              className="thread-music-embed-art"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';
              }}
            />

            <div className="thread-music-embed-meta">
              <span className="thread-music-embed-title">{post.musicTag.title}</span>
              <span className="thread-music-embed-artist">{post.musicTag.artist}</span>
            </div>

            {post.musicTag.rating !== undefined && (
              <div className="thread-music-embed-score">
                <Star size={11} fill="var(--gds-accent-citron, #d4ff32)" color="var(--gds-accent-citron, #d4ff32)" />
                <span>{(post.musicTag.rating <= 5 ? post.musicTag.rating * 2 : post.musicTag.rating).toFixed(1)}</span>
              </div>
            )}
          </div>
        )}

        {/* Action icons row (Replies, Reposts, Likes, Share) */}
        <div className="thread-actions-bar" onClick={(e) => e.stopPropagation()}>
          {/* Reply */}
          <button
            type="button"
            className="thread-action-btn"
            onClick={() => onOpenReplies(post)}
            aria-label="Balas thread"
          >
            <MessageCircle size={15} />
            <span>{post.replyCount || 0}</span>
          </button>

          {/* Repost */}
          <button
            type="button"
            className={`thread-action-btn ${post.repostedByMe ? 'is-reposted' : ''}`}
            onClick={() => onRepostToggle(post.id)}
            aria-label="Repost thread"
          >
            <Repeat size={15} />
            <span>{post.reposts || 0}</span>
          </button>

          {/* Like */}
          <button
            type="button"
            className={`thread-action-btn ${post.likedByMe ? 'is-liked' : ''}`}
            onClick={() => onLikeToggle(post.id)}
            aria-label="Suka thread"
          >
            <Heart
              size={15}
              fill={post.likedByMe ? '#ef4444' : 'none'}
              color={post.likedByMe ? '#ef4444' : 'currentColor'}
            />
            <span>{post.likes}</span>
          </button>

          {/* Share */}
          <button
            type="button"
            className="thread-action-btn"
            onClick={() => onShare(post)}
            aria-label="Bagikan thread"
          >
            <Share2 size={15} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default CommunityThreadCard;
