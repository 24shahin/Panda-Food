// src/redux/ordersSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Helper functions to load and save user-specific order data to localStorage
const loadOrderState = (userId) => {
  try {
    // যদি userId না থাকে, তাহলে একটি খালি স্টেট রিটার্ন করবে
    if (!userId) {
      return { list: [], deliveryAddress: null, userId: null };
    }

    // userId-ভিত্তিক localStorage key ব্যবহার করা হচ্ছে
    const orders = localStorage.getItem(`orders_${userId}`);
    const address = localStorage.getItem(`deliveryAddress_${userId}`);

    return {
      list: orders ? JSON.parse(orders) : [],
      deliveryAddress: address ? JSON.parse(address) : null,
      userId,
    };
  } catch (err) {
    console.error("Could not load orders state from localStorage", err);
    return { list: [], deliveryAddress: null, userId };
  }
};

const saveOrderState = (userId, list) => {
  try {
    // userId থাকলে ডেটা সেভ করা হবে
    if (userId) {
      localStorage.setItem(`orders_${userId}`, JSON.stringify(list));
    }
  } catch (err) {
    console.error("Could not save orders list to localStorage", err);
  }
};

const saveAddress = (userId, address) => {
  try {
    // userId থাকলে ডেটা সেভ করা হবে
    if (userId) {
      localStorage.setItem(
        `deliveryAddress_${userId}`,
        JSON.stringify(address)
      );
    }
  } catch (err) {
    console.error("Could not save address to localStorage", err);
  }
};

const ordersSlice = createSlice({
  name: "orders",
  initialState: { list: [], deliveryAddress: null, userId: null },
  reducers: {
    initOrdersFromLocalStorage: (state, action) => {
      const userId = action.payload;
      const loaded = loadOrderState(userId);
      state.list = loaded.list;
      state.deliveryAddress = loaded.deliveryAddress;
      state.userId = userId;
    },

    addOrder: (state, action) => {
      const newOrder = {
        ...action.payload,
        address: action.payload.address || null,
      };
      state.list.push(newOrder);
      saveOrderState(state.userId, state.list);
    },

    clearOrders: (state) => {
      state.list = [];
      saveOrderState(state.userId, []);
    },

    updateOrderStatus: (state, action) => {
      const { orderId, newStatus } = action.payload;
      const order = state.list.find((o) => o.id === orderId);
      if (order) {
        order.status = newStatus;
        saveOrderState(state.userId, state.list);
      }
    },

    setDeliveryAddress: (state, action) => {
      state.deliveryAddress = action.payload;
      saveAddress(state.userId, action.payload);
    },

    // ✅ logoutOrders reducer আপডেট করা হয়েছে যাতে এটি localStorage থেকেও ডেটা মুছে ফেলে
    logoutOrders: (state) => {
      // localStorage থেকে ইউজারের নির্দিষ্ট ডেটা মুছে ফেলা হবে
      // if (state.userId) {
      //   localStorage.removeItem(`orders_${state.userId}`);
      //   localStorage.removeItem(`deliveryAddress_${state.userId}`);
      // }

      // Redux state খালি করা হবে
      state.list = [];
      state.deliveryAddress = null;
      state.userId = null;
    },
  },
});

export const {
  addOrder,
  clearOrders,
  updateOrderStatus,
  setDeliveryAddress,
  logoutOrders,
  initOrdersFromLocalStorage,
} = ordersSlice.actions;

export default ordersSlice.reducer;
