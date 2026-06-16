import React, { useState, useEffect } from 'react';

interface BandSettingsCardProps {
  initialName?: string;
  onNameChange?: (newName: string) => void;
}

export const BandSettingsCard: React.FC<BandSettingsCardProps> = ({
  initialName = 'Worship Flow Team',
  onNameChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bandName, setBandName] = useState(initialName);

  // Sincroniza o nome da banda vindo do serviço externo
  useEffect(() => {
    if (!isEditing) {
      setBandName(initialName);
    }
  }, [initialName, isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    if (onNameChange) {
      onNameChange(bandName);
    }
  };

  const handleCancel = () => {
    setBandName(initialName);
    setIsEditing(false);
  };

  return (
    <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex justify-between items-center group transition-all duration-200">
      {isEditing ? (
        <div className="flex items-center gap-3 w-full">
          <div className="flex-1 space-y-1">
            <label htmlFor="bandNameInput" className="text-on-surface-variant text-[12px] font-medium">
              Nome da Banda
            </label>
            <input
              id="bandNameInput"
              type="text"
              value={bandName}
              onChange={(e) => setBandName(e.target.value)}
              className="w-full text-on-surface text-[16px] font-bold border-b border-primary focus:border-primary-variant pb-1 bg-transparent focus:outline-none"
              autoFocus
            />
          </div>
          <div className="flex gap-1 shrink-0">
            <button
              onClick={handleSave}
              className="w-8 h-8 flex items-center justify-center rounded-full text-success hover:bg-success/10 transition-colors"
              aria-label="Salvar nome da banda"
            >
              <span className="material-symbols-outlined text-[20px]">check</span>
            </button>
            <button
              onClick={handleCancel}
              className="w-8 h-8 flex items-center justify-center rounded-full text-error hover:bg-error/10 transition-colors"
              aria-label="Cancelar edição"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-1">
            <p className="text-on-surface-variant text-[12px] font-medium">Nome da Banda</p>
            <p className="text-on-surface text-[18px] font-bold">{bandName}</p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full text-primary hover:bg-primary-fixed group-hover:scale-105 transition-all"
            aria-label="Editar nome da banda"
          >
            <span className="material-symbols-outlined">edit</span>
          </button>
        </>
      )}
    </div>
  );
};

export default BandSettingsCard;
