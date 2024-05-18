import Loadable from 'react-loadable';

import LoadingIndicator from 'components/LoadingIndicator';

export const LoadDepartmentPage = Loadable({
  loader: () => import('./index'),
  loading: LoadingIndicator,
});
