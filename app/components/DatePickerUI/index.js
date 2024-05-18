import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import FormHelperText from '@material-ui/core/FormHelperText';
import { DatePicker } from 'material-ui-pickers';
import FormControl from '@material-ui/core/FormControl';
// import Button from '@material-ui/core/Button';

import messages from './messages';
import { getFormatDatePicker } from '../../utils/dateTimeHelper';
import { Tooltip } from '@material-ui/core';

const styles = () => ({
  formControl: {
    // some css style for component
  },
  // cssUnderline: {
  //   '&:after': {
  //     borderBottomColor: purple[500],
  //   },
  // },
});

class DatePickerUI extends PureComponent {
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
      keyboard,
      InputProps,
      KeyboardButtonProps,
      disabled,
      placeholder,
      disablePast,
      tooltip,
    } = this.props;

    const { formatStr, reg } = getFormatDatePicker();
    const className = classes && classes.formControl;
    return (
      <FormControl
        fullWidth
        className={className || styles.formControl}
        error={!!textHelperError}
      >
        {tooltip ? (
          <Tooltip title={tooltip} placement="bottom-start">
            <DatePicker
              keyboard={keyboard === undefined ? true : keyboard}
              name={name}
              id={id}
              label={label}
              required={required}
              showTodayButton
              // maxDateMessage="Date must be less than today"
              value={value}
              onChange={onChange}
              mask={(valueDate) => (valueDate ? reg : [])}
              disableOpenOnEnter
              animateYearScrolling={false}
              format={formatStr}
              placeholder={placeholder || formatStr}
              autoComplete="off"
              fullWidth
              minDate={minDate || new Date(1000, 1, 1)}
              maxDate={maxDate || new Date(9999, 11, 31)}
              okLabel={<FormattedMessage {...messages.okLabel} />}
              cancelLabel={<FormattedMessage {...messages.cancelLabel} />}
              todayLabel={<FormattedMessage {...messages.todayLabel} />}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={InputProps}
              KeyboardButtonProps={KeyboardButtonProps}
              disabled={disabled}
              error={!!textHelperError}
              disablePast={disablePast}
              invalidDateMessage={
                <FormattedMessage {...messages.invalidDateFormat} />
              }
            />
          </Tooltip>
        ) : (
          <DatePicker
            keyboard={keyboard === undefined ? true : keyboard}
            name={name}
            id={id}
            label={label}
            required={required}
            showTodayButton
            // maxDateMessage="Date must be less than today"
            value={value}
            onChange={onChange}
            mask={(valueDate) => (valueDate ? reg : [])}
            disableOpenOnEnter
            animateYearScrolling={false}
            format={formatStr}
            placeholder={placeholder || formatStr}
            autoComplete="off"
            fullWidth
            minDate={minDate || new Date(1000, 1, 1)}
            maxDate={maxDate || new Date(9999, 11, 31)}
            okLabel={<FormattedMessage {...messages.okLabel} />}
            cancelLabel={<FormattedMessage {...messages.cancelLabel} />}
            todayLabel={<FormattedMessage {...messages.todayLabel} />}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={InputProps}
            KeyboardButtonProps={KeyboardButtonProps}
            disabled={disabled}
            error={!!textHelperError}
            disablePast={disablePast}
            invalidDateMessage={
              <FormattedMessage {...messages.invalidDateFormat} />
            }
          />
        )}
        {textHelperError ? (
          <FormHelperText id="component-error-text">
            {textHelperError}
          </FormHelperText>
        ) : null}
      </FormControl>
    );
  }
}

DatePickerUI.propTypes = {
  minDate: PropTypes.object,
  maxDate: PropTypes.object,
  classes: PropTypes.object,
  name: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.object,
  ]),
  tooltip: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.object,
  ]),
  onChange: PropTypes.func,
  label: PropTypes.object,
  textHelperError: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
    PropTypes.string,
  ]),
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  keyboard: PropTypes.bool,
  InputProps: PropTypes.object,
  KeyboardButtonProps: PropTypes.object,
  placeholder: PropTypes.string,
  disablePast: PropTypes.bool,
};

export default DatePickerUI;
