import { Double } from "react-native/Libraries/Types/CodegenTypes";

export interface OrderModel {
  orderId: string;
  userId: string;
  shipperId: string;
  totalAmount: Double;
  paymentMethodId: string;
  orderStatusId: string;
}
export interface OrderStatus {
  orderStatusId: string;
  orderStatusName: string;
}