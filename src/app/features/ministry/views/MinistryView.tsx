import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BandSettingsCard from '../components/BandSettingsCard';
import InviteCodeCard from '../components/InviteCodeCard';
import MemberRow from '../components/MemberRow';
import type { Member } from '../components/MemberRow';
import MemberManagementDrawer from '../components/MemberManagementDrawer';
import { PageHeader } from '@shared/components';
import { ministryService } from '../services/ministryService';

interface MinistryViewProps {
  onBack?: () => void;
}

const INITIAL_MEMBERS: Member[] = [
  {
    id: '1',
    name: 'Manu',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCXYJNNKuhoDyFI9BTBymtVaEkIbRUZ1TfBB8z5YU6H7KPKO_a_DkzOwGqZlzbDwv8qJ8ERZh8MpjVcr1C59Pb_cFbRt4s9DTYf4XFwX_JOwW3ngf7gO1HbT9oHxJ0lwsZ0vY6RK5JDTceJWAVewGTOensFh1V8usc3o0MRlpcgTRt1E8wxwh6imMkuzQRMlFEnFjvRjzRl38ZtALHqbIZq1Psz3lWkUEauxpBV_HFkuSyg1el8SN--LY4bwH6mAZ-TRlc0V2Jbhk',
    isActive: true,
    roles: 'Teclado',
    role: 'admin',
    permissions: {
      accountStatus: true,
      editScales: true,
      manageRepertoire: true,
      adminAccess: true,
    },
  },
  {
    id: '2',
    name: 'Gabriel Santos',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSGg0mmloY-d7T33mlOZCS2iesLfM-e1BxnLDzWNL0pu894-KtPAnfAI3KvChVC2TepR9SYeNB3kW7hhw-Dm67X2Mm3cgGa2UmKtU1ynoWUIVdxRwEKl1cGhywSIkvAjuVxYXBS-zhkIdgK1miT4US3QLUaJz0u2GUu4Nlw4nMeuu0uaOAKh7ldYjXwLKk2PJYUvlEAG8LqaxdBEJJjN3KUz2mM2ZwY59CGfoYBXL1YpzvbEjizKH7FC1chbsMqFulfq2eA9ajAgg',
    isActive: true,
    roles: 'Vocal',
    role: 'member',
    permissions: {
      accountStatus: true,
      editScales: true,
      manageRepertoire: true,
      adminAccess: false,
    },
  },
  {
    id: '3',
    name: 'Ana Oliveira',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACFKCT4bt7XNtLM3R3Ly-KLrL2H1g_PccJgPBNiP0B-oAJfovTjI22jTISrhWo91NfrJJJ2GPu0Tscmwp7-su7O639Rfw1I8zdQ5jhxt2NELaFlUi7PL5LUS-VTFVe7OT6ctS7ZqridTjAY3DP3jDv0MMWT3vZyp9odPUDwJAZtdMscZCBG123CRFF21fFXF1U6ceFuH8XviFscbB60Qts5pZx5znGoBK40eMXVsmwF-t0_3SZLwbzOzMNPnbz1VRLwAdag2a-U5A',
    isActive: true,
    roles: 'Vocal ',
    role: 'member',
    permissions: {
      accountStatus: true,
      editScales: false,
      manageRepertoire: false,
      adminAccess: false,
    },
  },
  {
    id: '4',
    name: 'Lucas Ferreira',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDj5u1l8jP1ckX0ZprgnAMKYzpdG5pA1tYnhf06qdn0muADvmaAZ5ATtcSWT1mw3gULL22Lmof1C2Q71foYn2mauOv1Qu76o5JXi7RSqmaJaFhA5KUoDoCWwPR-uCVLMyI5M5XhxW6UmlylkufqWqNhZKWxP6FuNJ9QlXUqU8bY4HVvZhdNLAFsH9fxa6-fa_E3_Uq2jgLd5nVDcTDVom6NYPAQAmUPnrLpJVKeDuDEvctLaV2yursRf83tIP1mv1KLT34UYMF74nY',
    isActive: false,
    roles: 'Bateria',
    role: 'member',
    permissions: {
      accountStatus: false,
      editScales: false,
      manageRepertoire: false,
      adminAccess: false,
    },
  },
];

export const MinistryView: React.FC<MinistryViewProps> = ({ onBack }) => {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Estados para nome da banda e código de convite
  const [bandName, setBandName] = useState('Banda da Colina');
  const [inviteCode, setInviteCode] = useState('WORSHIP-X7K2');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingCode, setIsUpdatingCode] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchMinistry = async () => {
      try {
        const data = await ministryService.getMinistry();
        if (active) {
          setBandName(data.name);
          setInviteCode(data.inviteCode);
        }
      } catch (err) {
        console.error('Erro ao buscar dados do ministério', err);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };
    fetchMinistry();
    return () => {
      active = false;
    };
  }, []);

  const handleNameChange = async (newName: string) => {
    try {
      const updated = await ministryService.updateMinistryName(newName);
      setBandName(updated.name);
    } catch (err) {
      console.error('Erro ao salvar nome da banda', err);
    }
  };

  const handleRegenerateCode = async () => {
    setIsUpdatingCode(true);
    try {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let suffix = '';
      let suffix2 = '';
      for (let i = 0; i < 4; i++) {
        suffix += chars.charAt(Math.floor(Math.random() * chars.length));
        suffix2 += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      const newCode = `${suffix}-${suffix2}`;
      const updated = await ministryService.updateInviteCode(newCode);
      setInviteCode(updated.inviteCode);
    } catch (err) {
      console.error('Erro ao regenerar código de convite', err);
    } finally {
      setIsUpdatingCode(false);
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

  const handleSaveMember = (updatedMember: Member) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === updatedMember.id ? updatedMember : m))
    );
    setIsDrawerOpen(false);
    setSelectedMember(null);
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
              onRegenerate={handleRegenerateCode}
              isUpdating={isUpdatingCode}
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

