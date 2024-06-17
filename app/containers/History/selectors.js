/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectMarket = (state) => state.get('history', initialState);

const getMarketDataSelector = () =>
  createSelector(selectMarket, (historyState) => historyState.get('data'));

const getstoreListData = () =>
  createSelector(selectMarket, (historyState) => historyState.get('storeList'));

const getMarketDataModified = () =>
  createSelector(selectMarket, (historyState) =>
    historyState.get('historyModel'),
  );

const getAjaxInfo = () =>
  createSelector(selectMarket, (historyState) =>
    historyState.get('ajaxSuccess'),
  );
const getRidirectInfo = () =>
  createSelector(selectMarket, (userState) => userState.get('isRedirect'));

const getMetaPagingMarket = () =>
  createSelector(selectMarket, (historyState) =>
    historyState.get('metaPaging'),
  );
const getUserListData = () =>
  createSelector(selectMarket, (roomDetailState) =>
    roomDetailState.get('userList'),
  );

export {
  selectMarket,
  getMarketDataSelector,
  getMarketDataModified,
  getAjaxInfo,
  getRidirectInfo,
  getMetaPagingMarket,
  getstoreListData,
  getUserListData,
};
