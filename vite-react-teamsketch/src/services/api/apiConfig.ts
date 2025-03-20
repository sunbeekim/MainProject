const isDev = process.env.NODE_ENV === 'development';
const BASE_URL = isDev ? 'http://localhost:8080/api' : 'https://sunbee.world/api';
const REALTIME_URL = isDev ? 'ws://localhost:8080/ws' : 'ws://gateway-container/ws';

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
      // 일단 복붙 아까 복사한거 여기 붙여넣기 그다음 이름 정해주세요
      // 이름정한걸 복사
      myprodregibuy: `${BASE_URL}/core/market/products/users/registers/buy`,
      myprodregisell: `${BASE_URL}/core/market/products/users/registers/sell`,
      myprodreqbuy: `${BASE_URL}/core/market/products/users/requests/buy`,
      myprodreqsell: `${BASE_URL}/core/market/products/users/requests/sell`,
      userprod: `${BASE_URL}/core/market/products/users`,
      mylocation:`${BASE_URL}/core/market/users/location`,
      deleteUser: `${BASE_URL}/core/auth/me/withdrawal`,
      passwordChange:`${BASE_URL}/core/auth/me/password
`,
      passwordChangeNoneToken : `${BASE_URL}/core/auth/me/password/notoken`,
      userinfo: `${BASE_URL}/core/profiles/me`,
      uploadProfile: `${BASE_URL}/core/profiles/me/image`,
      getProfileImageInfo: `${BASE_URL}/core/profiles/me/image-info`,
      getProfileImage: `${BASE_URL}/core/profiles/image`,
      getCategory: `${BASE_URL}/core/hobbies/categories`,
      getHobbies: `${BASE_URL}/core/hobbies`,
      getHobbiesByCategory: (categoryId: number) =>
        `${BASE_URL}/core/hobbies/categories/${categoryId}`,
      updateProfile: `${BASE_URL}/core/profiles/me`,
      registerProduct: `${BASE_URL}/core/market/products/registers`,
      uploadProductImages: `${BASE_URL}/core/market/images/upload`,
      getDefaultProfileImage: `${BASE_URL}/core/profiles/image/default`,
      getProducts: `${BASE_URL}/core/market/products/all`,
      getProductById: (productId: number) => `${BASE_URL}/core/market/products/${productId}`,
      getProductImage: (imageId: number) => `${BASE_URL}/core/market/products/images/${imageId}`,

      getChatRooms: `${BASE_URL}/core/chat/rooms`,
      createChatRoom: `${BASE_URL}/core/chat/rooms`,
      getChatRoomDetail: (chatroomId: number) => `${BASE_URL}/core/chat/rooms/${chatroomId}`,
      approveChatMember: (chatroomId: number) => `${BASE_URL}/core/chat/rooms/${chatroomId}/approve`,
      updateMessagesRead: (chatroomId: number) => `${BASE_URL}/core/chat/rooms/${chatroomId}/read`,
      sendMessage: (chatroomId: number) => `${BASE_URL}/core/chat/rooms/${chatroomId}/messages`,

      requestProduct: `${BASE_URL}/core/market/products/requests/with-chat`,

      websocket: `${REALTIME_URL}`,
    },
    ai: {
      base: `${BASE_URL}/ai`,
      aichat: `${BASE_URL}/ai/chat`
      // 영어 질문용(번역기능 없음)
    }
  }
};
