import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface LeaderSignupViewProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const LeaderSignupView: React.FC<LeaderSignupViewProps> = ({ onBack, onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [band, setBand] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      alert('A senha deve conter pelo menos 8 caracteres.');
      return;
    }
    // Redireciona para a tela de aprovação pendente
    onSuccess();
  };

  return (
    <div className="bg-[#131313] text-[#e5e2e1] min-h-screen flex flex-col relative overflow-x-hidden antialiased select-none font-sans">
      
      {/* Back Button in header */}
      <div className="absolute top-6 left-6 z-20">
        <button 
          onClick={onBack}
          className="flex items-center gap-1.5 text-[#cac3d8] hover:text-[#cdbdff] transition-colors focus:outline-none group"
        >
          <span className="material-symbols-outlined text-xl transition-transform group-hover:-translate-x-0.5">
            arrow_back
          </span>
          <span className="text-xs font-semibold tracking-wider uppercase font-sans">Voltar</span>
        </button>
      </div>

      {/* Ambient "Light of the Stage" Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[120vw] md:w-[800px] h-[500px] bg-[#7c4dff]/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
      
      {/* Main Content Canvas */}
      <main className="flex-1 flex flex-col justify-center px-6 py-10 relative z-10 w-full max-w-lg mx-auto">
        
        {/* Header Section */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-10 flex flex-col items-center gap-2"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#201f1f] flex items-center justify-center border border-white/5 mb-2 shadow-[0_8px_16px_rgba(0,0,0,0.5)]">
            <span className="material-symbols-outlined text-[#cdbdff] text-3xl font-normal" style={{ fontVariationSettings: "'FILL' 1" }}>
              graphic_eq
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#e5e2e1] tracking-tight">
            Cadastro de Líder
          </h1>
          <p className="text-xs text-[#cac3d8]">
            Configure sua banda e prepare o palco.
          </p>
        </motion.header>

        {/* Registration Form (Glassmorphic Card) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="bg-[#201f1f]/60 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-[0_12px_32px_rgba(0,0,0,0.4)] relative overflow-hidden"
        >
          {/* Subtle internal glow top edge */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            
            {/* Input Group: Name */}
            <div className="flex flex-col gap-1.5 group">
              <label className="text-[12px] font-semibold tracking-wide text-[#cac3d8] group-focus-within:text-[#cdbdff] transition-colors" htmlFor="name">
                NOME COMPLETO
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#cac3d8]/50 group-focus-within:text-[#cdbdff] transition-colors text-xl font-normal">
                  person
                </span>
                <input 
                  className="w-full bg-[#131313]/50 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-base text-[#e5e2e1] placeholder:text-[#cac3d8]/30 focus:outline-none focus:border-[#cdbdff] focus:ring-1 focus:ring-[#cdbdff] focus:bg-[#0e0e0e] transition-all" 
                  id="name" 
                  placeholder="Ex: João Silva" 
                  required 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            {/* Input Group: Email */}
            <div className="flex flex-col gap-1.5 group">
              <label className="text-[12px] font-semibold tracking-wide text-[#cac3d8] group-focus-within:text-[#cdbdff] transition-colors" htmlFor="email">
                E-MAIL PROFISSIONAL
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#cac3d8]/50 group-focus-within:text-[#cdbdff] transition-colors text-xl font-normal">
                  mail
                </span>
                <input 
                  className="w-full bg-[#131313]/50 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-base text-[#e5e2e1] placeholder:text-[#cac3d8]/30 focus:outline-none focus:border-[#cdbdff] focus:ring-1 focus:ring-[#cdbdff] focus:bg-[#0e0e0e] transition-all" 
                  id="email" 
                  placeholder="lider@suabanda.com" 
                  required 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Input Group: Band Name */}
            <div className="flex flex-col gap-1.5 group">
              <label className="text-[12px] font-semibold tracking-wide text-[#cac3d8] group-focus-within:text-[#cdbdff] transition-colors" htmlFor="band">
                NOME DA BANDA / MINISTÉRIO
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#cac3d8]/50 group-focus-within:text-[#cdbdff] transition-colors text-xl font-normal">
                  groups
                </span>
                <input 
                  className="w-full bg-[#131313]/50 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-base text-[#e5e2e1] placeholder:text-[#cac3d8]/30 focus:outline-none focus:border-[#cdbdff] focus:ring-1 focus:ring-[#cdbdff] focus:bg-[#0e0e0e] transition-all" 
                  id="band" 
                  placeholder="Worship Flow Team" 
                  required 
                  type="text"
                  value={band}
                  onChange={(e) => setBand(e.target.value)}
                />
              </div>
            </div>

            {/* Input Group: Password */}
            <div className="flex flex-col gap-1.5 group">
              <label className="text-[12px] font-semibold tracking-wide text-[#cac3d8] group-focus-within:text-[#cdbdff] transition-colors" htmlFor="password">
                SENHA DE ACESSO
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#cac3d8]/50 group-focus-within:text-[#cdbdff] transition-colors text-xl font-normal">
                  lock
                </span>
                <input 
                  className="w-full bg-[#131313]/50 border border-white/10 rounded-lg py-3 pl-12 pr-12 text-base text-[#e5e2e1] placeholder:text-[#cac3d8]/30 focus:outline-none focus:border-[#cdbdff] focus:ring-1 focus:ring-[#cdbdff] focus:bg-[#0e0e0e] transition-all" 
                  id="password" 
                  placeholder="Mínimo 8 caracteres" 
                  required 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#cac3d8]/50 hover:text-[#e5e2e1] transition-colors focus:outline-none" 
                  onClick={togglePasswordVisibility}
                  type="button"
                >
                  <span className="material-symbols-outlined text-xl font-normal">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-4">
              <button 
                className="w-full bg-gradient-to-r from-[#7c4dff] to-[#6833ea] text-white font-semibold text-sm py-4 px-6 rounded-full shadow-[0_4px_14px_0_rgba(124,77,255,0.39)] hover:shadow-[0_6px_20px_rgba(124,77,255,0.5)] hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.98] active:translate-y-0 flex items-center justify-center gap-2" 
                type="submit"
              >
                <span>Criar Conta</span>
                <span className="material-symbols-outlined text-sm font-normal">arrow_forward</span>
              </button>
            </div>
            
          </form>
        </motion.div>

        {/* Footer Link */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 text-center"
        >
          <p className="text-xs text-[#cac3d8]">
            Já possui uma conta?{' '}
            <button 
              onClick={onBack}
              className="text-[#cdbdff] hover:text-[#e8deff] transition-colors font-bold uppercase tracking-wider ml-1 underline-offset-4 hover:underline focus:outline-none"
            >
              Fazer Login
            </button>
          </p>
        </motion.div>

      </main>
    </div>
  );
};

export default LeaderSignupView;
