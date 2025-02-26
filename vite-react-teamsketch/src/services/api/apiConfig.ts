const isDev = process.env.NODE_ENV === 'development';
const BASE_URL = isDev 
  ? 'http://localhost:8080/api'
  : 'https://sunbee.world/api';

export const apiConfig = {
  baseURL: BASE_URL,
  endpoints: {
    assist: {
      base: `${BASE_URL}/assist`,
      chat: `${BASE_URL}/assist/tinylamanaver/chat`,
      cloudOCR: `${BASE_URL}/assist/cloudocr/process`,
      // 다른 assist 서비스 엔드포인트들...
    },
    core: {
      base: `${BASE_URL}/core`,
      signup: `${BASE_URL}/core/auth/signup`,
      login: `${BASE_URL}/core/auth/login`,
      user: `${BASE_URL}/core/user`,
      test: `${BASE_URL}/core/test`,
      // 다른 core 서비스 엔드포인트들...
    },
    ai: {
      base: `${BASE_URL}/ai`,
      aichat: `${BASE_URL}/ai/chat`,
      // 영어 질문용(번역기능 없음)
    }
  }
};

