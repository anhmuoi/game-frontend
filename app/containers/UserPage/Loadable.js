import Loadable from 'react-loadable';

import LoadingIndicator from 'components/LoadingIndicator';

export const UserManagementPage = Loadable({
  loader: () => import('./index'),
  loading: LoadingIndicator,
});
export const UserModifyPage = Loadable({
  loader: () => import('./UserModifiedUi.js'),
  loading: LoadingIndicator,
});
