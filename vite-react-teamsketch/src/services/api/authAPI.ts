import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from './axiosInstance';
import { apiConfig } from './apiConfig';
import { SignupForm, ProfileUpdateRequest } from '../../types/auth';

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupResponse {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    email: string;
  };
}

interface VerifyOtpRequest {
  phoneNumber: string;
  otp: string;
}

interface SmsResponse {
  statusCode: string;
  message: string;
}

interface VerifyOtpResponse {
  success: boolean;
  message: string;
}

// 로그인 API
const loginApi = async (credentials: LoginCredentials) => {
  const response = await axiosInstance.post(apiConfig.endpoints.core.login, credentials);
  console.log('로그인 응답:', response.data);
  return response.data;
};

// 회원가입 API
const signupApi = async (userData: SignupForm) => {
  const response = await axiosInstance.post<SignupResponse>(
    apiConfig.endpoints.core.signup,
    userData
  );
  return response.data;
};

// 로그아웃 API
const logoutApi = async () => {
  const response = await axiosInstance.post(apiConfig.endpoints.core.logout);
  return response.data;
};

// 유저정보조회 API
const getUserInfoApi = async () => {
  const response = await axiosInstance.get(apiConfig.endpoints.core.userinfo);
  return response.data;
};

// 문자 전송 API
const sendSmsApi = async (phoneNumber: string): Promise<SmsResponse> => {
  const response = await axiosInstance.post(apiConfig.endpoints.assist.sendSms, { phoneNumber });
  return response.data;
};

// 문자 인증 API
const verifyOtpApi = async ({ phoneNumber, otp }: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
  const response = await axiosInstance.post(apiConfig.endpoints.assist.verifyOtp, {
    phoneNumber,
    otp
  });
  return response.data;
};

// //이메일 전송 API
// const sendEmailApi = async (email: string): Promise<EmailResponse> => {
//   const response = await axiosInstance.post(apiConfig.endpoints.assist.sendEmail, { email });
//   return response.data;
// }

// //이메일 인증 API
// const verifyOtpEmailApi = async ({ email, otp }: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
//   const response = await axiosInstance.post(apiConfig.endpoints.assist.verifyOtpEmail, {
//     email,
//     otp
//   });
//   return response.data;
// }

// 프로필 수정 API
const updateProfileApi = async (profileData: ProfileUpdateRequest) => {
  const response = await axiosInstance.put(apiConfig.endpoints.core.updateProfile, profileData);
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

// 로그아웃 Hook
export const useLogout = () => {
  return useMutation({
    mutationFn: logoutApi
  });
};

// 유저정보조회 Hook
export const useInfoApi = () => {
  return useMutation({
    mutationFn: getUserInfoApi
  });
};

// 문자 전송 Hook
export const useSendSms = () => {
  return useMutation({
    mutationFn: sendSmsApi,
    onError: (error: any) => {
      console.error('SMS 전송 실패:', error);
      throw new Error(error.response?.data?.message || 'SMS 전송에 실패했습니다.');
    }
  });
};

// 문자 인증 Hook
export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: verifyOtpApi,
    onError: (error: any) => {
      console.error('OTP 검증 실패:', error);
      throw new Error(error.response?.data?.message || '인증번호 확인에 실패했습니다.');
    }
  });
};

// //이메일 전송 Hook
// export const useSendEmail = () => {
//   return useMutation({
//     mutationFn: sendEmailApi,
//     onError: (error: any) => {
//       console.error('Email 전송 실패:', error);
//       throw new Error(error.response?.data?.message || 'Email 전송에 실패했습니다.');
//     }
//   });
// };

// //이메일 인증 Hook
// export const userVerifyOtpEmail = () => {
//   return useMutation({
//     mutationFn: verifyOtpEmailApi,
//     onError: (error: any) => {
//       console.error('OTP 검증 실패:', error);
//       throw new Error(error.response?.data?.message || '인증번호 확인에 실패했습니다.');
//     }
//   });
// };

// 프로필 수정 Hook
export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: updateProfileApi
  });
};
