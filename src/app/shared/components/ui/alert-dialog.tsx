import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@src/lib/utils';
import Button from './button';

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  variant?: 'primary' | 'danger';
  icon?: string;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  variant = 'primary',
  icon,
}) => {
  if (typeof window === 'undefined') return null;
  const isDanger = variant === 'danger';

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-[360px] bg-surface-container-lowest border border-outline-variant/30 rounded-[28px] shadow-2xl p-6 z-[110] flex flex-col gap-6"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                  isDanger ? "bg-error/10 text-error" : "bg-primary/10 text-primary"
                )}>
                  <span className="material-symbols-outlined text-[22px]">
                    {icon || (isDanger ? 'warning' : 'info')}
                  </span>
                </div>
                <h3 className="text-[18px] font-bold text-on-surface leading-tight">{title}</h3>
              </div>
              <p className="text-[14px] text-on-surface-variant leading-relaxed">{description}</p>
            </div>

            <div className="flex gap-3">
              <Button onClick={onClose} variant="secondary" className="flex-1">
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                variant={isDanger ? 'danger' : 'primary'}
                className="flex-1"
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default AlertDialog;
