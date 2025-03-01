import { useState } from 'react';
import DayButton from '../forms/radiobutton/DayButton';

interface DaySelectProps {
  onDaySelect: (day: string) => void;
  selectedDay?: string;
}

const DaySelect: React.FC<DaySelectProps> = ({ onDaySelect, selectedDay }) => {
  const [selected, setSelected] = useState<string | undefined>(selectedDay);

  const handleDaySelect = (day: string) => {
    setSelected(day);
    onDaySelect(day);
    console.log('선택된 요일:', day);
  };

  return (
    <section className="flex flex-col items-center justify-center w-full py-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <DayButton onDaySelect={handleDaySelect} selectedDay={selected} />  
      </div>
    </section>
  );
};

export default DaySelect;
