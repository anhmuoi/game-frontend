import Loadable from 'react-loadable';

import LoadingIndicator from 'components/LoadingIndicator';

export const LoadHistoryPage = Loadable({
  loader: () => import('./index'),
  loading: LoadingIndicator,
});
