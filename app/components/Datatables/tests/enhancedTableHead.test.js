import React from 'react';
import { shallow, mount } from 'enzyme';
import EnhancedTableHead from '../enhancedTableHead';

describe('<enhancedTableHead />', () => {
  const spySnSelectAllClick = jest.fn();
  const spyOnRequestSort = jest.fn();
  const headers = [
    { id: 0, label: '0' },
    { id: 1, label: '1' },
    { id: 2, label: '2' },
    { id: 3, label: '3' },
    { id: 4, label: '4' },
  ];
  describe('check existed of component when render', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = shallow(
        <EnhancedTableHead
          headers={headers}
          classes={{ tableHeader: '' }}
          numSelected={0}
          rowCount={1}
          onSelectAllClick={spySnSelectAllClick}
          order="desc"
          orderBy="0"
          isNotCheckedRow
          onRequestSort={spyOnRequestSort}
        />,
      );
    });

    it('should contains TableHead component of Material-UI', () => {
      expect(wrapper.find('TableHead')).toBeDefined();
    });

    it('should contains TableRow component of Material-UI', () => {
      expect(wrapper.find('TableRow')).toBeDefined();
    });
  });

  describe('check render with condition is props corressponding to', () => {
    const onRequestSort = jest.fn();
    const numSelected = 0;
    const rowCount = 1;
    const wrapper = mount(
      <EnhancedTableHead
        headers={headers}
        classes={{ tableHeader: '' }}
        numSelected={numSelected}
        rowCount={rowCount}
        onSelectAllClick={spySnSelectAllClick}
        order="desc"
        orderBy="0"
        isNotCheckedRow={false}
        onRequestSort={onRequestSort}
      />,
    );

    it('should not render Tooltip with lenght 3', () => {
      expect(wrapper.find('Tooltip').length).toBe(5);
    });

    it('onRequestSort is called when click header table', () => {
      wrapper
        .find('TableSortLabel')
        .at(0)
        .simulate('click');
      expect(onRequestSort).toHaveBeenCalled();
    });

    it('indeterminate attribute of checkbox should return value corresponding to props pass into', () => {
      const expected = numSelected > 0 && numSelected < rowCount;
      expect(wrapper.find('Checkbox').prop('indeterminate')).toEqual(expected);
    });

    it('checkbox should be not checked (numSelected !== rowCount) props', () => {
      const expected = numSelected === rowCount;
      expect(wrapper.find('Checkbox').prop('checked')).toEqual(expected);
    });
  });
});
