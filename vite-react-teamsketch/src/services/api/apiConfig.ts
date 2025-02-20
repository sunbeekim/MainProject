const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const apiConfig = {
  baseURL: BASE_URL,
  endpoints: {
    assist: {
      base: `${BASE_URL}/assist`,
      chat: `${BASE_URL}/assist/tinylamanaver/chat`,
      // 다른 assist 서비스 엔드포인트들...
    },
    core: {
      base: `${BASE_URL}/core`,
      auth: `${BASE_URL}/core/auth`,
      user: `${BASE_URL}/core/user`,
      // 다른 core 서비스 엔드포인트들...
    },
    ai: {
      base: `${BASE_URL}/ai`,
      aichat: `${BASE_URL}/ai/chat`,
      // 영어 질문용(번역기능 없음)
    }
  }
};

