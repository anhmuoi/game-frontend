import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectDriver = (state) => state.get('driver', initialState);
const getRootFolderId = () => createSelector(selectDriver, (state) => state.get('rootFolderId'));
const getDocument = () => createSelector(selectDriver, (state) => state.get('document'));
const getListLinkFolders = () => createSelector(selectDriver, (state) => state.get('listLinkFolders'));
const getStateUsersShared = () => createSelector(selectDriver, (state) => state.get('usersShared'));
const getStateMetaUsersShared = () => createSelector(selectDriver, (state) => state.get('metaUsersShared'));
const getPermissions = () => createSelector(selectDriver, (state) => state.get('permissions'));
const getStateUsersNotShared = () => createSelector(selectDriver, (state) => state.get('usersNotShared'));
const getStateMetaUsersNotShared = () => createSelector(selectDriver, (state) => state.get('metaUsersNotShared'));

export {
  selectDriver,
  getRootFolderId,
  getDocument,
  getListLinkFolders,
  getStateUsersShared,
  getStateMetaUsersShared,
  getPermissions,
  getStateUsersNotShared,
  getStateMetaUsersNotShared,
};