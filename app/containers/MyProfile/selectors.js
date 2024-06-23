/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectMyProfile = (state) => state.get('myProfile', initialState);
const selectMyProfileModify = (state) =>
  state.get('myProfileModify', initialState);

const getMyProfileDataSelector = () =>
  createSelector(selectMyProfile, (myProfileState) =>
    myProfileState.get('data'),
  );

const getRolesListData = () =>
  createSelector(selectMyProfile, (myProfileState) =>
    myProfileState.get('roleList'),
  );
const getRolesListModify = () =>
  createSelector(selectMyProfileModify, (myProfileState) =>
    myProfileState.get('roleList'),
  );
const getStatusListModify = () =>
  createSelector(selectMyProfileModify, (myProfileState) =>
    myProfileState.get('statusList'),
  );
const getStatusListData = () =>
  createSelector(selectMyProfile, (myProfileState) =>
    myProfileState.get('statusList'),
  );
const getDepartmentsListModify = () =>
  createSelector(selectMyProfileModify, (myProfileState) =>
    myProfileState.get('departmentsList'),
  );
const getDepartmentsListData = () =>
  createSelector(selectMyProfile, (myProfileState) =>
    myProfileState.get('departmentsList'),
  );
const getGenderListData = () =>
  createSelector(selectMyProfileModify, (myProfileState) =>
    myProfileState.get('genderList'),
  );

const getMyProfileDataModified = () =>
  createSelector(selectMyProfileModify, (myProfileState) =>
    myProfileState.get('myProfileModel'),
  );

const getAjaxInfo = () =>
  createSelector(selectMyProfileModify, (myProfileState) =>
    myProfileState.get('ajaxSuccess'),
  );
const getRidirectInfo = () =>
  createSelector(selectMyProfileModify, (myProfileState) =>
    myProfileState.get('isRedirect'),
  );

const getMetaPagingMyProfile = () =>
  createSelector(selectMyProfile, (myProfileState) =>
    myProfileState.get('metaPaging'),
  );

export {
  selectMyProfile,
  getMyProfileDataSelector,
  getMyProfileDataModified,
  getAjaxInfo,
  getRidirectInfo,
  getMetaPagingMyProfile,
  getDepartmentsListData,
  getStatusListData,
  getGenderListData,
  getRolesListData,
  getRolesListModify,
  getStatusListModify,
  getDepartmentsListModify,
};
