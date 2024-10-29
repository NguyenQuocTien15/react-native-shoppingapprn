// Định nghĩa trạng thái ban đầu cho đơn hàng
const initialState = {
  orders: [],
};

// Định nghĩa reducer cho đơn hàng
export const orderReducer = (state = initialState, action: { type: any; payload: any; }) => {
  switch (action.type) {
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: [...state.orders, action.payload],
      };
    default:
      return state;
  }
};
