import Loadable from 'react-loadable';

import LoadingIndicator from 'components/LoadingIndicator';

export const MyProfileManagementPage = Loadable({
  loader: () => import('./index'),
  loading: LoadingIndicator,
});
export const MyProfileModifyPage = Loadable({
  loader: () => import('./MyProfileModifiedUi.js'),
  loading: LoadingIndicator,
});
