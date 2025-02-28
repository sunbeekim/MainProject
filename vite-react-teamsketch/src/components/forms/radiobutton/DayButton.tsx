import RadioButton from '../../common/RadioButton';

interface DayButtonProps {
  onDaySelect: (day: string) => void;
  selectedDay?: string;
}

const DayButton: React.FC<DayButtonProps> = ({ onDaySelect, selectedDay }) => {
  const days = [
    { label: '월', value: 'MON' },
    { label: '화', value: 'TUE' },
    { label: '수', value: 'WED' },
    { label: '목', value: 'THU' },
    { label: '금', value: 'FRI' },
    { label: '토', value: 'SAT', isWeekend: true },
    { label: '일', value: 'SUN', isWeekend: true }
  ];

  const handleDaySelect = (value: string) => {
    onDaySelect(value);
    console.log('선택된 요일:', days.find((day) => day.value === value)?.label);
  };

  return (
    <div className="flex flex-row gap-4 items-center justify-center p-4">
      {days.map((day) => (
        <RadioButton
          key={day.value}
          label={day.label}
          value={day.value}
          checked={selectedDay === day.value}
          onChange={handleDaySelect}
        />
      ))}
    </div>
  );
};

export default DayButton;
