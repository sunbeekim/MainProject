import axios from 'axios';
import { apiConfig } from './apiConfig';

interface ChatResponse {
  response: string;
}

export const DeepSeekNaverChat = async (message: string): Promise<ChatResponse> => {
  try {
    const response = await axios.post<ChatResponse>(apiConfig.endpoints.assist.chat, {
      message,
      type: 'customer_service'
    });

    console.log('서버 응답:', response.data);
    
    if (!response.data.response) {
      throw new Error('Invalid response format');
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('채팅 API 에러:', error.response?.data);
      throw new Error(error.response?.data?.message || '고객센터와 통신 중 오류가 발생했습니다.');
    }
    throw error;
  }
};

