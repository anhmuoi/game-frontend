import Loadable from 'react-loadable';

import LoadingIndicator from 'components/LoadingIndicator';

export const MyDriverPage = Loadable({
  loader: () => import('./MyDriverPage'),
  loading: LoadingIndicator,
});

export const DocumentPage = Loadable({
  loader: () => import('./MyDriverPage'),
  loading: LoadingIndicator,
});

export const SharedWithMePage = Loadable({
  loader: () => import('./SharedWithMePage'),
  loading: LoadingIndicator,
});
