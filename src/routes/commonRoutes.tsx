import { Navigate } from 'react-router-dom';

import lazyWithRetry from 'utils/lazyWithRetry';

import { createRoutes } from './utils/createRoute';

const pages = {
  NotFound: lazyWithRetry(() => import('@shared/components/NotFound/NotFound')),
};

export default createRoutes([
  {
    path: '/404',
    component: pages.NotFound,
  },
  {
    path: '/*',
    element: <Navigate replace to="/404" />,
  },
]);
