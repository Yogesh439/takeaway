import { createSlice } from '@reduxjs/toolkit';

export const distancePrice = createSlice({
  name: 'distancePrice',
  initialState: {
    distance: null,
    price: null
  },
  reducers: {
    setDistance: (state, action) => {
      state.distance = action.payload;
    },
    setPrice: (state, action) => {
      state.price = action.payload;
    }
  }
});

export const { setDistance, setPrice } = distancePrice.actions;
export default distancePrice.reducer;
