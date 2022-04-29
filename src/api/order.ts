import { OrderCreate } from 'pages/Orders/type';
import { TOrder, TOrderDetail, TOrderDetailMedia } from 'types/order';
import { TProductBase } from 'types/product';
import { BaseReponse } from 'types/response';
import request from 'utils/axios';
import { generateAPIWithPaging } from './utils';

const getOrderDetail = (orderId: number) => request.get<TOrderDetail>(`admin/orders/${orderId}`);
const createOrder = (data: any) => request.post<OrderCreate>(`/orders`, data);
const getPorduct = () => request.get<BaseReponse<TProductBase>>(`/products`);
const updateOrderMedia = ({
  data,
  orderId,
  mediaId
}: {
  data: TOrderDetailMedia;
  orderId: number;
  mediaId: number;
}) => request.put<TOrderDetailMedia>(`/orders/${orderId}/medias/${mediaId}`, data);
const deleteOrderMedia = ({ orderId, mediaId }: { orderId: number; mediaId: any }) =>
  request.delete<number>(`/orders/${orderId}/medias`, { data: [mediaId] });

const getOrderMediasOfOrder = (orderId: number) =>
  request.get<TOrderDetailMedia[]>(`/orders/${orderId}/medias`);

const shareAlbum = (albumId: string, data: any) =>
  request.put<any>(`admin/albums/${albumId}/share`, data);

const createMedia = (orderId: number, data: any) => request.post(`/orders/${orderId}/medias`, data);

const updateOrderDetail = (orderId: number, orderDetailId: number, data: any) =>
  request.put(`/admin/orders/${orderId}/order-details/${orderDetailId}`, data);

const orderApi = {
  getPorduct,
  getOrderDetail,
  createOrder,
  updateOrderMedia,
  deleteOrderMedia,
  getOrderMediasOfOrder,
  createMedia,
  updateOrderDetail,
  shareAlbum,
  ...generateAPIWithPaging<TOrder>('admin/orders')
};

export default orderApi;
