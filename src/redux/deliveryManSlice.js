import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
const API_BASE = import.meta.env.VITE_BACKEND_URL2;
// ✅ Login async thunk
export const loginDeliveryMan = createAsyncThunk(
  "deliveryMan/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}api/deliveryman/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : null;

      if (!res.ok) {
        return rejectWithValue(data?.message || "Login failed");
      }

      // ✅ store flattened object
      localStorage.setItem("deliveryManInfo", JSON.stringify(data));
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Login failed");
    }
  }
);

// ✅ Load from localStorage
const getInitialState = () => {
  try {
    const stored = localStorage.getItem("deliverymanAuth");
    return stored ? JSON.parse(stored) : { deliveryman: null };
  } catch {
    return { deliveryman: null };
  }
};

const deliverymanSlice = createSlice({
  name: "deliveryman",
  initialState: {
    deliveryman: getInitialState().deliveryman,
    isLoading: false,
    error: null,
  },
  reducers: {
    logoutDeliveryManAuth: (state) => {
      if (state.deliveryman?._id) {
        // ✅ Clear specific deliveryman storage
        localStorage.removeItem(`deliveryman_${state.deliveryman._id}`);
      }
      localStorage.removeItem("deliverymanAuth");
      state.deliveryman = null;
      toast.success("Logged out successfully");
    },
    initDeliveryManFromLocalStorage: (state) => {
      const stored = localStorage.getItem("deliverymanAuth");
      if (stored) {
        state.deliveryman = JSON.parse(stored).deliveryman;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginDeliveryMan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginDeliveryMan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deliveryman = action.payload;

        // ✅ Store globally
        localStorage.setItem(
          "deliverymanAuth",
          JSON.stringify({ deliveryman: action.payload })
        );

        // ✅ Store separately per deliveryman
        localStorage.setItem(
          `deliveryman_${action.payload._id}`,
          JSON.stringify(action.payload)
        );

        toast.success("Login successful!");
      })
      .addCase(loginDeliveryMan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload || "Login failed");
      });
  },
});

export const { logoutDeliveryManAuth, initDeliveryManFromLocalStorage } =
  deliverymanSlice.actions;

export default deliverymanSlice.reducer;
