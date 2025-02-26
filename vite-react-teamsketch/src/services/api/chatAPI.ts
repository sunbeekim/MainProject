import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from './axiosInstance';
import { apiConfig } from './apiConfig';

// 타입 정의
interface ChatRequest {
  message: string;
  type: 'customer_service';
}

interface ChatResponse {
  status: string;
  data: {
    message: string;
    response: string;
  };
  message: string | null;
  code: string;
}

export const useSendChatMessage = () => {
  return useMutation({
    mutationFn: async (message: string) => {
      const request: ChatRequest = {
        message,
        type: 'customer_service'
      };

      const response = await axiosInstance.post<ChatResponse>(
        apiConfig.endpoints.assist.chat,
        request
      );
      return response.data.data.response;
    }
  });
};

