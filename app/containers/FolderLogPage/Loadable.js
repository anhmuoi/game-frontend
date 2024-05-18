import Loadable from 'react-loadable';

import LoadingIndicator from 'components/LoadingIndicator';


export const LoadFolderLogPage = Loadable({
  loader: () => import('./index'),
  loading: LoadingIndicator,
});
