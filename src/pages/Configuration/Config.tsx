// material
import { Alert, Box, Card, CircularProgress, Stack } from '@mui/material';
import configApi from 'api/configuration';
import { exchangeToken } from 'api/google-oauth';
import EmptyContent from 'components/EmptyContent';
import Page from 'components/Page';
import ResoDescriptions, { ResoDescriptionColumnType } from 'components/ResoDescriptions';
import { useSnackbar } from 'notistack';
import { CardTitle } from 'pages/Orders/components/Card';
import React, { useEffect } from 'react';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { useQuery } from 'react-query';
import { TBrand } from 'types/brand';
import { setGoogleAccessToken, setGoogleRefreshToken } from 'utils/utils';

const OrderListPage = () => {
  const [hasConnectToGGPhoto, setHasConnectToGGPhoto] = React.useState(false);

  const {
    data: brandInfo,
    refetch: refetchBrandInfo,
    isLoading
  } = useQuery(['configuration'], () => configApi.getInfor().then((res) => res.data));

  useEffect(() => {
    setHasConnectToGGPhoto(Boolean(brandInfo?.google_photo_refresh_token));
  }, [brandInfo?.google_photo_refresh_token]);

  const saveRefreshTokenToServer = (res: any) => {
    const updateData: any = { ...brandInfo };
    updateData.google_photo_refresh_token = res.data.refresh_token;
    configApi.updateInfor(updateData);
    setTimeout(() => {
      refetchBrandInfo();
    }, 2000);
  };
  const { enqueueSnackbar } = useSnackbar();
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
  const configColumns: ResoDescriptionColumnType<TBrand>[] = [
    {
      title: 'ID',
      dataIndex: 'id'
    },
    {
      title: 'Tên thương hiệu',
      dataIndex: 'brand_name'
    },
    {
      title: 'Mô tả',
      dataIndex: 'description'
    },
    {
      title: 'Tên công ty',
      dataIndex: 'company_name'
    },
    {
      title: 'Người liên hệ',
      dataIndex: 'contact_person'
    },
    {
      title: 'SĐT',
      dataIndex: 'phone_number'
    },
    {
      title: 'Website',
      dataIndex: 'website'
    }
  ];
  const notAuthorWithGoogle = !brandInfo?.google_photo_refresh_token;
  console.log(`notAuthorWithGoogle`, notAuthorWithGoogle);
  return (
    <Page
      title="Cấu hình"
      actions={() => [
        <GoogleLogin
          key="google-login"
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
      ]}
    >
      <Stack>
        {notAuthorWithGoogle && (
          <Alert
            severity="warning"
            action={
              <GoogleLogin
                key="google-login"
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
            }
          >
            Vui lòng kết nối với Google Photos
          </Alert>
        )}
        <Box flex={1}>
          <Card id="product-detail">
            <Box textAlign="left">
              <CardTitle mb={2} variant="subtitle1">
                Thông tin cấu hình
              </CardTitle>

              {isLoading ? (
                <CircularProgress />
              ) : !brandInfo ? (
                <EmptyContent title="Không có thông tin cấu hình" />
              ) : (
                <Stack spacing={2}>
                  <ResoDescriptions
                    labelProps={{ fontWeight: 'bold' }}
                    columns={configColumns as any}
                    datasource={brandInfo}
                    column={4}
                  />
                </Stack>
              )}
            </Box>
          </Card>
        </Box>
      </Stack>
    </Page>
  );
};

export default OrderListPage;
