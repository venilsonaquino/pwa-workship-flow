import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AuthLayout, AuthCard, BackButton, InputGroup, SubmitButton } from '../components';
import authService from '../services/authService';

interface MemberSignupViewProps {
  onBack: () => void;
  onLogin: () => void;
}

export const MemberSignupView: React.FC<MemberSignupViewProps> = ({ onBack, onLogin }) => {
  const [bandCode, setBandCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBandCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    let formattedValue = '';
    
    for (let i = 0; i < value.length; i++) {
      if (i === 4) {
        formattedValue += '-';
      }
      formattedValue += value[i];
    }
    
    setBandCode(formattedValue.substring(0, 9));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!bandCode || bandCode.length < 9) {
      setError('Por favor, informe um código de banda válido no formato XXXX-XXXX.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve conter pelo menos 6 caracteres.');
      return;
    }
    setIsLoading(true);
    try {
      const cleanBandCode = bandCode.replace('-', '');
      await authService.registerMember({
        name: fullName,
        email,
        password,
        bandCode: cleanBandCode,
      });
      setIsLoading(false);
      onLogin();
    } catch (apiError) {
      setIsLoading(false);
      if (apiError instanceof Error) {
        setError(apiError.message);
      }
    }
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
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg p-3 text-center">
                {error}
              </div>
            )}
            
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
                  disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </motion.div>

            {/* Primary Action Button */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
              className="mt-2"
            >
              <SubmitButton type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span>Entrando na Equipe...</span>
                    <svg className="animate-spin h-5 w-5 text-[#cdbdff]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </>
                ) : (
                  <>
                    <span>Entrar na Equipe</span>
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform font-normal">
                      arrow_forward
                    </span>
                  </>
                )}
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
                disabled={isLoading}
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
