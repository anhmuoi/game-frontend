import ApiClient from 'utils/axiosClient';
import { isPluginEnabled } from 'utils/plugins';
import { localstoreUtilites } from '../../utils/persistenceData';
import { mapHeadersUiToApi } from '../App/appUtilities';

async function getDepartments({
  search,
  pageNumber,
  // pageSize,
  sortColumn,
  sortDirection,
}) {
  try {
    const res = await ApiClient.get('/departments-tree', {
      params: {
        search,
        pageNumber,
        pageSize: 999999,
        sortColumn,
        sortDirection,
      },
    });
    return res;
  } catch (error) {
    console.log('error', { ...error });
    throw error;
  }
}

async function addDepartment({ name, number, parentId, departmentManagerId }) {
  try {
    const res = await ApiClient.post('/departments', {
      name,
      number,
      parentId,
      departmentManagerId,
    });
    return res;
  } catch (error) {
    console.log('error', { ...error });
    throw error;
  }
}

async function updateDepartment({
  id,
  name,
  number,
  parentId,
  departmentManagerId,
}) {
  try {
    const res = await ApiClient.put(`/departments/${id}`, {
      name,
      number,
      parentId,
      departmentManagerId,
    });
    return res;
  } catch (error) {
    console.log('error', { ...error });
    throw error;
  }
}

async function assignUsersToDepartment({ partmentId, userIds }) {
  try {
    // console.log('userIds');
    // console.log(userIds);

    const res = await ApiClient.post(
      `/departments/${partmentId}/assign`,
      userIds,
    );
    return res;
  } catch (error) {
    console.log('error', { ...error });
    throw error;
  }
}

async function deleteDepartments(ids) {
  try {
    const res = await ApiClient.delete(`/departments?ids=${ids.join('&ids=')}`);
    return res.data;
  } catch (error) {
    console.log('error', { ...error });
    throw error;
  }
}

async function getDepartmentUsers({
  departmentId,
  pageNumber,
  pageSize,
  sortColumn,
  sortDirection,
}) {
  const lang = localstoreUtilites.getLanguageFromLocalStorage();
  try {
    const url = `/departments/${departmentId}/assign`;
    const res = await ApiClient.get(url.concat(`?culture=${lang}`), {
      params: {
        pageNumber,
        pageSize,
        sortColumn,
        sortDirection,
      },
    });
    return res.data;
  } catch (error) {
    console.log('error', { ...error });
    throw error;
  }
}

async function getUsersForAssignToDepartment({
  departmentId,
  pageNumber,
  pageSize,
  sortColumn,
  sortDirection,
}) {
  const lang = localstoreUtilites.getLanguageFromLocalStorage();
  try {
    const url = `departments/${departmentId}/un-assign`;
    const res = await ApiClient.get(url, {
      params: {
        pageNumber,
        pageSize,
        sortColumn,
        sortDirection,
      },
    });
    return res.data;
  } catch (error) {
    console.log('error', { ...error });
    throw error;
  }
}

async function getUsersForAssignToDepartmentSearch({
  search,
  departmentId,
  pageNumber,
  pageSize,
  sortColumn,
  sortDirection,
}) {
  const lang = localstoreUtilites.getLanguageFromLocalStorage();
  try {
    const url = `departments/${departmentId}/un-assign`;

    if (search) {
      // Add 1 second delay if search is provided
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    const res = await ApiClient.get(url, {
      params: {
        name: search,
        pageNumber,
        pageSize,
        sortColumn,
        sortDirection,
      },
    });
    return res.data;
  } catch (error) {
    console.log('error', { ...error });
    throw error;
  }
}

async function getAccounts() {
  try {
    const res = await ApiClient.get(`/users`, {
      params: {
        pageSize: 99999999,
      },
    });
    return res.data;
  } catch (error) {
    console.log('error', { ...error });
    throw error;
  }
}

async function getUserList(meta) {
  const { pageNumber, pageSize, sortColumn, sortDirection, search } = meta;
  const url = '/users';
  try {
    const res = await ApiClient.get(url, {
      params: {
        pageNumber,
        pageSize,
        sortColumn,
        sortDirection,
        search,
        isValid: 0,
      },
    });
    console.log(res);
    return res.data;
  } catch (error) {
    console.log('error', { ...error });
    throw error;
  }
}

async function onPatchHeaderColumns(headers) {
  try {
    const res = await ApiClient.patch('/header', mapHeadersUiToApi(headers));
    return res.data;
  } catch (error) {
    console.log('error', { ...error });
    throw error;
  }
}

export default {
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartments,
  getDepartmentUsers,
  getAccounts,
  assignUsersToDepartment,
  getUsersForAssignToDepartment,
  getUsersForAssignToDepartmentSearch,
  getUserList,
  onPatchHeaderColumns,
};
