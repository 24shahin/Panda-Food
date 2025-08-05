import { createSlice } from "@reduxjs/toolkit";

const loadOrderState = (userId) => {
  try {
    const orders = localStorage.getItem(`orders_${userId}`);
    const address = localStorage.getItem(`deliveryAddress_${userId}`);
    return {
      list: orders ? JSON.parse(orders) : [],
      deliveryAddress: address ? JSON.parse(address) : null,
      userId,
    };
  } catch {
    return { list: [], deliveryAddress: null, userId };
  }
};

const saveOrderState = (userId, list) => {
  try {
    localStorage.setItem(`orders_${userId}`, JSON.stringify(list));
  } catch {}
};

const saveAddress = (userId, address) => {
  try {
    localStorage.setItem(`deliveryAddress_${userId}`, JSON.stringify(address));
  } catch {}
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

    logoutOrders: (state) => {
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
