import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const apiSlice = createApi({
  reducerPath: "api", // key in the Redux state
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL2,
    prepareHeaders: (headers) => {
      const user = JSON.parse(localStorage.getItem("user"));
      const Deliveryman = JSON.parse(localStorage.getItem("deliverymanAuth"));

      if (user && user.token) {
        headers.set("Authorization", `Bearer ${user.token}`);
      } else if (Deliveryman && Deliveryman?.deliveryman?.token) {
        headers.set(
          "Authorization",
          `Bearer ${Deliveryman?.deliveryman?.token}`
        );
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
    DeliveryManRegister: builder.mutation({
      query: ({
        name,
        email,
        password,
        phone,
        image,
        vehicleNumber,
        drivingLicence,
      }) => ({
        url: "api/deliveryman/register",
        method: "POST",
        body: {
          name,
          email,
          password,
          phone,
          image,
          vehicleNumber,
          drivingLicence,
        },
      }),
    }),

    editDeliveryManRegister: builder.mutation({
      query: ({ id, data, addedImage, path }) => ({
        url: `/api/deliveryman/edit/${id}`,
        method: "PUT",
        body: { data, addedImage, path },
      }),
    }),

    uploadImages: builder.mutation({
      query: ({ formData }) => ({
        url: "/api/upload/images",
        method: "POST",
        body: formData,
      }),
    }),
    deliveryManRegisterimages: builder.mutation({
      query: ({ formData }) => ({
        url: "/api/upload/deliveryManRegisterimages",
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
      query: () => `/api/address/get`,
    }),
    userOrder: builder.mutation({
      query: ({
        items,
        restaurant,
        deliveryFee,
        subtotal,
        total,
        address,
      }) => ({
        url: `/api/orders`,
        method: "POST",
        body: { items, restaurant, deliveryFee, subtotal, total, address },
      }),
    }),
    getUserOrders: builder.query({
      query: () => `/api/orders/get`,
    }),
    getSelectedOrders: builder.query({
      query: ({ id }) => `/api/orders/get/${id}`,
    }),

    OrderStatus: builder.mutation({
      query: ({ orderId, newStatus }) => ({
        url: `/api/orders/status`,
        method: "PUT",
        body: { orderId, newStatus },
      }),
    }),
    restaurantOverView: builder.query({
      query: (purpuse) => `/api/restaurantowner/dashboard/${purpuse}`,
    }),
    deleteOrderItem: builder.mutation({
      query: ({ id }) => ({
        url: `/api/restaurantowner/dashboard/orders/${id}`,
        method: "DELETE",
      }),
    }),

    getDeliveryManOrders: builder.query({
      query: (deliveryManId) =>
        `/api/deliveryman/orders/deliveryman/${deliveryManId}`,
    }),
    getAvailableOrders: builder.query({
      query: () => `/api/deliveryman/orders/available`,
    }),

    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `/api/deliveryman/orders/status/${orderId}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Orders"],
    }),
    pickedOrders: builder.mutation({
      query: ({ orderId }) => ({
        url: `/api/deliveryman/orders/pick/${orderId}`,
        method: "POST",
      }),
      invalidatesTags: ["Orders"],
    }),
    searchQuery: builder.mutation({
      query: (searchTerm) => ({
        url: `/api/search/searchresult/${searchTerm}`,
        method: "POST",
      }),
    }),
    addSearchHistory: builder.mutation({
      query: ({ searchUser }) => ({
        url: "/api/search/addsearchhistory",
        method: "PUT",
        body: { searchUser },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useDeliveryManRegisterMutation,
  useEditDeliveryManRegisterMutation,
  useDeliveryManRegisterimagesMutation,
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
  useUserOrderMutation,
  useGetUserOrdersQuery,
  useGetSelectedOrdersQuery,
  useOrderStatusMutation,
  useRestaurantOverViewQuery,
  useDeleteOrderItemMutation,
  useGetDeliveryManOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetAvailableOrdersQuery,
  usePickedOrdersMutation,
  useSearchQueryMutation,
  useAddSearchHistoryMutation,
} = apiSlice;
