import { useState } from 'react';
import BaseInput, { BaseInputProps } from '../../common/BaseInput';

interface CustomInputProps extends Omit<BaseInputProps, 'type'> {
  label?: string;
  helperText?: string;
  prefix?: string;
  suffix?: string;
}

const CustomInput = ({ label, helperText, prefix, suffix, ...props }: CustomInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <BaseInput
      {...props}
      type="text"
      variant={props.error ? 'error' : props.variant}
      className={`${prefix ? 'pl-8' : ''} ${suffix ? 'pr-8' : ''} ${props.className || ''}`}
      onFocus={(e) => {
        setIsFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setIsFocused(false);
        props.onBlur?.(e);
      }}
    >
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          {label}
        </label>
      )}
      
      {/* Prefix */}
      {prefix && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          {prefix}
        </div>
      )}
      
      {/* Suffix */}
      {suffix && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
          {suffix}
        </div>
      )}
      
      {/* Helper Text */}
      {helperText && !props.error && (
        <p className={`text-xs mt-1 ${isFocused ? 'text-primary-light' : 'text-gray-500'}`}>
          {helperText}
        </p>
      )}
    </BaseInput>
  );
};

export default CustomInput; 