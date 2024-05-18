import Loadable from 'react-loadable';

import LoadingIndicator from 'components/LoadingIndicator';

export const LoadCategoryPage = Loadable({
  loader: () => import('./index'),
  loading: LoadingIndicator,
});
