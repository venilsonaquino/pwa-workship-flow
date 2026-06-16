import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@src/lib/utils';
import Button from '@shared/components/ui/button';
import { PageHeader } from '@shared/components';
import { profileService } from '../services/profileService';

interface SecurityViewProps {
  onBack: () => void;
}

export const SecurityView: React.FC<SecurityViewProps> = ({ onBack }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Estados para alternar a visibilidade da senha
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Estados de carregamento e feedback
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [errors, setErrors] = useState<{ currentPassword?: string; newPassword?: string; confirmPassword?: string }>({});



  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!currentPassword) {
      newErrors.currentPassword = 'A senha atual é obrigatória.';
    }

    if (!newPassword) {
      newErrors.newPassword = 'A nova senha é obrigatória.';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'A nova senha deve ter no mínimo 6 caracteres.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'A confirmação de senha é obrigatória.';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSaving) return;

    setIsSaving(true);
    try {
      await profileService.changePassword({
        currentPassword,
        newPassword,
      });

      // Limpa os campos
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrors({});

      // Exibe feedback
      setToastMessage('Senha atualizada com sucesso!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar senha.';
      setErrors({ currentPassword: message });
    } finally {
      setIsSaving(false);
    }
  };



  return (
    <div className="w-full flex-1 max-w-[600px] mx-auto py-4 px-4 space-y-8">
      <PageHeader title="Segurança" onBack={onBack} />

      {/* Formulário de Alteração de Senha */}
      <section className="space-y-4">
        <h2 className="text-on-surface-variant text-[14px] font-semibold uppercase tracking-wider px-1 text-left">
          Alterar Senha
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
          {/* Senha Atual */}
          <div className="flex flex-col gap-1.5 text-left">
            <label htmlFor="current-password" className="text-label-lg font-semibold text-on-surface">
              Senha Atual
            </label>
            <div className="relative">
              <input
                id="current-password"
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={cn(
                  "w-full pl-4 pr-12 py-3 rounded-xl border bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
                  errors.currentPassword ? "border-error focus:ring-error/20 focus:border-error" : "border-outline-variant"
                )}
                placeholder="Sua senha atual"
                disabled={isSaving}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface focus:outline-none"
              >
                <span className="material-symbols-outlined text-[22px]">
                  {showCurrent ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {errors.currentPassword && (
              <span className="text-body-sm text-error flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">error</span>
                {errors.currentPassword}
              </span>
            )}
          </div>

          {/* Nova Senha */}
          <div className="flex flex-col gap-1.5 text-left">
            <label htmlFor="new-password" className="text-label-lg font-semibold text-on-surface">
              Nova Senha
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={cn(
                  "w-full pl-4 pr-12 py-3 rounded-xl border bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
                  errors.newPassword ? "border-error focus:ring-error/20 focus:border-error" : "border-outline-variant"
                )}
                placeholder="Mínimo 6 caracteres"
                disabled={isSaving}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface focus:outline-none"
              >
                <span className="material-symbols-outlined text-[22px]">
                  {showNew ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {errors.newPassword && (
              <span className="text-body-sm text-error flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">error</span>
                {errors.newPassword}
              </span>
            )}
          </div>

          {/* Confirmar Nova Senha */}
          <div className="flex flex-col gap-1.5 text-left">
            <label htmlFor="confirm-password" className="text-label-lg font-semibold text-on-surface">
              Confirmar Nova Senha
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={cn(
                  "w-full pl-4 pr-12 py-3 rounded-xl border bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
                  errors.confirmPassword ? "border-error focus:ring-error/20 focus:border-error" : "border-outline-variant"
                )}
                placeholder="Repita a nova senha"
                disabled={isSaving}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface focus:outline-none"
              >
                <span className="material-symbols-outlined text-[22px]">
                  {showConfirm ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-body-sm text-error flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">error</span>
                {errors.confirmPassword}
              </span>
            )}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              className="w-full py-3"
              disabled={isSaving}
            >
              {isSaving ? 'Atualizando...' : 'Atualizar Senha'}
            </Button>
          </div>
        </form>
      </section>



      {/* Micro-interaction Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 16, x: '-50%', scale: 0.95 }}
            animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
            exit={{ opacity: 0, y: 16, x: '-50%', scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-28 left-1/2 px-5 py-3 rounded-xl shadow-xl z-[100] text-sm font-medium flex items-center gap-2.5 border border-white/10 backdrop-blur-md bg-neutral-900/90 text-white whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-success text-[20px]">check_circle</span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SecurityView;
