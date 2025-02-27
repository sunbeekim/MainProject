import axios, { AxiosInstance } from 'axios';
import { apiConfig } from './apiConfig';
import { toast } from 'react-toastify';

// API 응답 타입 정의
interface ApiResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  code?: string;
}

// 기본 axios 인스턴스 생성
export const axiosInstance = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 파일 업로드용 인스턴스
export const uploadInstance = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

// 공통 인터셉터 설정
const setupInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      console.error('Request Error:', error);
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      const apiResponse = response.data as ApiResponse;
      if (apiResponse.status === 'error') {
        return Promise.reject(new Error(apiResponse.message));
      }
      return response;
    },
    (error) => {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            localStorage.removeItem('token');
            window.location.href = '/login';
            toast.error('인증이 만료되었습니다. 다시 로그인해주세요.');
            break;
          case 403:
            toast.error('접근 권한이 없습니다.');
            break;
          case 404:
            toast.error('요청하신 리소스를 찾을 수 없습니다.');
            break;
          case 429:
            toast.error('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.');
            break;
          case 500:
            toast.error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            break;
          default:
            toast.error('오류가 발생했습니다.');
        }
      } else if (error.request) {
        toast.error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
      }
      return Promise.reject(error);
    }
  );
};

// 인터셉터 적용
setupInterceptors(axiosInstance);
setupInterceptors(uploadInstance);
