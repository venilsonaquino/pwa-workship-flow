import React, { useState } from 'react';
import MonthSelector from '../components/MonthSelector';
import SongDistribution from '../components/SongDistribution';
import ScalePreviewCard from '../components/ScalePreviewCard';

export const ScalesPreviewView: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('2023-10');

  return (
    <div className="w-full flex flex-col gap-6 pb-6">
      <MonthSelector 
        selectedMonth={selectedMonth} 
        onMonthSelect={setSelectedMonth} 
      />
      <SongDistribution />
      <ScalePreviewCard />

      {/* FAB - Nova Escala */}
      <button
        type="button"
        className="fixed bottom-24 right-6 gradient-brand text-white flex items-center gap-2 px-6 py-3 rounded-full shadow-xl z-50 active:scale-95 transition-transform cursor-pointer font-bold text-label-lg"
      >
        <span className="material-symbols-outlined">add</span>
        Nova Escala
      </button>
    </div>
  );
};

export default ScalesPreviewView;
