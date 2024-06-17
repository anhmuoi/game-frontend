import Loadable from 'react-loadable';

import LoadingIndicator from 'components/LoadingIndicator';

export const LoadAnalysisPage = Loadable({
  loader: () => import('./index'),
  loading: LoadingIndicator,
});
