import Loadable from 'react-loadable';

import LoadingIndicator from 'components/LoadingIndicator';

export const LoadRoomDetailPage = Loadable({
  loader: () => import('./index'),
  loading: LoadingIndicator,
});
