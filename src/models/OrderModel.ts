export interface OrderModel {
    orderId : string;
    userId: number;
    shipperId: number;
    totalAmount : number;
    shippingAddress: string;
    paymentMethodId: number;
    orderStatusId: number;
}
export interface OrderStatus {
  orderStatusId: string;
  orderStatusName: string;
}
export interface PaymentMethodModel {
  PaymentMethodId: string;
  PaymentMethodName: string;
}