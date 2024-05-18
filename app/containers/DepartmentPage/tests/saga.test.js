import { URL_DOMAIN } from 'utils/constants';
import request, { option } from 'utils/request';
import { takeLatest, call, put } from 'redux-saga/effects';
import { loadSuccess, fetchApiError } from 'containers/App/actions';
import departmentDatas, {
  getDepartments,
  postDepartmentAdd,
  deleteDepartment,
  deleteMultiesDepartment,
  updateDepartment,
  getURL,
  mapIdsToQueryString,
} from '../saga';
import {
  GET_DEPARTMENT,
  ADD_DEPARTMENT,
  DELETE_DEPARTMENT_ROW,
  DELETE_MULTIES_DEPARTMENT,
  UPDATE_DEPARTMENT,
} from '../constants';
import { initialState } from '../reducer';
import {
  fetchDepartmentsSuccess,
  setMetaPagingDepartment,
  addDepartmentSuccess,
  deleteMultiesDepartmentSucces,
  refreshPage,
  deleteDepartmentSuccess,
  updateDepartmentSuccess,
  hideModal,
} from '../actions';

describe('fetch data from server', () => {
  const paging = initialState.get('metaDepartment');
  const action = {};
  action.paging = paging;
  const generator = getDepartments(action);
  const getDepartmentURL = getURL(paging, null);
  generator.next();
  const res = { data: [], meta: {} };
  it('fetch data', () => {
    expect(generator.next().value).toEqual(
      call(request, getDepartmentURL, option('GET')),
    );
  });

  it('put fetchDepartmentsSuccess action when get data success', () => {
    // skip delay
    generator.next(res);
    expect(generator.next(res).value).toEqual(
      put(fetchDepartmentsSuccess(res.data)),
    );
  });

  it('put setMetaPagingDepartment to change meta in state', () => {
    expect(generator.next(res.meta).value).toEqual(
      put(setMetaPagingDepartment(res.meta)),
    );
  });

  it('put loadSuccess action to notify to user', () => {
    expect(generator.next().value).toEqual(put(loadSuccess()));
  });
});

describe('fetch data from server without internet', () => {
  const paging = initialState.get('metaDepartment');
  const action = {};
  action.paging = paging;
  const generator = getDepartments(action);
  generator.next();

  it('put fetchApiError action to notify to user', () => {
    generator.next();
    const res = { statusCode: 500, message: 'server error' };
    expect(generator.next(res).value).toEqual(
      put(fetchApiError({ message: res.message })),
    );
  });
});

describe('add department', () => {
  const urlAddDepartment = `${URL_DOMAIN}/departments`;
  const action = {};
  action.department = {
    id: 1,
    number: '1',
    name: 'Duali',
    parentDepartment: null,
    isRoot: true,
    editUrl: null,
    deleteUrl: null,
  };
  const generator = postDepartmentAdd(action);
  it('call api to add department', () => {
    expect(generator.next().value).toEqual(
      call(request, urlAddDepartment, option('POST', action.department)),
    );
  });
  const res = { message: 'add success' };
  it('should put a success notify', () => {
    expect(generator.next(res).value).toEqual(
      put(addDepartmentSuccess(res.message)),
    );
  });
  it('should hide modal', () => {
    expect(generator.next(res).value).toEqual(put(hideModal()));
  });
  it('should refresh page', () => {
    expect(generator.next(res).value).toEqual(put(refreshPage()));
  });
});

describe('deleteDepartment', () => {
  const action = { id: 3 };
  const generator = deleteDepartment({ id: 3 });
  const urlDeleteDepartment = `${URL_DOMAIN}/departments/${action.id}`;
  const res = { statusCode: 200, message: 'Delete department successfully.' };

  it('delete department', () => {
    expect(generator.next().value).toEqual(
      call(request, urlDeleteDepartment, option('DELETE')),
    );
  });

  it('should call deleteDepartmentSuccess action to delete', () => {
    expect(generator.next(res).value).toEqual(
      put(deleteDepartmentSuccess(res.message, action.id)),
    );
  });

  it('refresh page', () => {
    generator.next(res);
    expect(generator.next(res).value).toEqual(put(refreshPage()));
  });
});

describe('deleteDepartment failures', () => {
  const res = { message: 'error', statusCode: 404 };
  const generator = deleteDepartment({ id: 3 });
  it('should put fetchApiError action to show error', () => {
    generator.next();
    const error = { message: 'error' };
    expect(generator.next(res).value).toEqual(put(fetchApiError(error)));
  });
});

describe('deleteMultiesDepartment', () => {
  const action = { ids: [1, 2, 3] };
  const urlDeleteMutltiesDepartment = `${URL_DOMAIN}/departments?${mapIdsToQueryString(
    action.ids,
  )}`;
  const generator = deleteMultiesDepartment(action);

  it('should call to api to delete multi department', () => {
    expect(generator.next().value).toEqual(
      call(request, urlDeleteMutltiesDepartment, option('DELETE')),
    );
  });

  const res = { message: 'delete succes' };

  it('should delete multi department in front end', () => {
    expect(generator.next(res).value).toEqual(
      put(deleteMultiesDepartmentSucces(res.message, action.ids)),
    );
  });

  it('should reload page', () => {
    expect(generator.next(res).value).toEqual(put(refreshPage()));
  });
});

describe('deleteMultiesDepartment error case', () => {
  const action = { ids: [1, 2, 3] };
  const generator = deleteMultiesDepartment(action);
  generator.next();
  const res = { message: 'error', statusCode: 404 };
  const error = { message: 'error' };
  it('should return call fetchApiError action to show error', () => {
    expect(generator.next(res).value).toEqual(put(fetchApiError(error)));
  });
});

describe('update department', () => {
  const action = { department: { id: 3 } };
  const generator = updateDepartment(action);
  it('should call api to update department', () => {
    expect(generator.next().value).toEqual(
      call(
        request,
        `${URL_DOMAIN}/departments/${action.department.id}`,
        option('PUT', action.department),
      ),
    );
  });
  const res = { errors: 'update success', statusCode: 200 };
  it('should return call updateDepartmentSuccess action to show error', () => {
    expect(generator.next(res).value).toEqual(
      put(updateDepartmentSuccess(res.message)),
    );
  });
  it('should hide model', () => {
    expect(generator.next(res).value).toEqual(put(hideModal()));
  });
  it('should refresh page', () => {
    expect(generator.next(res).value).toEqual(put(refreshPage()));
  });
});

describe('watcher Saga', () => {
  const generator = departmentDatas();
  it('should start task to watch for GET_DEPARTMENT action', () => {
    expect(generator.next().value).toEqual(
      takeLatest(GET_DEPARTMENT, getDepartments),
    );
  });

  it('should start task to watch for ADD_DEPARTMENT action', () => {
    expect(generator.next().value).toEqual(
      takeLatest(ADD_DEPARTMENT, postDepartmentAdd),
    );
  });
  it('should start task to watch for DELETE_DEPARTMENT_ROW action', () => {
    expect(generator.next().value).toEqual(
      takeLatest(DELETE_DEPARTMENT_ROW, deleteDepartment),
    );
  });
  it('should start task to watch for DELETE_MULTIES_DEPARTMENT action', () => {
    expect(generator.next().value).toEqual(
      takeLatest(DELETE_MULTIES_DEPARTMENT, deleteMultiesDepartment),
    );
  });
  it('should start task to watch for UPDATE_DEPARTMENT action', () => {
    expect(generator.next().value).toEqual(
      takeLatest(UPDATE_DEPARTMENT, updateDepartment),
    );
  });
});
