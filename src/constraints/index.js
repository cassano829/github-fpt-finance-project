export const ORDER_MASTER = 6;
export const ORDER_EXTRA = 5;
export const ORDER_DETAIL = 7;
export const ORDER_SINGLE = 0;
export const ORDER_COMBO = 1;
export const ORDER_COMPLEX = 10;

export const ORDER_TYPE_DATA = [
  {
    value: ORDER_MASTER,
    typeCode: 'master',
    label: 'Dòng sản phẩm'
  },
  {
    value: ORDER_COMPLEX,
    typeCode: 'complex',
    label: 'SP Kết hợp'
  },
  {
    value: ORDER_COMBO,
    typeCode: 'combo',
    label: 'SP Combo'
  },
  {
    value: `${ORDER_SINGLE}`,
    typeCode: 'single',
    label: 'SP Đơn'
  },
  {
    value: ORDER_DETAIL,
    typeCode: 'child',
    label: 'SP Con'
  },
  {
    value: ORDER_EXTRA,
    typeCode: 'extra',
    label: 'SP Extra'
  }
];

export const ORDER_SERVICE = [
  {
    label: 'Standard',
    value: 1
  },
  {
    label: 'Plus',
    value: 2
  },
  {
    label: 'Advance',
    value: 3
  },
  {
    label: 'Premium',
    value: 4
  }
];
export const ORDER_PAYMENT = [
  {
    label: 'Chuyển khoản',
    value: 1
  },
  {
    label: 'VISA DEBIT',
    value: 2
  },
  {
    label: 'Tiền mặt',
    value: 3
  },
  {
    label: 'Internet Banking',
    value: 4
  }
];
