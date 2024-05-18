import Loadable from 'react-loadable';

import LoadingIndicator from 'components/LoadingIndicator';

export const DailyReportPage = Loadable({
  loader: () => import('./index'),
  loading: LoadingIndicator,
});
