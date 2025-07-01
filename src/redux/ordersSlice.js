import { createSlice } from "@reduxjs/toolkit";

const loadOrders = () => {
  try {
    const savedOrders = localStorage.getItem("orders");
    const savedAddress = localStorage.getItem("deliveryAddress");
    return {
      list: savedOrders ? JSON.parse(savedOrders) : [],
      deliveryAddress: savedAddress ? JSON.parse(savedAddress) : null,
    };
  } catch {
    return { list: [], deliveryAddress: null };
  }
};

const saveOrders = (orders) => {
  try {
    localStorage.setItem("orders", JSON.stringify(orders));
  } catch {}
};

const ordersSlice = createSlice({
  name: "orders",
  initialState: loadOrders(),
  reducers: {
    addOrder: (state, action) => {
      const newOrder = {
        ...action.payload,
        address: action.payload.address || null,
      };
      state.list.push(newOrder);
      saveOrders(state.list);
    },
    clearOrders: (state) => {
      state.list = [];
      saveOrders([]);
    },
    updateOrderStatus: (state, action) => {
      const { orderId, newStatus } = action.payload;
      const order = state.list.find((o) => o.id === orderId);
      if (order) {
        order.status = newStatus;
        saveOrders(state.list);
      }
    },
    setDeliveryAddress: (state, action) => {
      state.deliveryAddress = action.payload;
      try {
        localStorage.setItem("deliveryAddress", JSON.stringify(action.payload));
      } catch {}
    },
  },
});

export const { addOrder, clearOrders, updateOrderStatus, setDeliveryAddress } =
  ordersSlice.actions;

export default ordersSlice.reducer;
