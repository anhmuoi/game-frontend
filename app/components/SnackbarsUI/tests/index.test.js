import React from 'react';
import { mount } from 'enzyme';
import SnackbarsUI from '../index';

describe('<SnackbarsUI />', () => {
  let wrapper;
  const closeSpy = jest.fn();
  beforeEach(() => {
    wrapper = mount(
      <SnackbarsUI
        onClose={closeSpy}
        variant="success"
        message="some mesage"
      />,
    );
  });

  it('should render SnackbarsUI material-ui component', () => {
    expect(wrapper.find('SnackbarsUI')).toBeDefined();
  });

  it('should render MySnackbarContentWrapper components', () => {
    expect(wrapper.find('MySnackbarContentWrapper')).toBeDefined();
  });
});
