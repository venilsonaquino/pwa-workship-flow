import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth, type UserRole } from '@shared/hooks';
import { AuthLayout, AuthCard, BackButton, InputGroup, SubmitButton } from '../components';

interface LoginViewProps {
  onBack: () => void;
  onSignup: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onBack, onSignup }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      alert('A senha deve conter pelo menos 6 caracteres.');
      return;
    }

    // Inferência de papel com base no e-mail digitado
    const role: UserRole = email.toLowerCase().includes('lider') ? 'Líder de Louvor' : 'Integrante';
    
    // Inferência inteligente do nome de exibição do usuário a partir do e-mail
    const inferredName = email.split('@')[0]
      .split(/[._-]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

    login(role, inferredName || undefined, email);
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
              login
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#e5e2e1] tracking-tight">
            Entrar no WorshipFlow
          </h1>
          <p className="text-xs text-[#cac3d8]">
            Acesse sua conta para continuar gerenciando o repertório.
          </p>
        </motion.header>

        {/* Login Form (Glassmorphic Card) */}
        <AuthCard delay={0.2}>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            
            {/* Input Group: Email */}
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

            {/* Input Group: Password */}
            <InputGroup
              id="password"
              label="SENHA DE ACESSO"
              placeholder="Digite sua senha"
              icon="lock"
              isPassword
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Submit Button */}
            <SubmitButton type="submit" className="mt-4">
              <span>Entrar</span>
              <span className="material-symbols-outlined text-sm font-normal">login</span>
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
            Não possui uma conta?{' '}
            <button 
              onClick={onSignup}
              className="text-[#cdbdff] hover:text-[#e8deff] transition-colors font-bold uppercase tracking-wider ml-1 underline-offset-4 hover:underline focus:outline-none"
            >
              Cadastre-se
            </button>
          </p>
        </motion.div>

      </main>
    </AuthLayout>
  );
};

export default LoginView;
