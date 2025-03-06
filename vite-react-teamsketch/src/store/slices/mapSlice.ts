import { createSlice } from '@reduxjs/toolkit';
import { ILocationState } from '../../types/map';

const initialState: ILocationState = {
  myLocation: { id: '', name: '', address: '', lat: 0, lng: 0 },
  yourLocation: { id: '', name: '', address: '', lat: 0, lng: 0 },
  endLocation: { id: '', name: '', address: '', lat: 0, lng: 0 }
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setMyLocation: (state, action) => {
      state.myLocation = action.payload;
    },
    setYourLocation: (state, action) => {
      state.yourLocation = action.payload;
    },
    setEndLocation: (state, action) => {
      state.endLocation = action.payload;
    },

    clearLocations: (state) => {
      state.myLocation = initialState.myLocation;
      state.yourLocation = initialState.yourLocation;
      state.endLocation = initialState.endLocation;
    }
  }
});

export const { setMyLocation, setYourLocation, setEndLocation, clearLocations } = mapSlice.actions;
export default mapSlice.reducer;
