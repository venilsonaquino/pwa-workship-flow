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
      initial={{ opacity: 0, scale: 0.8, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 12 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className={cn(
        'fixed bottom-24 right-6 z-40 flex items-center justify-center vivid-gradient text-white shadow-[0_6px_20px_rgba(124,58,237,0.3)] select-none cursor-pointer',
        isExtended 
          ? 'h-12 px-4 rounded-full gap-1.5 text-[12px] font-semibold tracking-wide font-label-sm' 
          : 'w-12 h-12 rounded-full',
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
