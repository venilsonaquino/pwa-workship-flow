import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@src/lib/utils';
import type { Member } from './MemberRow';
import Button from '@shared/components/ui/button';

import type { Instrument } from '../services/ministryService';

interface MemberManagementDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null;
  instruments: Instrument[];
  onSave: (updatedMember: Member) => void;
  onRemove: (memberId: string) => void;
}

export const MemberManagementDrawer: React.FC<MemberManagementDrawerProps> = ({
  isOpen,
  onClose,
  member,
  instruments = [],
  onSave,
  onRemove,
}) => {
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
  const [permissions, setPermissions] = useState({
    accountStatus: true,
    editScales: false,
    manageRepertoire: false,
    adminAccess: false,
  });

  // Carrega os valores sempre que o integrante selecionado ou drawer mudar
  useEffect(() => {
    if (member) {
      setSelectedInstruments(member.instruments || []);

      // Define permissões de acordo com o integrante
      setPermissions({
        accountStatus: member.isActive,
        editScales: member.permissions?.editScales ?? false,
        manageRepertoire: member.permissions?.manageRepertoire ?? false,
        adminAccess: member.permissions?.adminAccess ?? (member.role === 'admin'),
      });
    }
  }, [member, isOpen]);

  const toggleInstrument = (code: string) => {
    setSelectedInstruments((prev) =>
      prev.includes(code)
        ? prev.filter((i) => i !== code)
        : [...prev, code]
    );
  };

  const togglePermission = (key: keyof typeof permissions) => {
    const isAdmin = permissions.adminAccess || member?.role === 'admin';
    if (isAdmin && (key === 'accountStatus' || key === 'editScales' || key === 'manageRepertoire')) {
      return;
    }

    setPermissions((prev) => {
      const nextVal = !prev[key];
      const updated = { ...prev, [key]: nextVal };

      // Se conceder acesso de admin, auto-concede as outras permissões e ativa a conta
      if (key === 'adminAccess' && nextVal) {
        updated.editScales = true;
        updated.manageRepertoire = true;
        updated.accountStatus = true;
      }
      return updated;
    });
  };

  const handleSave = () => {
    if (!member) return;

    const updated: Member = {
      ...member,
      isActive: permissions.accountStatus,
      instruments: selectedInstruments,
      role: permissions.adminAccess ? 'admin' : 'member',
      permissions: {
        accountStatus: permissions.accountStatus,
        editScales: permissions.editScales,
        manageRepertoire: permissions.manageRepertoire,
        adminAccess: permissions.adminAccess,
      },
    };
    onSave(updated);
  };

  const renderSwitch = (isOn: boolean, onClick: () => void, disabled?: boolean) => {
    return (
      <div
        onClick={disabled ? undefined : onClick}
        className={cn(
          "w-12 h-6 rounded-full relative transition-colors duration-200 shrink-0",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          isOn ? "bg-primary" : "bg-outline-variant"
        )}
      >
        <div
          className={cn(
            "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 shadow-sm",
            isOn ? "right-1" : "left-1"
          )}
        />
      </div>
    );
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && member && (
        <div className="fixed inset-0 z-[60] overflow-hidden flex items-end justify-center">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 glass-effect"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full max-w-[600px] bg-surface-container-lowest rounded-t-[32px] shadow-lg z-[70] overflow-y-auto max-h-[90vh] scrollbar-hide"
          >
            {/* Drag Handle */}
            <div className="flex justify-center p-4 cursor-pointer" onClick={onClose}>
              <div className="w-12 h-1.5 bg-outline-variant rounded-full" />
            </div>

            <div className="px-6 pb-8 space-y-8">
              {/* Member Profile Header */}
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 shrink-0">
                  {member.avatarUrl ? (
                    <img
                      alt={member.name}
                      className="w-full h-full rounded-full object-cover border-2 border-secondary-container"
                      src={member.avatarUrl}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        const parent = (e.target as HTMLImageElement).parentElement;
                        if (parent) {
                          const fallback = parent.querySelector('.fallback-profile');
                          if (fallback) {
                            (fallback as HTMLElement).style.display = 'flex';
                          }
                        }
                      }}
                    />
                  ) : null}
                  <div
                    className="fallback-profile w-full h-full rounded-full border-2 border-secondary-container bg-surface-container flex items-center justify-center text-on-surface-variant"
                    style={{ display: member.avatarUrl ? 'none' : 'flex' }}
                  >
                    <span className="material-symbols-outlined text-[32px]">person</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-on-surface text-[20px]">{member.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={cn(
                      "w-2 h-2 rounded-full transition-colors duration-200",
                      permissions.accountStatus ? "bg-green-500" : "bg-red-500"
                    )} />
                    <span className={cn(
                      "text-[12px] font-bold uppercase tracking-wider transition-colors duration-200",
                      permissions.accountStatus ? "text-green-500" : "text-red-500"
                    )}>
                      {permissions.accountStatus ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Instrument Assignment Section */}
              <div className="space-y-3">
                <h4 className="text-on-surface-variant font-label-lg text-[12px] uppercase tracking-wider">
                  Instrumentos
                </h4>
                <div className="flex flex-wrap gap-2">
                  {instruments.map((inst) => {
                    const isSelected = selectedInstruments.includes(inst.code);
                    return (
                      <button
                        key={inst.id}
                        onClick={() => toggleInstrument(inst.code)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-full text-[14px] font-medium transition-all active:scale-95 duration-200",
                          isSelected
                            ? "bg-primary text-white shadow-sm"
                            : "bg-surface-container text-on-surface-variant hover:bg-surface-variant"
                        )}
                      >
                        <span className="material-symbols-outlined text-[18px]">{inst.icon}</span>
                        {inst.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Permissions Section */}
              <div className="space-y-4">
                <h4 className="text-on-surface-variant font-label-lg text-[12px] uppercase tracking-wider">
                  Permissões
                </h4>
                <div className="space-y-4">

                  {/* Admin Access */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-on-surface text-[16px]">Acesso administrador</span>
                      <span className="text-on-surface-variant text-[12px]">
                        Controle total sobre o ministério e integrantes
                      </span>
                    </div>
                    {renderSwitch(permissions.adminAccess, () => togglePermission('adminAccess'))}
                  </div>

                  {/* Account Status */}
                  <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                    <div className="flex flex-col">
                      <span className="text-on-surface font-bold text-[16px]">Status da conta</span>
                      <span className="text-on-surface-variant text-[12px]">
                        Membro pode acessar o sistema
                      </span>
                    </div>
                    {renderSwitch(
                      permissions.accountStatus,
                      () => togglePermission('accountStatus'),
                      permissions.adminAccess || member?.role === 'admin'
                    )}
                  </div>

                  {/* Edit Scales */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-on-surface text-[16px]">Gerenciar escalas</span>
                      <span className="text-on-surface-variant text-[12px]">
                        Criar e editar escalas de eventos
                      </span>
                    </div>
                    {renderSwitch(
                      permissions.editScales,
                      () => togglePermission('editScales'),
                      permissions.adminAccess || member?.role === 'admin'
                    )}
                  </div>

                  {/* Manage Repertoire */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-on-surface text-[16px]">Gerenciar repertório</span>
                      <span className="text-on-surface-variant text-[12px]">
                        Acesso e edição do catálogo de músicas
                      </span>
                    </div>
                    {renderSwitch(
                      permissions.manageRepertoire,
                      () => togglePermission('manageRepertoire'),
                      permissions.adminAccess || member?.role === 'admin'
                    )}
                  </div>
                </div>
              </div>

              {member.role === 'member' && (
                <div className="pt-4 border-t border-surface-container">
                  <div
                    onClick={() => {
                      if (confirm(`Tem certeza que deseja remover ${member.name} do time?`)) {
                        onRemove(member.id);
                      }
                    }}
                    className="bg-error-container/30 p-4 rounded-xl flex items-center justify-between group cursor-pointer hover:bg-error-container/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center text-error">
                        <span className="material-symbols-outlined">person_remove</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-on-error-container font-bold text-[16px]">
                          Remover do Time
                        </span>
                        <span className="text-on-error-container/70 text-[12px]">
                          Revogar acesso deste integrante ao ministério
                        </span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-error transition-transform group-hover:translate-x-1">
                      chevron_right
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-surface-container">
                <Button
                  onClick={handleSave}
                  variant="primary"
                  className="flex-1"
                >
                  Salvar Alterações
                </Button>
                <Button
                  onClick={onClose}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default MemberManagementDrawer;
