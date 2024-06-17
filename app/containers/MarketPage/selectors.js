/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectMarket = (state) => state.get('market', initialState);

const getMarketDataSelector = () =>
  createSelector(selectMarket, (marketState) => marketState.get('data'));

const getstoreListData = () =>
  createSelector(selectMarket, (marketState) => marketState.get('storeList'));

const getMarketDataModified = () =>
  createSelector(selectMarket, (marketState) => marketState.get('marketModel'));

const getAjaxInfo = () =>
  createSelector(selectMarket, (marketState) => marketState.get('ajaxSuccess'));
const getRidirectInfo = () =>
  createSelector(selectMarket, (userState) => userState.get('isRedirect'));

const getMetaPagingMarket = () =>
  createSelector(selectMarket, (marketState) => marketState.get('metaPaging'));

export {
  selectMarket,
  getMarketDataSelector,
  getMarketDataModified,
  getAjaxInfo,
  getRidirectInfo,
  getMetaPagingMarket,
  getstoreListData,
};
