import Loadable from 'react-loadable';

import LoadingIndicator from 'components/LoadingIndicator';

export const LoadRoleSettingPage = Loadable({
  loader: () => import('./index'),
  loading: LoadingIndicator,
});
