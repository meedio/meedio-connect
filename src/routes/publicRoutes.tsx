import RoomDisconnectedPage from 'pages/RoomDisconnectedPage/RoomDisconnectedPage';
import lazyWithRetry from 'utils/lazyWithRetry';

import { createRoutes } from './utils/createRoute';
import withBrowserCheck from './utils/withBrowserCheck';
import withPageWrapper from './utils/withPageWrapper';

const pages = {
  UnsupportedBrowser: lazyWithRetry(
    () => import('modules/UnsupportedBrowser/UnsupportedBrowser')
  ),
  RoomsPage: lazyWithRetry(() => import('pages/RoomsPage/RoomsPage')),
  RoomPage: lazyWithRetry(() => import('pages/RoomPage/RoomPage')),
  RoomEndedPage: lazyWithRetry(
    () => import('pages/RoomEndedPage/RoomEndedPage')
  ),
  RoomTerminatedPage: lazyWithRetry(
    () => import('pages/RoomTerminatedPage/RoomTerminatedPage')
  ),
  AuthenticationPage: lazyWithRetry(
    () => import('pages/AuthenticationPage/AuthenticationPage')
  ),
  DiagnosticsPage: lazyWithRetry(
    () => import('pages/DiagnosticsPage/DiagnosticsPage')
  ),
};

export default createRoutes([
  {
    path: '/',
    component: pages.RoomsPage,
    hocs: [withPageWrapper()],
  },
  {
    path: '/unsupported-browser',
    component: pages.UnsupportedBrowser,
  },
  {
    path: ['/:inviteToken', '/rooms/:roomId'],
    component: pages.RoomPage,
    hocs: [withBrowserCheck],
    children: [
      { path: '/end', component: pages.RoomEndedPage },
      { path: '/disconnected', element: <RoomDisconnectedPage /> },
      { path: '/terminated', component: pages.RoomTerminatedPage },
    ],
  },

  {
    path: '/auth',
    component: pages.AuthenticationPage,
    hocs: [withPageWrapper()],
  },
  {
    path: '/test',
    component: pages.DiagnosticsPage,
    hocs: [withPageWrapper()],
  },
]);
