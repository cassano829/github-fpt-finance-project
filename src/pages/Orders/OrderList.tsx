import { yupResolver } from '@hookform/resolvers/yup';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Icon } from '@iconify/react';
import { RemoveCircleOutline, Visibility } from '@mui/icons-material';
// material
import { Box, Button, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import orderApi from 'api/order';
import { InputField, SelectField } from 'components/form';
import ModalForm from 'components/ModalForm/ModalForm';
import Page from 'components/Page';
import ResoTable from 'components/ResoTable/ResoTable';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import { useRef, useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
// components
import { useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { TOrder } from 'types/order';
import { TTableColumn } from 'types/table';
import AutoCompleteProduct from './components/AutoCompleteProduct';
import { Card, CardTitle } from './components/Card';
import OrderDetailDialog from './components/OrderDetailDialog';
import { PAYMENT_TYPE_OPTIONS, validationSchema } from './type';

const OrderListPage = () => {
  const navigate = useNavigate();
  const tableRef = useRef<any>();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const [detailOrder, setDetailOrder] = useState<number | null>(null);

  const methods = useForm<any>({
    resolver: yupResolver(validationSchema),
    shouldUnregister: true,
    defaultValues: {
      order_details: [
        {
          product_id: null,
          quantity: 1
        }
      ]
    }
  });

  const { fields, remove, append } = useFieldArray({
    control: methods.control,
    name: 'order_details'
  });

  const orderColumns: TTableColumn<TOrder>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      hideInSearch: true
    },
    {
      title: translate('pages.orders.table.invoice'),
      dataIndex: 'invoice_id'
    },
    {
      title: translate('pages.orders.table.customerName'),
      dataIndex: 'customer_name',
      hideInSearch: true,
      hideInTable: true
    },
    {
      title: translate('pages.orders.table.customerPhone'),
      dataIndex: 'customer_phone',
      hideInSearch: true,
      hideInTable: true
    },
    {
      title: translate('pages.orders.table.finalAmount'),
      dataIndex: 'final_amount',
      hideInSearch: true,
      valueType: 'money'
    },
    {
      title: translate('pages.orders.table.orderTime'),
      dataIndex: 'check_in_date',
      hideInSearch: true,
      valueType: 'datetime'
    },
    {
      title: translate('pages.orders.table.note'),
      dataIndex: 'notes',
      hideInSearch: true
    },
    {
      title: translate('pages.orders.table.detail'),
      fixed: 'right',
      hideInSearch: true,
      render: (_: any, order: TOrder) => (
        <Tooltip title="Chi ti???t">
          <IconButton
            onClick={() => {
              navigate(`${PATH_DASHBOARD.orders.root}/${order.order_id}`);
            }}
          >
            <Visibility />
          </IconButton>
        </Tooltip>
      )
    }
  ];

  return (
    <Page
      title="Danh s??ch ????n h??ng"
      actions={() => [
        <ModalForm
          maxWidth="md"
          key="create-order"
          title={
            <Typography id="modal-modal-title" variant="h3">
              T???o m???i ????n h??ng
            </Typography>
          }
          trigger={
            <Button variant="contained" startIcon={<Icon icon={plusFill} />}>
              T???o ????n H??ng
            </Button>
          }
          onOk={async () => {
            try {
              await methods.handleSubmit(
                (data) => {
                  return orderApi.createOrder(data).then(() => {
                    methods.reset({
                      order_details: [
                        {
                          product_id: null,
                          quantity: 1
                        }
                      ]
                    });
                  });
                },
                (e) => {
                  throw e;
                }
              )();
              enqueueSnackbar('T???o ????n h??ng th??nh c??ng', {
                variant: 'success'
              });
              tableRef.current?.reload();
              return true;
            } catch (error) {
              enqueueSnackbar((error as any).message, {
                variant: 'error'
              });
              return false;
            }
          }}
        >
          <FormProvider {...methods}>
            <Stack spacing={4}>
              <Box textAlign="left">
                <CardTitle mb={2} variant="subtitle1">
                  Chi ti???t ????n h??ng
                </CardTitle>
                <Stack spacing={2}>
                  {fields.map(({ id }, idx) => (
                    <Stack
                      key={`order-detail-${id}`}
                      direction="row"
                      spacing={2}
                      alignItems="center"
                    >
                      <AutoCompleteProduct
                        name={`order_details.${idx}.product_id`}
                        label="G??i D???ch V???"
                      />
                      <InputField
                        type="number"
                        name={`order_details.${idx}.quantity`}
                        label="S??? l?????ng"
                        size="small"
                        fullWidth
                        required
                      />
                      <IconButton onClick={() => remove(idx)}>
                        <RemoveCircleOutline />
                      </IconButton>
                    </Stack>
                  ))}
                  <Button
                    onClick={() => append({ product_id: null, quantity: 1 })}
                    variant="outlined"
                    sx={{ height: '70px' }}
                  >
                    Th??m d???ch v???
                  </Button>
                </Stack>
              </Box>
              <Box>
                <CardTitle mb={2} variant="subtitle1">
                  Thanh to??n
                </CardTitle>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2}>
                    <SelectField
                      name="payments.0.type"
                      label="Ph????ng th???c thanh to??n"
                      size="small"
                      required
                      fullWidth
                      options={PAYMENT_TYPE_OPTIONS}
                      sx={{
                        width: '100%'
                      }}
                    />
                    <InputField
                      type="number"
                      name="payments.0.amount"
                      label="T???ng ti???n"
                      required
                      fullWidth
                      size="small"
                    />
                  </Stack>
                  <Box>
                    <InputField
                      name="notes"
                      sx={{
                        width: '100%'
                      }}
                      id="outlined-multiline-static"
                      multiline
                      rows={3}
                      variant="outlined"
                      label="Ghi ch??"
                    />
                  </Box>
                </Stack>
              </Box>
              <Box textAlign="left" marginTop="20px">
                <CardTitle mb={2} variant="subtitle1">
                  Th??ng tin kh??ch h??ng
                </CardTitle>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2}>
                    <InputField
                      name="customer.name"
                      size="small"
                      type="text"
                      required
                      label="T??n kh??ch h??ng"
                      sx={{
                        width: '50%'
                      }}
                    />
                    <InputField
                      name="customer.email"
                      size="small"
                      type="text"
                      label="Email"
                      required
                      sx={{
                        width: '50%'
                      }}
                    />
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <InputField
                      name="customer.phone"
                      size="small"
                      type="text"
                      required
                      label="S??? ??i???n tho???i"
                      sx={{
                        width: '50%'
                      }}
                    />
                    <InputField
                      name="customer.address"
                      size="small"
                      type="text"
                      label="?????a ch???"
                      sx={{
                        width: '50%'
                      }}
                    />
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </FormProvider>
        </ModalForm>
      ]}
    >
      <OrderDetailDialog
        orderId={detailOrder}
        open={Boolean(detailOrder)}
        onClose={() => setDetailOrder(null)}
      />
      <Card>
        <Stack spacing={2}>
          <ResoTable
            ref={tableRef}
            showAction={false}
            rowKey="menu_id"
            getData={(params: any) => orderApi.get(params)}
            columns={orderColumns}
          />
        </Stack>
      </Card>
    </Page>
  );
};

export default OrderListPage;
