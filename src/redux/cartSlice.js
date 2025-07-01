import { createSlice } from "@reduxjs/toolkit";

// Helper functions for localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("cartState");
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("cartState", serializedState);
  } catch {
    // Ignore write errors
  }
};

const persistedState = loadState();

const cartSlice = createSlice({
  name: "cart",
  initialState: persistedState || {
    items: [],
    selectedIds: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const { _id, restaurantId } = action.payload;
      const existing = state.items.find((i) => i._id === _id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          ...action.payload,
          quantity: 1,
          restaurantId: restaurantId || null, // default fallback if missing
        });
      }

      saveState(state);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      state.selectedIds = state.selectedIds.filter(
        (id) => id !== action.payload
      );
      saveState(state);
    },

    updateQuantity: (state, action) => {
      const item = state.items.find((i) => i._id === action.payload.id);
      if (item) item.quantity = action.payload.quantity;
      saveState(state);
    },

    toggleSelectItem: (state, action) => {
      const id = action.payload;
      if (state.selectedIds.includes(id)) {
        state.selectedIds = state.selectedIds.filter((i) => i !== id);
      } else {
        state.selectedIds.push(id);
      }
      saveState(state);
    },

    selectAll: (state, action) => {
      state.selectedIds = action.payload;
      saveState(state);
    },

    clearSelected: (state) => {
      state.selectedIds = [];
      saveState(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.selectedIds = [];
      saveState(state);
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
} = cartSlice.actions;

export default cartSlice.reducer;
