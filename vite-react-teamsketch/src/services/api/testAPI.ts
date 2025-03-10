import { useMutation, useQuery } from '@tanstack/react-query';
import { axiosInstance, uploadInstance } from './axiosInstance';
import { apiConfig } from './apiConfig';

interface IEchoRequest {
  // 인덱스 시그니처
  [key: string]: any;
}

interface IHealthResponse {
  service: string;
  status: string;
  timestamp: string;
}

interface IHelloResponse {
  message: string;
  status: string;
}

interface IEchoResponse {
  message: string;
  receivedData: IEchoRequest;
  timestamp: number;
}

// API 함수들
const getHelloApi = async (): Promise<IHelloResponse> => {
  const response = await axiosInstance.get(`${apiConfig.endpoints.core.test}/hello`);
  return response.data;
};

const postEchoApi = async (data: IEchoRequest): Promise<IEchoResponse> => {
  const response = await axiosInstance.post(`${apiConfig.endpoints.core.test}/echo`, data);
  return response.data;
};

const getHealthApi = async (): Promise<IHealthResponse> => {
  const response = await axiosInstance.get(`${apiConfig.endpoints.core.test}/health`);
  return response.data;
};

// Custom Hooks
export const useTestApi = () => {
  const useHello = () =>
    useQuery({
      queryKey: ['hello'],
      queryFn: getHelloApi
    });

  const useEcho = () =>
    useMutation({
      mutationFn: postEchoApi
    });

  const useHealth = () =>
    useQuery({
      queryKey: ['health'],
      queryFn: getHealthApi
    });

  return {
    useHello,
    useEcho,
    useHealth
  };
};

//===============================================================//
interface FileResponse {
  status: string;
  data: {
    message: string;
    response: string;
  };
  code: string;
}

export const CloudOCR = async (formData: FormData): Promise<FileResponse> => {
  try {
    const response = await uploadInstance.post(apiConfig.endpoints.assist.cloudOCR, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log(response.data);

    if (response.data && typeof response.data === 'object') {
      return {
        status: 'success',
        data: response.data.data,
        code: response.data.code
      };
    }

    throw new Error('Invalid response format');
  } catch (error) {
    console.error('OCR API Error:', error);
    return {
      status: 'error',
      data: {
        message: error instanceof Error ? error.message : '이미지 처리 중 오류가 발생했습니다.',
        response: ''
      },
      code: '500'
    };
  }
};

export const assistProfile = async (formData: FormData): Promise<FileResponse> => {
  try {
    const response = await uploadInstance.post(apiConfig.endpoints.assist.uploadProfile, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log(response.data);
    if (response.data && typeof response.data === 'object') {
      return {
        status: 'success',
        data: response.data.data,
        code: response.data.code
      };
    }

    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Profile API Error:', error);
    return {
      status: 'error',
      data: {
        message: error instanceof Error ? error.message : '이미지 처리 중 오류가 발생했습니다.',
        response: ''
      },
      code: '500'
    };
  }
};

export const coreProfile = async (formData: FormData): Promise<FileResponse> => {
  try {
    const response = await uploadInstance.post(apiConfig.endpoints.core.uploadProfile, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log(response.data);
    if (response.data && typeof response.data === 'object') {
      return {
        status: 'success',
        data: response.data.data,
        code: response.data.code
      };
    }

    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Profile API Error:', error);
    return {
      status: 'error',
      data: {
        message: error instanceof Error ? error.message : '이미지 처리 중 오류가 발생했습니다.',
        response: ''
      },
      code: '500'
    };
  }
};

export const fileUpload = {
  CloudOCR,
  assistProfile,
  coreProfile
};
