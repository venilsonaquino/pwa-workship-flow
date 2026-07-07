import React from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: React.ReactNode;
  glowType?: 'welcome' | 'leader' | 'member' | 'pending';
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, glowType }) => {
  return (
    <div className="bg-[#131313] text-[#e5e2e1] min-h-screen flex flex-col font-sans antialiased relative overflow-x-hidden select-none">
      
      {/* Stage light glows (customizable background effects) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {glowType === 'welcome' && (
          <div className="absolute inset-0 z-0 flex items-start justify-center pt-20 pointer-events-none">
            <div
              className="w-[150vw] h-[150vw] md:w-[80vw] md:h-[80vw] max-w-4xl max-h-4xl rounded-full blur-3xl opacity-80"
              style={{
                background: 'radial-gradient(circle at center, rgba(124, 77, 255, 0.15) 0%, rgba(19, 19, 19, 0) 70%)',
              }}
            />
          </div>
        )}

        {glowType === 'leader' && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120vw] md:w-[800px] h-[500px] bg-[#7c4dff]/20 blur-[120px] rounded-full pointer-events-none z-0" />
        )}

        {glowType === 'member' && (
          <>
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[150vw] md:w-[80vw] h-[442px] bg-[#7c4dff]/10 rounded-[100%] blur-[120px] opacity-70" />
            <div className="absolute bottom-0 right-0 w-[50vw] h-[353px] bg-[#c3841b]/5 rounded-full blur-[100px] opacity-50" />
          </>
        )}

        {glowType === 'pending' && (
          <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
            <motion.div 
              animate={{
                opacity: [0.15, 0.25, 0.15],
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute w-[60vh] h-[60vh] bg-[#ffb954] rounded-full blur-[120px]"
            />
            <div className="absolute w-[40vh] h-[40vh] bg-[#7c4dff] rounded-full blur-[100px] opacity-10 -translate-y-1/4 translate-x-1/4" />
          </div>
        )}
      </div>

      {/* Children Wrapper */}
      <div className="relative z-10 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
