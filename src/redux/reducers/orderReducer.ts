import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice} from '@reduxjs/toolkit';

const handleSyncCardData = async (data: any[]) => {
  await AsyncStorage.setItem('order', JSON.stringify(data));
};

export interface OrderItem {
  color: string;
  description: string;
  id: string;
  imageUrl: string;
  price: number;
  quantity: number;
  size: string;
  title: string;
}

const initialState: OrderItem[] = [];

const orderSlicer = createSlice({
  name: 'order',
  initialState: {
    orderData: initialState,
  },
  reducers: {
    addOrder: (state, action) => {
      const items: any = state.orderData;
      const item = action.payload;
      const index = items.findIndex((element: any) => element.id === item.id);

      if (index !== -1) {
        items[index].quantity = item.quantity;
      } else {
        items.push(item);
      }

      state.orderData = items;
      handleSyncCardData(items);
    },
    // Hàm xóa một sản phẩm khỏi giỏ hàng
    removeOrderItem: (state, action) => {
      const itemId = action.payload; // ID của sản phẩm cần xóa
      state.orderData = state.orderData.filter((item: any) => item.id !== itemId);

      // Sau khi xóa, bạn cần đồng bộ dữ liệu giỏ hàng
      handleSyncCardData(state.orderData);
    },
    syncLocalStorage: (state, action) => {
      state.orderData = action.payload;
    },
  },
});

export const orderReducer = orderSlicer.reducer;
export const {
  addOrder,
  syncLocalStorage,
  removeOrderItem,
} = orderSlicer.actions;
export const orderSelector = (state: any) => state.orderReducer.orderData;
