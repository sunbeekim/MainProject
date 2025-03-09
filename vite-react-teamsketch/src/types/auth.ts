export type LoginMethod = 'EMAIL' | 'SOCIAL';
export type SocialProvider = 'GOOGLE' | 'KAKAO' | 'NAVER' | null;

export interface Hobbies{
  hobbyId: number;
  catetoryId: number;
}
export interface Hobby{
  hobbyId: number;
  hobbyName: string;
}

export interface Category{
  categoryId: number;
  categoryName: string;
}
export interface SignupForm {
  name: string;
  password: string;
  email: string;
  phoneNumber: string;
  bio?: string;
  nickname: string;
  hobbies?: Hobbies[];
  profileImage?: File;
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

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: 'success' | 'error';
  data: {
    id?: number;
    email?: string;
    name?: string;
    nickname?: string;
    phoneNumber?: string | null;
    bio?: string | null;
    loginMethod?: 'EMAIL' | 'SOCIAL';
    socialProvider?: 'GOOGLE' | 'KAKAO' | 'NAVER' | 'NONE';
    accountStatus?: 'Active' | 'Deactivated' | 'Dormant' | 'Withdrawal';
    authority?: 'USER' | 'ADMIN';
    profileImagePath?: string | null;
    token?: string;
  };
  message?: string;
  code: string;
}

// {
//   "success": true,
//   "message": "프로필 조회 성공",
//   "email": "user@example.com",
//   "name": "사용자명",
//   "nickname": "사용자닉네임",
//   "phoneNumber": "01012345678",
//   "profileImageUrl": "http://localhost:8081/api/core/profiles/image/user_abc123.jpg",
//   "bio": "자기소개입니다.",
//   "loginMethod": "EMAIL",
//   "accountStatus": "Active",
//   "signupDate": "2023-06-24T10:15:30",
//   "lastLoginTime": "2023-06-24T15:30:45",
//   "hobbies": [
//     {
//       "hobbyId": 1,
//       "hobbyName": "축구",
//       "categoryId": 1,
//       "categoryName": "스포츠"
//     },
//     {
//       "hobbyId": 6,
//       "hobbyName": "피아노",
//       "categoryId": 3,
//       "categoryName": "음악"
//     }
//   ]
// }
