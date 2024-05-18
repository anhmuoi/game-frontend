import { fromJS } from 'immutable';
import departmentReducer, { initialState } from '../reducer';
import {
  changePageNumberDepartment,
  getDepartments,
  fetchDepartmentsSuccess,
  setMetaPagingDepartment,
  deleteMultiesDepartmentSucces,
  changePageSizeDepartment,
  invalidModel,
  changeTextField,
  hideModal,
  showModal,
  showModelUpdate,
  refreshPage,
  hideNotify,
  deleteDepartmentSuccess,
} from '../actions';
import { mergeMetaPaging } from '../../App/appUtilities';
import { mergeState } from '../departmentUtilities';

describe('department reducer testing', () => {
  let state;
  beforeEach(() => {
    state = initialState;
  });

  it('should handle setMetaPagingDepartment action when call api paging have meta', () => {
    const meta = {
      recordsTotal: 10,
      recordsFiltered: 6,
    };
    const expectedResult = state.set(
      'metaDepartment',
      fromJS(mergeMetaPaging(state.toJS().metaDepartment, meta)),
    );

    expect(departmentReducer(state, setMetaPagingDepartment(meta))).toEqual(
      expectedResult,
    );
  });

  it('should return initial state by default', () => {
    expect(departmentReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle getDepartments action when init page', () => {
    const expectedResult = state;
    expect(departmentReducer(state, getDepartments())).toEqual(expectedResult);
  });

  it('should handle fetchDepartmentsSuccess action when fetch departments success', () => {
    const data = [
      {
        id: 1,
        number: 1,
        name: 'Duali',
        parentDepartment: null,
        isRoot: true,
        editUrl: null,
        deleteUrl: null,
      },
    ];
    const expectedResult = state.set('data', data);
    expect(departmentReducer(state, fetchDepartmentsSuccess(data))).toEqual(
      expectedResult,
    );
  });

  it('should handle setMetaPagingDepartment action when fetch departments success', () => {
    const meta = { recordsTotal: 1000, recordsFiltered: 25 };
    const expectedResult = fromJS({
      data: [],
      ajaxSuccess: { value: false, message: '' },
      metaDepartment: {
        recordsTotal: 1000,
        recordsFiltered: 25,
        orderBy: '',
        pageNumber: 1,
        pageSize: 5,
        sortColumn: 0,
        sortDirection: 'desc',
        search: null,
      },
      refresh: false,
      isOpenModal: false,
      departmentModel: {
        number: { value: '', errorMessage: false },
        name: { value: '', errorMessage: false },
      },
    });

    expect(departmentReducer(state, setMetaPagingDepartment(meta))).toEqual(
      expectedResult,
    );
  });

  it('should handle deleteMultiesDepartmentSucces action when deleted multi department', () => {
    const expectedResult = fromJS({
      data: [],
      metaDepartment: {
        recordsTotal: 1,
        recordsFiltered: 1,
        sortDirection: 'desc',
        orderBy: '',
        pageNumber: 1,
        pageSize: 5,
        sortColumn: 0,
      },
      ajaxSuccess: {
        value: true,
        message: 'deleted success',
      },
    });

    const testState = fromJS({
      data: [],
      metaDepartment: {
        recordsTotal: 1,
        recordsFiltered: 1,
        sortDirection: 'desc',
        orderBy: '',
        pageNumber: 1,
        pageSize: 5,
        sortColumn: 0,
      },
    });
    expect(
      departmentReducer(
        testState,
        deleteMultiesDepartmentSucces('deleted success', [2, 3]),
      ),
    ).toEqual(expectedResult);
  });

  it('should handle  changePageNumberDepartment action when change page', () => {
    const pageNumber = 2;
    const expectedResult = state.setIn(
      ['metaDepartment', 'pageNumber'],
      pageNumber,
    );
    expect(
      departmentReducer(state, changePageNumberDepartment(pageNumber)),
    ).toEqual(expectedResult);
  });

  it('should handle  invalidModel action when change page', () => {
    const errors = [
      {
        field: 'name',
        message: 'Department Name already exists in the system',
      },
    ];
    const expectedResult = state.set(
      'departmentModel',
      fromJS(mergeState(state.toJS().departmentModel, errors)),
    );
    expect(departmentReducer(state, invalidModel(errors))).toEqual(
      expectedResult,
    );
  });

  it('should handle changePageSizeDepartment action when change page size', () => {
    const pageSize = 25;
    const expectedResult = state.setIn(
      ['metaDepartment', 'pageSize'],
      pageSize,
    );
    expect(
      departmentReducer(state, changePageSizeDepartment(pageSize)),
    ).toEqual(expectedResult);
  });

  it('should handle deleteDepartmentSuccess action', () => {
    const action = { message: 'Delete multiple department successfully' };
    const expectedResult = state.set(
      'ajaxSuccess',
      fromJS({ value: true, message: action.message }),
    );
    expect(
      departmentReducer(state, deleteDepartmentSuccess(action.message)),
    ).toEqual(expectedResult);
  });

  it('should handle hideNotify action', () => {
    const expectedResult = state.set(
      'ajaxSuccess',
      fromJS({ value: false, message: '' }),
    );
    expect(departmentReducer(state, hideNotify())).toEqual(expectedResult);
  });

  it('should handle refreshPage action after update, add department', () => {
    const expectedResult = state.set('refresh', true);
    expect(departmentReducer(state, refreshPage())).toEqual(expectedResult);
  });

  it('should handle showModal action when close dialog', () => {
    const expectedResult = state
      .setIn(['departmentModel', 'number'], {
        value: '',
        errorMessage: false,
      })
      .setIn(['departmentModel', 'name'], {
        value: '',
        errorMessage: false,
      })
      .set('isOpenModal', true);
    expect(departmentReducer(state, showModal())).toEqual(expectedResult);
  });

  it('should handle showModelUpdate action when update department', () => {
    const action = {
      number: 1,
      name: '3S',
    };
    const expectedResult = state
      .setIn(['departmentModel', 'number'], {
        value: action.number,
        errorMessage: false,
      })
      .setIn(['departmentModel', 'name'], {
        value: action.name,
        errorMessage: false,
      })
      .set('isOpenModal', true);
    expect(
      departmentReducer(state, showModelUpdate(action.number, action.name)),
    ).toEqual(expectedResult);
  });

  it('should handle hideModal action when close dialog', () => {
    const expectedResult = state.set('isOpenModal', false);
    expect(departmentReducer(state, hideModal())).toEqual(expectedResult);
  });

  it('should handle changeTextField action when change text in dialog', () => {
    const action = { name: 'number', value: 3 };
    const expectedResult = state.setIn(['departmentModel', action.name], {
      value: action.value,
      errorMessage: false,
    });
    expect(
      departmentReducer(state, changeTextField(action.name, action.value)),
    ).toEqual(expectedResult);
  });
});
