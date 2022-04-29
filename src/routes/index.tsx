import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import BlogPosts from 'pages/dashboard/BlogPosts';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// static
import BlogPost from 'pages/dashboard/BlogPost';
import BlogNewPost from 'pages/dashboard/BlogNewPost';
// guards
import AuthGuard from '../guards/AuthGuard';
import GuestGuard from '../guards/GuestGuard';
// import RoleBasedGuard from '../guards/RoleBasedGuard';
// components
import LoadingScreen from '../components/LoadingScreen';
import RoleBasedGuard from '../guards/RoleBasedGuard';
// ----------------------------------------------------------------------

const Loadable = (Component: any) => (props: any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();
  const isDashboard = pathname.includes('/dashboard');

  return (
    <Suspense
      fallback={
        <LoadingScreen
          sx={{
            ...(!isDashboard && {
              top: 0,
              left: 0,
              width: 1,
              zIndex: 9999,
              position: 'fixed'
            })
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          )
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          )
        },
        { path: 'login-unprotected', element: <Login /> },
        { path: 'register-unprotected', element: <Register /> },
        { path: 'reset-password', element: <ResetPassword /> },
        { path: 'verify', element: <VerifyCode /> }
      ]
    },

    // Dashboard Routes
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <RoleBasedGuard accessibleRoles={['admin']}>
            <DashboardLayout />
          </RoleBasedGuard>
        </AuthGuard>
      ),
      children: [
        { path: '', element: <Navigate to="/dashboard/app" replace /> },
        { path: 'app', element: <GeneralApp /> },
        { path: 'ecommerce', element: <GeneralEcommerce /> },
        {
          path: 'analytics',
          element: <GeneralAnalytics />
        },
        {
          path: 'orders',
          children: [
            { path: '', element: <OrderListPage /> },
            //{ path: 'detail', element: <OrderDetail /> },
            { path: ':orderId', element: <OrderDetail /> }
          ]
        },
        {
          path: 'configuration',
          children: [{ path: '', element: <Configuration /> }]
        },
        {
          path: 'customers',
          children: [
            { path: '', element: <CustomerListPage /> },
            { path: 'new', element: <ComingSoon /> }
          ]
        }
      ]
    },
    // FOR STORE ADMIN
    {
      path: 'store-admin',
      element: (
        <AuthGuard>
          <RoleBasedGuard accessibleRoles={['store-admin']}>
            <DashboardLayout />
          </RoleBasedGuard>
        </AuthGuard>
      ),
      children: [
        { path: '', element: <Navigate to="/store-admin/orders" replace /> },
        { path: 'app', element: <GeneralApp /> },
        {
          path: 'blog',
          children: [
            {
              path: '',
              element: <Navigate to="/dashboard/blog/posts" replace />
            },
            { path: 'posts', element: <BlogPosts /> },
            { path: 'post/:title', element: <BlogPost /> },
            { path: 'new-post', element: <BlogNewPost /> }
          ]
        }
      ]
    },
    {
      path: '/',
      element: <Navigate to="/auth/login" replace />
    },
    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'coming-soon', element: <ComingSoon /> },
        { path: '500', element: <Page500 /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}

// IMPORT COMPONENTS

// Authentication
const Login = Loadable(lazy(() => import('../pages/authentication/Login')));
const Register = Loadable(lazy(() => import('../pages/authentication/Register')));
const ResetPassword = Loadable(lazy(() => import('../pages/authentication/ResetPassword')));
const VerifyCode = Loadable(lazy(() => import('../pages/authentication/VerifyCode')));
// Dashboard
const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/GeneralApp')));
const GeneralEcommerce = Loadable(lazy(() => import('../pages/dashboard/GeneralEcommerce')));
const GeneralAnalytics = Loadable(lazy(() => import('../pages/dashboard/GeneralAnalytics')));

const ComingSoon = Loadable(lazy(() => import('../pages/ComingSoon')));

const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));

// Store-Order
const OrderListPage = Loadable(lazy(() => import('../pages/Orders/OrderList')));
const OrderDetail = Loadable(lazy(() => import('../pages/Orders/OrderDetail')));
// customers
const CustomerListPage = Loadable(lazy(() => import('../pages/Customer/CustomerListPage')));
// Configuration
const Configuration = Loadable(lazy(() => import('../pages/Configuration/Config')));
