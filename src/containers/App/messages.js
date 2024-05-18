import { defineMessages } from 'react-intl';
import common from 'components/Common/messages';

export const scope = 'demasterpro.components.App';
export default defineMessages({
  ...common,
  btnDismiss: {
    id: `${scope}.btnDismiss`,
    defaultMessage: 'Dismiss',
  },
  titleUserRoute: {
    id: `${scope}.titleUserRoute`,
    defaultMessage: 'User',
  },
  titleAddUserRoute: {
    id: `${scope}.titleAddUserRoute`,
    defaultMessage: 'Add User',
  },
  titleEditUserRoute: {
    id: `${scope}.titleEditUserRoute`,
    defaultMessage: 'Edit User',
  },
  titleNotFoundRoute: {
    id: `${scope}.titleNotFoundRoute`,
    defaultMessage: 'Not found',
  },
  titleDepartmentRoute: {
    id: `${scope}.titleDepartmentRoute`,
    defaultMessage: 'Department',
  },
});
