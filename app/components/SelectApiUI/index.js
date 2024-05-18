import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const styles = () => ({
  formControl: {
    // some css style for component
  },
});

class SelectDeviceUI extends PureComponent {
  render() {
    const {
      id,
      name,
      label,
      value,
      options,
      classes,
      required,
      onChange,
      valueName,
      defaultSelect,
      textHelperError,
      disabled,
      fullWidth,
    } = this.props;

    return (
      <FormControl
        required={required}
        fullWidth={!fullWidth}
        error={textHelperError}
        className={classes.formControl}
      >
        <InputLabel htmlFor={name}>{label}</InputLabel>
        <Select
          value={(value && value.toString()) || ''}
          onChange={onChange}
          input={<Input name={name} id={id} value={valueName} />}
          disabled={disabled}
        >
          {defaultSelect && (
            <MenuItem value="">
              <em>{defaultSelect}</em>
            </MenuItem>
          )}
          {options.map((item) => (
            <MenuItem value={item.value} key={item.value}>
              {item.text}
            </MenuItem>
          ))}
        </Select>
        {textHelperError && (
          <FormHelperText id="component-error-text">
            {textHelperError}
          </FormHelperText>
        )}
      </FormControl>
    );
  }
}

SelectDeviceUI.propTypes = {
  fullWidth: PropTypes.bool,
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
  textHelperError: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.object,
  ]),
  options: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  required: PropTypes.bool,
  defaultSelect: PropTypes.string,
  valueName: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
};

export default withStyles(styles)(SelectDeviceUI);
