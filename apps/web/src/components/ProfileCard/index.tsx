'use client';

import React, { useRef, useState } from 'react';
import './ProfileCard.css';

type Photo = { url: string };
type Profile = {
  id: number;
  display_name: string;
  age?: number | null;
  bio?: string | null;
  badges: string[];
  circle?: string | null;
  photos: Photo[];
};

export default function ProfileCard({
  p,
  onLike,
  onPass,
  isTop,
  mode = 'open',
  expanded = false,
  onExpand,
  onCollapse,
}: {
  p: Profile;
  onLike: (id: number) => Promise<void> | void;
  onPass: (id: number) => Promise<void> | void;
  isTop?: boolean;
  mode?: 'open' | 'blind';
  expanded?: boolean;
  onExpand?: () => void;
  onCollapse?: () => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const [photoIndex, setPhotoIndex] = useState(0);

  function onPointerDown(e: React.PointerEvent) {
    if (!isTop || expanded) return; // only top card draggable and not when expanded
    (e.target as Element).setPointerCapture(e.pointerId);
    startX.current = e.clientX;
    startY.current = e.clientY;
    lastX.current = 0;
    lastY.current = 0;
    setDragging(true);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging || !ref.current) return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;
    lastX.current = dx;
    lastY.current = dy;
    const rot = Math.max(-25, Math.min(25, dx / 10));
    ref.current.style.transition = 'none';
    ref.current.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
  }

  function settle(action?: 'like' | 'pass') {
    if (!ref.current) return;
    ref.current.style.transition = 'transform 600ms cubic-bezier(0.4, 0.2, 0.2, 1)';
    if (action === 'like') {
      ref.current.style.transform = `translate(1000px, ${lastY.current}px) rotate(25deg)`;
    } else if (action === 'pass') {
      ref.current.style.transform = `translate(-1000px, ${lastY.current}px) rotate(-25deg)`;
    } else {
      ref.current.style.transform = '';
    }
  }

  async function onPointerUp(e: React.PointerEvent) {
    if (!dragging || !ref.current) return;
    setDragging(false);
    const dx = lastX.current;
    const threshold = 120;
    if (dx > threshold) {
      // like
      settle('like');
      try {
        await onLike(p.id);
      } catch (err) {
        // ignore
      }
    } else if (dx < -threshold) {
      // pass
      settle('pass');
      try {
        await onPass(p.id);
      } catch (err) {
        // ignore
      }
    } else {
      settle();
    }
  }

  function toggleExpand() {
    if (expanded) {
      onCollapse?.();
    } else {
      onExpand?.();
      setPhotoIndex(0);
    }
  }

  function prevPhoto() {
    setPhotoIndex((i) => (i > 0 ? i - 1 : p.photos.length - 1));
  }

  function nextPhoto() {
    setPhotoIndex((i) => (i + 1) % Math.max(1, p.photos.length));
  }

  return (
    <div
      className={`pm-card-wrapper ${expanded ? 'expanded' : ''}`}
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div className={`profile-card ${isTop ? 'top' : ''} ${expanded ? 'expanded' : ''}`}>
        <div className="image-wrap" onDoubleClick={toggleExpand}>
          {p.photos && p.photos.length > 0 ? (
            <img
              className={`profile-image${mode === 'blind' ? ' blurred' : ''}`}
              src={p.photos[photoIndex]?.url || '/lyra-fallback.jpg'}
              alt={p.display_name}
            />
          ) : (
            <img className={`profile-image${mode === 'blind' ? ' blurred' : ''}`} src={'/lyra-fallback.jpg'} alt={p.display_name} />
          )}
          {expanded && p.photos && p.photos.length > 1 && (
            <div className="carousel-controls">
              <button className="carousel prev" onClick={(e) => { e.stopPropagation(); prevPhoto(); }}>‹</button>
              <button className="carousel next" onClick={(e) => { e.stopPropagation(); nextPhoto(); }}>›</button>
            </div>
          )}
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>
              {p.display_name} {p.age !== undefined && p.age !== null && <span className="age">• {p.age}</span>}
            </h3>
            <button className="view-more" onClick={toggleExpand}>{expanded ? 'Close' : 'View more'}</button>
          </div>
          {p.bio && <p className="bio">{p.bio}</p>}

          {expanded && (
            <div className="expanded-details">
              <div className="badges">
                {(p.badges || []).map((b, i) => (
                  <span key={i} className="badge">{b}</span>
                ))}
              </div>
              <div className="responses">
                {/* placeholder for other user's responses or extra details */}
                <h4>About</h4>
                <p className="detail">More detailed profile text and answers go here. If the backend provides additional fields like prompts/responses, they will be displayed here.</p>
              </div>
            </div>
          )}

          <div className="card-actions">
            <button
              className="action pass"
              onClick={async (e) => {
                e.stopPropagation();
                // animate left then call
                if (!ref.current) return;
                settle('pass');
                await onPass(p.id);
              }}
            >
              ✕ Pass
            </button>
            <button
              className="action like"
              onClick={async (e) => {
                e.stopPropagation();
                if (!ref.current) return;
                settle('like');
                await onLike(p.id);
              }}
            >
              ♥ Like
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
