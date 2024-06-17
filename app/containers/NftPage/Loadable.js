import Loadable from 'react-loadable';

import LoadingIndicator from 'components/LoadingIndicator';

export const ItemNftPage = Loadable({
  loader: () => import('./index'),
  loading: LoadingIndicator,
});
