import Loadable from 'react-loadable';

import LoadingIndicator from 'components/LoadingIndicator';

export const LoginPage = Loadable({
  loader: () => import('./index'),
  loading: LoadingIndicator,
});

export const AuthenticationKeyPage = Loadable({
  loader: () => import('./AuthenticationKey'),
  loading: LoadingIndicator,
});
