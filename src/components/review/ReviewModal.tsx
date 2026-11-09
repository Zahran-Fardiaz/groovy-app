import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, Disc3, ArrowUpRight, Check, RotateCcw, Search, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Album, Review } from '../../types/music';
import { StarRating } from '../common/StarRating';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useScrobble } from '../../context/ScrobbleContext';
import { musicApi } from '../../services/musicApi';
import './ReviewModal.css';

interface ReviewModalProps {
  isOpen: boolean;
  album: Album | null;
  initialRating?: number;
  onClose: () => void;
  onReviewCreated: (newReview: Review) => void;
}

const COMMON_TAGS = ['masterpiece', 'late-night', 'melancholic', 'euphoric', 'driving-alone', 'headphones-only', 'repeat-worthy'];
const today = () => {
  const date = new Date();
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
};

export const ReviewModal: React.FC<ReviewModalProps> = props => {
  if (!props.isOpen) return null;
  return <ReviewSession {...props} />;
};

const ReviewSession: React.FC<ReviewModalProps> = ({ onClose, album, initialRating = 4, onReviewCreated }) => {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(() => album || storageService.getAlbums()[0] || null);
  const [isPicking, setIsPicking] = useState(!selectedAlbum);
  const [query, setQuery] = useState('');
  const [catalogResults, setCatalogResults] = useState<Album[]>([]);
  const [searching, setSearching] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const requestId = useRef(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const requestClose = useCallback(() => {
    setIsClosing(true);
  }, []);

  // Ensure unmount even if animationend does not fire (fallback timer)
  useEffect(() => {
    if (isClosing) {
      const timer = setTimeout(() => {
        onClose();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isClosing, onClose]);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus({ preventScroll: true });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        requestClose();
      }
      if (event.key !== 'Tab') return;
      const controls = dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]');
      if (!controls?.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => { document.removeEventListener('keydown', handleKeyDown); previousFocus?.focus({ preventScroll: true }); };
  }, [requestClose]);

  const candidates = [...new Map([...catalogResults, ...storageService.getAlbums()].map(item => [item.id, item])).values()]
    .filter(item => (item.title + ' ' + item.artist).toLowerCase().includes(query.trim().toLowerCase())).slice(0, 12);
  const searchCatalog = async () => {
    const id = ++requestId.current;
    setSearching(true);
    try {
      const results = await musicApi.searchAlbums(query);
      if (id === requestId.current) setCatalogResults(results);
    } finally { if (id === requestId.current) setSearching(false); }
  };
  const picker = (
    <section className="review-album-picker" aria-label="Choose an album">
      <div className="review-picker-heading"><span>Album to review</span><button type="button" onClick={() => setIsPicking(!isPicking)} aria-expanded={isPicking}>{isPicking && selectedAlbum ? 'Done' : 'Change album'}<ChevronDown size={13} /></button></div>
      {isPicking && <div className="review-picker-content">
        <div className="review-picker-search"><Search size={14} /><input aria-label="Search albums or artists" placeholder="Search album or artist…" value={query} onChange={event => { requestId.current++; setSearching(false); setCatalogResults([]); setQuery(event.target.value); }} /><button type="button" disabled={searching || !query.trim()} onClick={searchCatalog}>{searching ? 'Searching…' : 'Search catalog'}</button></div>
        <div className="review-picker-results" aria-live="polite">
          {candidates.map(item => <button type="button" key={item.id} className={'review-picker-result ' + (item.id === selectedAlbum?.id ? 'selected' : '')} onClick={() => { setSelectedAlbum(item); setIsPicking(false); }} aria-label={'Select ' + item.title + ' by ' + item.artist}>
            <img src={item.coverUrl} alt="" /><span><strong>{item.title}</strong><small>{item.artist} · {item.releaseYear}</small></span>{item.id === selectedAlbum?.id && <Check size={14} />}
          </button>)}
          {!candidates.length && <p className="review-picker-empty">No albums found. Try another name or search the catalog.</p>}
        </div>
      </div>}
    </section>
  );

  return (
    <div
      className={`review-backdrop ${isClosing ? 'closing' : ''}`}
      onClick={requestClose}
    >
      <div
        className={`review-dialog ${isClosing ? 'closing' : ''}`}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
        onClick={event => event.stopPropagation()}
        onAnimationEnd={(e) => {
          if (e.target === e.currentTarget && isClosing) {
            onClose();
          }
        }}
      >
        <div className="review-sheet-handle" aria-hidden="true" />
        <header className="review-dialog-header">
          <div>
            <span className="review-eyebrow">Your music diary</span>
            <h2 id="review-modal-title">{selectedAlbum ? 'Log a listen' : 'Choose an album'}</h2>
          </div>
          <button
            id="btn-close-review-modal"
            className="review-close"
            ref={closeRef}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              requestClose();
            }}
            aria-label="Close review dialog"
          >
            <X size={18} />
          </button>
        </header>

        {!selectedAlbum ? (
          <div className="review-form-body">{picker}</div>
        ) : (
          <ReviewForm
            key={selectedAlbum.id}
            album={selectedAlbum}
            initialRating={initialRating}
            onClose={requestClose}
            onReviewCreated={onReviewCreated}
            picker={picker}
          />
        )}
      </div>
    </div>
  );
};

