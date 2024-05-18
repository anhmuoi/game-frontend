import { fromJS } from 'immutable';
import {
  getDepartmentsData,
  getMetaDepartment,
  getAjaxInfo,
  getRefreshInfo,
  getOpenModal,
  getLocalDepartment,
} from '../selectors';

import { initialState } from '../reducer';

describe('Test department selector', () => {
  const state = fromJS(initialState);

  it('should select department data', () => {
    const testGetData = getDepartmentsData();
    const data = fromJS([]);
    expect(testGetData(state)).toEqual(data);
  });

  it('should select department meta', () => {
    const testGetMeta = getMetaDepartment();
    const meta = fromJS({
      recordsTotal: 1,
      recordsFiltered: 1,
      sortDirection: 'desc',
      orderBy: '',
      pageNumber: 1,
      pageSize: 5,
      sortColumn: 0,
      search: null,
    });
    expect(testGetMeta(state)).toEqual(meta);
  });

  it('should select Ajax Infomation', () => {
    const testGetAjaxInfo = getAjaxInfo();
    const ajaxInfo = fromJS({ value: false, message: '' });
    expect(testGetAjaxInfo(state)).toEqual(ajaxInfo);
  });

  it('should select Ajax Infomation', () => {
    const testGetRefreshInfo = getRefreshInfo();
    const refreshInfo = false;
    expect(testGetRefreshInfo(state)).toEqual(refreshInfo);
  });

  it('should select Ajax Infomation', () => {
    const testGetOpenModalo = getOpenModal();
    const isOpenModal = false;
    expect(testGetOpenModalo(state)).toEqual(isOpenModal);
  });

  it('should select departmentModel', () => {
    const localDepartment = getLocalDepartment();
    const stateDepartment = fromJS({
      number: { value: '', errorMessage: false },
      name: { value: '', errorMessage: false },
    });
    expect(localDepartment(state)).toEqual(stateDepartment);
  });
});
