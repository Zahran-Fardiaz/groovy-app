import { useEffect, useRef, useState, type CSSProperties } from 'react';

export function OverflowText({ text }: { text: string }) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const content = textRef.current;
    if (!container || !content) return;

    const measure = () => setDistance(Math.max(0, content.scrollWidth - container.clientWidth));
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    observer.observe(content);
    measure();
    return () => observer.disconnect();
  }, [text]);

  const style = {
    '--overflow-distance': `${-distance}px`,
    '--overflow-duration': `${Math.max(7, distance / 22 + 4)}s`,
  } as CSSProperties;

  return (
    <span ref={containerRef} className={`album-overflow-text${distance > 1 ? ' is-overflowing' : ''}`} style={style}>
      <span ref={textRef} className="album-overflow-content">{text}</span>
    </span>
  );
}
