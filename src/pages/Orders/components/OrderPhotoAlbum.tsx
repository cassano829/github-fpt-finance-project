import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  Alert,
  alpha,
  Box,
  Button,
  Card,
  CircularProgress,
  Menu,
  MenuItem,
  MenuProps,
  Stack,
  styled,
  Typography
} from '@mui/material';
import configApi from 'api/configuration';
import { exchangeToken } from 'api/google-oauth';
import orderApi from 'api/order';
import ConfirmDialog from 'components/Dialog/ConfirmDialog';
import Label from 'components/Label';
import LoadingAsyncButton from 'components/LoadingAsyncButton/LoadingAsyncButton';
import ResoTable from 'components/ResoTable/ResoTable';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { useQuery } from 'react-query';
import { TOrderDetail, TOrderDetailItem } from 'types/order';
import { TTableColumn } from 'types/table';
import { setGoogleAccessToken, setGoogleRefreshToken } from 'utils/utils';
import { Share } from '../type';
import { CardTitle } from './Card';
import SelectAlbumDialog from './SelectAlbumDialog';
interface Props {
  order: TOrderDetail;
  isLoading: Boolean;
  refetchOrder: () => void;
}

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right'
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right'
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0'
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        marginRight: theme.spacing(1.5)
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
      }
    }
  }
}));
const OrderPhotoAlbum = ({ order, isLoading, refetchOrder }: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>, orderDetailId: number) => {
    setOpenMenuId(orderDetailId);
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setOpenMenuId(null);
    setAnchorEl(null);
  };
  const { enqueueSnackbar } = useSnackbar();
  const orderId = order.order_id;
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<TOrderDetailItem | null>(null);
  const [selectedOrderDetailDelete, setSelectedOrderDetailDelete] =
    useState<TOrderDetailItem | null>(null);
  const handleClose = () => setSelectedOrderDetail(null);
  const handleCloseConFirm = () => setSelectedOrderDetailDelete(null);
  const { data: brandInfo, refetch: refetchBrandInfo } = useQuery(['brandInfo'], () =>
    configApi.getInfor().then((res) => res.data)
  );

  const saveRefreshTokenToServer = (res: any) => {
    const updateData: any = { ...brandInfo };
    updateData.google_photo_refresh_token = res.data.refresh_token;
    configApi.updateInfor(updateData);
    refetchBrandInfo();
    setLoadingGoogle(true);
    setTimeout(() => {
      refetchOrder();
      setLoadingGoogle(false);
    }, 2000);
  };
  const [openConfirm, setOpenConfirm] = useState(false);
  const onLoginGoogle = (res: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    if (res.code) {
      exchangeToken(res.code)
        .then((res: any) => {
          setGoogleAccessToken(res.data.access_token);
          setGoogleRefreshToken(res.data.refresh_token);
          saveRefreshTokenToServer(res);
        })
        .catch((err: any) => {
          enqueueSnackbar('Có lỗi khi kết nối', {
            variant: 'error'
          });
        });
    }
  };

  const onDeleteAlbum = async (orderDetail: TOrderDetailItem) => {
    try {
      const updateOrder = { ...orderDetail };
      updateOrder.photo_album_id = null;
      const orderRes = await orderApi.updateOrderDetail(
        orderId,
        updateOrder.order_detail_id,
        updateOrder
      );
      refetchOrder();
      setSelectedOrderDetailDelete(null);
      enqueueSnackbar('Xóa thành công', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Có lỗi xảy ra', { variant: 'error' });
    }
    setOpenConfirm(false);
  };

  const notAuthorWithGoogle = order.photo_album_id !== null && order.google_photo_album === null;

  const onShareAlbum = async (orderDetail: TOrderDetailItem) => {
    try {
      const shareOrder = { ...orderDetail };
      const albumId = shareOrder.photo_album_id;
      const data: Share = { is_collaborative: true, is_commentable: true };
      const shareRes = await orderApi.shareAlbum(albumId!, data);
      refetchOrder();
      enqueueSnackbar('Chia sẻ album thành công', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Có lỗi xảy ra', { variant: 'error' });
    }
  };

  const renderOrderDetails = () => {
    const columns: TTableColumn<TOrderDetailItem>[] = [
      {
        title: 'Dịch vụ',
        dataIndex: 'product_name'
      },
      {
        title: 'Album',
        render: (_, { google_photo_album: album }) => {
          if (album == null) return <>Chưa chọn album</>;
          return (
            <Box sx={{ maxWidth: '400px' }} textAlign="center" mx="auto">
              <a
                href={album.product_url}
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <Box
                  component="img"
                  alt={album.title}
                  src={album.cover_photo_base_url}
                  sx={{ width: 150, height: 150, display: 'inline-block', objectFit: 'cover' }}
                />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {album.title}
                </Typography>
              </a>
              <Typography noWrap gutterBottom variant="caption" component="div">
                {album.media_items_count} Hình ảnh
              </Typography>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {album.share_info?.shareable_url && <Label color="success">Đã chia sẻ</Label>}
              </div>
            </Box>
          );
        }
      },
      {
        title: 'Hành động',
        render: (_, orderDetail) => {
          const { google_photo_album: album } = orderDetail;
          if (!album)
            return (
              <LoadingAsyncButton
                onClick={() => {
                  setSelectedOrderDetail(orderDetail);
                }}
              >
                Chọn album
              </LoadingAsyncButton>
            );
          return (
            <Stack mt={2} direction="row" spacing={2} justifyContent="center">
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {!orderDetail.google_photo_album?.share_info?.shareable_url && (
                  <LoadingAsyncButton onClick={() => onShareAlbum(orderDetail)} variant="text">
                    Chia sẻ album
                  </LoadingAsyncButton>
                )}
              </div>
              <Button
                id="demo-customized-button"
                aria-controls={openMenu ? 'demo-customized-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openMenu ? 'true' : undefined}
                variant="contained"
                disableElevation
                onClick={(e) => handleClick(e, orderDetail.order_detail_id)}
                endIcon={<KeyboardArrowDownIcon />}
              >
                Tùy chọn
              </Button>
              <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                  'aria-labelledby': 'demo-customized-button'
                }}
                anchorEl={anchorEl}
                open={openMenuId === orderDetail.order_detail_id}
                onClose={handleCloseMenu}
              >
                <MenuItem
                  onClick={() => {
                    setSelectedOrderDetail(orderDetail);
                    handleCloseMenu();
                  }}
                  disableRipple
                >
                  <EditIcon />
                  Cập nhật album
                </MenuItem>

                <a
                  href={album.product_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: 'none', color: ' black' }}
                >
                  <MenuItem disableRipple>
                    <CloudUploadIcon />
                    Upload hình ảnh
                  </MenuItem>
                </a>
                <MenuItem
                  sx={{ color: 'error.main' }}
                  onClick={() => {
                    setSelectedOrderDetailDelete(orderDetail);
                    handleCloseMenu();
                  }}
                  disableRipple
                >
                  <DeleteIcon color="error" />
                  Hủy chọn album
                </MenuItem>
              </StyledMenu>
            </Stack>
          );
        }
      }
    ];
    if (isLoading) return <CircularProgress />;
    return (
      <ResoTable
        dataSource={order.order_detail}
        columns={columns}
        rowKey="order_detail_id"
        showFilter={false}
        showAction={false}
        showSettings={false}
      />
    );
  };
  return (
    <Card>
      <Stack direction="row" justifyContent="space-between">
        <CardTitle mb={2} variant="subtitle1">
          Album hình ảnh
        </CardTitle>
      </Stack>
      {selectedOrderDetail && (
        <SelectAlbumDialog
          refetchOrder={refetchOrder}
          orderDetail={selectedOrderDetail}
          open={Boolean(selectedOrderDetail)}
          onClose={handleClose}
          order={order}
        />
      )}
      {selectedOrderDetailDelete && (
        <ConfirmDialog
          open={Boolean(selectedOrderDetailDelete)}
          title="Bạn có chắc muốn hủy chọn album này"
          onClose={handleCloseConFirm}
          onDelete={() => onDeleteAlbum(selectedOrderDetailDelete!)}
        />
      )}
      <Stack>
        {notAuthorWithGoogle && (
          <Alert
            severity="warning"
            action={
              loadingGoogle ? (
                <CircularProgress />
              ) : (
                <GoogleLogin
                  clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID as string}
                  buttonText="Kết nối với GooglePhotos"
                  onSuccess={onLoginGoogle}
                  onFailure={console.log}
                  cookiePolicy={'single_host_origin'}
                  accessType="offline"
                  responseType="code"
                  prompt="consent"
                  scope="https://www.googleapis.com/auth/photoslibrary https://www.googleapis.com/auth/photoslibrary.appendonly https://www.googleapis.com/auth/photoslibrary.sharing"
                />
              )
            }
          >
            Vui lòng kết nối với Google Photos
          </Alert>
        )}
        {renderOrderDetails()}
      </Stack>
    </Card>
  );
};

export default OrderPhotoAlbum;
