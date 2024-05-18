import React from 'react';
import { mount } from 'enzyme';
import SelectDeviceUI from '../index';

describe('<SelectDeviceUI />', () => {
  let wrapper;
  const options = [
    {
      value: 0,
      text: 'value1',
    },
    {
      value: 1,
      text: 'value2',
    },
  ];
  beforeEach(() => {
    wrapper = mount(
      <SelectDeviceUI
        options={options}
        textHelperError={<span>some error happended</span>}
      />,
    );
  });

  it('should render InputLabel', () => {
    expect(wrapper.find('InputLabel')).toHaveLength(1);
  });

  it('should contains Select component', () => {
    expect(wrapper.find('Select')).toHaveLength(1);
  });

  it('should render FormHelperText component', () => {
    expect(wrapper.find('#component-error-text')).toBeDefined();
  });
});
