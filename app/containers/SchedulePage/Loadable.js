import Loadable from 'react-loadable';

import LoadingIndicator from 'components/LoadingIndicator';

export const LoadSchedulePage = Loadable({
  loader: () => import('./index'),
  loading: LoadingIndicator,
});
