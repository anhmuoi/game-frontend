/*
 *
 * LanguageProvider reducer
 *
 */

import { fromJS } from 'immutable';
import { localstoreUtilites } from 'utils/persistenceData';
import { CHANGE_LOCALE } from './constants';
import { DEFAULT_LOCALE } from '../../i18n';

export const initialState = fromJS({
  locale: localstoreUtilites.getLanguageFromLocalStorage()
    ? localstoreUtilites.getLanguageFromLocalStorage().substr(0, 2)
    : DEFAULT_LOCALE,
});

function languageProviderReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_LOCALE:
      return state.set('locale', action.locale);
    default:
      return state;
  }
}

export default languageProviderReducer;
