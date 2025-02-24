import BaseInput, { BaseInputProps } from '../../common/BaseInput';

const EmailInput = (props: Omit<BaseInputProps, 'type'>) => {
  return <BaseInput {...props} type="email" />;
};

export default EmailInput; 