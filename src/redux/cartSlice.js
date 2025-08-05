// src/redux/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Keyed by userId
const loadCartState = (userId) => {
  try {
    // userId null হলে খালি কার্ট স্টেট রিটার্ন করবে
    if (!userId) return { items: [], selectedIds: [] };
    const data = localStorage.getItem(`cartState_${userId}`);
    return data ? JSON.parse(data) : { items: [], selectedIds: [] };
  } catch {
    return { items: [], selectedIds: [] };
  }
};

const saveCartState = (userId, state) => {
  try {
    // userId না থাকলে সেভ করা হবে না
    if (userId) {
      localStorage.setItem(`cartState_${userId}`, JSON.stringify(state));
    }
  } catch {}
};

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], selectedIds: [], userId: null },
  reducers: {
    initCartFromLocalStorage: (state, action) => {
      const userId = action.payload;
      const persisted = loadCartState(userId);
      state.items = persisted.items || [];
      state.selectedIds = persisted.selectedIds || [];
      state.userId = userId;
      console.log("Restoring cart for user:", userId, loadCartState(userId));
    },

    addToCart: (state, action) => {
      const { _id, restaurantId } = action.payload; // ✅ userId পেলোড থেকে সরানো হয়েছে
      const existing = state.items.find((i) => i._id === _id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          ...action.payload,
          quantity: 1,
          restaurantId: restaurantId || null,
        });
      }

      // ✅ state.userId ব্যবহার করে ডেটা সেভ করা হয়েছে
      saveCartState(state.userId, state);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      state.selectedIds = state.selectedIds.filter(
        (id) => id !== action.payload
      );
      // ✅ state.userId ব্যবহার করে ডেটা সেভ করা হয়েছে
      saveCartState(state.userId, state);
    },

    updateQuantity: (state, action) => {
      const item = state.items.find((i) => i._id === action.payload.id);
      if (item) item.quantity = action.payload.quantity;
      // ✅ state.userId ব্যবহার করে ডেটা সেভ করা হয়েছে
      saveCartState(state.userId, state);
    },

    toggleSelectItem: (state, action) => {
      const id = action.payload;
      if (state.selectedIds.includes(id)) {
        state.selectedIds = state.selectedIds.filter((i) => i !== id);
      } else {
        state.selectedIds.push(id);
      }
      // ✅ state.userId ব্যবহার করে ডেটা সেভ করা হয়েছে
      saveCartState(state.userId, state);
    },

    selectAll: (state, action) => {
      state.selectedIds = action.payload;
      // ✅ state.userId ব্যবহার করে ডেটা সেভ করা হয়েছে
      saveCartState(state.userId, state);
    },

    clearSelected: (state) => {
      state.selectedIds = [];
      // ✅ state.userId ব্যবহার করে ডেটা সেভ করা হয়েছে
      saveCartState(state.userId, state);
    },

    clearCart: (state) => {
      state.items = [];
      state.selectedIds = [];
      // ✅ state.userId ব্যবহার করে ডেটা সেভ করা হয়েছে
      saveCartState(state.userId, state);
    },

    logoutCart: (state) => {
      state.items = [];
      state.selectedIds = [];
      state.userId = null;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  toggleSelectItem,
  selectAll,
  clearSelected,
  clearCart,
  logoutCart,
  initCartFromLocalStorage,
} = cartSlice.actions;

export default cartSlice.reducer;
