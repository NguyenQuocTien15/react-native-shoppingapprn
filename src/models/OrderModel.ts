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
  orderStatusId: number;
  orderStatusName: string
}