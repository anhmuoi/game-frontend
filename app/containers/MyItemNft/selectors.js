/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectMarket = (state) => state.get('myNft', initialState);

const getMarketDataSelector = () =>
  createSelector(selectMarket, (myNftState) => myNftState.get('data'));

const getstoreListData = () =>
  createSelector(selectMarket, (myNftState) => myNftState.get('storeList'));

const getMarketDataModified = () =>
  createSelector(selectMarket, (myNftState) => myNftState.get('myNftModel'));

const getAjaxInfo = () =>
  createSelector(selectMarket, (myNftState) => myNftState.get('ajaxSuccess'));
const getRidirectInfo = () =>
  createSelector(selectMarket, (userState) => userState.get('isRedirect'));

const getMetaPagingMarket = () =>
  createSelector(selectMarket, (myNftState) => myNftState.get('metaPaging'));
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
