import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { apiConfig } from './apiConfig';

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
      try {
        const response = await axios.post<ChatResponse>(
          apiConfig.endpoints.assist.chat, 
          {
            message,
            type: 'customer_service'
          }
        );

        console.log('서버 응답:', response.data);

        if (response.data.status !== 'success' || !response.data.data?.response) {
          throw new Error(response.data.message || '서버 응답 형식이 올바르지 않습니다.');
        }

        return response.data.data.response;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.message || '서버 통신 중 오류가 발생했습니다.';
          console.error('API 에러:', errorMessage);
          throw new Error(errorMessage);
        }
        throw error;
      }
    }
  });
};

