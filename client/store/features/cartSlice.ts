import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, IProduct } from "@/types";

interface CartState {
  items: CartItem[];
}

const loadCartFromStorage = (): CartItem[] => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  }
  return [];
};

const initialState: CartState = {
  items: loadCartFromStorage(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<IProduct>) => {
      const existingItem = state.items.find(
        (item) => item._id === action.payload._id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find((item) => item._id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        localStorage.setItem("cart", JSON.stringify(state.items));
      }
    },
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find((item) => item._id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        localStorage.setItem("cart", JSON.stringify(state.items));
      }
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  updateCartItemQuantity,
} = cartSlice.actions;
export default cartSlice.reducer;
