const isDev = process.env.NODE_ENV === 'development';
const BASE_URL = isDev ? 'http://localhost:8080/api' : 'https://sunbee.world/api';

export const apiConfig = {
  baseURL: BASE_URL,
  endpoints: {
    assist: {
      base: `${BASE_URL}/assist`,
      chat: `${BASE_URL}/assist/tinylamanaver/chat`,
      cloudOCR: `${BASE_URL}/assist/cloudocr/process`,
      uploadProfile: `${BASE_URL}/assist/upload/profile`,
      sendSms: `${BASE_URL}/assist/sms/send-sms`,
      verifyOtp: `${BASE_URL}/assist/sms/verify-otp`,
      coordToAddress: `${BASE_URL}/assist/location/coord-to-address`,
      searchAddress: `${BASE_URL}/assist/location/search`
      // 다른 assist 서비스 엔드포인트들...
    },
    core: {
      base: `${BASE_URL}/core`,
      signup: `${BASE_URL}/core/auth/signup`,
      login: `${BASE_URL}/core/auth/login`,
      logout: `${BASE_URL}/core/auth/logout`,
      user: `${BASE_URL}/core/user`,
      userinfo: `${BASE_URL}/core/profiles/me`,
      uploadProfile: `${BASE_URL}/core/profiles/me/image`,
      getProfileImageInfo: `${BASE_URL}/core/profiles/me/image-info`,
      getProfileImage: `${BASE_URL}/core/profiles/image`,
      getCategory: `${BASE_URL}/core/hobbies/categories`,
      getHobbies: `${BASE_URL}/core/hobbies`,
      getHobbiesByCategory: (categoryId: number) => `${BASE_URL}/core/hobbies/categories/${categoryId}`,
      updateProfile: `${BASE_URL}/core/profiles/me`,
      registerProduct: `${BASE_URL}/core/market/products/registers`,
      uploadProductImages: `${BASE_URL}/core/market/images/upload`,
      getProducts: `${BASE_URL}/core/market/products`,
      getProductById: (productId: number) => `${BASE_URL}/core/market/products/${productId}`,
      test: `${BASE_URL}/core/test`,
      
      // 다른 core 서비스 엔드포인트들...
    },
    ai: {
      base: `${BASE_URL}/ai`,
      aichat: `${BASE_URL}/ai/chat`
      // 영어 질문용(번역기능 없음)
    }
  }
};
