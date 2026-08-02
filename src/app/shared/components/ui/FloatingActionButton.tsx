import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@src/lib/utils';

export interface FloatingActionButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  icon?: React.ReactNode;
  label?: string;
}

const SCROLL_DELTA_THRESHOLD = 6;
const TOP_VISIBILITY_THRESHOLD = 16;

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  label,
  className,
  ...props
}) => {
  const isExtended = !!label;
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollTopRef = useRef(0);

  useEffect(() => {
    const scrollContainer = document.querySelector<HTMLElement>('.scroll-container-native');
    if (!scrollContainer) return;

    let animationFrameId: number | null = null;
    lastScrollTopRef.current = scrollContainer.scrollTop;

    const updateVisibility = () => {
      const currentScrollTop = Math.max(scrollContainer.scrollTop, 0);
      const scrollDelta = currentScrollTop - lastScrollTopRef.current;

      if (currentScrollTop <= TOP_VISIBILITY_THRESHOLD) {
        setIsVisible(true);
      } else if (Math.abs(scrollDelta) >= SCROLL_DELTA_THRESHOLD) {
        setIsVisible(scrollDelta < 0);
      }

      lastScrollTopRef.current = currentScrollTop;
      animationFrameId = null;
    };

    const handleScroll = () => {
      if (animationFrameId === null) {
        animationFrameId = window.requestAnimationFrame(updateVisibility);
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const button = (
    <motion.button
      initial={{ opacity: 0, scale: 0.92, y: 16 }}
      animate={{ opacity: isVisible ? 1 : 0, scale: 1, y: isVisible ? 0 : 96 }}
      exit={{ opacity: 0, scale: 0.92, y: 96 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'fixed bottom-28 right-6 z-[60] flex items-center justify-center vivid-gradient text-white shadow-[0_10px_32px_rgba(124,58,237,0.55),0_4px_12px_rgba(0,0,0,0.5)] ring-1 ring-white/15 select-none cursor-pointer motion-reduce:transition-none',
        !isVisible && 'pointer-events-none',
        isExtended 
          ? 'h-12 px-4 rounded-full gap-1.5 text-[12px] font-semibold tracking-wide font-label-sm' 
          : 'w-12 h-12 rounded-full',
        className
      )}
      {...props}
      aria-hidden={!isVisible}
      tabIndex={isVisible ? props.tabIndex : -1}
    >
      {icon && <span className="flex items-center justify-center shrink-0">{icon}</span>}
      {isExtended && <span className="whitespace-nowrap">{label}</span>}
    </motion.button>
  );

  return createPortal(button, document.body);
};

export default FloatingActionButton;
