import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CategoryState } from '../../types/category';

const initialState: CategoryState = {
  categories: [],
  hobbies: [],
  loading: false,
  error: null,
  selectedCategoryId: null
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<CategoryState['categories']>) => {
      state.categories = action.payload;
    },
    setHobbies: (state, action: PayloadAction<CategoryState['hobbies']>) => {
      state.hobbies = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<number | null>) => {
      state.selectedCategoryId = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const {
  setCategories,
  setHobbies,
  setSelectedCategory,
  setLoading,
  setError
} = categorySlice.actions;

export default categorySlice.reducer;
