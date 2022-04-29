import { TBrand } from 'types/brand';
import { TOrder } from 'types/order';
import request from 'utils/axios';
import { generateAPIWithPaging } from './utils';
const getInfor = () => request.get<TBrand>(`brands/info`);
const updateInfor = (data: TBrand) => request.put<TBrand>(`brands/info`, data);

const configApi = {
  getInfor,
  updateInfor,
  ...generateAPIWithPaging<TOrder>('admin/orders')
};

export default configApi;
