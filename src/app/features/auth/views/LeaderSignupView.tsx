import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AuthLayout, AuthCard, BackButton, InputGroup, SubmitButton } from '../components';

interface LeaderSignupViewProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const LeaderSignupView: React.FC<LeaderSignupViewProps> = ({ onBack, onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [band, setBand] = useState('');
  const [password, setPassword] = useState('');

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
    <AuthLayout glowType="leader">
      <BackButton onClick={onBack} />
      
      {/* Main Content Canvas */}
      <main className="flex-1 flex flex-col justify-center px-6 py-10 relative z-10 w-full max-w-lg mx-auto my-auto">
        
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
        <AuthCard delay={0.2}>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            
            {/* Input Group: Name */}
            <InputGroup
              id="name"
              label="NOME COMPLETO"
              placeholder="Ex: João Silva"
              icon="person"
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* Input Group: Email */}
            <InputGroup
              id="email"
              label="E-MAIL PROFISSIONAL"
              placeholder="lider@suabanda.com"
              icon="mail"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Input Group: Band Name */}
            <InputGroup
              id="band"
              label="NOME DA BANDA / MINISTÉRIO"
              placeholder="Worship Flow Team"
              icon="groups"
              required
              type="text"
              value={band}
              onChange={(e) => setBand(e.target.value)}
            />

            {/* Input Group: Password */}
            <InputGroup
              id="password"
              label="SENHA DE ACESSO"
              placeholder="Mínimo 8 caracteres"
              icon="lock"
              isPassword
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Submit Button */}
            <SubmitButton type="submit" className="mt-4">
              <span>Criar Conta</span>
              <span className="material-symbols-outlined text-sm font-normal">arrow_forward</span>
            </SubmitButton>
            
          </form>
        </AuthCard>

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
    </AuthLayout>
  );
};

export default LeaderSignupView;
