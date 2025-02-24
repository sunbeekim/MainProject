import React from 'react';

export interface BaseInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  testId?: string;
  name: string;
  label?: string;
  rightIcon?: React.ReactNode;
}

const BaseInput = ({
  value,
  onChange,
  error,
  placeholder,
  required = true,
  className = '',
  testId,
  name,
  label,
  type = 'text',
  rightIcon,
  ...props
}: BaseInputProps & { type?: string }) => {
  const baseClassName = "w-full rounded-lg border p-2 text-gray-900 dark:text-white dark:bg-gray-800";
  const errorClassName = error ? "border-red-500" : "border-gray-300 dark:border-gray-600";
  
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`${baseClassName} ${errorClassName} ${className} ${rightIcon ? 'pr-10' : ''}`.trim()}
          data-testid={testId}
          name={name}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-xs" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default BaseInput; 