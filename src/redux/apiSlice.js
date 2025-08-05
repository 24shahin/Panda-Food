import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const apiSlice = createApi({
  reducerPath: "api", // key in the Redux state
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL2,
    prepareHeaders: (headers) => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.token) {
        headers.set("Authorization", `Bearer ${user.token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "api/users/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userInfo) => ({
        url: "api/users/register",
        method: "POST",
        body: userInfo,
      }),
    }),

    uploadImages: builder.mutation({
      query: ({ formData }) => ({
        url: "/api/upload/images",
        method: "POST",
        body: formData,
      }),
    }),
    deleteImagesFolder: builder.mutation({
      query: ({ path }) => ({
        url: "/api/upload/imagesdelete",
        method: "POST",
        body: { path },
      }),
    }),
    registerRestaurant: builder.mutation({
      query: ({ name, location, contactNumber, email, images }) => ({
        url: "/api/restaurants/registerrestaurant",
        method: "POST",
        body: { name, location, contactNumber, email, images },
      }),
    }),
    myRestaurant: builder.query({
      query: (userId) => `/api/restaurants/my/${userId}`,
    }),
    selectedRestaurant: builder.query({
      query: (id) => `/api/restaurants/selectedrestaurant/${id}`,
    }),
    getAllRestaurant: builder.query({
      query: () => `/api/restaurants/allrestaurant`,
    }),
    addMenuItem: builder.mutation({
      query: ({ name, description, price, image, category, available }) => ({
        url: "/api/menu-items/",
        method: "POST",
        body: { name, description, price, image, category, available },
      }),
    }),
    editMenuItem: builder.mutation({
      query: ({ id, data, addedImage, path }) => ({
        url: `/api/menu-items/menuoption/${id}`,
        method: "PUT",
        body: { data, addedImage, path },
      }),
    }),
    deleteMenuItem: builder.mutation({
      query: ({ id }) => ({
        url: `/api/menu-items/menudelete/${id}`,
        method: "DELETE",
      }),
    }),
    userdeliveryaddress: builder.mutation({
      query: ({ data }) => ({
        url: `/api/address/send`,
        method: "POST",
        body: { data },
      }),
    }),
    getuserdeliveryaddress: builder.query({
      query: () => `/api/address/send`,
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useUploadImagesMutation,
  useRegisterRestaurantMutation,
  useMyRestaurantQuery,
  useGetAllRestaurantQuery,
  useAddMenuItemMutation,
  useSelectedRestaurantQuery,
  useEditMenuItemMutation,
  useDeleteImagesFolderMutation,
  useDeleteMenuItemMutation,
  useUserdeliveryaddressMutation,
  useGetuserdeliveryaddressQuery,
} = apiSlice;
