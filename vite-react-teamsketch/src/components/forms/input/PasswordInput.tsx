import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import BaseInput, { BaseInputProps } from '../../common/BaseInput';

const PasswordInput = (props: Omit<BaseInputProps, 'type' | 'rightIcon'>) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleIcon = (
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
    >
      {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
    </button>
  );

  return (
    <BaseInput
      {...props}
      type={showPassword ? "text" : "password"}
      rightIcon={toggleIcon}
    />
  );
};

export default PasswordInput; 