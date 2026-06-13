import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@src/lib/utils';

export interface FloatingActionButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  icon?: React.ReactNode;
  label?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  label,
  className,
  ...props
}) => {
  const isExtended = !!label;

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0, opacity: 0, y: 20 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={cn(
        'fixed bottom-24 right-6 z-40 flex items-center justify-center vivid-gradient text-white shadow-[0_8px_25px_rgba(124,58,237,0.4)] transition-all select-none cursor-pointer',
        isExtended 
          ? 'h-14 px-6 rounded-full gap-2 text-[14px] font-semibold tracking-wide font-label-lg' 
          : 'w-14 h-14 rounded-full',
        className
      )}
      {...props}
    >
      {icon && <span className="flex items-center justify-center shrink-0">{icon}</span>}
      {isExtended && <span className="whitespace-nowrap">{label}</span>}
    </motion.button>
  );
};

export default FloatingActionButton;
