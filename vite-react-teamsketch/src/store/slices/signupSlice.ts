import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SignupForm {
  name: string;
  id: string;
  password: string;
  email: string;
  phone: string;
  hobby: string;
  nickname: string;
}

interface ValidationErrors {
  name: string;
  id: string;
  password: string;
  email: string;
  phone: string;
  nickname: string;
}

interface SignupState {
  formData: SignupForm;
  validationErrors: ValidationErrors;
  error: string;
}

const initialState: SignupState = {
  formData: {
    name: '',
    id: '',
    password: '',
    email: '',
    phone: '',
    hobby: '',
    nickname: ''
  },
  validationErrors: {
    name: '',
    id: '',
    password: '',
    email: '',
    phone: '',
    nickname: ''
  },
  error: ''
};

const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    updateField: (state, action: PayloadAction<{ name: string; value: string }>) => {
      state.formData[action.payload.name as keyof SignupForm] = action.payload.value;
    },
    setValidationError: (state, action: PayloadAction<{ field: string; message: string }>) => {
      state.validationErrors[action.payload.field as keyof ValidationErrors] =
        action.payload.message;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    }
  }
});

export const { updateField, setValidationError, setError } = signupSlice.actions;
export default signupSlice.reducer;
