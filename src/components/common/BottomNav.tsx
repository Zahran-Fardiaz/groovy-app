import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TabType } from '../../types/music';

interface BottomNavProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onQuickLogClick: () => void;
}

// 1. Friendly Home Icon: soft rounded organic shape with smile
const FriendlyHomeIcon: React.FC<{ active: boolean; size?: number }> = ({ active, size = 21 }) => {
  if (active) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#000000" style={{ flexShrink: 0 }}>
        <path d="M 6.8 9.2 Q 12 3.8 17.2 9.2 Q 20.2 11.2 19 14.5 L 18 17.5 Q 17.2 19.8 15 19.8 L 9 19.8 Q 6.8 19.8 6 17.5 L 5 14.5 Q 3.8 11.2 6.8 9.2 Z" />
        <path d="M 9.8 14.8 Q 12 17.2 14.2 14.8" stroke="#D4FF32" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" style={{ flexShrink: 0 }}>
      <path d="M 6.8 9.2 Q 12 3.8 17.2 9.2 Q 20.2 11.2 19 14.5 L 18 17.5 Q 17.2 19.8 15 19.8 L 9 19.8 Q 6.8 19.8 6 17.5 L 5 14.5 Q 3.8 11.2 6.8 9.2 Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 9.8 14.8 Q 12 17.2 14.2 14.8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
};

// 2. Friendly Search Icon: black circle with lime crescent reflection when active, white outline when inactive
const FriendlySearchIcon: React.FC<{ active: boolean; size?: number }> = ({ active, size = 20 }) => {
  if (active) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
        <circle cx="10" cy="10" r="6.8" fill="#000000" />
        <path d="M7.6 7.6 C8.3 6.6 9.6 6.1 10.7 6.1" stroke="#D4FF32" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M15.2 15.2 L20.5 20.5" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="10.5" cy="10.5" r="6.8" />
      <path d="M15.5 15.5 L21 21" strokeWidth="2.2" />
    </svg>
  );
};

// 3. Plus Icon (⊕ circle with plus)
const CirclePlusIcon: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="9.2" />
    <path d="M12 8 L12 16" />
    <path d="M8 12 L16 12" />
  </svg>
);

