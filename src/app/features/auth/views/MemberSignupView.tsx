import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@shared/hooks';

interface MemberSignupViewProps {
  onBack: () => void;
}

export const MemberSignupView: React.FC<MemberSignupViewProps> = ({ onBack }) => {
  const { login } = useAuth();
  const [bandCode, setBandCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleBandCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    let formattedValue = '';
    
    for (let i = 0; i < value.length; i++) {
      if (i === 4) {
        formattedValue += '-';
      }
      formattedValue += value[i];
    }
    
    setBandCode(formattedValue.substring(0, 9));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bandCode || bandCode.length < 9) {
      alert('Por favor, informe um código de banda válido no formato XXXX-XXXX.');
      return;
    }
    if (password.length < 6) {
      alert('A senha deve conter pelo menos 6 caracteres.');
      return;
    }
    // Efetua login direto para Integrantes
    login('Integrante', fullName, email);
  };

  return (
    <div className="bg-[#131313] text-[#e5e2e1] min-h-screen flex flex-col font-sans antialiased relative overflow-x-hidden select-none">
      
      {/* Back Button */}
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

      {/* The Light of the Stage - Ambient Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[150vw] md:w-[80vw] h-[442px] bg-[#7c4dff]/10 rounded-[100%] blur-[120px] opacity-70"></div>
        <div className="absolute bottom-0 right-0 w-[50vw] h-[353px] bg-[#c3841b]/5 rounded-full blur-[100px] opacity-50"></div>
      </div>

      {/* Main Registration Canvas */}
      <main className="relative z-10 flex-1 flex flex-col px-6 py-10 md:justify-center md:items-center min-h-screen">
        
        {/* Glassmorphic Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto bg-[#201f1f]/60 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-[0_12px_32px_rgba(0,0,0,0.4)] relative overflow-hidden"
        >
          {/* Subtle internal glow top edge */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          {/* Header Section */}
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col items-center text-center mb-8 mt-4 md:mt-0"
          >
            <div className="w-16 h-16 rounded-full bg-[#2a2a2a] border border-white/5 flex items-center justify-center mb-6 shadow-lg">
              <span className="material-symbols-outlined text-[#cdbdff] text-3xl font-normal" style={{ fontVariationSettings: "'FILL' 1" }}>
                groups
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#e5e2e1] mb-2 tracking-tight">
              Junte-se à Equipe
            </h1>
            <p className="text-xs text-[#cac3d8] max-w-[280px]">
              Preencha seus dados para conectar-se ao repertório do seu ministério.
            </p>
          </motion.header>

          <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
            
            {/* Highlighted Band Code Field */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="flex flex-col bg-[#2a2a2a] rounded-xl border border-[#7c4dff]/30 p-6 relative overflow-hidden group focus-within:border-[#7c4dff] focus-within:ring-1 focus-within:ring-[#7c4dff] transition-all duration-300"
            >
              {/* Subtle inner glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#7c4dff]/10 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
              
              <label className="text-[12px] font-bold text-[#cdbdff] text-center tracking-wider uppercase mb-3" htmlFor="bandCode">
                Código da Banda
              </label>
              
              <div className="relative flex justify-center">
                <input 
                  autoComplete="off" 
                  className="w-full bg-transparent border-none text-center text-2xl font-bold tracking-[0.2em] text-[#e5e2e1] focus:ring-0 placeholder:text-[#353534] placeholder:opacity-40 uppercase outline-none" 
                  id="bandCode" 
                  maxLength={9} 
                  placeholder="XXXX-XXXX" 
                  type="text"
                  value={bandCode}
                  onChange={handleBandCodeChange}
                  required
                />
              </div>
              
              <p className="text-center text-[11px] text-[#ffb954] mt-3.5 flex items-center justify-center gap-1.5 opacity-90 font-medium">
                <span className="material-symbols-outlined text-[15px] font-normal">info</span>
                Peça o código ao seu líder de louvor
              </p>
            </motion.div>

            {/* Divider line */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-1"
            />

            {/* Personal Information Fields */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="flex flex-col gap-4"
            >
              {/* Nome */}
              <div className="flex flex-col gap-1.5 group">
                <label className="text-[12px] font-semibold tracking-wide text-[#cac3d8] group-focus-within:text-[#cdbdff] transition-colors" htmlFor="fullName">
                  NOME COMPLETO
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#cac3d8]/50 group-focus-within:text-[#cdbdff] transition-colors text-xl font-normal">
                    person
                  </span>
                  <input 
                    className="w-full bg-[#131313]/50 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-base text-[#e5e2e1] placeholder:text-[#cac3d8]/30 focus:outline-none focus:border-[#cdbdff] focus:ring-1 focus:ring-[#cdbdff] focus:bg-[#0e0e0e] transition-all" 
                    id="fullName" 
                    placeholder="Como você é chamado na banda" 
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5 group">
                <label className="text-[12px] font-semibold tracking-wide text-[#cac3d8] group-focus-within:text-[#cdbdff] transition-colors" htmlFor="email">
                  E-MAIL
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#cac3d8]/50 group-focus-within:text-[#cdbdff] transition-colors text-xl font-normal">
                    mail
                  </span>
                  <input 
                    className="w-full bg-[#131313]/50 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-base text-[#e5e2e1] placeholder:text-[#cac3d8]/30 focus:outline-none focus:border-[#cdbdff] focus:ring-1 focus:ring-[#cdbdff] focus:bg-[#0e0e0e] transition-all" 
                    id="email" 
                    placeholder="seu@email.com" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Senha */}
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
                    placeholder="Mínimo de 6 caracteres" 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#cac3d8]/50 hover:text-[#e5e2e1] transition-colors p-1 flex items-center justify-center focus:outline-none" 
                    onClick={togglePasswordVisibility}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px] font-normal">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Primary Action Button */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
              className="mt-2"
            >
              <button 
                className="w-full bg-gradient-to-r from-[#7c4dff] to-[#6833ea] text-white font-semibold text-sm py-4 rounded-full shadow-[0_12px_32px_rgba(124,77,255,0.3)] hover:shadow-[0_12px_32px_rgba(124,77,255,0.5)] hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 group focus:outline-none" 
                type="submit"
              >
                Entrar na Equipe
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform font-normal">
                  arrow_forward
                </span>
              </button>
            </motion.div>

            {/* Secondary Link */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center mt-2"
            >
              <button 
                onClick={onBack}
                type="button"
                className="text-xs text-[#cac3d8] hover:text-[#cdbdff] transition-colors focus:outline-none"
              >
                Já faz parte de uma equipe? <span className="text-[#cdbdff] font-bold underline decoration-[#cdbdff]/30 underline-offset-4 font-sans">Entrar</span>
              </button>
            </motion.div>

          </form>
        </motion.div>

      </main>
    </div>
  );
};

export default MemberSignupView;
