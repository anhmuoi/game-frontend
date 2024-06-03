/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectRoomDetail = (state) => state.get('roomDetail', initialState);

const getRoomDetailDataSelector = () =>
  createSelector(selectRoomDetail, (roomDetailState) =>
    roomDetailState.get('data'),
  );

const getstoreListData = () =>
  createSelector(selectRoomDetail, (roomDetailState) =>
    roomDetailState.get('storeList'),
  );

const getUserListData = () =>
  createSelector(selectRoomDetail, (roomDetailState) =>
    roomDetailState.get('userList'),
  );

const getRoomDetailDataModified = () =>
  createSelector(selectRoomDetail, (roomDetailState) =>
    roomDetailState.get('roomDetailModel'),
  );

const getAjaxInfo = () =>
  createSelector(selectRoomDetail, (roomDetailState) =>
    roomDetailState.get('ajaxSuccess'),
  );
const getRidirectInfo = () =>
  createSelector(selectRoomDetail, (userState) => userState.get('isRedirect'));

const getMetaPagingRoomDetail = () =>
  createSelector(selectRoomDetail, (roomDetailState) =>
    roomDetailState.get('metaPaging'),
  );
const getMeetingLogsDetailSelector = () =>
  createSelector(selectRoomDetail, (roomDetailState) =>
    roomDetailState.get('meetingLogDetail'),
  );

export {
  selectRoomDetail,
  getRoomDetailDataSelector,
  getRoomDetailDataModified,
  getAjaxInfo,
  getRidirectInfo,
  getMetaPagingRoomDetail,
  getstoreListData,
  getUserListData,
  getMeetingLogsDetailSelector,
};
