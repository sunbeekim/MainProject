import { useState } from 'react';
import DayButton from './DayButton';

interface DaySelectProps {
  onDaySelect: (days: string[]) => void;
  selectedDays?: string[];
}

const DaySelect: React.FC<DaySelectProps> = ({ onDaySelect, selectedDays = [] }) => {
  const [selected, setSelected] = useState<string[]>(selectedDays);

  const handleDaySelect = (day: string) => {
    let updatedSelected;

    if (selected.includes(day)) {
      // 이미 선택된 경우 → 선택 해제 (제거)
      updatedSelected = selected.filter((d) => d !== day);
    } else {
      // 선택되지 않은 경우 → 추가
      updatedSelected = [...selected, day];
    }

    setSelected(updatedSelected);
    onDaySelect(updatedSelected);
  };

  return (
    <div className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-sm p-2">
      <DayButton onDaySelect={handleDaySelect} selectedDays={selected} />
    </div>
  );
};

export default DaySelect;
