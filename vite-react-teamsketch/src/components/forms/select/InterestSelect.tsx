import Select from "../../common/Select";   

interface InterestSelectProps {
  onInterestSelect: (value: string) => void;
  selectedInterest?: string;
  interest: [];
}


const InterestSelect: React.FC<InterestSelectProps> = ({ onInterestSelect,
  selectedInterest,
  interest = [
    { value: '예술', label: '🎨예술' },
    { value: '음악', label: '🎤음악' },
    { value: '스포츠', label: '🏋️‍♂️스포츠' },
    { value: '게임', label: '🎮게임' },
    { value: '여행', label: '🚗여행' },
    { value: '요리', label: '🍽️요리' },
    { value: '독서', label: '📚독서' },
    { value: '수집', label: '🎁수집' },
    { value: 'DIY', label: '🛠️DIY' },
    { value: '과학', label: '🔍과학' },
  ]
}) => {
 

  const handleInterestSelect = (value: string) => { 
    onInterestSelect(value);
    console.log('선택된 관심사:', value);
  }

  return (
    <Select 
        options={interest}
        onChange={handleInterestSelect}
        className="w-full"
        placeholder="관심사를 선택해주세요"
        value={selectedInterest}
    />
  );
};

export default InterestSelect;

