import React, { useState } from 'react';
import Button from '@shared/components/ui/button';
import Input from '@shared/components/ui/input';

export interface SuggestSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, artist: string) => void;
}

export const SuggestSongModal = ({
  isOpen,
  onClose,
  onSubmit,
}: SuggestSongModalProps) => {
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');

  if (!isOpen) return null;

  const handleSuggestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newArtist) return;
    onSubmit(newTitle, newArtist);
    setNewTitle('');
    setNewArtist('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4">
      <div 
        className="bg-background rounded-2xl w-full max-w-sm flex flex-col gap-4 shadow-2xl border border-outline-variant/20 p-6"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-headline-md font-bold text-on-surface">Sugerir Música</h3>
          <button 
            onClick={onClose}
            className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSuggestSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-label-lg text-on-surface">Título da música</label>
            <Input
              required
              placeholder="Ex: Ousado Amor"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-label-lg text-on-surface">Artista / Ministério</label>
            <Input
              required
              placeholder="Ex: Isaías Saad"
              value={newArtist}
              onChange={(e) => setNewArtist(e.target.value)}
            />
          </div>

          <div className="flex gap-3 mt-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
            >
              Sugerir
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SuggestSongModal;
