import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BandSettingsCard from '../components/BandSettingsCard';
import InviteCodeCard from '../components/InviteCodeCard';
import MemberRow from '../components/MemberRow';
import type { Member } from '../components/MemberRow';
import MemberManagementDrawer from '../components/MemberManagementDrawer';
import { PageHeader } from '@shared/components';
import { ministryService } from '../services/ministryService';
import type { Instrument } from '../services/ministryService';

interface MinistryViewProps {
  onBack?: () => void;
}

export const MinistryView: React.FC<MinistryViewProps> = ({ onBack }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Estados para nome da banda e código de convite
  const [bandName, setBandName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchMinistryAndInstruments = async () => {
      try {
        const [data, instrumentsList] = await Promise.all([
          ministryService.getMinistry(),
          ministryService.getInstruments(),
        ]);
        if (active) {
          setBandName(data.name);
          setInviteCode(data.inviteCode);
          setMembers(data.members);
          setInstruments(instrumentsList);
        }
      } catch (err) {
        console.error('Erro ao buscar dados do ministério/banda ou instrumentos', err);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };
    fetchMinistryAndInstruments();
    return () => {
      active = false;
    };
  }, []);

  const handleNameChange = async (newName: string) => {
    try {
      const updated = await ministryService.updateMinistryName(newName);
      setBandName(updated.name);
      setMembers(updated.members);
    } catch (err) {
      console.error('Erro ao salvar nome da banda', err);
    }
  };


  const handleCopyCode = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  const handleMemberAction = (member: Member) => {
    setSelectedMember(member);
    setIsDrawerOpen(true);
  };

  const handleSaveMember = async (updatedMember: Member) => {
    try {
      // Mapeia códigos de instrumento para seus IDs correspondentes
      const instrumentIds = updatedMember.instruments.map((code) => {
        const match = instruments.find((i) => i.code === code);
        return match ? match.id : code;
      });

      // Mapeia as permissões booleanas para o array de strings esperado pelo backend
      const apiPermissions: string[] = [];
      if (updatedMember.permissions.editScales) {
        apiPermissions.push('EditScales');
      }
      if (updatedMember.permissions.adminAccess) {
        apiPermissions.push('AdminAccess');
      }
      if (updatedMember.permissions.manageRepertoire) {
        apiPermissions.push('ManageRepertoire');
      }
      if (updatedMember.permissions.scaleView) {
        apiPermissions.push('ScaleView');
      }
      if (updatedMember.permissions.rankingView) {
        apiPermissions.push('RankingView');
      }
      if (updatedMember.permissions.songViewEngagement) {
        apiPermissions.push('SongViewEngagement');
      }
      if (updatedMember.permissions.songViewListeners) {
        apiPermissions.push('SongViewListeners');
      }
      if (updatedMember.permissions.songEditColumns) {
        apiPermissions.push('SongEditColumns');
      }

      const updatedBand = await ministryService.updateMember(updatedMember.id, {
        isActive: updatedMember.isActive,
        instrumentIds,
        permissions: apiPermissions,
      });

      setBandName(updatedBand.name);
      setMembers(updatedBand.members);
      setIsDrawerOpen(false);
      setSelectedMember(null);
    } catch (err) {
      console.error('Erro ao atualizar integrante', err);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    setIsDrawerOpen(false);
    setSelectedMember(null);
  };

  return (
    <div className="w-full flex-1 max-w-[1200px] mx-auto">
      {onBack && (
        <PageHeader title="Gestão da Banda" onBack={onBack} />
      )}
      {/* Band Settings Section */}
      <section className="space-y-4">
        <h2 className="text-on-surface-variant text-[14px] font-semibold uppercase tracking-wider px-1">
          Informações da Banda
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading ? (
            <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm h-[88px] animate-pulse" />
          ) : (
            <BandSettingsCard initialName={bandName} onNameChange={handleNameChange} />
          )}

          {isLoading ? (
            <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm h-[88px] animate-pulse" />
          ) : (
            <InviteCodeCard
              code={inviteCode}
              onCopy={handleCopyCode}
            />
          )}
        </div>
      </section>

      {/* Team Management Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-end px-1">
          <h2 className="text-on-surface-variant text-[14px] font-semibold uppercase tracking-wider pt-4">
            Integrantes Ativos
          </h2>
          <span className="text-on-surface-variant text-[12px] font-medium">
            {members.length} Membros
          </span>
        </div>

        {/* Members Grid/List Card */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
          <div className="divide-y divide-surface-container">
            {members.map((member) => (
              <MemberRow
                key={member.id}
                member={member}
                instruments={instruments}
                onAction={handleMemberAction}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Member Management Drawer */}
      <MemberManagementDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedMember(null);
        }}
        member={selectedMember}
        instruments={instruments}
        onSave={handleSaveMember}
        onRemove={handleRemoveMember}
      />

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
            <span>Código copiado para a área de transferência!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MinistryView;
