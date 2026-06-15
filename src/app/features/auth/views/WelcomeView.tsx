import React from 'react';
import { motion } from 'framer-motion';
import { type UserRole } from '@shared/hooks';
import { AuthLayout } from '../components';

interface WelcomeViewProps {
  onSelectRole: (role: UserRole) => void;
  onLogin: () => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({ onSelectRole, onLogin }) => {
  const handleSelectRole = (role: UserRole) => {
    onSelectRole(role);
  };

  return (
    <AuthLayout glowType="welcome">
      {/* Main Content Canvas */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-8 w-full max-w-md mx-auto">
        
        {/* Header Section */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center mb-10 w-full text-center"
        >
          {/* Logo Mark */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7c4dff] to-[#6833ea] flex items-center justify-center mb-6 shadow-[0_8px_32px_rgba(124,77,255,0.3)]">
            <span className="material-symbols-outlined text-[#fcf6ff] text-4xl font-normal" style={{ fontVariationSettings: "'FILL' 1" }}>
              graphic_eq
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#e5e2e1] mb-2 tracking-tight">
            Bem-vindo ao WorshipFlow
          </h1>
          <p className="text-base text-[#cac3d8] max-w-[280px]">
            Escolha como deseja acessar o ministério
          </p>
        </motion.header>

        {/* Selection Cards Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="w-full flex flex-col gap-2"
        >
          {/* Option 1: Leader */}
          <button
            onClick={() => handleSelectRole('Líder de Louvor')}
            className="group bg-[rgba(32,31,31,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-xl p-6 flex items-center w-full text-left transition-all duration-300 hover:bg-[#201f1f] hover:border-[#cdbdff]/40 focus:outline-none focus:ring-2 focus:ring-[#cdbdff] focus:border-transparent active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-full bg-[#2a2a2a] flex items-center justify-center mr-4 group-hover:bg-[#7c4dff]/20 transition-colors">
              <span className="material-symbols-outlined text-[#cdbdff] text-2xl font-normal" style={{ fontVariationSettings: "'FILL' 0" }}>
                music_cast
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-[#e5e2e1] mb-1 group-hover:text-[#e8deff] transition-colors">
                Sou Líder de Louvor
              </h2>
              <p className="text-xs text-[#cac3d8]">
                Criar e gerenciar uma nova banda
              </p>
            </div>
            <span className="material-symbols-outlined text-[#cac3d8] group-hover:text-[#cdbdff] transition-all group-hover:translate-x-1 duration-300">
              arrow_forward
            </span>
          </button>

          {/* Option 2: Member */}
          <button
            onClick={() => handleSelectRole('Integrante')}
            className="group bg-[rgba(32,31,31,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-xl p-6 flex items-center w-full text-left transition-all duration-300 hover:bg-[#201f1f] hover:border-[#cdbdff]/40 focus:outline-none focus:ring-2 focus:ring-[#cdbdff] focus:border-transparent active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-full bg-[#2a2a2a] flex items-center justify-center mr-4 group-hover:bg-[#7c4dff]/20 transition-colors">
              <span className="material-symbols-outlined text-[#ffb954] text-2xl font-normal" style={{ fontVariationSettings: "'FILL' 0" }}>
                group_add
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-[#e5e2e1] mb-1 group-hover:text-[#e8deff] transition-colors">
                Sou Integrante
              </h2>
              <p className="text-xs text-[#cac3d8]">
                Entrar em uma banda já existente
              </p>
            </div>
            <span className="material-symbols-outlined text-[#cac3d8] group-hover:text-[#ffb954] transition-all group-hover:translate-x-1 duration-300">
              arrow_forward
            </span>
          </button>
        </motion.div>

        {/* Login Link */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-6"
        >
          <button 
            onClick={onLogin}
            className="text-xs text-[#cac3d8] hover:text-[#cdbdff] transition-colors focus:outline-none"
          >
            Já possui uma conta? <span className="text-[#cdbdff] font-bold underline decoration-[#cdbdff]/30 underline-offset-4 font-sans">Entrar</span>
          </button>
        </motion.div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10"
        >
          <p className="text-xs font-semibold text-[#948ea1] tracking-wide">
            Precisa de ajuda?{' '}
            <a 
              className="text-[#cdbdff] hover:text-[#e8deff] transition-colors underline decoration-[#cdbdff]/30 underline-offset-4 font-bold" 
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              Fale com o suporte
            </a>
          </p>
        </motion.div>

      </main>
    </AuthLayout>
  );
};

export default WelcomeView;
