/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectRoomGame = (state) => state.get('roomGame', initialState);

const getRoomGameDataSelector = () =>
  createSelector(selectRoomGame, (roomGameState) => roomGameState.get('data'));

const getstoreListData = () =>
  createSelector(selectRoomGame, (roomGameState) =>
    roomGameState.get('storeList'),
  );

const getRoomGameDataModified = () =>
  createSelector(selectRoomGame, (roomGameState) =>
    roomGameState.get('roomGameModel'),
  );

const getAjaxInfo = () =>
  createSelector(selectRoomGame, (roomGameState) =>
    roomGameState.get('ajaxSuccess'),
  );
const getRidirectInfo = () =>
  createSelector(selectRoomGame, (userState) => userState.get('isRedirect'));

const getMetaPagingRoomGame = () =>
  createSelector(selectRoomGame, (roomGameState) =>
    roomGameState.get('metaPaging'),
  );

export {
  selectRoomGame,
  getRoomGameDataSelector,
  getRoomGameDataModified,
  getAjaxInfo,
  getRidirectInfo,
  getMetaPagingRoomGame,
  getstoreListData,
};
