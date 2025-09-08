import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';
import { CartType } from '../../types/cart';

type CartState = { cart: CartType[] };

const initialState: CartState = {
  cart: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      state.cart.push(action.payload);
    },
    deleteItem(state, action) {
      state.cart = state.cart.filter((item) => item.pizzaId !== action.payload);
    },
    increaseItemQuantity(state, action) {
      const item = state.cart.find((item) => item.pizzaId === action.payload)!;
      item.quantity++;
      item.totalPrice = item.unitPrice * item.quantity;
    },
    decreaseItemQuantity(state, action) {
      const item = state.cart.find((item) => item.pizzaId === action.payload)!;

      item.quantity--;
      item.totalPrice = item.unitPrice * item.quantity;

      if (item.quantity === 0) cartSlice.caseReducers.deleteItem(state, action);
    },
    clearCart(state) {
      state.cart = [];
    },
  },
});

export const {
  addItem,
  deleteItem,
  increaseItemQuantity,
  decreaseItemQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

export const getCart = (state: RootState) => state.cartStore.cart;

export const getTotalCartQuantity = (state: RootState) =>
  state.cartStore.cart.reduce((sum, item) => sum + item.quantity, 0);

export const getTotalCartPrice = (state: RootState) =>
  state.cartStore.cart.reduce((sum, item) => sum + item.totalPrice, 0);

export const getCurrentQuantityById = (id: number) => (state: RootState) =>
  state.cartStore.cart.find((item) => item.pizzaId === id)?.quantity ?? 0;
