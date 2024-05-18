import Loadable from 'react-loadable';

import LoadingIndicator from 'components/LoadingIndicator';

export const ProfilePage = Loadable({
  loader: () => import('./index'),
  loading: LoadingIndicator,
});
