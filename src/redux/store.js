import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import ordersReducer from "./ordersSlice";
import { apiSlice } from "./apiSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    orders: ordersReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
