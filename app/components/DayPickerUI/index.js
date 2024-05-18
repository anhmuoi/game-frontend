import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import { DateUtils } from 'react-day-picker';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
import Helmet from 'react-helmet';

function parseDate(str, format, locale) {
  const parsed = dateFnsParse(str, format, new Date(), { locale });
  if (DateUtils.isDate(parsed)) {
    return parsed;
  }
  return undefined;
}

function formatDate(date, format, locale) {
  return dateFnsFormat(date, format, { locale });
}

const styles = () => ({
  formControl: {
    // some css style for component
  },
});

export default class DayPickerUI extends Component {
  state = {
    autoFocus: false,
  };

  focus = () => {
    this.setState({
      autoFocus: true,
    });
  };

  unFocus = async () => {
    this.setState({
      autoFocus: false,
    });
  };

  render() {
    const { classes, id, name, label, textHelperError, required } = this.props;

    const trueValue = true;
    const className = classes && classes.formControl;

    return (
      <FormControl
        required={required}
        fullWidth
        className={className || styles.formControl}
        error={textHelperError ? trueValue : false}
      >
        <InputLabel htmlFor={name} shrink>
          {label}
        </InputLabel>
        <DayPickerInput
          {...this.props}
          placeholder={this.props.format || 'yyyy-MM-dd'}
          format={this.props.format || 'yyyy-MM-dd'}
          formatDate={formatDate}
          parseDate={parseDate}
          onDayPickerHide={this.unFocus}
          component={props => (
            <React.Fragment>
              <InputLabel htmlFor={name} shrink>
                {label}
              </InputLabel>
              {
                <Input
                  {...props}
                  inputRef={this.input}
                  autoFocus={this.state.autoFocus}
                  id={id}
                />
              }
            </React.Fragment>
          )}
        />
        {textHelperError ? (
          <FormHelperText id="component-error-text">
            {textHelperError}
          </FormHelperText>
        ) : null}
        <Helmet>
          <style>{`
            .DayPickerInput .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
              background-color: #f0f8ff !important;
              color: #4a90e2;
            }
            .DayPickerInput .DayPicker-Day {
              border-radius: 0 !important;
              border: solid 1px #eee;
            }
            .DayPickerInput .DayPickerInput-Overlay {
              margin-top: 20px;
              width: 555px;
            }
          `}</style>
        </Helmet>
      </FormControl>
    );
  }

  static get propTypes() {
    return {
      classes: PropTypes.object,
      name: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      textHelperError: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string,
        PropTypes.object,
      ]),
      required: PropTypes.bool,
      format: PropTypes.string,
    };
  }
}
