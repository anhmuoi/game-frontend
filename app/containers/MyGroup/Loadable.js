import Loadable from 'react-loadable';

import LoadingIndicator from 'components/LoadingIndicator';

export const LoadMyGroupPage = Loadable({
  loader: () => import('./index'),
  loading: LoadingIndicator,
});
