import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@src/lib/utils';

export interface MarqueeTextProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  speed?: number;
  minDuration?: number;
  maxDuration?: number;
  maskWidth?: number;
}

export const MarqueeText: React.FC<MarqueeTextProps> = ({
  text,
  className,
  speed = 10,
  minDuration = 6,
  maxDuration = 25,
  maskWidth = 12,
  style,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [scrollDist, setScrollDist] = useState(0);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current && containerRef.current) {
        const parentWidth = containerRef.current.clientWidth;
        const scrollWidth = textRef.current.scrollWidth;
        const diff = parentWidth - scrollWidth;
        setScrollDist(diff < 0 ? diff : 0);
      }
    };

    checkOverflow();
    const timer = setTimeout(checkOverflow, 150);
    window.addEventListener('resize', checkOverflow);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkOverflow);
    };
  }, [text]);

  const duration = Math.max(minDuration, Math.min(maxDuration, Math.abs(scrollDist) / speed));
  const isOverflowing = scrollDist < 0;

  return (
    <div
      ref={containerRef}
      className={cn(
        "overflow-hidden w-full relative min-w-0",
        isOverflowing && "mask-marquee",
        className
      )}
      style={{
        '--marquee-scroll': `${scrollDist}px`,
        '--marquee-duration': `${duration}s`,
        '--marquee-mask-width': `${maskWidth}px`,
        ...style,
      } as React.CSSProperties}
      {...props}
    >
      <span
        ref={textRef}
        className={cn(
          "whitespace-nowrap text-left",
          isOverflowing ? "animate-marquee-bounce inline-block" : "block"
        )}
        style={{
          paddingLeft: isOverflowing ? '16px' : '0',
          paddingRight: isOverflowing ? '16px' : '0'
        }}
      >
        {text}
      </span>
    </div>
  );
};

export default MarqueeText;
