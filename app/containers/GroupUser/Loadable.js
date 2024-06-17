import Loadable from 'react-loadable';

import LoadingIndicator from 'components/LoadingIndicator';

export const LoadGroupUserPage = Loadable({
  loader: () => import('./index'),
  loading: LoadingIndicator,
});
