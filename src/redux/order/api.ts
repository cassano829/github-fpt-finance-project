import { OrderCreate } from 'pages/Orders/type';
import { TOrderDetail } from 'types/order';
import request from 'utils/axios';

export const getOrderDetail = (orderId: number) => request.get<TOrderDetail>(`/orders/${orderId}`);
export const createOrder = (data: any) => request.post<OrderCreate>(`/orders`, data);
