import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: null | {
    email: string;
    nickname: string;
    userId: number;
  };
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem('token') // 초기값으로 저장된 토큰 가져오기
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ 
      email: string;
      nickname: string;
      userId: number;
      token: string;
    }>) => {
      state.isAuthenticated = true;
      state.user = {
        email: action.payload.email,
        nickname: action.payload.nickname,
        userId: action.payload.userId
      };
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token); // 토큰 저장
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('token'); // 토큰 제거
    }
  }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
