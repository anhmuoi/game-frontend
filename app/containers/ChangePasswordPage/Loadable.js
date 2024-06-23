import Loadable from 'react-loadable';

import LoadingIndicator from 'components/LoadingIndicator';

export const LoadChangePasswordPage = Loadable({
  loader: () => import('./index'),
  loading: LoadingIndicator,
});
