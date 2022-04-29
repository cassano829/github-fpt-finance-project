// routes
import { PATH_STORE_APP } from 'routes/storeAppPaths';
import SvgIconStyle from '../../components/SvgIconStyle';
import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <SvgIconStyle src={`/static/icons/navbar/${name}.svg`} sx={{ width: '100%', height: '100%' }} />
);

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  kanban: getIcon('ic_kanban'),
  tag: getIcon('tag'),
  menu: getIcon('menu'),
  store: getIcon('ic_store'),
  order: getIcon('ic_order'),
  category: getIcon('ic_category'),
  extraCategory: getIcon('ic_extra_category'),
  storeApply: getIcon('ic_store_apply'),
  combo: getIcon('ic_combo'),
  product: getIcon('ic_product'),
  collection: getIcon('ic_collection'),
  configuration: getIcon('ic_setting')
};

const sidebarConfig = [
  {
    subheader: 'general',
    items: [
      {
        title: 'app',
        path: PATH_DASHBOARD.general.app,
        icon: ICONS.dashboard
      },
      {
        title: 'order',
        path: PATH_DASHBOARD.orders.list,
        icon: ICONS.order
      },
      {
        title: 'configuration',
        path: PATH_DASHBOARD.configuration.list,
        icon: ICONS.configuration
      }
    ]
  }
];

export const storeAppSidebarConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      {
        title: 'app',
        path: PATH_STORE_APP.general.app,
        icon: ICONS.dashboard
      }
    ]
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      // MANAGEMENT : PRODUCT

      {
        title: 'order',
        path: PATH_STORE_APP.orders.list,
        icon: ICONS.order
      },
      {
        title: 'store-menu',
        path: PATH_STORE_APP.menus.list,
        icon: ICONS.menu
      },
      {
        title: 'configuration',
        path: PATH_STORE_APP.configuration.list,
        icon: ICONS.configuration
      }
    ]
  }
];

export default sidebarConfig;
