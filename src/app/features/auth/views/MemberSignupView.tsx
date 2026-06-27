import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@shared/hooks/useAuth';
import { AuthLayout, AuthCard, BackButton, InputGroup, SubmitButton } from '../components';

interface MemberSignupViewProps {
  onBack: () => void;
  onLogin: () => void;
}

export const MemberSignupView: React.FC<MemberSignupViewProps> = ({ onBack, onLogin }) => {
  const { login } = useAuth();
  const [bandCode, setBandCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
    <AuthLayout glowType="member">
      <BackButton onClick={onBack} />
      
      {/* Main Registration Canvas */}
      <main className="relative z-10 flex-1 flex flex-col px-6 py-10 md:justify-center md:items-center min-h-screen">
        
        {/* Glassmorphic Container */}
        <AuthCard delay={0.1}>
          
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
              {/* NOME COMPLETO */}
              <InputGroup
                id="fullName"
                label="NOME COMPLETO"
                placeholder="Como você é chamado na banda"
                icon="person"
                required
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              {/* E-MAIL */}
              <InputGroup
                id="email"
                label="E-MAIL"
                placeholder="seu@email.com"
                icon="mail"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {/* SENHA DE ACESSO */}
              <InputGroup
                id="password"
                label="SENHA DE ACESSO"
                placeholder="Mínimo de 6 caracteres"
                icon="lock"
                isPassword
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </motion.div>

            {/* Primary Action Button */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
              className="mt-2"
            >
              <SubmitButton type="submit">
                Entrar na Equipe
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform font-normal">
                  arrow_forward
                </span>
              </SubmitButton>
            </motion.div>

            {/* Secondary Link */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center mt-2"
            >
              <button 
                onClick={onLogin}
                type="button"
                className="text-xs text-[#cac3d8] hover:text-[#cdbdff] transition-colors focus:outline-none"
              >
                Já faz parte de uma equipe? <span className="text-[#cdbdff] font-bold underline decoration-[#cdbdff]/30 underline-offset-4 font-sans">Entrar</span>
              </button>
            </motion.div>

          </form>
        </AuthCard>

      </main>
    </AuthLayout>
  );
};

export default MemberSignupView;
