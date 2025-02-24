import { useMutation } from '@tanstack/react-query';
import { uploadInstance } from '../../../services/api/axiosInstance';
import { apiConfig } from '../../../services/api/apiConfig';

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

interface OCRResponse {
  status: 'success' | 'error';
  text: string;
  confidence?: number;
}

export const CloudOCR = async (formData: FormData): Promise<OCRResponse> => {
  try {
    const response = await uploadInstance.post(
      `${apiConfig.endpoints.assist.base}/ocr/process`, 
      formData
    );

    if (response.data && typeof response.data === 'object') {
      return {
        status: 'success',
        text: response.data.text || '',
        confidence: response.data.confidence
      };
    }

    throw new Error('Invalid response format');
  } catch (error) {
    console.error('OCR API Error:', error);
    return {
      status: 'error',
      text: (error as any).response?.data?.message || '이미지 처리 중 오류가 발생했습니다.',
    };
  }
};

// 다른 테스트 API 함수들도 여기에 추가할 수 있습니다.
export const testAPI = {
  CloudOCR,
  // ... 다른 API 함수들
}; 