interface ReviewFormProps {
  album: Album;
  initialRating?: number;
  onClose: () => void;
  onReviewCreated: (newReview: Review) => void;
  picker: React.ReactNode;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ album, initialRating = 4, onClose, onReviewCreated, picker }) => {
  const { currentUser } = useAuth();
  const { markAsReviewed } = useScrobble();
  const [rating, setRating] = useState(initialRating);
  const [reviewText, setReviewText] = useState('');
  const [favoriteTrack, setFavoriteTrack] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isRelisten, setIsRelisten] = useState(false);
  const [listenDate, setListenDate] = useState(today);
  const [detailedAlbum, setDetailedAlbum] = useState<Album | null>(null);
  const [trackStatus, setTrackStatus] = useState<'loading' | 'ready' | 'error'>(album.tracklist.length ? 'ready' : 'loading');
  const [rateTracks, setRateTracks] = useState(false);
  const [trackRatings, setTrackRatings] = useState<Record<string, number>>(() => storageService.getTrackRatings());
  const [changedTrackRatings, setChangedTrackRatings] = useState<Record<string, number>>({});
  const tracks = (detailedAlbum || album).tracklist;
  const ratedCount = tracks.filter(track => trackRatings[track.id] > 0).length;

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const result = await musicApi.getAlbumDetails(album.id);
        if (!active) return;
        if (result) setDetailedAlbum(result);
        setTrackStatus(result?.tracklist.length ? 'ready' : 'error');
      } catch { if (active) setTrackStatus('error'); }
    };
    void load();
    return () => { active = false; };
  }, [album.id]);

  const handleRatingChange = (value: number) => {
    setRating(value);
    if (value === 5 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      try { confetti({ particleCount: 30, spread: 45, origin: { y: .6 }, colors: ['#d4ff32', '#ffffff'], disableForReducedMotion: true }); } catch { /* Canvas may be unavailable. */ }
    }
  };
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newReview: Review = {
      id: 'rev-' + Date.now(), albumId: album.id, albumTitle: album.title, albumCover: album.coverUrl,
      artist: album.artist, userId: currentUser.id, userName: currentUser.displayName,
      userAvatar: currentUser.avatarUrl, userHandle: currentUser.username, rating,
      reviewText: reviewText.trim() || 'Rated ' + (rating * 2).toFixed(1) + ' / 10.',
      favoriteTrackTitle: favoriteTrack || undefined, tags: selectedTags, dateListened: listenDate,
      trackRatings: rateTracks ? Object.fromEntries(tracks.filter(track => trackRatings[track.id] > 0).map(track => [track.id, trackRatings[track.id]])) : undefined,
      createdAt: 'Just now', likes: 0, likedByMe: false, comments: [], isRelisten
    };
    storageService.saveReview(newReview);
    if (rateTracks) Object.entries(changedTrackRatings).forEach(([id, value]) => storageService.saveTrackRating(id, value));
    markAsReviewed(album.title);
    onReviewCreated(newReview);
    onClose();
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <div className="review-form-body">
        {picker}
        <div className="review-album">
          <img src={album.coverUrl} alt={album.title + ' cover'} />
          <div><span className="review-eyebrow">{album.albumType || 'Release'} · {album.releaseYear}</span><h3>{album.title}</h3><p>{album.artist}</p></div>
        </div>
        <section className="review-rating-panel" aria-labelledby="review-rating-label">
          <div className="review-rating-heading"><h3 id="review-rating-label">Your rating</h3><span>{rating >= 4.5 ? 'On repeat.' : rating >= 3.5 ? 'A good listen.' : rating >= 2.5 ? 'Mixed feelings.' : 'Not your favorite.'}</span></div>
          <div className="review-rating-selector"><StarRating rating={rating} size={29} interactive onChange={handleRatingChange} showScore={false} /><strong>{(rating * 2).toFixed(1)}<small> / 10</small></strong></div>
          <input className="review-rating-range" type="range" min=".5" max="5" step=".5" value={rating} onChange={event => handleRatingChange(Number(event.target.value))} aria-label="Your rating" aria-valuetext={(rating * 2).toFixed(1) + ' out of 10'} />
          <p className="review-rating-hint">Tap a star or slide to find your rating.</p>
        </section>

        <section className="review-track-section" aria-label="Rate individual songs">
          <label className="review-track-toggle"><span><strong>Rate each song</strong><small>Optional · Give tracks their own ratings</small></span><input type="checkbox" checked={rateTracks} onChange={event => setRateTracks(event.target.checked)} /></label>
          {rateTracks && <div className="review-track-list">
            {trackStatus === 'loading' && <p className="review-picker-empty" role="status">Loading the tracklist…</p>}
            {trackStatus === 'error' && <p className="review-picker-empty" role="status">The tracklist is unavailable right now. You can still review the album or choose another release.</p>}
            {tracks.length > 0 && <p className="review-track-progress">{ratedCount} of {tracks.length} songs rated · Unrated songs are optional.</p>}
            {tracks.map(track => <div key={track.id} className="review-track-row"><div className="review-track-title"><span>{track.trackNumber}</span><strong>{track.title}</strong></div><select aria-label={'Rating for ' + track.title} value={trackRatings[track.id] || ''} onChange={event => { const value = Number(event.target.value); setTrackRatings(previous => ({ ...previous, [track.id]: value })); setChangedTrackRatings(previous => ({ ...previous, [track.id]: value })); }}><option value="">Not rated</option>{Array.from({length:10}, (_, index) => (index + 1) / 2).map(value => <option key={value} value={value}>{(value * 2).toFixed(1)} / 10</option>)}</select></div>)}
          </div>}
        </section>

        <div className="review-field">
          <label htmlFor="review-text">Your review <span>Optional</span></label>
          <textarea id="review-text" rows={3} placeholder="What stayed with you? A lyric, a feeling, a favorite moment…" value={reviewText} onChange={event => setReviewText(event.target.value)} />
        </div>

        {tracks.length > 0 && <div className="review-field">
          <label htmlFor="review-favorite-track"><span className="review-label-icon"><Disc3 size={13} /> Favorite track</span><span>Optional</span></label>
          <select id="review-favorite-track" value={favoriteTrack} onChange={event => setFavoriteTrack(event.target.value)}>
            <option value="">Pick a standout track</option>
            {tracks.map(track => <option key={track.id} value={track.title}>{track.trackNumber}. {track.title}</option>)}
          </select>
        </div>}

        <fieldset className="review-tags-field">
          <legend>Mood & tags</legend>
          <div className="review-tags">
            {COMMON_TAGS.map(tag => <button key={tag} type="button" className={'review-tag ' + (selectedTags.includes(tag) ? 'selected' : '')} aria-pressed={selectedTags.includes(tag)}
              onClick={() => setSelectedTags(previous => previous.includes(tag) ? previous.filter(value => value !== tag) : [...previous, tag])}>
              {selectedTags.includes(tag) && <Check size={11} />} {tag.replaceAll('-', ' ')}
            </button>)}
          </div>
        </fieldset>

        <div className="review-listen-row">
          <div className="review-field"><label htmlFor="review-listen-date">Date listened</label><input id="review-listen-date" type="date" required value={listenDate} onChange={event => setListenDate(event.target.value)} /></div>
          <label className={'review-relisten ' + (isRelisten ? 'selected' : '')}><input type="checkbox" checked={isRelisten} onChange={event => setIsRelisten(event.target.checked)} /><RotateCcw size={13} /> Re-listen</label>
        </div>
      </div>
      <footer className="review-form-footer">
        <button id="btn-submit-review" type="submit" className="review-submit">{reviewText.trim() ? 'Publish review' : 'Save rating'}<ArrowUpRight size={17} /></button>
        <p>{reviewText.trim() ? 'Your review will appear in your listening diary.' : 'You can log a listen with just a rating.'}</p>
      </footer>
    </form>
  );
};
