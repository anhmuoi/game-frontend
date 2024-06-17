/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectMarket = (state) => state.get('analysis', initialState);

const getMarketDataSelector = () =>
  createSelector(selectMarket, (analysisState) => analysisState.get('data'));

const getstoreListData = () =>
  createSelector(selectMarket, (analysisState) =>
    analysisState.get('storeList'),
  );

const getMarketDataModified = () =>
  createSelector(selectMarket, (analysisState) =>
    analysisState.get('analysisModel'),
  );

const getAjaxInfo = () =>
  createSelector(selectMarket, (analysisState) =>
    analysisState.get('ajaxSuccess'),
  );
const getRidirectInfo = () =>
  createSelector(selectMarket, (userState) => userState.get('isRedirect'));

const getMetaPagingMarket = () =>
  createSelector(selectMarket, (analysisState) =>
    analysisState.get('metaPaging'),
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
