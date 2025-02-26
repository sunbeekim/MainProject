import React from 'react';

interface FloatingButtonProps {
  onClick: () => void;
  icon: React.ReactNode;  
  label: string;          
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';  
  color?: 'primary' | 'secondary';
}

const FloatingButton: React.FC<FloatingButtonProps> = ({
  onClick,
  icon,
  label,
  position = 'bottom-right',
  color = 'primary',
}) => {
  const positionClasses = {//버튼 위치
    'bottom-right': 'bottom-24 right-5',
    'bottom-left': 'bottom-15 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  const colorClasses = {
    primary: 'bg-green-500 hover:bg-green-900 text-white',
    secondary: 'bg-blue-500 hover:bg-blue-900 text-white',
  };

  return (
    <button
      onClick={onClick}
      className={`fixed ${positionClasses[position]} ${colorClasses[color]} p-5 rounded-full shadow-lg flex items-center justify-center transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light  z-50 `}
      aria-label={label}  
    >
      {icon}
      <span className="sr-only">{label}</span>
    </button>
  );
};

export default FloatingButton;
