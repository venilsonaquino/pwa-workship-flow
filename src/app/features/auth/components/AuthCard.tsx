import React from 'react';
import { motion } from 'framer-motion';

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const AuthCard: React.FC<AuthCardProps> = ({ children, className = '', delay = 0.2 }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={`w-full max-w-md mx-auto bg-[#201f1f]/60 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-[0_12px_32px_rgba(0,0,0,0.4)] relative overflow-hidden ${className}`}
    >
      {/* Subtle internal glow top edge */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      {children}
    </motion.div>
  );
};

export default AuthCard;
