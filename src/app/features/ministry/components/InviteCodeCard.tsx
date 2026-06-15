import React, { useState } from 'react';

interface InviteCodeCardProps {
  initialCode?: string;
  onCopy?: () => void;
}

export const InviteCodeCard: React.FC<InviteCodeCardProps> = ({
  initialCode = 'WORSHIP-X7K2',
  onCopy,
}) => {
  const [code, setCode] = useState(initialCode);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      if (onCopy) {
        onCopy();
      }
    });
  };

  const handleRegenerate = () => {
    // Generate a random-looking invite code, e.g., WORSHIP-[4 alphanumeric characters]
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let suffix = '';
    for (let i = 0; i < 4; i++) {
      suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCode(`WORSHIP-X${suffix}`);
  };

  return (
    <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex justify-between items-center transition-all duration-200">
      <div className="space-y-1">
        <p className="text-on-surface-variant text-[12px] font-medium">Código de Convite</p>
        <div className="flex items-center gap-2">
          <code className="text-primary font-bold text-[18px] tracking-widest">{code}</code>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors flex items-center justify-center"
          title="Copiar"
          aria-label="Copiar código de convite"
        >
          <span className="material-symbols-outlined">content_copy</span>
        </button>
        <button
          onClick={handleRegenerate}
          className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors flex items-center justify-center"
          title="Regerar"
          aria-label="Regerar código de convite"
        >
          <span className="material-symbols-outlined">refresh</span>
        </button>
      </div>
    </div>
  );
};

export default InviteCodeCard;
