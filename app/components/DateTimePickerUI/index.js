import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import FormHelperText from '@material-ui/core/FormHelperText';
import { DateTimePicker } from 'material-ui-pickers';
import FormControl from '@material-ui/core/FormControl';
import messages from './messages';
import { getFormatDateTimePicker } from '../../utils/dateTimeHelper';

const styles = () => ({
  formControl: {
    // some css style for component
  },
});

class DateTimePickerUI extends PureComponent {
  render() {
    const {
      id,
      name,
      value,
      label,
      classes,
      required,
      onChange,
      textHelperError,
      minDate,
      maxDate,
      disabled,
    } = this.props;

    const { formatStr, reg } = getFormatDateTimePicker();
    const trueValue = true;
    const className = classes && classes.formControl;

    return (
      <FormControl
        fullWidth
        className={className || styles.formControl}
        error={textHelperError ? trueValue : false}
      >
        <DateTimePicker
          keyboard
          name={name}
          id={id}
          label={label}
          required={required}
          // maxDateMessage="Date must be less than today"
          value={value}
          onChange={onChange}
          mask={(valueDate) => (valueDate ? reg : [])}
          disabled={disabled}
          animateYearScrolling={false}
          format={formatStr}
          placeholder={formatStr}
          autoComplete="off"
          fullWidth
          minDate={minDate || new Date(1000, 1, 1)}
          maxDate={maxDate || new Date(9999, 11, 31)}
          okLabel={<FormattedMessage {...messages.okLabel} />}
          cancelLabel={<FormattedMessage {...messages.cancelLabel} />}
          todayLabel={<FormattedMessage {...messages.todayLabel} />}
        />
        {textHelperError ? (
          <FormHelperText id="component-error-text">
            {textHelperError}
          </FormHelperText>
        ) : null}
      </FormControl>
    );
  }
}

DateTimePickerUI.propTypes = {
  minDate: PropTypes.object,
  maxDate: PropTypes.object,
  classes: PropTypes.object.isRequired,
  name: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.object,
  ]),
  onChange: PropTypes.func,
  label: PropTypes.object,
  textHelperError: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  error: PropTypes.bool,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default DateTimePickerUI;
