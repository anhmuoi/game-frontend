import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectDepartment = state => state.get('department', initialState);

const getDepartmentsData = () =>
  createSelector(selectDepartment, departmentState =>
    departmentState.get('data'),
  );

const getMetaDepartment = () =>
  createSelector(selectDepartment, departmentState =>
    departmentState.get('metaDepartment'),
  );

const getAjaxInfo = () =>
  createSelector(selectDepartment, departmentState =>
    departmentState.get('ajaxSuccess'),
  );

const getRefreshInfo = () =>
  createSelector(selectDepartment, departmentState =>
    departmentState.get('refresh'),
  );

const getOpenModal = () =>
  createSelector(selectDepartment, departmentState =>
    departmentState.get('isOpenModal'),
  );

const getLocalDepartment = () =>
  createSelector(selectDepartment, departmentState =>
    departmentState.get('departmentModel'),
  );

const getAccounts = () =>
  createSelector(selectDepartment, departmentState =>
    departmentState.get('accounts'),
  );

const getUserData = () =>
  createSelector(selectDepartment, departmentState =>
    departmentState.get('userData'),
  );

const getUserMeta = () =>
  createSelector(selectDepartment, departmentState =>
    departmentState.get('userMeta'),
  );

const getUserHeader = () =>
  createSelector(selectDepartment, departmentState =>
    departmentState.get('userHeader'),
  );

export {
  getDepartmentsData,
  getMetaDepartment,
  getAjaxInfo,
  getRefreshInfo,
  getOpenModal,
  getLocalDepartment,
  getAccounts,
  getUserData,
  getUserMeta,
  getUserHeader,
};
