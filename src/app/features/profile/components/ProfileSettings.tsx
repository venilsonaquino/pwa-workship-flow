import React from 'react';
import { useThemeStore, useAuth } from '@shared/hooks';

interface ProfileSettingsProps {
  onNavigateToTeam?: () => void;
  onEditPersonalData?: () => void;
  onNavigateToSecurity?: () => void;
  memberCount?: number;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  onNavigateToTeam,
  onEditPersonalData,
  onNavigateToSecurity,
  memberCount = 24,
}) => {
  const { theme, toggleTheme } = useThemeStore();
  const { logout } = useAuth();
  const isDarkMode = theme === 'dark';

  return (
    <div className="w-full" style={{ marginTop: 24 }}>
      {/* ── Configurações da Conta ── */}
      <section style={{ marginBottom: 24 }}>
        <h3
          className="text-label-sm font-semibold text-primary uppercase tracking-wider"
          style={{ paddingLeft: 4, paddingRight: 4, marginBottom: 12 }}
        >
          Configurações da Conta
        </h3>
        <div className="grid grid-cols-1" style={{ gap: 12 }}>
          {/* Dados Pessoais */}
          <div
            onClick={onEditPersonalData}
            className="bg-surface-container-lowest rounded-xl shadow-sm flex items-center justify-between hover:bg-surface-container transition-all duration-150 cursor-pointer group active:scale-[0.98]"
            style={{ padding: 16 }}
          >
            <div className="flex items-center" style={{ gap: 16 }}>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div className="text-left">
                <p className="text-label-lg font-semibold text-on-surface">Dados Pessoais</p>
                <p className="text-body-md text-on-surface-variant">Nome, email e telefone</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">
              chevron_right
            </span>
          </div>

          {/* Segurança */}
          <div
            onClick={onNavigateToSecurity}
            className="bg-surface-container-lowest rounded-xl shadow-sm flex items-center justify-between hover:bg-surface-container transition-all duration-150 cursor-pointer group active:scale-[0.98]"
            style={{ padding: 16 }}
          >
            <div className="flex items-center" style={{ gap: 16 }}>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">lock</span>
              </div>
              <div className="text-left">
                <p className="text-label-lg font-semibold text-on-surface">Segurança</p>
                <p className="text-body-md text-on-surface-variant">Senha e autenticação</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">
              chevron_right
            </span>
          </div>
        </div>
      </section>

      {/* ── Gestão do Ministério ── */}
      <section style={{ marginBottom: 24 }}>
        <h3
          className="text-label-sm font-semibold text-primary uppercase tracking-wider"
          style={{ paddingLeft: 4, paddingRight: 4, marginBottom: 12 }}
        >
          Gestão do Ministério
        </h3>
        <div className="grid" style={{ gap: 12 }}>
          {/* Banda */}
          <div
            onClick={onNavigateToTeam}
            className="bg-surface-container-lowest rounded-xl shadow-sm flex items-center justify-between hover:bg-surface-container transition-all duration-150 cursor-pointer group active:scale-[0.98]"
            style={{ padding: 16 }}
          >
            <div className="flex items-center" style={{ gap: 16 }}>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">groups</span>
              </div>
              <div className="text-left">
                <p className="text-label-lg font-semibold text-on-surface">Banda</p>
                <p className="text-body-md text-on-surface-variant">{memberCount} Integrantes</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">
              chevron_right
            </span>
          </div>
        </div>
      </section>

      {/* ── Configurações do App ── */}
      <section style={{ marginBottom: 56 }}>
        <h3
          className="text-label-sm font-semibold text-primary uppercase tracking-wider"
          style={{ paddingLeft: 4, paddingRight: 4, marginBottom: 12 }}
        >
          Configurações do App
        </h3>
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden divide-y divide-outline-variant/30">
          {/* Modo Escuro */}
          <div className="flex items-center justify-between" style={{ padding: 16 }}>
            <div className="flex items-center" style={{ gap: 16 }}>
              <div className="w-10 h-10 rounded-lg bg-surface-variant/30 flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined">dark_mode</span>
              </div>
              <p className="text-label-lg font-semibold text-on-surface">Modo Escuro</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-12 h-6 rounded-full relative transition-colors duration-200 focus:outline-none ${isDarkMode ? 'bg-primary' : 'bg-outline-variant'
                }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-transform duration-200 ${isDarkMode ? 'left-[26px]' : 'left-0.5'
                  }`}
              />
            </button>
          </div>

          {/* Idioma */}
          <div
            className="flex items-center justify-between hover:bg-surface-container/50 cursor-pointer transition-colors duration-150"
            style={{ padding: 16 }}
          >
            <div className="flex items-center" style={{ gap: 16 }}>
              <div className="w-10 h-10 rounded-lg bg-surface-variant/30 flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined">language</span>
              </div>
              <p className="text-label-lg font-semibold text-on-surface">Idioma</p>
            </div>
            <div className="flex items-center text-on-surface-variant" style={{ gap: 4 }}>
              <span className="text-body-md">Português (BR)</span>
              <span className="material-symbols-outlined">expand_more</span>
            </div>
          </div>

          {/* Sair da Conta */}
          <div
            onClick={logout}
            className="flex items-center justify-between hover:bg-error-container/10 cursor-pointer transition-colors duration-150 text-error"
            style={{ padding: 16 }}
          >
            <div className="flex items-center" style={{ gap: 16 }}>
              <div className="w-10 h-10 rounded-lg bg-error-container/20 flex items-center justify-center">
                <span className="material-symbols-outlined">logout</span>
              </div>
              <p className="text-label-lg font-semibold">Sair da Conta</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Version Info ── */}
      <div className="text-center" style={{ paddingTop: 16, paddingBottom: 16 }}>
        <p className="text-label-sm text-outline">Versão 2.4.0 (Build 120)</p>
      </div>
    </div>
  );
};

export default ProfileSettings;
