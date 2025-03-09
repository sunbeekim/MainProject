import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  productData: {
    title: '',
    description: '',
    price: 0,
    image: '',
    location: '',
    address: '',
    transactionType: '',
    registrationType: '',
    latitude: 0,
    longitude: 0,
    participants: 0,
    status: '',
    createdAt: '',
    updatedAt: '',
    userId: '',
    productId: '',
    images: [],
    interest: '',
  }
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProductData: (state, action) => {
      state.productData = action.payload;
    },
  },
});

export const { setProductData } = productSlice.actions;
export default productSlice.reducer;
