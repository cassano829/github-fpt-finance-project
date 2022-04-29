import QrCodeIcon from '@mui/icons-material/QrCode';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Snackbar,
  SnackbarOrigin,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import orderApi from 'api/order';
import EmptyContent from 'components/EmptyContent';
import ResoDescriptions, { ResoDescriptionColumnType } from 'components/ResoDescriptions';
import useLocales from 'hooks/useLocales';
//import QRCode from 'react-qr-code';
import QRCode from 'qrcode.react';
import React from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { TOrderDetail } from 'types/order';
import Page from '../../components/Page';
import ModalShareForm from './components/ModalShareForm';
import OrderPhotoAlbum from './components/OrderPhotoAlbum';
import { PAYMENT_TYPE_OPTIONS } from './type';

export interface State extends SnackbarOrigin {
  open: boolean;
}
const OrderDetail = () => {
  const { orderId } = useParams();
  const { translate } = useLocales();
  const {
    data: order,
    isLoading,
    isFetching,
    refetch: refetchOrder
  } = useQuery(
    ['orders', orderId],
    () => orderApi.getOrderDetail(+orderId!).then((res) => res.data),
    {
      enabled: Boolean(orderId)
    }
  );
  const custColumns: ResoDescriptionColumnType<TOrderDetail>[] = [
    {
      title: 'Họ và Tên',
      dataIndex: 'customer_name'
    },
    {
      title: 'SĐT',
      dataIndex: 'customer_phone'
    },
    {
      title: 'Email',
      dataIndex: 'customer_email'
    }
  ];

  const orderColumns: ResoDescriptionColumnType<TOrderDetail>[] = [
    {
      title: translate('pages.orders.table.invoice'),
      dataIndex: 'invoice_id'
    },
    {
      title: translate('pages.orders.table.paymentType'),
      dataIndex: 'payments',
      render: (payments) => {
        if (!payments) return '-';
        return (
          <Stack spacing={2}>
            {(payments as TOrderDetail['payments'])?.slice(0, 1).map((payment) => (
              <Typography key={`${payment.type}`}>
                {PAYMENT_TYPE_OPTIONS.find((e) => e.value === payment.type)?.label}
              </Typography>
            ))}
          </Stack>
        );
      }
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'check_in_date',
      valueType: 'datetime'
    },
    {
      title: translate('pages.orders.table.finalAmount'),
      dataIndex: 'final_amount',
      hideInSearch: true,
      valueType: 'money'
    },
    {
      title: translate('pages.orders.table.discount'),
      dataIndex: 'discount'
    },
    {
      title: translate('pages.orders.table.totalAmount'),
      dataIndex: 'total_amount',
      valueType: 'money'
    },

    {
      title: translate('pages.orders.table.note'),
      dataIndex: 'notes'
    }
  ];

  const REACT_APP_LANDING_URL = 'https://stg.phuquocphoto.com';
  const shareLink = (orderId: string | undefined) => {
    return `${REACT_APP_LANDING_URL}/order/${orderId}`;
  };
  const downloadQRCode = () => {
    // Generate download with use canvas and stream
    const canvas: any = document.getElementById('qr-gen');
    const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    let downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = shareLink(order?.invoice_id) + `.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const [stateSnackBar, setStateSnackBar] = React.useState(false);
  return (
    <Page
      title="Chi tiết đơn hàng"
      actions={() => [
        <ModalShareForm
          maxWidth="xs"
          key="create-order"
          title={
            <Typography id="modal-modal-title" variant="h4">
              Chia sẻ mã đơn hàng
            </Typography>
          }
          trigger={
            <Button variant="outlined" startIcon={<QrCodeIcon />}>
              Chia sẻ mã đơn hàng
            </Button>
          }
          onOk={async () => {}}
        >
          <Stack spacing={2}>
            <Box textAlign="center">
              <QRCode id="qr-gen" value={shareLink(order?.invoice_id)} />
            </Box>
            <Button type="button" onClick={downloadQRCode}>
              Tải về mã QR
            </Button>
            <Stack direction="row" spacing={2}>
              <TextField
                value={shareLink(order?.invoice_id)}
                label="Đường dẫn"
                variant="outlined"
                size="small"
                disabled
                sx={{
                  width: '60%'
                }}
              />
              <Button
                variant="contained"
                color="info"
                sx={{
                  width: '40%'
                }}
                onClick={() => {
                  setStateSnackBar(true);
                  navigator.clipboard.writeText(shareLink(order?.invoice_id));
                }}
              >
                Sao chép
              </Button>
              <div>
                <Snackbar
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={stateSnackBar}
                  onClose={() => setStateSnackBar(false)}
                  message="Đã sao chép đường dẫn vào bộ nhớ tạm"
                />
              </div>
            </Stack>
          </Stack>
        </ModalShareForm>
      ]}
    >
      <Stack spacing={2} p={1} flex={1}>
        <Card id="product-detail">
          <Box textAlign="left">
            {isLoading ? (
              <CircularProgress />
            ) : !order ? (
              <EmptyContent title="Không tìm thấy đơn hàng" />
            ) : (
              <Stack spacing={2}>
                <ResoDescriptions
                  title="Thông tin đơn hàng"
                  labelProps={{ fontWeight: 'bold' }}
                  columns={orderColumns as any}
                  datasource={order}
                  column={3}
                />
                <ResoDescriptions
                  title="Thông tin khách hàng"
                  labelProps={{ fontWeight: 'bold' }}
                  columns={custColumns as any}
                  datasource={order}
                  column={3}
                />
              </Stack>
            )}
          </Box>
        </Card>
        {order && (
          <OrderPhotoAlbum refetchOrder={refetchOrder} isLoading={isFetching} order={order} />
        )}
      </Stack>
    </Page>
  );
};

export default OrderDetail;
