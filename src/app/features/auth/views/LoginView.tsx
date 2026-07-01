import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth, type UserRole } from '@shared/hooks/useAuth';
import { AuthLayout, AuthCard, BackButton, InputGroup, SubmitButton } from '../components';
import authService from '../services/authService';

interface LoginViewProps {
  onBack: () => void;
  onSignup: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onBack, onSignup }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError('A senha deve conter pelo menos 6 caracteres.');
      return;
    }
    setIsLoading(true);
    try {
      console.log('[LoginView] Enviando login para:', email);
      const response = await authService.login({ email, password });
      console.log('[LoginView] Resposta recebida do login:', response);
      setIsLoading(false);

      if (response.success) {
        console.log('[LoginView] Login bem-sucedido. Mapeando dados do usuário...');
        const role = response.user?.role as UserRole;
        const name = response.user?.name || '';
        const userEmail = response.user?.email;
        const ministryName = response.user?.ministryName;
        const avatarUrl = response.user?.avatarUrl;
        const permissions = response.user?.permissions;

        console.log('[LoginView] Executando login do contexto com:', { role, name, userEmail, token: response.token, ministryName, avatarUrl, permissions });
        login(
          role,
          name,
          userEmail,
          response.token,
          ministryName,
          avatarUrl,
          permissions
        );
        console.log('[LoginView] Contexto de login atualizado!');
        return;
      }
      console.warn('[LoginView] Login não foi bem-sucedido de acordo com a resposta:', response.message);
      setError(response.message || 'Ocorreu um problema ao tentar entrar.');
    } catch (apiError) {
      console.error('[LoginView] Erro capturado no catch de login:', apiError);
      setIsLoading(false);
      if (apiError instanceof Error) {
        setError(apiError.message);
      }
    }
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
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg p-3 text-center">
                {error}
              </div>
            )}

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
              disabled={isLoading}
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
              disabled={isLoading}
            />

            {/* Submit Button */}
            <SubmitButton type="submit" className="mt-4" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span>Entrando...</span>
                  <svg className="animate-spin h-5 w-5 text-[#cdbdff]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </>
              ) : (
                <>
                  <span>Entrar</span>
                  <span className="material-symbols-outlined text-sm font-normal">login</span>
                </>
              )}
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
              disabled={isLoading}
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
