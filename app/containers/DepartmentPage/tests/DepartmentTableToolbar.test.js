import { mount } from 'enzyme';
import React from 'react';
import { IntlProvider } from 'react-intl';
import DepartmentTableToolbar from '../DepartmentTableToolbar';

describe('DepartmentTableToolbar', () => {
  const onDeleteMultiesRowSpy = jest.fn();
  const wrapper = mount(
    <IntlProvider locale="en">
      <DepartmentTableToolbar onDeleteMultiesRow={onDeleteMultiesRowSpy} />
    </IntlProvider>,
  );
  it('should show dialog confirm when click delete button', () => {
    const deleteButton = wrapper
      .find('button[aria-label="DeleteMulties"]')
      .first();
    deleteButton.prop('onClick')();
    expect(wrapper.find('DepartmentTableToolbar').state('showDialog')).toBe(
      true,
    );
    wrapper.update();
  });

  it('should delete multi department', () => {
    wrapper
      .find('AlertDialogSlideUI')
      .at(0)
      .prop('onActionAgree')();
    expect(onDeleteMultiesRowSpy).toBeCalled();
  });

  it('should close dialog', () => {
    wrapper
      .find('AlertDialogSlideUI')
      .at(0)
      .prop('onCloseDialog')();

    expect(wrapper.find('DepartmentTableToolbar').state('showDialog')).toBe(
      false,
    );
  });

  it('should not show title', () => {
    wrapper.find('DepartmentTableToolbar').setState({ windowWidth: 700 });
    wrapper.update();
    expect(wrapper.find('DepartmentTableToolbar').state('windowWidth')).toEqual(
      700,
    );
  });
});
