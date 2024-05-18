/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectPassword = state => state.get('resetPassword', initialState);

const makeSelectorPassword = () =>
  createSelector(selectPassword, resetPassState =>
    resetPassState.get('passwordModel'),
  );

const getRedirect = () =>
  createSelector(selectPassword, resetPassState =>
    resetPassState.get('isRedirect'),
  );

export { makeSelectorPassword, getRedirect };
