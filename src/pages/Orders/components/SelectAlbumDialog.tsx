import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography
} from '@mui/material';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import googlePhotoApi from 'api/google-photo';
import orderApi from 'api/order';
import { InputField } from 'components/form';
import LoadingAsyncButton from 'components/LoadingAsyncButton/LoadingAsyncButton';
import ModalForm from 'components/ModalForm/ModalForm';
import { useSnackbar } from 'notistack';
import React, { forwardRef, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { GoogleAlbum } from 'types/google-photo';
import { TOrderDetail, TOrderDetailItem } from 'types/order';

const Transition = forwardRef(
  (
    props: TransitionProps & {
      children?: React.ReactElement;
    },
    ref: React.Ref<unknown>
  ) => <Slide direction="up" ref={ref} {...(props as any)} />
);

type Props = {
  open: boolean;
  onClose: () => void;
  order: TOrderDetail;
  orderDetail: TOrderDetailItem;
  refetchOrder: () => void;
};

const SelectAlbumDialog: React.FC<Props> = ({
  open,
  onClose,
  order,
  orderDetail,
  refetchOrder
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const orderId = order.order_id;
  const createAlbumForm = useForm({
    defaultValues: {
      title: `${orderDetail.product_name}`
    }
  });
  const [listAlbums, setListAlbums] = useState<GoogleAlbum[]>([]);
  const [loadingAlbums, setloadingAlbums] = useState(false);
  useEffect(() => {
    setloadingAlbums(true);
    googlePhotoApi.getAlbumsOfBrand().then((res) => {
      setListAlbums(res.data.albums);
      setloadingAlbums(false);
    });
  }, [open]);

  const onCreateAlbum = async (data: any) => {
    try {
      const res = await googlePhotoApi.createAlbumOfBrand(data);
      const updateOrder = { ...orderDetail };
      updateOrder.photo_album_id = res.data.id;
      await orderApi.updateOrderDetail(orderId, orderDetail.order_detail_id, updateOrder);
      enqueueSnackbar('T???o th??nh c??ng', { variant: 'success' });
      refetchOrder();
      onClose();
    } catch (error) {
      enqueueSnackbar('C?? l???i x???y ra', { variant: 'error' });
    }
  };

  const onSelectAlbum = async (albumId: string) => {
    try {
      const updateOrder = { ...orderDetail };
      updateOrder.photo_album_id = albumId;
      await orderApi.updateOrderDetail(orderId, orderDetail.order_detail_id, updateOrder);
      onClose();
      enqueueSnackbar('C???p nh???t th??nh c??ng', { variant: 'success' });
      return refetchOrder();
    } catch (error) {
      enqueueSnackbar('C?? l???i x???y ra', { variant: 'error' });
    }
  };
  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      TransitionComponent={Transition}
      open={open}
      onClose={onClose}
      scroll="paper"
    >
      <DialogTitle>
        Danh s??ch album
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
          size="large"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {loadingAlbums ? (
          <Container sx={{ alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress />
          </Container>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12} sm={3}>
              <Card sx={{ padding: 0, height: '100%', minHeight: '250px' }}>
                <ModalForm
                  maxWidth="sm"
                  onOk={async () => {
                    try {
                      await createAlbumForm.handleSubmit(
                        (data: any) => {
                          return onCreateAlbum(data);
                        },
                        (e) => {
                          throw e;
                        }
                      )();
                      return true;
                    } catch (error) {
                      enqueueSnackbar('C?? l???i', { variant: 'error' });
                      return false;
                    }
                  }}
                  title={<Typography variant="h3">T???o album</Typography>}
                  trigger={<Button sx={{ width: '100%', height: '100%' }}>T???o album</Button>}
                >
                  <FormProvider {...createAlbumForm}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <InputField fullWidth name="title" label="T??n album" />
                      </Grid>
                    </Grid>
                  </FormProvider>
                </ModalForm>
              </Card>
            </Grid>
            {listAlbums.map((album, index) => (
              <Grid key={`item ${index}`} item xs={12} sm={6} md={3}>
                <Card sx={{ padding: 0 }}>
                  <CardMedia
                    component="img"
                    height="140"
                    width="100%"
                    image={album.cover_photo_base_url}
                    alt="green iguana"
                    sx={{ objectFit: 'cover', objectPosition: 'top' }}
                  />
                  <CardContent sx={{ paddingBottom: 0 }}>
                    <Typography noWrap gutterBottom variant="body1" component="div">
                      {album.title}
                    </Typography>
                    <Typography noWrap gutterBottom variant="caption" component="div">
                      {album.media_items_count} H??nh ???nh
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <LoadingAsyncButton
                      onClick={() => onSelectAlbum(album.id)}
                      size="small"
                      color="primary"
                    >
                      Ch???n
                    </LoadingAsyncButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <LoadingAsyncButton onClick={onClose}>Quay l???i</LoadingAsyncButton>
      </DialogActions>
    </Dialog>
  );
};
export default SelectAlbumDialog;
