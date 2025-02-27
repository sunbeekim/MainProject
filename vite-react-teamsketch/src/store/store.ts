import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import testReducer from './slices/testSlice';
import signupReducer from './slices/signupSlice';
import loadingReducer from './slices/loadingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    test: testReducer,
    signup: signupReducer,
    loading: loadingReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat()
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
