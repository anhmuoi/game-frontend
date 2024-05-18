import React from 'react';
import { mount } from 'enzyme';
import MySnackbarContent from '../MySnackbarContent';

describe('<MySnackbarContent />', () => {
  const onCloseMock = jest.fn();
  const wrapper = mount(
    <MySnackbarContent
      message="some message"
      onClose={onCloseMock}
      variant="success"
    />,
  );
  it('should render SnackbarContent component', () => {
    expect(wrapper.find('SnackbarContent')).toBeDefined();
  });

  it('should call onClose function when click close on snackbars', () => {
    wrapper
      .find('IconButton')
      .at(0)
      .simulate('click');

    expect(onCloseMock).toBeCalled();
  });
});
