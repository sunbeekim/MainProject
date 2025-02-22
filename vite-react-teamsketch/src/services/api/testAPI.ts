import axios from 'axios';
import { apiConfig } from './apiConfig';

interface IEchoRequest { // 인덱스 시그니처
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

export const testAPI = {
  // Hello 테스트
  getHello: async (): Promise<IHelloResponse> => {
    const response = await axios.get(`${apiConfig.endpoints.core.test}/hello`);
    return response.data;
  },

  // Echo 테스트
  postEcho: async (data: IEchoRequest): Promise<IEchoResponse> => {
    const response = await axios.post(`${apiConfig.endpoints.core.test}/echo`, data);
    return response.data;
  },

  // Health Check
  getHealth: async (): Promise<IHealthResponse> => {
    const response = await axios.get(`${apiConfig.endpoints.core.test}/health`);
    return response.data;
  }
};
