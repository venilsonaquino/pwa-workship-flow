import React from 'react';

export const MaintenanceFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="z-10 text-center py-4">
      <p className="text-xs text-on-surface-variant/70 font-medium">
        © {currentYear} Worship Flow • Elevando o seu ministério
      </p>
    </footer>
  );
};
