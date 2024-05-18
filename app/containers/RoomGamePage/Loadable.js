import Loadable from 'react-loadable';

import LoadingIndicator from 'components/LoadingIndicator';

export const LoadRoomGamePage = Loadable({
  loader: () => import('./index'),
  loading: LoadingIndicator,
});
