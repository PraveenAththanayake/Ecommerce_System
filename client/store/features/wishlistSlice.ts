import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProduct } from "@/types";

interface WishlistState {
  items: IProduct[];
}

const loadWishlistFromStorage = (): IProduct[] => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  }
  return [];
};

const initialState: WishlistState = {
  items: loadWishlistFromStorage(),
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<IProduct>) => {
      const exists = state.items.some(
        (item) => item._id === action.payload._id
      );
      if (!exists) {
        state.items.push(action.payload);
        localStorage.setItem("wishlist", JSON.stringify(state.items));
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      localStorage.setItem("wishlist", JSON.stringify(state.items));
    },
    clearWishlist: (state) => {
      state.items = [];
      localStorage.setItem("wishlist", JSON.stringify(state.items));
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;
