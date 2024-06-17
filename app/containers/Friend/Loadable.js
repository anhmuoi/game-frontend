import Loadable from 'react-loadable';

import LoadingIndicator from 'components/LoadingIndicator';

export const LoadFriendPage = Loadable({
  loader: () => import('./index'),
  loading: LoadingIndicator,
});
