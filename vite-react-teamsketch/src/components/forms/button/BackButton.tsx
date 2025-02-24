import { useNavigate } from 'react-router-dom';
import BaseButton from '../../common/BaseButton';

interface BackButtonProps {
  className?: string;
}

const BackButton = ({ className = '' }: BackButtonProps) => {
  const navigate = useNavigate();

  return (
    <BaseButton
      variant="outline"
      size="sm"
      onClick={() => navigate(-1)}
      className={`rounded-full ${className}`}
      aria-label="뒤로 가기"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-6 h-6" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M15 19l-7-7 7-7" 
        />
      </svg>
    </BaseButton>
  );
};

export default BackButton;