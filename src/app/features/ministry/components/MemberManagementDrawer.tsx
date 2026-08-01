import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@src/lib/utils';
import type { Member } from './MemberRow';
import Button from '@shared/components/ui/button';
import AlertDialog from '@shared/components/ui/alert-dialog';

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
    adminAccess: false,
    scaleView: false,
    rankingView: false,
    songEditColumns: false,
    songViewEngagement: false,
    songViewListeners: false,
  });
  const [isRemoveConfirmOpen, setIsRemoveConfirmOpen] = useState(false);

  const [prevMemberId, setPrevMemberId] = useState<string | null>(null);
  const [prevIsOpen, setPrevIsOpen] = useState(false);

  if ((member?.id || null) !== prevMemberId || isOpen !== prevIsOpen) {
    setPrevMemberId(member?.id || null);
    setPrevIsOpen(isOpen);
    if (member) {
      setSelectedInstruments(member.instruments || []);
      setPermissions({
        accountStatus: member.isActive,
        adminAccess: member.permissions?.adminAccess ?? (member.role === 'admin'),
        scaleView: member.permissions?.scaleView ?? false,
        rankingView: member.permissions?.rankingView ?? false,
        songEditColumns: member.permissions?.songEditColumns ?? false,
        songViewEngagement: member.permissions?.songViewEngagement ?? false,
        songViewListeners: member.permissions?.songViewListeners ?? false,
      });
    }
  }

  const toggleInstrument = (code: string) => {
    setSelectedInstruments((prev) =>
      prev.includes(code)
        ? prev.filter((i) => i !== code)
        : [...prev, code]
    );
  };

  const togglePermission = (key: keyof typeof permissions) => {
    const isAdmin = permissions.adminAccess;
    if (isAdmin && key !== 'adminAccess') {
      return;
    }

    setPermissions((prev) => {
      const nextVal = !prev[key];
      const updated = { ...prev, [key]: nextVal };

      if (key === 'adminAccess') {
        // Ao habilitar admin: ativa conta e concede todas as permissões
        if (nextVal) {
          updated.accountStatus = true;
          updated.scaleView = true;
          updated.rankingView = true;
          updated.songEditColumns = true;
          updated.songViewEngagement = true;
          updated.songViewListeners = true;
        }
        // Ao desabilitar admin: não altera as demais — apenas destravam para edição
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
        adminAccess: permissions.adminAccess,
        scaleView: permissions.scaleView,
        rankingView: permissions.rankingView,
        songEditColumns: permissions.songEditColumns,
        songViewEngagement: permissions.songViewEngagement,
        songViewListeners: permissions.songViewListeners,
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
                      permissions.adminAccess
                    )}
                  </div>

                  {/* Scale View */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-on-surface text-[16px]">Visualizar escalas</span>
                      <span className="text-on-surface-variant text-[12px]">
                        Acesso à tela e listagem de escalas
                      </span>
                    </div>
                    {renderSwitch(
                      permissions.scaleView,
                      () => togglePermission('scaleView'),
                      permissions.adminAccess
                    )}
                  </div>

                  {/* Ranking View */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-on-surface text-[16px]">Visualizar ranking</span>
                      <span className="text-on-surface-variant text-[12px]">
                        Acesso à tela de ranking da banda
                      </span>
                    </div>
                    {renderSwitch(
                      permissions.rankingView,
                      () => togglePermission('rankingView'),
                      permissions.adminAccess
                    )}
                  </div>

                  {/* Song Edit Columns */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-on-surface text-[16px]">Mover músicas de coluna</span>
                      <span className="text-on-surface-variant text-[12px]">
                        Alterar status das músicas entre colunas
                      </span>
                    </div>
                    {renderSwitch(
                      permissions.songEditColumns,
                      () => togglePermission('songEditColumns'),
                      permissions.adminAccess
                    )}
                  </div>

                  {/* Song View Engagement */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-on-surface text-[16px]">Ver engajamento das músicas</span>
                      <span className="text-on-surface-variant text-[12px]">
                        Visualizar porcentagem de engajamento da banda
                      </span>
                    </div>
                    {renderSwitch(
                      permissions.songViewEngagement,
                      () => togglePermission('songViewEngagement'),
                      permissions.adminAccess
                    )}
                  </div>

                  {/* Song View Listeners */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-on-surface text-[16px]">Ver ouvintes das músicas</span>
                      <span className="text-on-surface-variant text-[12px]">
                        Visualizar lista de integrantes que já ouviram a música
                      </span>
                    </div>
                    {renderSwitch(
                      permissions.songViewListeners,
                      () => togglePermission('songViewListeners'),
                      permissions.adminAccess
                    )}
                  </div>
                </div>
              </div>

              {member.role === 'member' && (
                <div className="pt-4 border-t border-surface-container">
                  <div
                    onClick={() => setIsRemoveConfirmOpen(true)}
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
      {member && (
        <AlertDialog
          isOpen={isRemoveConfirmOpen}
          onClose={() => setIsRemoveConfirmOpen(false)}
          onConfirm={() => onRemove(member.id)}
          title="Remover do Time"
          description={`Tem certeza que deseja remover ${member.name} do time? Esta ação revogará o acesso deste integrante ao ministério.`}
          confirmText="Remover"
          variant="danger"
          icon="person_remove"
        />
      )}
    </AnimatePresence>,
    document.body
  );
};

export default MemberManagementDrawer;
