import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IProductRegister } from '../../types/product';

interface ProductState {
  registerForm: IProductRegister;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  registerForm: {
    title: '',
    description: '',
    price: '',
    email: '',
    categoryId: 0,
    transactionType: '',
    registrationType: '',
    meetingPlace: '',
    latitude: 0,
    longitude: 0,
    address: '',
    images: [],
    maxParticipants: 1,
    selectedDays: [],
    startDate: '',
    endDate: '',
    hobbyId: 0
  },
  isLoading: false,
  error: null
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    updateProductForm: (state, action: PayloadAction<Partial<IProductRegister>>) => {
      state.registerForm = {
        ...state.registerForm,
        ...action.payload
      };
    },
    addProductImage: (state, action: PayloadAction<File>) => {
      state.registerForm.images = [...(state.registerForm.images || []), action.payload];
    },
    removeProductImage: (state, action: PayloadAction<number>) => {
      state.registerForm.images = state.registerForm.images?.filter(
        (_, index) => index !== action.payload
      );
    },
    resetProductForm: (state) => {
      state.registerForm = initialState.registerForm;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const {
  updateProductForm,
  addProductImage,
  removeProductImage,
  resetProductForm,
  setError
} = productSlice.actions;

export default productSlice.reducer;
