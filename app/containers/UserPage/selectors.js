/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectUser = (state) => state.get('user', initialState);
const selectUserModify = (state) => state.get('userModify', initialState);

const getUserDataSelector = () =>
  createSelector(selectUser, (userState) => userState.get('data'));

const getRolesListData = () =>
  createSelector(selectUser, (userState) => userState.get('roleList'));
const getRolesListModify = () =>
  createSelector(selectUserModify, (userState) => userState.get('roleList'));
const getStatusListModify = () =>
  createSelector(selectUserModify, (userState) => userState.get('statusList'));
const getStatusListData = () =>
  createSelector(selectUser, (userState) => userState.get('statusList'));
const getDepartmentsListModify = () =>
  createSelector(selectUserModify, (userState) =>
    userState.get('departmentsList'),
  );
const getDepartmentsListData = () =>
  createSelector(selectUser, (userState) => userState.get('departmentsList'));
const getGenderListData = () =>
  createSelector(selectUserModify, (userState) => userState.get('genderList'));

const getUserDataModified = () =>
  createSelector(selectUserModify, (userState) => userState.get('userModel'));

const getAjaxInfo = () =>
  createSelector(selectUser, (userState) => userState.get('ajaxSuccess'));
const getRidirectInfo = () =>
  createSelector(selectUserModify, (userState) => userState.get('isRedirect'));

const getMetaPagingUser = () =>
  createSelector(selectUser, (userState) => userState.get('metaPaging'));

export {
  selectUser,
  getUserDataSelector,
  getUserDataModified,
  getAjaxInfo,
  getRidirectInfo,
  getMetaPagingUser,
  getDepartmentsListData,
  getStatusListData,
  getGenderListData,
  getRolesListData,
  getRolesListModify,
  getStatusListModify,
  getDepartmentsListModify,
};
