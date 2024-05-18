import React from 'react';
import { fromJS } from 'immutable';
import { IntlProvider } from 'react-intl';
import { mount } from 'enzyme';
import { mapDispatchToProps, DepartmentPageTest } from '../index';
import DepartmentTableToolbar from '../DepartmentTableToolbar';
import {
  getDepartments,
  deleteDepartment,
  deleteMultiesDepartment,
  changeTextField,
  showModal,
  hideModal,
  hideNotify,
  changePageSizeDepartment,
  changePageNumberDepartment,
  showModelUpdate,
  putDepartmentUpdate,
  postDepartmentAdd,
} from '../actions';

describe('Department Page', () => {
  describe('handle action and render', () => {
    let wrapper;
    const data = [
      {
        id: 1,
        number: '1',
        name: '3S',
        parentDepartment: null,
        isRoot: true,
        editUrl: null,
        deleteUrl: null,
      },
    ];
    const ajaxInfo = fromJS({ value: true, message: '' });
    const trueValue = true;
    const onGetDepartmentsSpy = jest.fn();
    const onChangePageSizeSpy = jest.fn();
    const onChangePageNumberSpy = jest.fn();
    const onDeleteDepartmentSpy = jest.fn();
    const onShowModelUpdateSpy = jest.fn();
    const onDeleteMultiesDepartmentSpy = jest.fn();
    const onAddDepartmentSpy = jest.fn();
    const onUpdateDepartmentSpy = jest.fn();
    const onHideNotify = jest.fn();
    const onShowModalSpy = jest.fn();
    const onHideModalSpy = jest.fn();
    const onChangeTextFieldSpy = jest.fn();
    const onSearchSpy = jest.fn();
    const metaPage = {
      recordsTotal: 1,
      recordsFiltered: 1,
      orderBy: '',
      pageNumber: 1,
      pageSize: 5,
      sortColumn: 0,
      sortDirection: 'desc',
      search: null,
    };
    const departmentModify = fromJS({
      number: { value: '1' },
      name: { value: '3S' },
    });
    const isOpenModal = true;
    beforeEach(() => {
      wrapper = mount(
        <IntlProvider locale="en">
          <DepartmentPageTest
            data={data}
            ajaxInfo={ajaxInfo}
            onGetDepartments={onGetDepartmentsSpy}
            onChangePageSize={onChangePageSizeSpy}
            onDeleteDepartment={onDeleteDepartmentSpy}
            onDeleteMultiesDepartment={onDeleteMultiesDepartmentSpy}
            onChangeTextField={onChangeTextFieldSpy}
            onAddDepartment={onAddDepartmentSpy}
            onUpdateDepartment={onUpdateDepartmentSpy}
            onHideNotify={onHideNotify}
            metaPage={fromJS(metaPage)}
            departmentModify={departmentModify}
            isOpenModal={isOpenModal}
            onShowModal={onShowModalSpy}
            onHideModal={onHideModalSpy}
            onChangePageNumber={onChangePageNumberSpy}
            onShowModelUpdate={onShowModelUpdateSpy}
            onSearch={onSearchSpy}
            refresh={trueValue}
            viewOnly={false}
          />
        </IntlProvider>,
      );
    });

    it('should render one department', () => {
      const numberTr = 2; // first tr in table header and second tr in table body
      expect(wrapper.find('tr')).toHaveLength(numberTr);
    });

    it('should call onDeleteMultiesDepartmentSpy props when press on agree alertDialog(delete user)', () => {
      // click on button agree dialog of tableToobar not table enhance
      const toolbar = wrapper.find(DepartmentTableToolbar).first();
      toolbar.prop('onDeleteMultiesRow')();
      expect(onDeleteMultiesDepartmentSpy).toHaveBeenCalledTimes(1);
    });

    it('should call onDeleteDevice props when call onDeleteRow of EnhancedTable component', () => {
      wrapper.find('EnhancedTable').prop('onDeleteRow')(5);

      expect(onDeleteDepartmentSpy).toBeCalledWith(5);
    });

    it('should call onShowModelUpdateSpy props when call onEditRow of EnhancedTable component', () => {
      wrapper.find('EnhancedTable').prop('onEditRow')(1);
      expect(onShowModelUpdateSpy).toBeCalledWith('1', '3S');
    });

    it('should change departmentsIdSelected when select rows on table', () => {
      const ids = [1, 2, 3];
      wrapper.find('EnhancedTable').prop('rowsSelected')(ids);
      expect(
        wrapper.find('DepartmentPage').state().departmentsIdSelected,
      ).toEqual(ids);
    });

    it('should call onChangeTextField props', () => {
      const text = '3S';
      wrapper.find('InputUI#name').prop('onChange')(text);
      expect(onChangeTextFieldSpy).toBeCalledWith(text);
    });

    it('should change showDialog state when click add button', () => {
      const deleteButton = wrapper.find('button[aria-label="Add"]').first();
      deleteButton.prop('onClick')();

      setTimeout(() => {
        expect(wrapper.instance().state().showDialog).toBe(true);
      });
    });

    it('should call onHideModalSpy when click to cancel button', () => {
      wrapper.find('ModalMaterialUi').at(0).prop('onCloseModal')();
      expect(onHideModalSpy).toBeCalled();
    });

    it('should call onChangePageSizeSpy when click change page', () => {
      wrapper.find('TablePagination').prop('onChangeRowsPerPage')({
        target: { value: 2 },
      });
      expect(onChangePageSizeSpy).toHaveBeenCalled();
    });

    it('should call next page function', () => {
      const pageNumber = 2;
      wrapper.find('button[aria-label="Next Page"]').prop('onClick')(
        pageNumber,
      );
      expect(onChangePageNumberSpy).toHaveBeenCalledWith(pageNumber);
    });

    it('should call onAddDepartment when click ok button', () => {
      wrapper.find('InputUI#name').prop('onChange')('3S');
      wrapper.find('InputUI#number').prop('onChange')('3');
      wrapper.find('button#submit').prop('onClick')();
      expect(onAddDepartmentSpy).toHaveBeenCalledWith({
        name: '3S',
        number: '1',
        parentId: null,
      });
    });

    it('should call onUpdateDepartment when click edit then click ok button', () => {
      wrapper.find('DepartmentPage').setState({ updateId: 1 });
      wrapper.find('InputUI#name').prop('onChange')('3S');
      wrapper.find('InputUI#number').prop('onChange')('3');
      wrapper.find('button#submit').prop('onClick')();
      expect(onUpdateDepartmentSpy).toHaveBeenCalledWith({
        id: 1,
        name: '3S',
        number: '1',
        parentId: null,
      });
    });

    it('should search with keyword 3S', () => {
      wrapper.find('DepartmentTableToolbar').at(0).prop('onSearchDataTable')({
        target: { value: '3S' },
      });
      expect(onGetDepartmentsSpy).toBeCalledWith({
        departmentsIdSelected: [],
        pageNumber: 1,
        pageSize: 5,
        search: '3S',
        searchTxt: '3S',
        sortColumn: 0,
        sortDirection: 'desc',
        updateId: null,
      });
    });

    it('should search with keyword 3S', () => {
      wrapper.setProps({ location: { pathname: 'testUrl2' } });
    });
  });

  describe('mapDispatchToProps', () => {
    describe('onGetDepartments', () => {
      it('should be injected', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        expect(result.onGetDepartments).toBeDefined();
      });

      it('should dispatch getDepartments when called', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        const paging = {};
        result.onGetDepartments(paging);
        expect(dispatch).toHaveBeenCalledWith(getDepartments(paging));
      });
    });

    describe('onDeleteDepartment', () => {
      it('should be injected', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        expect(result.onDeleteDepartment).toBeDefined();
      });

      it('should dispatch deleteDepartment when called', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        const id = 1;
        result.onDeleteDepartment(id);
        expect(dispatch).toHaveBeenCalledWith(deleteDepartment(id));
      });
    });

    describe('onDeleteMultiesDepartment', () => {
      it('should be injected', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        expect(result.onDeleteMultiesDepartment).toBeDefined();
      });

      it('should dispatch `deleteMultiesDepartment` when called', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        const ids = [1];
        result.onDeleteMultiesDepartment(ids);
        expect(dispatch).toHaveBeenCalledWith(deleteMultiesDepartment(ids));
      });
    });

    describe('onAddDepartment', () => {
      it('should be injected', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        expect(result.onAddDepartment).toBeDefined();
      });
      it('should dispatch postDepartmentAdd when called', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        const department = { number: 1, name: '3S' };
        result.onAddDepartment(department);
        expect(dispatch).toHaveBeenCalledWith(postDepartmentAdd(department));
      });
    });

    describe('onUpdateDepartment', () => {
      it('should be injected', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        expect(result.onUpdateDepartment).toBeDefined();
      });
      it('should dispatch putDepartmentUpdate when called', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        const department = { number: 1, name: '3S' };
        result.onUpdateDepartment(department);
        expect(dispatch).toHaveBeenCalledWith(putDepartmentUpdate(department));
      });
    });

    describe('onShowModelUpdate', () => {
      it('should be injected', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        expect(result.onShowModelUpdate).toBeDefined();
      });
      it('should dispatch showModelUpdate when called', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        const number = 1;
        const name = '3S';
        result.onShowModelUpdate(number, name);
        expect(dispatch).toHaveBeenCalledWith(showModelUpdate(number, name));
      });
    });

    describe('onChangePageNumber', () => {
      it('should be injected', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        expect(result.onChangePageNumber).toBeDefined();
      });
      it('should dispatch changePageNumberDepartment when called', () => {
        const dispatch = jest.fn();
        const pageNumber = 5;
        const result = mapDispatchToProps(dispatch);
        result.onChangePageNumber(pageNumber);
        expect(dispatch).toHaveBeenCalledWith(
          changePageNumberDepartment(pageNumber),
        );
      });
    });

    describe('onChangePageSize', () => {
      it('should be injected', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        expect(result.onChangePageSize).toBeDefined();
      });
      it('should dispatch changePageSizeDepartment when called', () => {
        const dispatch = jest.fn();
        const pageSize = 25;
        const result = mapDispatchToProps(dispatch);
        result.onChangePageSize(pageSize);
        expect(dispatch).toHaveBeenCalledWith(
          changePageSizeDepartment(pageSize),
        );
      });
    });

    describe('onHideNotify', () => {
      it('should be injected', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        expect(result.onHideNotify).toBeDefined();
      });
      it('should dispatch hideNotify when called', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        result.onHideNotify();
        expect(dispatch).toHaveBeenCalledWith(hideNotify());
      });
    });

    describe('onShowModal', () => {
      it('should be injected', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        expect(result.onShowModal).toBeDefined();
      });
      it('should dispatch showModal when called', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        result.onShowModal();
        expect(dispatch).toHaveBeenCalledWith(showModal());
      });
    });

    describe('onHideModal', () => {
      it('should be injected', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        expect(result.onHideModal).toBeDefined();
      });
      it('should dispatch hideModal when called', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        result.onHideModal();
        expect(dispatch).toHaveBeenCalledWith(hideModal());
      });
    });

    describe('onChangeTextField', () => {
      it('should be injected', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        expect(result.onChangeTextField).toBeDefined();
      });
      it('should dispatch changeTextField when called', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        const evt = { target: { name: 'number', value: 1 } };
        result.onChangeTextField(evt);
        expect(dispatch).toHaveBeenCalledWith(
          changeTextField(evt.target.name, evt.target.value),
        );
      });
    });
  });
});
