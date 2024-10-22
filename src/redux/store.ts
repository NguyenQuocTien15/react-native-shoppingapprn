import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./reducers/authReducer";
import { cartReducer } from "./reducers/cartReducer";
import { orderReducer } from "./reducers/orderReducer";

const store = configureStore({
  reducer: {
    authReducer,
    cartReducer
  }
});


export default store;