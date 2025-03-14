import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage 사용
import { setupListeners } from '@reduxjs/toolkit/query';

import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import testReducer from './slices/testSlice';
import signupReducer from './slices/signupSlice';
import loadingReducer from './slices/loadingSlice';
import mapReducer from './slices/mapSlice';
import userReducer from './slices/userSlice';
import categoryReducer from './slices/categorySlice';
import productReducer from './slices/productSlice';
// `combineReducers`를 사용하여 Redux Reducer 결합
const rootReducer = combineReducers({
  auth: authReducer,
  chat: chatReducer,
  test: testReducer,
  signup: signupReducer,
  loading: loadingReducer,
  map: mapReducer,
  user: userReducer, // user 상태를 persist에 저장
  category: categoryReducer, // category 상태를 persist에 저장
  product: productReducer // product 상태를 persist에 저장
});

// Redux Persist 설정
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'] // user 상태만 저장 (필요하면 다른 reducer도 추가)
};

// Redux Persist 적용
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Redux Store 생성
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false // redux-persist 사용 시 직렬화 검사 비활성화
    })
});

// Redux Persistor 생성
export const persistor = persistStore(store);

// RTK Query 설정
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
