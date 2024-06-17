import Loadable from 'react-loadable';

import LoadingIndicator from 'components/LoadingIndicator';

export const LoadMyNftPage = Loadable({
  loader: () => import('./index'),
  loading: LoadingIndicator,
});
