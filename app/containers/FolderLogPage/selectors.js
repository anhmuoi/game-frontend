import { createSelector } from 'reselect';
import { initialState } from './reducer';

export const selectFolderLog = (state) => state.get('folderLog', initialState);

export const makeGrouModelSelector = () =>
  createSelector(selectFolderLog, (state) => state.get('groupModel'));

export const makeGroupDataSelector = () =>
  createSelector(selectFolderLog, (state) => state.get('groupData'));

export const makeAjaxInfoSelector = () =>
  createSelector(selectFolderLog, (state) => state.get('ajaxSuccess'));

export const makeGroupPagingSelector = () =>
  createSelector(selectFolderLog, (state) => state.get('groupPaging'));

export const makeCurrentGroupIdSelector = () =>
  createSelector(selectFolderLog, (state) => state.get('currentGroupId'));
export const getFolderSelectedSelector = () =>
  createSelector(selectFolderLog, (state) => state.get('folderSelect'));
export const getAccountListSelector = () =>
  createSelector(selectFolderLog, (state) => state.get('accountList'));
export const getSearchDataSelector = () =>
  createSelector(selectFolderLog, (state) => state.get('searchData'));

// work log
export const workLogDetailSelector = () =>
  createSelector(selectFolderLog, (state) => state.get('workLogModel'));
export const getMetaPagingWorkLog = () =>
  createSelector(selectFolderLog, (state) => state.get('metaPagingWorkLog'));
export const workLogDataSelector = () =>
  createSelector(selectFolderLog, (state) => state.get('workLogData'));
export const userDataSelector = () =>
  createSelector(selectFolderLog, (state) => state.get('userData'));

// meeting
export const meetingDetailSelector = () =>
  createSelector(selectFolderLog, (state) => state.get('meetingModel'));
