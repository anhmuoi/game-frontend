/*
 * UserPage Messages
 *
 * This contains all the text for the UserPage component.
 */
import { defineMessages } from 'react-intl';
import common from 'components/Common/messages';

export const scope = 'demasterpro.components.FindUserModal';
export default defineMessages({
  ...common,
  btnSave: {
    id: `demasterpro.containers.VisitPage.btnSave`,
    defaultMessage: `Save`,
  },
  searchBox: {
    id: `demasterpro.containers.VisitArmyPage.searchBox`,
    defaultMessage: `Search`,
  },
  btnClear: {
    id: `demasterpro.components.Common.clear`,
    defaultMessage: `Clear`,
  }
});
