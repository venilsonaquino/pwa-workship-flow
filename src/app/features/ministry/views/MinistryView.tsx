import React, { useState } from 'react';
import BandSettingsCard from '../components/BandSettingsCard';
import InviteCodeCard from '../components/InviteCodeCard';
import MemberRow from '../components/MemberRow';
import type { Member } from '../components/MemberRow';

const INITIAL_MEMBERS: Member[] = [
  {
    id: '1',
    name: 'Manu',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCXYJNNKuhoDyFI9BTBymtVaEkIbRUZ1TfBB8z5YU6H7KPKO_a_DkzOwGqZlzbDwv8qJ8ERZh8MpjVcr1C59Pb_cFbRt4s9DTYf4XFwX_JOwW3ngf7gO1HbT9oHxJ0lwsZ0vY6RK5JDTceJWAVewGTOensFh1V8usc3o0MRlpcgTRt1E8wxwh6imMkuzQRMlFEnFjvRjzRl38ZtALHqbIZq1Psz3lWkUEauxpBV_HFkuSyg1el8SN--LY4bwH6mAZ-TRlc0V2Jbhk',
    isActive: true,
    isSelf: true,
    roles: 'Teclado',
  },
  {
    id: '2',
    name: 'Gabriel Santos',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSGg0mmloY-d7T33mlOZCS2iesLfM-e1BxnLDzWNL0pu894-KtPAnfAI3KvChVC2TepR9SYeNB3kW7hhw-Dm67X2Mm3cgGa2UmKtU1ynoWUIVdxRwEKl1cGhywSIkvAjuVxYXBS-zhkIdgK1miT4US3QLUaJz0u2GUu4Nlw4nMeuu0uaOAKh7ldYjXwLKk2PJYUvlEAG8LqaxdBEJJjN3KUz2mM2ZwY59CGfoYBXL1YpzvbEjizKH7FC1chbsMqFulfq2eA9ajAgg',
    isActive: true,
    isSelf: false,
    roles: 'Vocal, Guitarra, Bateria, Teclado',
  },
  {
    id: '3',
    name: 'Ana Oliveira',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACFKCT4bt7XNtLM3R3Ly-KLrL2H1g_PccJgPBNiP0B-oAJfovTjI22jTISrhWo91NfrJJJ2GPu0Tscmwp7-su7O639Rfw1I8zdQ5jhxt2NELaFlUi7PL5LUS-VTFVe7OT6ctS7ZqridTjAY3DP3jDv0MMWT3vZyp9odPUDwJAZtdMscZCBG123CRFF21fFXF1U6ceFuH8XviFscbB60Qts5pZx5znGoBK40eMXVsmwF-t0_3SZLwbzOzMNPnbz1VRLwAdag2a-U5A',
    isActive: false,
    isSelf: false,
    roles: 'Vocal',
  },
  {
    id: '4',
    name: 'Lucas Ferreira',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDj5u1l8jP1ckX0ZprgnAMKYzpdG5pA1tYnhf06qdn0muADvmaAZ5ATtcSWT1mw3gULL22Lmof1C2Q71foYn2mauOv1Qu76o5JXi7RSqmaJaFhA5KUoDoCWwPR-uCVLMyI5M5XhxW6UmlylkufqWqNhZKWxP6FuNJ9QlXUqU8bY4HVvZhdNLAFsH9fxa6-fa_E3_Uq2jgLd5nVDcTDVom6NYPAQAmUPnrLpJVKeDuDEvctLaV2yursRf83tIP1mv1KLT34UYMF74nY',
    isActive: false,
    isSelf: false,
    roles: 'Bateria',
  },
];

export const MinistryView: React.FC = () => {
  const members = INITIAL_MEMBERS;
  const [showToast, setShowToast] = useState(false);

  const handleCopyCode = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  const handleMemberAction = (member: Member) => {
    console.info(`[MinistryView] Member action clicked for: ${member.name}`);
  };

  return (
    <div className="w-full flex-1 max-w-[1200px] mx-auto py-4 space-y-8">
      {/* Band Settings Section */}
      <section className="space-y-4">
        <h2 className="text-on-surface-variant text-[14px] font-semibold uppercase tracking-wider px-1">
          Informações da Equipe
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BandSettingsCard />
          <InviteCodeCard onCopy={handleCopyCode} />
        </div>
      </section>

      {/* Team Management Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-end px-1">
          <h2 className="text-on-surface-variant text-[14px] font-semibold uppercase tracking-wider">
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

      {/* Micro-interaction Toast */}
      <div
        className={`fixed bottom-28 left-1/2 -translate-x-1/2 px-6 py-3.5 rounded-full shadow-xl transition-all duration-500 ease-out z-[100] font-semibold text-[14px] flex items-center gap-2 border border-primary/10 dark:border-primary/20 backdrop-blur-md bg-white/90 dark:bg-surface-container-lowest/90 text-primary dark:text-primary-variant ${showToast
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
          }`}
      >
        <span className="material-symbols-outlined text-success text-[18px]">check_circle</span>
        <span>Código copiado para a área de transferência!</span>
      </div>
    </div>
  );
};

export default MinistryView;
