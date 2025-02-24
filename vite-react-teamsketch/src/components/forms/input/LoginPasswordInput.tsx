import BaseInput, { BaseInputProps } from '../../common/BaseInput';

const LoginPasswordInput = (props: BaseInputProps) => {
  return (    
      <BaseInput {...props} type={"password"} />      
  );
};

export default LoginPasswordInput; 