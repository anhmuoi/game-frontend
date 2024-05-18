import React from 'react';
import { mount } from 'enzyme';
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';
import DatePickerUI from '../index';

const utilsToUse = new DateFnsUtils();
describe('<DatePickerUI />', () => {
  const onChangeMock = jest.fn();
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = mount(
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePickerUI
          value={utilsToUse.date('2018-01-01T00:00:00.000Z')}
          onChange={onChangeMock}
          textHelperError={<span>some error</span>}
        />
      </MuiPickersUtilsProvider>,
    );
  });

  it('should call onChange props when input', () => {
    wrapper.find(DatePicker).prop('onChange')();

    expect(onChangeMock).toBeCalled();
  });

  it('render FormControl', () => {
    expect(wrapper.find('FormControl')).toBeDefined();
  });

  it('render DatePicker', () => {
    expect(wrapper.find('DatePicker')).toBeDefined();
  });

  it('render FormHelperText', () => {
    expect(wrapper.find('FormHelperText')).toBeDefined();
  });

  it('should render FormHelperText', () => {
    expect(wrapper.find('FormHelperText')).toBeDefined();
  });
});
