import { useMutation, useQuery } from '@tanstack/react-query';
import { axiosInstance } from './axiosInstance';
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
