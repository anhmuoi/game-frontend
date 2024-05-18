/*
 * Footer Messages
 *
 * This contains all the text for the Footer component.
 */
import { defineMessages } from 'react-intl';

export const scope = 'demasterpro.components.DatePickerUI';
export default defineMessages({
  okLabel: {
    id: `${scope}.okLabel`,
    defaultMessage: `Ok`,
  },
  cancelLabel: {
    id: `${scope}.cancelLabel`,
    defaultMessage: `Cancel`,
  },
  todayLabel: {
    id: `${scope}.todayLabel`,
    defaultMessage: `Today`,
  },
  invalidDateFormat: {
    id: `demasterpro.components.Common.invalidDateFormat`,
    defaultMessage: `Invalid Date Format`,
  },
});
