import {
  getDepartments,
  changePageNumberDepartment,
  deleteMultiesDepartmentSucces,
  fetchDepartmentsSuccess,
  changePageSizeDepartment,
  setMetaPagingDepartment,
  deleteDepartment,
  addDepartmentSuccess,
  postDepartmentAdd,
  putDepartmentUpdate,
  invalidModel,
  deleteDepartmentSuccess,
  deleteMultiesDepartment,
  updateDepartmentSuccess,
} from '../actions';
import {
  GET_DEPARTMENT,
  SET_DEPARTMENT_SUCCESS,
  SET_META_DEPARTMENT,
  CHANGE_PAGE_NUMBER_DEPARTMENT,
  CHANGE_PAGE_SIZE_DEPARTMENT,
  DELETE_DEPARTMENT_ROW,
  ADD_DEPARTMENT_SUCCESS,
  DELETE_DEPARTMENT_SUCCESS,
  VALIDATE_DEPARTMENT_ERROR,
  UPDATE_DEPARTMENT_SUCCESS,
  DELETE_MULTIES_DEPARTMENT_SUCCESS,
  DELETE_MULTIES_DEPARTMENT,
  ADD_DEPARTMENT,
  UPDATE_DEPARTMENT,
} from '../constants';

describe('actions unit test', () => {
  it('should return the correct type and paging setting', () => {
    const paging = {
      recordsTotal: 1,
      recordsFiltered: 1,
      sortDirection: 'desc',
      orderBy: '',
      pageNumber: 1,
      pageSize: 5,
      sortColumn: 0,
    };
    const expectedResult = {
      type: GET_DEPARTMENT,
      paging,
    };
    expect(getDepartments(paging)).toEqual(expectedResult);
  });

  it('should return the correct type and the data that fetch from api', () => {
    const data = [
      {
        id: 1,
        number: '1',
        name: 'Duali',
        parentDepartment: null,
        isRoot: true,
        editUrl: null,
        deleteUrl: null,
      },
    ];
    const expectedResult = {
      type: SET_DEPARTMENT_SUCCESS,
      data,
    };
    expect(fetchDepartmentsSuccess(data)).toEqual(expectedResult);
  });

  it('should return the correct type and the meta that fetch from api', () => {
    const meta = { recordsTotal: 1, recordsFiltered: 1 };
    const expectedResult = {
      type: SET_META_DEPARTMENT,
      meta,
    };
    expect(setMetaPagingDepartment(meta)).toEqual(expectedResult);
  });

  it('should return the correct type and page number', () => {
    const pageNumber = 3;
    const expectedResult = {
      type: CHANGE_PAGE_NUMBER_DEPARTMENT,
      pageNumber,
    };
    expect(changePageNumberDepartment(pageNumber)).toEqual(expectedResult);
  });

  it('should return the correct type and page number', () => {
    const pageSize = 25;
    const expectedResult = {
      type: CHANGE_PAGE_SIZE_DEPARTMENT,
      pageSize,
    };
    expect(changePageSizeDepartment(pageSize)).toEqual(expectedResult);
  });
  it('should return the correct type and department id to delete', () => {
    const id = 1;
    const expectedResult = {
      type: DELETE_DEPARTMENT_ROW,
      id,
    };
    expect(deleteDepartment(id)).toEqual(expectedResult);
  });
  it('should return the correct type and validation error', () => {
    const errors = 'Not connect';
    const expectedResult = {
      type: VALIDATE_DEPARTMENT_ERROR,
      errors,
    };
    expect(invalidModel(errors)).toEqual(expectedResult);
  });
  it('should return the correct type and success infomation', () => {
    const message = 'Create success';
    const expectedResult = {
      type: ADD_DEPARTMENT_SUCCESS,
      message,
    };
    expect(addDepartmentSuccess(message)).toEqual(expectedResult);
  });

  it('should return the correct type and success infomation', () => {
    const message = 'update success';
    const expectedResult = {
      type: UPDATE_DEPARTMENT_SUCCESS,
      message,
    };
    expect(updateDepartmentSuccess(message)).toEqual(expectedResult);
  });

  it('should return the correct type and department', () => {
    const department = {
      id: 2,
      number: '2',
      name: '3S',
      parentDepartment: null,
      isRoot: true,
      editUrl: null,
      deleteUrl: null,
    };
    const expectedResult = {
      type: ADD_DEPARTMENT,
      department,
    };
    expect(postDepartmentAdd(department)).toEqual(expectedResult);
  });

  it('should return the correct type and department', () => {
    const department = {
      id: 2,
      number: '2',
      name: '3S',
      parentDepartment: null,
      isRoot: true,
      editUrl: null,
      deleteUrl: null,
    };
    const expectedResult = {
      type: UPDATE_DEPARTMENT,
      department,
    };
    expect(putDepartmentUpdate(department)).toEqual(expectedResult);
  });

  it('should return the correct type and department', () => {
    const message = 'Deleted';
    const id = 2;
    const expectedResult = {
      type: DELETE_DEPARTMENT_SUCCESS,
      message,
      id,
    };
    expect(deleteDepartmentSuccess(message, id)).toEqual(expectedResult);
  });

  it('should return the correct type and department', () => {
    const ids = ['3'];
    const expectedResult = {
      type: DELETE_MULTIES_DEPARTMENT,
      ids,
    };
    expect(deleteMultiesDepartment(ids)).toEqual(expectedResult);
  });

  it('should return the correct type and department', () => {
    const ids = ['2', '3'];
    const message = 'deleted';
    const expectedResult = {
      type: DELETE_MULTIES_DEPARTMENT_SUCCESS,
      message,
      ids,
    };
    expect(deleteMultiesDepartmentSucces(message, ids)).toEqual(expectedResult);
  });
});
