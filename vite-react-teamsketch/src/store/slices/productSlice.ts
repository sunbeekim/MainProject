import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IProductRegister } from '../../types/product';

interface ProductState {
  registerForm: IProductRegister;
  isLoading: boolean;
  error: string | null;
  selectedDays: string[];
}

const initialState: ProductState = {
  registerForm: {
    title: '',
    description: '',
    price: 0,
    email: '',
    categoryId: null,
    hobbyId: null,
    transactionType: '',
    registrationType: '',
    maxParticipants: 1,
    startDate: '',
    endDate: '',
    selectedDays: [],
    images: [],
    latitude: undefined,
    longitude: undefined,
    address: undefined,
    meetingPlace: undefined
  },
  isLoading: false,
  error: null,
  selectedDays: []
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    updateProductForm: (state, action: PayloadAction<Partial<IProductRegister>>) => {
      state.registerForm = { ...state.registerForm, ...action.payload };     
    },
    addProductImage: (state, action: PayloadAction<File>) => {
      state.registerForm.images.push(action.payload);
    },
    removeProductImage: (state, action: PayloadAction<number>) => {
      state.registerForm.images.splice(action.payload, 1);
    },
    resetProductForm: (state) => {
      state.registerForm = initialState.registerForm;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
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
  setLoading,
  setError
} = productSlice.actions;
export default productSlice.reducer;
