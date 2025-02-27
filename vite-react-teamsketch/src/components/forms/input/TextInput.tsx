import BaseInput, { BaseInputProps } from '../../common/BaseInput';

interface TextInputProps extends Omit<BaseInputProps, 'type'> {
  label?: string;
  error?: string;
  inputType?: 'username' | 'name' | 'tel' | 'nickname' | 'organization' | 'street-address' | 'off';
}

const TextInput = ({ label, inputType, ...props }: TextInputProps) => {
  // 입력 필드 타입에 따른 autoComplete 값 설정
  const getAutoComplete = () => {
    switch (props.name) {
      case 'id':
      case 'username':
        return 'username';
      case 'name':
        return 'name';
      case 'phone':
        return 'tel';
      case 'nickname':
        return 'nickname';
      case 'organization':
        return 'organization';
      case 'address':
        return 'street-address';
      default:
        return inputType || 'off';
    }
  };

  return (
    <BaseInput
      {...props}
      type="text"
      autoComplete={getAutoComplete()}
      variant={props.error ? 'error' : props.variant}
      label={
        label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            {label}
          </label>
        )
      }
    />
  );
};

export default TextInput;
