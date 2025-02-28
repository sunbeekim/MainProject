import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from './axiosInstance';
import { apiConfig } from './apiConfig';

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupRequest {
  name: string;
  id: string;
  password: string;
  email: string;
  phone: string;
  hobby?: string;
  nickname: string;
}

interface SignupResponse {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    email: string;
  };
}

// 로그인 API
const loginApi = async (credentials: LoginCredentials) => {
  const response = await axiosInstance.post(apiConfig.endpoints.core.login, credentials);
  return response.data;
};

// 회원가입 API
const signupApi = async (userData: SignupRequest) => {
  const response = await axiosInstance.post<SignupResponse>(
    apiConfig.endpoints.core.signup,
    userData
  );
  return response.data;
};

// 로그인 Hook
export const useLogin = () => {
  return useMutation({
    mutationFn: loginApi
  });
};

// 회원가입 Hook
export const useSignup = () => {
  return useMutation({
    mutationFn: signupApi,
    onError: (error: any) => {
      // axiosInstance에서 기본 에러 처리를 하지만,
      // 회원가입 특화된 에러 처리가 필요한 경우 여기서 처리
      if (error.response?.data?.code === 'DUPLICATE_EMAIL') {
        throw new Error('이미 사용 중인 이메일입니다.');
      }
      if (error.response?.data?.code === 'DUPLICATE_ID') {
        throw new Error('이미 사용 중인 아이디입니다.');
      }
      throw error;
    }
  });
};
