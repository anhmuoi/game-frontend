import React from 'react';
import { mount } from 'enzyme';
import SelectUI from '../index';

describe('<SelectUI />', () => {
  let wrapper;
  const options = [
    {
      id: 0,
      name: 'name1',
    },
    {
      id: 2,
      name: 'name2',
    },
  ];
  beforeEach(() => {
    wrapper = mount(
      <SelectUI
        textHelperError={<span>some error happened</span>}
        options={options}
        name="nameSelectUI"
        id="0"
        valueName="valueNameSelectUI"
        value="value"
      />,
    );
  });

  it('should render InputLabel component of material-ui', () => {
    expect(wrapper.find('InputLabel')).toHaveLength(1);
  });

  it('should render Select material-ui component', () => {
    expect(wrapper.find('Select')).toHaveLength(1);
  });

  it('should render FormHelperText component of material-ui', () => {
    expect(wrapper.find('FormHelperText')).toHaveLength(1);
  });

  it('should render Input material-ui component', () => {
    const input = wrapper.find('Input');
    expect(input).toHaveLength(1);
  });
});
