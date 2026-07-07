import React from 'react';

interface InviteCodeCardProps {
  code?: string;
  onCopy?: () => void;
  onRegenerate?: () => void;
  isUpdating?: boolean;
}

export const InviteCodeCard: React.FC<InviteCodeCardProps> = ({
  code = '',
  onCopy,
  onRegenerate,
  isUpdating = false,
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      if (onCopy) {
        onCopy();
      }
    });
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
        {onRegenerate && (
          <button
            onClick={onRegenerate}
            disabled={isUpdating}
            className={`p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors flex items-center justify-center ${
              isUpdating ? 'animate-spin opacity-50' : ''
            }`}
            title="Regerar"
            aria-label="Regerar código de convite"
          >
            <span className="material-symbols-outlined">refresh</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default InviteCodeCard;
