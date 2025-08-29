import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import ordersReducer from "./ordersSlice";
import authReducer from "./authSlice";
import deliveryMan from "./deliveryManSlice";
import { apiSlice } from "./apiSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    orders: ordersReducer,
    auth: authReducer,
    deliveryManAuth: deliveryMan,
    [apiSlice.reducerPath]: apiSlice.reducer, // RTK Query reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
