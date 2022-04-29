import { TProductMaster } from 'types/product';
import * as yup from 'yup';
export type OrderPayment = {
  amount: number;
  type: number;
};
export type Customer = {
  phone: string;
  phone_receiver: string;
  name: string;
  email: string;
  address: string;
};

export type OrderDetail = {
  product_id: number;
  quantity: number;
  parent_id?: number;
  discount?: number;
};

export type Share = {
  is_collaborative: Boolean;
  is_commentable: Boolean;
};
export type OrderCreate = {
  order_details: OrderDetail[];
  customer: Customer;
  notes: string;
  order_type: number;
  return_url: string;
  discount: number;
  discount_order_detail: number;
  payments: OrderPayment[];
};
export const PAYMENT_TYPE_OPTIONS = [
  {
    label: 'Tiền mặt',
    value: 1
  },
  {
    label: 'Thanh Toán Online',
    value: 3
  }
];

export type UpdateProductForm = TProductMaster & {
  variants: {
    optName: string;
    values: string[];
  }[];
  hasVariant?: boolean;
};

export const DEFAULT_VALUES: OrderCreate = {
  order_details: [{ quantity: 1, product_id: 0 }],
  notes: '',
  payments: [{ amount: 0, type: 0 }],
  customer: {
    phone: '',
    phone_receiver: '',
    name: '',
    email: '',
    address: ''
  },
  order_type: 0,
  return_url: '',
  discount: 0,
  discount_order_detail: 0
};

export const validationSchema = yup.object({
  order_details: yup.array().of(
    yup.object().shape({
      product_id: yup.string().required('Vui lòng chọn gói dịch vụ'),
      quantity: yup
        .number()
        .typeError('Vui lòng nhập số lượng sản phẩm')
        .required('Vui lòng nhập số lượng sản phẩm')
    })
  ),
  payments: yup.array().of(
    yup.object().shape({
      amount: yup
        .number()
        .typeError('Vui lòng nhập tổng giá tiền')
        .required('Vui lòng nhập tổng giá tiền'),
      type: yup.string().required('Vui lòng nhập phương thức thanh toán')
    })
  ),
  customer: yup.object({
    phone: yup.string().required('Vui lòng nhập số điện thoại khách hàng'),
    name: yup.string().required('Vui lòng nhập tên khách hàng'),
    email: yup.string().required('Vui lòng nhập email khách hàng')
  })
});

export const validationSchemaMedia = yup.object({
  images: yup.array().of(
    yup.object().shape({
      title: yup.string().required('Vui lòng chọn tiêu đề của bức ảnh')
      // tags: yup.array().nullable().required('Vui lòng nhập tag')
    })
  )
});
