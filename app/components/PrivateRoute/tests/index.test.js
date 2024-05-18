import React from 'react';
import { shallow } from 'enzyme';
import { PrivateRoute } from '../index';

describe('<PrivateRoute />', () => {
  it('should render MasterPage component', () => {
    const enqueueSnackbar = jest.fn();
    const wrapper = shallow(
      <PrivateRoute title={{}} auth enqueueSnackbar={enqueueSnackbar} />,
    );
    expect(wrapper.find('MasterPage')).toBeDefined();
  });

  it('should render Redirect component', () => {
    const enqueueSnackbar = jest.fn();
    const wrapper = shallow(
      <PrivateRoute title={{}} auth enqueueSnackbar={enqueueSnackbar} />,
    );
    expect(wrapper.find('Redirect')).toBeDefined();
  });

  it('should render Redirect component', () => {
    const enqueueSnackbar = jest.fn();
    const wrapper = shallow(
      <PrivateRoute title={{}} enqueueSnackbar={enqueueSnackbar} />,
    );
    expect(wrapper.find('Redirect')).toBeDefined();
  });
});
