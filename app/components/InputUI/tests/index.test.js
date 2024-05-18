import React from 'react';
import { mount, shallow } from 'enzyme';
import InputUI from '../index';

describe('<InputUI />', () => {
  const textHelperError = 'some error happend';
  const wrapper = shallow(<InputUI textHelperError={textHelperError} />);

  it('should contains FormControl material-ui react component', () => {
    expect(wrapper.find('FormControl')).toBeDefined();
  });

  it('should contains Input material-ui react component', () => {
    expect(wrapper.find('Input')).toBeDefined();
  });

  it('should contains textHelperError pass into', () => {
    const wrapperDeep = mount(<InputUI textHelperError={textHelperError} />);
    expect(wrapperDeep.contains(textHelperError)).toBe(true);
  });

  it('should call onChange when enter data into Input component', () => {
    const spy = jest.fn();
    const wrapperFn = mount(<InputUI onChange={spy} id="input-id" />);
    wrapperFn
      .find('input#input-id')
      .simulate('change', { target: { value: '123' } });
    expect(spy).toHaveBeenCalled();
  });
});
