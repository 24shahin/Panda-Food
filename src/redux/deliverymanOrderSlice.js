import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  deliveryManInfo: null,
  loading: false,
  error: null,
};

const deliveryManSlice = createSlice({
  name: "deliveryManAuth",
  initialState,
  reducers: {
    setDeliveryManLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setDeliveryManSuccess: (state, action) => {
      state.loading = false;
      state.deliveryManInfo = action.payload;
    },
    setDeliveryManError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logoutDeliveryMan: (state) => {
      if (state.deliveryManInfo) {
        localStorage.removeItem(`deliveryManInfo_${state.deliveryManInfo._id}`);
      }
      state.deliveryManInfo = null;
    },
    initDeliveryMan: (state, action) => {
      state.deliveryManInfo = action.payload || null;
    },
  },
});

export const {
  setDeliveryManLoading,
  setDeliveryManSuccess,
  setDeliveryManError,
  logoutDeliveryMan,
  initDeliveryMan,
} = deliveryManSlice.actions;

export default deliveryManSlice.reducer;
