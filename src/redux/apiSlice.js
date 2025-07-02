// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// // Replace with your actual backend URL
// const BASE_URL = "https://your-backend.com/api/auth";

// export const authApi = createApi({
//   reducerPath: "authApi",
//   baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
//   endpoints: (builder) => ({
//     login: builder.mutation({
//       query: (credentials) => ({
//         url: "/login",
//         method: "POST",
//         body: credentials,
//       }),
//     }),
//     register: builder.mutation({
//       query: (userInfo) => ({
//         url: "/register",
//         method: "POST",
//         body: userInfo,
//       }),
//     }),
//   }),
// });

// export const { useLoginMutation, useRegisterMutation } = authApi;

// src/redux/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Set your backend API base URL here
const BASE_URL = "https://your-backend.com/api";

export const apiSlice = createApi({
  reducerPath: "api", // key in the Redux state
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userInfo) => ({
        url: "/register",
        method: "POST",
        body: userInfo,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = apiSlice;
