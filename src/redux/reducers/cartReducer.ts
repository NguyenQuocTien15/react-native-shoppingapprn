import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice} from '@reduxjs/toolkit';

const handleSyncCardData = async (data: any[]) => {
  await AsyncStorage.setItem('cart', JSON.stringify(data));
};

export interface CartItem {
  color: string;
  description: string;
  id: string;
  imageUrl: string;
  price: number;
  quantity: number;
  size: string;
  title: string;
}

const initialState: CartItem[] = [];

const cartSlicer = createSlice({
  name: 'cart',
  initialState: {
    cartData: initialState,
  },
  reducers: {
    addCart: (state, action) => {
      const items: any = state.cartData;
      const item = action.payload;
      const index = items.findIndex((element: any) => element.id === item.id);

      if (index !== -1) {
        items[index].quantity = item.quantity;
      } else {
        items.push(item);
      }

      state.cartData = items;
      handleSyncCardData(items);
    },
    removeCart: (state, action) => {
      state.cartData = [];
    },
    // Hàm xóa một sản phẩm khỏi giỏ hàng
    removeCartItem: (state, action) => {
      const itemId = action.payload; // ID của sản phẩm cần xóa
      state.cartData = state.cartData.filter((item: any) => item.id !== itemId);

      // Sau khi xóa, bạn cần đồng bộ dữ liệu giỏ hàng
      handleSyncCardData(state.cartData);
    },
    updateQuantity: (state, action) => {
      const items = [...state.cartData];
      const data = action.payload;
      const item = items.find(element => element.id === data.id);
      const index = items.findIndex(element => element.id === data.id);
      if (item && index !== -1) {
        const quantity = item.quantity + data.quantity;
        if (quantity === 0) {
          items.splice(index);
        } else {
          item.quantity = quantity;
        }
      }
      state.cartData = items;
    },
    syncLocalStorage: (state, action) => {
      state.cartData = action.payload;
    },
  },
});

export const cartReducer = cartSlicer.reducer;
export const {addCart, removeCart, syncLocalStorage, updateQuantity, removeCartItem} =
  cartSlicer.actions;
export const cartSelector = (state: any) => state.cartReducer.cartData;
