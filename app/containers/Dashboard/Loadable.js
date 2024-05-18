import Loadable from 'react-loadable';

import LoadingIndicator from 'components/LoadingIndicator';

export const LoadDashboardPage = Loadable({
  loader: () => import('./index'),
  loading: LoadingIndicator,
});
