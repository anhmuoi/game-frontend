import Loadable from 'react-loadable';

import LoadingIndicator from 'components/LoadingIndicator';

export const LoadRoomManagePage = Loadable({
  loader: () => import('./index'),
  loading: LoadingIndicator,
});
