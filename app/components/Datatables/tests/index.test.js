import React from 'react';
import { shallow, mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import TableRow from '@material-ui/core/TableRow';

import EnhancedTableHead from '../enhancedTableHead';
import EnhancedTable, { desc } from '../index';

describe('sort function', () => {
  it('should return -1 if b[orderBy] < a[orderBy]', () => {
    const a = [3];
    const b = [2];
    const orderBy = 0;
    expect(desc(a, b, orderBy)).toBe(-1);
  });

  it('should return 1 if b[orderBy] > a[orderBy]', () => {
    const a = [1];
    const b = [2];
    const orderBy = 0;
    expect(desc(a, b, orderBy)).toBe(1);
  });

  it('should return 0 if b[orderBy] = a[orderBy]', () => {
    const a = [1];
    const b = [1];
    const orderBy = 0;
    expect(desc(a, b, orderBy)).toBe(0);
  });
});

describe('<EnhancedTable />', () => {
  describe('check render component', () => {
    const onPagingRemoteSpy = jest.fn();
    const selectRowSpy = jest.fn();

    const data = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];
    const meta = {
      toJS: () => ({
        recordsTotal: 1,
        recordsFiltered: 1,
        sortDirection: 'desc',
        orderBy: '',
        pageNumber: 1,
        pageSize: 5,
      }),
    };
    const onEditRowSpy = jest.fn();
    const wrapper = shallow(
      <EnhancedTable
        meta={meta}
        data={data}
        onPagingRemote={onPagingRemoteSpy}
        rowsSelected={selectRowSpy}
        emptyRows={0}
        onEditRow={onEditRowSpy}
        history={[]}
      />,
    );
    // get through `withStyles` HOC
    const tableWrapper = wrapper.dive();
    const tableHead = tableWrapper.find(EnhancedTableHead).first();
    const rowZero = tableWrapper.find(TableRow).first();

    it('should render AlertDialogSlideUI component', () => {
      expect(wrapper.find('AlertDialogSlideUI')).toBeDefined();
    });

    it('should render Table material-ui component', () => {
      expect(wrapper.find('Table')).toBeDefined();
    });

    it('should render EnhancedTableHead  component', () => {
      expect(wrapper.find('EnhancedTableHead')).toBeDefined();
    });

    it('should render TablePagination  component', () => {
      expect(wrapper.find('TablePagination')).toBeDefined();
    });

    describe('EnhancedTableHead', () => {
      it('should handle onRequestSort', () => {
        const sort = 'asc';
        const property = '';

        tableHead.prop('onRequestSort')(undefined, property);
        expect(tableWrapper.state('sortDirection')).toBe(sort);
        expect(tableWrapper.state('orderBy')).toBe(property);
      });

      it('should handle select all', () => {
        const ids = data.map(row => row.id);
        const fixture = { target: { checked: true } };

        tableHead.prop('onSelectAllClick')(fixture);
        expect(tableWrapper.state('selected')).toEqual(ids);
        expect(selectRowSpy).toHaveBeenLastCalledWith(ids);
      });
    });

    describe('TableRow', () => {
      it('should handle onClick', () => {
        const selected = [];
        const id = 0;
        const expected = selected.concat(id);

        tableWrapper.setState({ selected });
        rowZero.prop('onClick')(undefined, id);
        expect(tableWrapper.state('selected')).toEqual(expected);
        expect(selectRowSpy).toHaveBeenLastCalledWith(expected);
      });

      it('should handle onClick', () => {
        const selected = [0, 1];
        const id = 0;
        const expected = [1];

        tableWrapper.setState({ selected });
        rowZero.prop('onClick')(undefined, id);
        expect(tableWrapper.state('selected')).toEqual(expected);
        expect(selectRowSpy).toHaveBeenLastCalledWith(expected);
      });

      it('should handle onClick', () => {
        const selected = [1, 0];
        const id = 0;
        const expected = [1];

        tableWrapper.setState({ selected });
        rowZero.prop('onClick')(undefined, id);
        expect(tableWrapper.state('selected')).toEqual(expected);
        expect(selectRowSpy).toHaveBeenLastCalledWith(expected);
      });

      it('should handle onClick', () => {
        const selected = [1, 0, 2];
        const id = 0;
        const expected = [1, 2];

        tableWrapper.setState({ selected });
        rowZero.prop('onClick')(undefined, id);
        expect(tableWrapper.state('selected')).toEqual(expected);
        expect(selectRowSpy).toHaveBeenLastCalledWith(expected);
      });

      it('should handle doubleClick', () => {
        rowZero.prop('onDoubleClick')(undefined, {
          id: 0,
          status: '0',
          tzId: 0,
        });
        expect(onEditRowSpy).toBeCalledWith('/0');
      });
    });
  });

  describe('check render full child and handle event', () => {
    let wrapper;
    const meta = {
      toJS: () => ({
        recordsTotal: 1,
        recordsFiltered: 1,
        sortDirection: 'desc',
        orderBy: '',
        pageNumber: 1,
        pageSize: 5,
      }),
    };
    const headers = [
      { id: 0, label: '0' },
      { id: 1, label: '1' },
      { id: 2, label: '2' },
      { id: 3, label: '3' },
      { id: 4, label: '4' },
    ];
    // spy for paging
    const onPagingRemoteSpy = jest.fn();
    /**
     * edit format show modal set isEditShowModal props => true
     * if redirect to new page need setup history props
     */
    const onEditRowSpy = jest.fn(id => id);
    const pushSpy = jest.fn(url => url);
    const history = { push: pushSpy };

    /**
     * spy props change status => e.g: device page use this props
     */
    const onChangeStatusSpy = jest.fn(idDevice => idDevice);
    // spy for delete props
    const onDeleteRowSpy = jest.fn(id => id);
    // spy for slectedAllrow
    const rowsSelectedSpy = jest.fn(ids => ids);

    describe('check render', () => {
      wrapper = mount(
        <IntlProvider locale="en">
          <EnhancedTable
            meta={meta}
            data={[
              { id: 0, status: '0', columnName: 'column1' },
              { id: 1, status: '0', columnName: 'column2' },
              { id: 2, status: '0', columnName: 'column3' },
              { id: 3, status: '0', columnName: 'column4' },
              { id: 4, status: '0', columnName: 'column5' },
              { id: 5, status: '0', columnName: 'column6' },
            ]}
            onDeleteRow={onDeleteRowSpy}
            onChangeStatus={onChangeStatusSpy}
            history={history}
            onPagingRemote={onPagingRemoteSpy}
            emptyRows={0}
            headers={headers}
            onEditRow={onEditRowSpy}
          />
        </IntlProvider>,
      );

      describe('call onActionAgree props on AlertDialogSlideUI component', () => {
        it('should onDeleteRow props when idSelected state exist and typeDialog is defferent "toggleStatus"', () => {
          const state = {
            idSelected: 5,
          };

          wrapper.find('EnhancedTable').setState(state);
          // click agree button
          wrapper.find('AlertDialogSlideUI').prop('onActionAgree')();
          expect(onDeleteRowSpy).toBeCalledWith(state.idSelected);
        });

        it('should call onChangeStatus props when typeDialog state is "toggleStatus" and idToggleStatus exist', () => {
          const state = {
            typeDialog: 'TOGGLE_STATUS',
            idToggleStatus: 10,
          };

          wrapper.find('EnhancedTable').setState(state);
          // click agree button
          wrapper.find('AlertDialogSlideUI').prop('onActionAgree')();
          expect(onChangeStatusSpy).toBeCalledWith(state.idToggleStatus);
        });
      });

      it('should change state when call onChange props of Switch component', () => {
        wrapper
          .find('Switch[title="Change Status"]')
          .at(0)
          .prop('onChange')();

        const stateTable = wrapper.find('EnhancedTable').state();
        expect(stateTable.showDialog).toBe(true);
        expect(stateTable.idToggleStatus).toBe(0);
        expect(stateTable.typeDialog).toBe('TOGGLE_STATUS');
      });

      it('should render 16 button (2: agree and disagree alertDialogUI, 1 prev page, 1: next page, 6 * 2: edit, delete for per rows)', () => {
        expect(wrapper.find('button')).toHaveLength(16); // button row not render due to lack onEditRow, onDeleteRow handler
      });

      it('should render 7 TableRow, (1:header, 6: rows data)', () => {
        expect(wrapper.find('TableRow')).toHaveLength(7);
      });

      it('should render 13 input with type="checkbox" (1: check all, 2 * 6: 1 checkbox for per row, 1 for swich of six rows) ', () => {
        expect(wrapper.find('input[type="checkbox"]')).toHaveLength(13);
      });
    });

    describe('check edit dispaly modal', () => {
      const datas = [
        { id: 0, status: '0', tzId: 0 },
        { id: 1, status: '0', tzId: 0 },
        { id: 2, status: '0', tzId: 2 },
        { id: 3, status: '0', tzId: 1 },
        { id: 4, status: '0', tzId: 0 },
        { id: 5, status: '0', tzId: 0 },
      ];
      const onSelectInlineRow = jest.fn();
      const options = [{ id: 2, name: 'tz1' }, { id: 3, name: 'tz2' }];
      wrapper = mount(
        <IntlProvider locale="en">
          <EnhancedTable
            options={options}
            meta={meta}
            data={datas}
            onDeleteRow={onDeleteRowSpy}
            onChangeStatus={onChangeStatusSpy}
            history={history}
            onPagingRemote={onPagingRemoteSpy}
            emptyRows={0}
            headers={headers}
            onEditRow={onEditRowSpy}
            rowsSelected={rowsSelectedSpy}
            isEditShowModal
            onSelectInlineRow={onSelectInlineRow}
            isModifiedRow
          />
        </IntlProvider>,
      );
      it('should call onSelectInlineRow props when call onChange on SelectUI component', () => {
        const evt = {};
        wrapper
          .find('SelectUI')
          .at(2)
          .prop('onChange')(evt);

        expect(onSelectInlineRow).toBeCalledWith(evt, 2);
      });

      it('click edit button should call onEditRow props', () => {
        // click edit button the first row.
        wrapper
          .find('button[aria-label="Edit"]')
          .at(0)
          .simulate('click');
        expect(onEditRowSpy).toBeCalledWith(0, { id: 0, status: '0', tzId: 0 }); // 0 : id item of the first record
      });
    });

    describe('check event', () => {
      const datas = [
        {
          id: 0,
          status: '0',
          columnName: 'column1',
          columnExcept: 'columnExcept',
        },
        {
          id: 1,
          status: '0',
          columnName: 'column2',
          columnExcept: 'columnExcept',
        },
        {
          id: 2,
          status: '0',
          columnName: 'column3',
          columnExcept: 'columnExcept',
        },
        {
          id: 3,
          status: '0',
          columnName: 'column4',
          columnExcept: 'columnExcept',
        },
        {
          id: 4,
          status: '0',
          columnName: 'column5',
          columnExcept: 'columnExcept',
        },
        {
          id: 5,
          status: '0',
          columnName: 'column6',
          columnExcept: 'columnExcept',
        },
      ];
      // spy for change page number
      const onChangePageNumberSpy = jest.fn(pageNumber => pageNumber);
      // spy for change size per page
      const onChangePageSizeSpy = jest.fn(size => size);
      const onCopySettingDeviceSpy = jest.fn();
      const onReinstallDoorSpy = jest.fn();
      const onSendCurrentTimeSpy = jest.fn();
      const onResetDeviceSpy = jest.fn();
      const onOpenDoor = jest.fn();
      const stopPropagation = jest.fn();

      beforeEach(() => {
        wrapper = mount(
          <IntlProvider locale="en">
            <EnhancedTable
              meta={meta}
              data={datas}
              onDeleteRow={onDeleteRowSpy}
              onChangeStatus={onChangeStatusSpy}
              history={history}
              onPagingRemote={onPagingRemoteSpy}
              emptyRows={0}
              headers={headers}
              onEditRow={onEditRowSpy}
              rowsSelected={rowsSelectedSpy}
              onChangePageNumber={onChangePageNumberSpy}
              onChangePageSize={onChangePageSizeSpy}
              onOpenDoor={onOpenDoor}
              onCopySettingDevice={onCopySettingDeviceSpy}
              onReinstallDoor={onReinstallDoorSpy}
              onSendCurrentTime={onSendCurrentTimeSpy}
              onResetDevice={onResetDeviceSpy}
            />
          </IntlProvider>,
        );
      });

      it('should call onSendCurrentTime props when click open door button', () => {
        wrapper
          .find('Button[aria-label="set-time"]')
          .at(0)
          .prop('onClick')({ stopPropagation });

        expect(onSendCurrentTimeSpy).toBeCalledWith(datas[0].id, datas[0]);
      });

      it('should call onOpenDoor props when click open door button', () => {
        wrapper.setProps({
          children: React.cloneElement(wrapper.props().children, {
            viewOnly: false,
          }),
        });
        wrapper
          .find('Button[aria-label="open-door"]')
          .at(0)
          .prop('onClick')({ stopPropagation });

        expect(onOpenDoor).toBeCalledWith(datas[0].id, datas[0]);
      });

      it('should call onResetDevice props when click open door button', () => {
        wrapper
          .find('Button[aria-label="reset-device"]')
          .at(0)
          .prop('onClick')({ stopPropagation });

        wrapper
          .find('Button[aria-label="alertDialogSlideUI-agree"]')
          .at(0)
          .prop('onClick')();

        expect(onResetDeviceSpy).toBeCalledWith(datas[0].id);
      });

      it('should call onCopySettingDevice props when click copy setting', () => {
        wrapper
          .find('Button[aria-label="copy-setting"]')
          .at(0)
          .prop('onClick')();
        expect(onCopySettingDeviceSpy).toBeCalledWith(datas[0].id);
      });

      it('should call onReinstallDoor props when click reinstall', () => {
        wrapper
          .find('Button[aria-label="reinstall-door"]')
          .at(0)
          .prop('onClick')();

        wrapper
          .find('Button[aria-label="alertDialogSlideUI-agree"]')
          .at(0)
          .prop('onClick')();

        expect(onReinstallDoorSpy).toBeCalledWith(datas[0].id);
      });

      it('should not render action if view data only', () => {
        wrapper.setProps({
          children: React.cloneElement(wrapper.props().children, {
            viewOnly: true,
          }),
        });
        expect(wrapper.find('Button[aria-label="open-door"]')).toHaveLength(0);
      });

      it('should render correct number of column, 4 column: 1 checkbox, 1: status, 1: columnName, 1: cell for action(edit, delete, switch) ', () => {
        const cellNumberPerFirstRow = wrapper
          .find('TableRow')
          .at(1)
          .find('TableCell');
        expect(cellNumberPerFirstRow).toHaveLength(4);
      });

      it('click edit button should call push method of history props', () => {
        // click edit button the first row.
        wrapper
          .find('button[aria-label="Edit"]')
          .at(0)
          .simulate('click');
        expect(pushSpy).toBeCalledWith(onEditRowSpy('/0')); // 0 : id item of the first record
      });

      it('click delete button on per row should show dialog, change state', () => {
        // button on the first row
        wrapper
          .find('button[aria-label="Delete"]')
          .at(0)
          .simulate('click');

        wrapper.setState({
          showDialog: true,
          idSelected: 0,
          typeDialog: 'deleteRow',
        });

        expect(wrapper.state().showDialog).toBe(true);
        expect(wrapper.state().idSelected).toBe(0); // id item the first row
        expect(wrapper.state().typeDialog).toBe('deleteRow');
      });

      it('click toggle button (switch) on per row should show dialog, change state', () => {
        // switch on the first row
        wrapper
          .find('input[type="checkbox"]')
          .at(1)
          .simulate('change');

        const idRecordItem = 0;
        wrapper.setState({
          showDialog: true,
          idToggleStatus: 0,
          typeDialog: 'TOGGLE_STATUS',
        });

        expect(wrapper.state().showDialog).toBe(true);
        expect(wrapper.state().idToggleStatus).toBe(idRecordItem); // id item the first row
        expect(wrapper.state().typeDialog).toBe('TOGGLE_STATUS');
      });

      describe('click agree on dialog', () => {
        it('should handle action corresponding to delete sigle record (typeDialog: deleteRow) ', () => {
          // id first item
          const idSelected = 0;
          // state after click button delete on row
          wrapper.setState({
            showDialog: true,
            typeDialog: 'deleteRow',
            idSelected,
          });
          wrapper
            .find('button')
            .at(1)
            .simulate('click');
          expect(onDeleteRowSpy).not.toBeCalledWith(idSelected);
        });

        it('should hanlde action corresponding to change status (typeDialog: toggleStatus)', () => {
          // id first item
          const idToggleStatus = 0;
          // state after click button delete on row
          wrapper.setState({
            showDialog: true,
            idToggleStatus,
            typeDialog: 'TOGGLE_STATUS',
          });
          // simulate click on button agree
          wrapper
            .find('button')
            .at(1)
            .simulate('click');

          expect(onChangeStatusSpy).not.toBeCalledWith(idToggleStatus);
        });

        it('click check all rowsSelected props should be called with array id if checked is true', () => {
          const idsArrayExpected = datas.map(n => n.id);
          wrapper
            .find('input[type="checkbox"]')
            .at(0)
            .simulate('change', { target: { checked: true } });

          expect(rowsSelectedSpy).toBeCalledWith(idsArrayExpected);
        });

        it('click check all rowsSelected props should be called with empty array if checked is false', () => {
          const idsArrayExpected = [];
          wrapper
            .find('input[type="checkbox"]')
            .at(0)
            .simulate('change', { target: { checked: false } });

          expect(rowsSelectedSpy).toBeCalledWith(idsArrayExpected);
        });

        it('click row should call rowsSelected props', () => {
          wrapper
            .find('tr[role="checkbox"]')
            .at(0)
            .simulate('click');

          expect(rowsSelectedSpy).toBeCalled();
        });

        it('should call onPagingRemote when click next page', () => {
          /**
           * due to onclick on child not propagate when using simulate()
           * => prop('onClick')() replace for simulate()
           */
          wrapper.find('button[aria-label="Next Page"]').prop('onClick')();
          expect(onPagingRemoteSpy).toBeCalled();
          expect(onChangePageNumberSpy).toBeCalled();
        });

        it('should call onPagingRemote when chaneg page size', () => {
          wrapper.find('SelectInput').prop('onChange')({
            target: { value: 10 },
          });
          expect(onPagingRemoteSpy).toBeCalled();
          expect(onChangePageSizeSpy).toBeCalled();
        });
      });
    });
  });
});
