import Loadable from 'react-loadable';

import LoadingIndicator from 'components/LoadingIndicator';

export const LoadRankPage = Loadable({
  loader: () => import('./index'),
  loading: LoadingIndicator,
});
