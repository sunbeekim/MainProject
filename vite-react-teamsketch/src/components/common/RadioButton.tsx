export interface RadioButtonProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  label: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  variant?: 'default' | 'circle' | 'square' | 'pill';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const RadioButton: React.FC<RadioButtonProps> = ({ 
  label, 
  value, 
  checked, 
  onChange, 
  variant = 'default',
  size = 'md',
  className = '',
  ...props 
}) => {
  const sizeStyles = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-xl'
  };

  const variantStyles = {
    default: 'rounded-full',
    circle: 'rounded-full',
    square: 'rounded-lg',
    pill: 'rounded-full px-6'
  };

  return (
    <label className="relative">
      <input
        type="radio"
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only peer"
        {...props}
      />
      <div
        className={`
          flex items-center justify-center
          cursor-pointer
          font-medium
          transition-all duration-200 ease-in-out
          ${sizeStyles[size]}
          ${variantStyles[variant]}
          ${
            checked
              ? 'bg-primary-light text-white border-2 border-primary-light transform scale-110'
              : 'bg-white text-gray-600 border-2 border-gray-300 hover:border-primary-light hover:text-primary-light'
          }
          peer-focus:ring-2 peer-focus:ring-primary-light peer-focus:ring-opacity-50
          ${className}
        `}
      >
        {label}
      </div>
    </label>
  );
};

export default RadioButton;
