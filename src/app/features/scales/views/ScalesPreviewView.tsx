import React, { useState } from 'react';
import MonthSelector from '../components/MonthSelector';

export const ScalesPreviewView: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('2023-10');

  return (
    <div className="w-full flex flex-col gap-6">
      <MonthSelector 
        selectedMonth={selectedMonth} 
        onMonthSelect={setSelectedMonth} 
      />
    </div>
  );
};

export default ScalesPreviewView;
