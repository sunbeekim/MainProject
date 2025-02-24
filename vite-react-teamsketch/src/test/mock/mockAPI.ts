import { mockMessages, mockAuthResponse } from './mockData';

// 실제 API 응답 구조를 모방
const createResponse = <T>(data: T) => ({
  status: 'success',
  data
});

export const mockAPI = {
  chat: {
    sendMessage: async (message: string) => {
      // 응답 지연 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return createResponse({
        response: '이것은 mock 응답입니다: ' + message
      });
    },
    
    getHistory: async () => {
      return createResponse({
        messages: mockMessages
      });
    }
  },

  auth: {
    login: async (credentials: { email: string; password: string }) => {
      if (credentials.email === 'test@test.com' && credentials.password === 'password123') {
        return createResponse(mockAuthResponse);
      }
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  }
};

// 테스트에서 사용할 수 있는 헬퍼 함수
export const setupMockAPI = () => {
  // axios mock adapter 설정 등
  console.log('Mock API가 설정되었습니다.');
};
