/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectAccount = state => state.get('account', initialState);

const getAccountData = () =>
  createSelector(selectAccount, accountState => accountState.get('data'));

const getAccountDataModified = () =>
  createSelector(selectAccount, accountState =>
    accountState.get('accountModel'),
  );

const getAjaxInfo = () =>
  createSelector(selectAccount, accountState =>
    accountState.get('ajaxSuccess'),
  );

const getMetaPagingAccount = () =>
  createSelector(selectAccount, accountState => accountState.get('metaPaging'));

export {
  selectAccount,
  getAccountData,
  getAccountDataModified,
  getAjaxInfo,
  getMetaPagingAccount,
};