// 4. Two Leaning Books Icon
const BooksLibraryIcon: React.FC<{ size?: number }> = ({ size = 21 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <rect x="4.4" y="4.5" width="5.4" height="15" rx="1.8" transform="rotate(-8 7.1 12)" />
    <rect x="14" y="4.5" width="5.4" height="15" rx="1.8" transform="rotate(8 16.7 12)" />
    <path d="M6.5 15.5 L8 15.5" />
    <path d="M16 15.5 L17.5 15.5" />
  </svg>
);

// 5. User Profile Icon
const ProfileUserIcon: React.FC<{ size?: number }> = ({ size = 21 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="7" r="4" />
    <path d="M4.5 20.5 C4.5 16.8 7.8 14 12 14 C16.2 14 19.5 16.8 19.5 20.5" />
  </svg>
);

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  onQuickLogClick
}) => {
  const navRef = useRef<HTMLElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Navigation indices: 0: Home, 1: Search, 2: Quick Log, 3: For You, 4: Profile
  const getActiveIndex = useCallback(() => {
    switch (currentTab) {
      case 'feed': return 0;
      case 'search': return 1;
      case 'recommendations': return 3;
      case 'profile': return 4;
      default: return 0;
    }
  }, [currentTab]);

  const activeIndex = getActiveIndex();

  // Proportions according to guide specifications
  const [dockWidth, setDockWidth] = useState(393);
  const dockHeight = 92;       // 88–96px dock height
  const shelfY = 0;            // Flat shelf level across the navbar
  const pH = 46;               // Capsule height
  const R = pH / 2;            // Capsule radius: 23px
  const cY = 8 + R;            // Vertical center of capsule: 31px
  const d = 8;                 // Uniform 8px space around capsule inside notch
  const R_outer = R + d;       // Concentric outer radius: 31px
  const floorY = cY + R_outer; // Floor depth: 62px
  const r_top = 20;            // Upper convex fillet radius onto shelf

  // Active button measurement & smooth animation
  const [activeRect, setActiveRect] = useState({ left: 14, width: 108 });
  const activeRectRef = useRef(activeRect);

  useEffect(() => {
    activeRectRef.current = activeRect;
  }, [activeRect]);

  const rafRef = useRef<number | null>(null);

  const updateMeasurements = useCallback((animate = true) => {
    const activeBtn = buttonRefs.current[activeIndex];
    if (!activeBtn || !navRef.current) return;

    const navRect = navRef.current.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();

    const targetLeft = btnRect.left - navRect.left;
    const targetWidth = btnRect.width;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!animate || prefersReducedMotion) {
      setActiveRect({ left: targetLeft, width: targetWidth });
      return;
    }

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const startLeft = activeRectRef.current.left;
    const startWidth = activeRectRef.current.width;
    const startTime = performance.now();
    const duration = 260; // ms cubic ease-out

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Smooth cubic ease-out
      const ease = 1 - Math.pow(1 - progress, 3);

      setActiveRect({
        left: startLeft + (targetLeft - startLeft) * ease,
        width: startWidth + (targetWidth - startWidth) * ease
      });

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
  }, [activeIndex]);

  // Keep shape aligned when viewport or phone frame changes width
  useEffect(() => {
    if (!navRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setDockWidth(entry.contentRect.width);
          updateMeasurements(false);
        }
      }
    });
    observer.observe(navRef.current);
    return () => observer.disconnect();
  }, [updateMeasurements]);

  // Animate notch whenever active tab changes
  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      updateMeasurements(true);
    });
    return () => {
      cancelAnimationFrame(frameId);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [activeIndex, updateMeasurements]);

  // Capsule geometry
  const pL = activeRect.left;
  const pR = activeRect.left + activeRect.width;
  const c_left_x = pL + R;
  const c_right_x = pR - R;

  // Concentric Equator Points (left and right apexes of the concentric notch)
  const equator_L_x = c_left_x - R_outer;
  const equator_L_y = cY;
  const equator_R_x = c_right_x + R_outer;
  const equator_R_y = cY;

  // 1. Left contour: flat shelf → upper shoulder → lower scoop wrapping around left capsule end
  let leftContour = '';
  const shelf_L_x = equator_L_x - r_top;

  if (shelf_L_x <= 0) {
    // When active tab is on the far left (Home), curve down directly from the left edge
    const cp1_x = Math.max(0, equator_L_x * 0.3);
    const cp2_y = cY - (cY - shelfY) * 0.45;
    const cp3_y = floorY - (floorY - cY) * 0.45;
    const cp4_x = c_left_x - R_outer * 0.55;

    leftContour = `M 0,${shelfY} C ${cp1_x.toFixed(1)},${shelfY} ${equator_L_x.toFixed(1)},${cp2_y.toFixed(1)} ${equator_L_x.toFixed(1)},${equator_L_y.toFixed(1)} C ${equator_L_x.toFixed(1)},${cp3_y.toFixed(1)} ${cp4_x.toFixed(1)},${floorY} ${c_left_x.toFixed(1)},${floorY}`;
  } else {
    // Standard left shelf then concentric S-curve wrapping around left circular end
    const cp1_x = shelf_L_x + r_top * 0.55;
    const cp2_y = cY - (cY - shelfY) * 0.45;
    const cp3_y = floorY - (floorY - cY) * 0.45;
    const cp4_x = c_left_x - R_outer * 0.55;

    leftContour = `M 0,${shelfY} L ${shelf_L_x.toFixed(1)},${shelfY} C ${cp1_x.toFixed(1)},${shelfY} ${equator_L_x.toFixed(1)},${cp2_y.toFixed(1)} ${equator_L_x.toFixed(1)},${equator_L_y.toFixed(1)} C ${equator_L_x.toFixed(1)},${cp3_y.toFixed(1)} ${cp4_x.toFixed(1)},${floorY} ${c_left_x.toFixed(1)},${floorY}`;
  }

  // 2. Pocket beneath active button: flat horizontal floor under the straight capsule segment
  const pocket = `L ${c_right_x.toFixed(1)},${floorY}`;

  // 3. Right contour: lower scoop wrapping around right capsule end → upper shoulder → flat shelf
  let rightContour = '';
  const shelf_R_x = equator_R_x + r_top;

  const cp1_R_x = c_right_x + R_outer * 0.55;
  const cp2_R_y = floorY - (floorY - cY) * 0.45;
  const cp3_R_y = cY - (cY - shelfY) * 0.45;

  if (shelf_R_x >= dockWidth) {
    const endX = dockWidth;
    const cp4_R_x = endX - (endX - equator_R_x) * 0.55;
    rightContour = `C ${cp1_R_x.toFixed(1)},${floorY} ${equator_R_x.toFixed(1)},${cp2_R_y.toFixed(1)} ${equator_R_x.toFixed(1)},${equator_R_y.toFixed(1)} C ${equator_R_x.toFixed(1)},${cp3_R_y.toFixed(1)} ${cp4_R_x.toFixed(1)},${shelfY} ${endX.toFixed(1)},${shelfY}`;
  } else {
    const cp4_R_x = shelf_R_x - r_top * 0.55;
    rightContour = `C ${cp1_R_x.toFixed(1)},${floorY} ${equator_R_x.toFixed(1)},${cp2_R_y.toFixed(1)} ${equator_R_x.toFixed(1)},${equator_R_y.toFixed(1)} C ${equator_R_x.toFixed(1)},${cp3_R_y.toFixed(1)} ${cp4_R_x.toFixed(1)},${shelfY} ${shelf_R_x.toFixed(1)},${shelfY} L ${dockWidth},${shelfY}`;
  }

  // Close path along bottom of navbar
  const strokePath = `${leftContour} ${pocket} ${rightContour}`;
  const fillPath = `${strokePath} L ${dockWidth},${dockHeight} L 0,${dockHeight} Z`;

  return (
    <nav
      className="bottom-nav-bar morphing-notch-dock"
      ref={navRef}
      aria-label="Mobile Navigation"
    >
      {/* Layer 2: Black SVG dock with recessed pocket */}
      <svg
        className="notch-dock-svg"
        viewBox={`0 0 ${dockWidth} ${dockHeight}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          {/* Luminous Specular Rim Light along the top contour */}
          <linearGradient id="notchRimLight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.22)" />
            <stop offset="40%" stopColor="rgba(255, 255, 255, 0.12)" />
            <stop offset="75%" stopColor="rgba(255, 255, 255, 0.02)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>
        </defs>

        {/* Solid #000 dock shape */}
        <path d={fillPath} fill="#000000" />

        {/* Top edge stroke */}
        <path
          d={strokePath}
          fill="none"
          stroke="url(#notchRimLight)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>

      {/* Layer 3: Navigation buttons above SVG with aligned icon centers */}
      <div className="notch-dock-items">
        {/* 1. Feed / Home */}
        <button
          ref={(el) => { buttonRefs.current[0] = el; }}
          id="nav-tab-feed"
          className={`nav-item-btn ${currentTab === 'feed' ? 'active-pill' : ''}`}
          onClick={() => onTabChange('feed')}
          title="Home"
          aria-label="Home"
          aria-current={currentTab === 'feed' ? 'page' : undefined}
        >
          <FriendlyHomeIcon active={currentTab === 'feed'} size={21} />
          {currentTab === 'feed' && <span className="nav-capsule-text">Home</span>}
        </button>

        {/* 2. Explore / Search */}
        <button
          ref={(el) => { buttonRefs.current[1] = el; }}
          id="nav-tab-search"
          className={`nav-item-btn ${currentTab === 'search' ? 'active-pill' : ''}`}
          onClick={() => onTabChange('search')}
          title="Search"
          aria-label="Search"
          aria-current={currentTab === 'search' ? 'page' : undefined}
        >
          <FriendlySearchIcon active={currentTab === 'search'} size={20} />
          {currentTab === 'search' && <span className="nav-capsule-text">Search</span>}
        </button>

        {/* 3. Center Quick Log Button (⊕ CirclePlus) */}
        <button
          ref={(el) => { buttonRefs.current[2] = el; }}
          id="nav-action-quick-log"
          className="nav-item-btn nav-quick-log-btn"
          onClick={onQuickLogClick}
          aria-label="Log or review music"
          title="Quick Log & Review"
        >
          <CirclePlusIcon size={22} />
        </button>

        {/* 4. Recommendations / For You */}
        <button
          ref={(el) => { buttonRefs.current[3] = el; }}
          id="nav-tab-recommendations"
          className={`nav-item-btn ${currentTab === 'recommendations' ? 'active-pill' : ''}`}
          onClick={() => onTabChange('recommendations')}
          title="For You"
          aria-label="For You"
          aria-current={currentTab === 'recommendations' ? 'page' : undefined}
        >
          <BooksLibraryIcon size={21} />
          {currentTab === 'recommendations' && <span className="nav-capsule-text">For You</span>}
        </button>

        {/* 5. Profile */}
        <button
          ref={(el) => { buttonRefs.current[4] = el; }}
          id="nav-tab-profile"
          className={`nav-item-btn ${currentTab === 'profile' ? 'active-pill' : ''}`}
          onClick={() => onTabChange('profile')}
          title="Profile"
          aria-label="Profile"
          aria-current={currentTab === 'profile' ? 'page' : undefined}
        >
          <ProfileUserIcon size={21} />
          {currentTab === 'profile' && <span className="nav-capsule-text">Profile</span>}
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
