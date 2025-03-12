interface DaySelectProps {
  onDaySelect: (days: string[]) => void;
  selectedDays: string[];
}

const DaySelect = ({ onDaySelect, selectedDays }: DaySelectProps) => {
  const daysOfWeek = ['월', '화', '수', '목', '금', '토', '일'];

  const handleDayClick = (day: string) => {
    const updatedDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    onDaySelect(updatedDays);
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
      {daysOfWeek.map((day) => (
        <button
          key={day}
          onClick={() => handleDayClick(day)}
          className={`
            relative
            min-w-[40px] sm:min-w-[50px] md:min-w-[60px]
            h-[40px] sm:h-[50px] md:h-[60px]
            rounded-full
            font-semibold
            text-sm sm:text-base md:text-lg
            transition-all duration-300 ease-in-out
            transform hover:scale-105
            ${
              selectedDays.includes(day)
                ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }
            ${
              selectedDays.includes(day)
                ? 'before:content-[""] before:absolute before:inset-0 before:rounded-full before:bg-white before:opacity-0 before:animate-ping'
                : ''
            }
            disabled:opacity-50 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
          `}
        >
          {day}
        </button>
      ))}
    </div>
  );
};

export default DaySelect;
