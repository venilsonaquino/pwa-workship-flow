import React from 'react';
import { motion } from 'framer-motion';
import { AuthLayout } from '../components';

interface PendingApprovalViewProps {
  onBack: () => void;
}

export const PendingApprovalView: React.FC<PendingApprovalViewProps> = ({ onBack }) => {
  return (
    <AuthLayout glowType="pending">
      {/* Main Content Canvas */}
      <main className="relative z-10 w-full max-w-[400px] px-6 flex flex-col items-center text-center py-10 mx-auto my-auto flex-1 justify-center">
        
        {/* Illustration/Icon Container */}
        <motion.div 
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="mb-10 relative"
        >
          {/* Glassmorphic backing */}
          <div className="w-32 h-32 rounded-full bg-[#201f1f]/40 backdrop-blur-xl border border-white/5 shadow-[0_12px_32px_rgba(0,0,0,0.4)] flex items-center justify-center relative z-10">
            <span className="material-symbols-outlined text-[64px] text-[#ffb954] drop-shadow-[0_0_15px_rgba(255,185,84,0.3)] font-normal" style={{ fontVariationSettings: "'FILL' 0" }}>
              hourglass_top
            </span>
          </div>

          {/* Orbital decorative elements */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-4 border border-[#ffb954]/20 rounded-full border-dashed z-0 pointer-events-none"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-8 border border-white/5 rounded-full z-0 pointer-events-none"
          />
        </motion.div>

        {/* Typography */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-2xl font-extrabold text-[#e5e2e1] mb-2 tracking-tight"
        >
          Conta em análise
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base text-[#cac3d8] mb-10 px-4 max-w-[320px]"
        >
          Sua conta foi criada e está aguardando aprovação manual. Você receberá um e-mail assim que for liberada para gerenciar sua banda.
        </motion.p>

        {/* Action Area */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full mt-2"
        >
          {/* Secondary (Ghost) Button as per guidelines: Border-only with Primary color text */}
          <button 
            onClick={onBack}
            className="w-full flex items-center justify-center h-14 rounded-full border border-[#cdbdff] text-[#cdbdff] font-semibold text-xs uppercase tracking-wider hover:bg-[#cdbdff]/10 transition-colors active:scale-95 duration-200 focus:outline-none"
          >
            <span className="material-symbols-outlined mr-2 text-[20px] leading-none font-normal">
              arrow_back
            </span>
            Voltar para Início
          </button>
        </motion.div>

      </main>
    </AuthLayout>
  );
};

export default PendingApprovalView;
