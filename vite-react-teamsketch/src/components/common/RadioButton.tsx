export interface RadioButtonProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({ label, value, checked, onChange, ...props }) => {
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
        w-12 h-12
        flex items-center justify-center
        rounded-full cursor-pointer
        text-lg font-medium
        transition-all duration-200 ease-in-out
        ${
          checked
            ? 'bg-primary-light text-white border-2 border-primary-light transform scale-110'
            : 'bg-white text-gray-600 border-2 border-gray-300 hover:border-primary-light hover:text-primary-light'
        }
        peer-focus:ring-2 peer-focus:ring-primary-light peer-focus:ring-opacity-50
      `}
      >
        {label}
      </div>
    </label>
  );
};

export default RadioButton;
