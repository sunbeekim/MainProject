export type LoginMethod = 'EMAIL' | 'SOCIAL';
export type SocialProvider = 'GOOGLE' | 'KAKAO' | 'NAVER' | null;

export interface SignupForm {
  name: string;
  password: string;
  email: string;
  phoneNumber: string;
  hobby?: string;
  bio?: string;
  nickname: string;
  loginMethod: LoginMethod;
  socialProvider: SocialProvider;
}

// 백엔드 ENUM과 매핑하기 위한 상수 추가
export const SOCIAL_PROVIDER = {
  GOOGLE: 'GOOGLE',
  KAKAO: 'KAKAO',
  NAVER: 'NAVER'
} as const;

export const LOGIN_METHOD = {
  EMAIL: 'EMAIL',
  SOCIAL: 'SOCIAL'
} as const;
