import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "https://your-api.com/api" }),
  endpoints: (builder) => ({
    getRestaurants: builder.query({
      query: () => "/restaurants",
    }),
    placeOrder: builder.mutation({
      query: (orderData) => ({
        url: "/orders",
        method: "POST",
        body: orderData,
      }),
    }),
  }),
});

export const { useGetRestaurantsQuery, usePlaceOrderMutation } = apiSlice;
