export const SET_ORDER = 'SET_ORDER'

export const setOrder = (order: { items: any; totalPrice: number; address: string; paymentMethod: string }) => ({
  type: SET_ORDER,
  payload: order,
})
