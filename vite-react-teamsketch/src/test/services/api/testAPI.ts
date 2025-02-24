import { useMutation } from '@tanstack/react-query';

interface LoginCredentials {  
  email: string;
  password: string;
}

const loginApi = async (credentials: LoginCredentials) => {
  // 실제 API 호출로 대체 필요
  if (credentials.email === 'test@test.com' && credentials.password === 'password123') {
    return { email: credentials.email };
  }
  throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
};

export const useLogin = () => {
  return useMutation({
    mutationFn: loginApi,
  });
}; 

