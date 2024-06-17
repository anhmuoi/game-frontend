/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectMarket = (state) => state.get('rank', initialState);

const getMarketDataSelector = () =>
  createSelector(selectMarket, (rankState) => rankState.get('data'));

const getstoreListData = () =>
  createSelector(selectMarket, (rankState) => rankState.get('storeList'));

const getMarketDataModified = () =>
  createSelector(selectMarket, (rankState) => rankState.get('rankModel'));

const getAjaxInfo = () =>
  createSelector(selectMarket, (rankState) => rankState.get('ajaxSuccess'));
const getRidirectInfo = () =>
  createSelector(selectMarket, (userState) => userState.get('isRedirect'));

const getMetaPagingMarket = () =>
  createSelector(selectMarket, (rankState) => rankState.get('metaPaging'));
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
