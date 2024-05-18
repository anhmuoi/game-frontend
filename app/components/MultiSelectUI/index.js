import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { Checkbox, ListItemText, Button, Divider } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

const styles = () => ({
  formControl: {
    // some css style for component
  },
});

class MultiSelectUI extends PureComponent {
  handleChange = (evt) => {
    const { onChange, options } = this.props;
    if (evt.target.value.includes('selectAll')) {
      const event = {
        ...evt,
        target: {
          ...evt.target,
          value: options.map((item) => item.name),
        },
      };
      onChange(event);
    } else if (evt.target.value.includes('unselectAll')) {
      const event = {
        ...evt,
        target: {
          ...evt.target,
          value: [],
        },
      };
      onChange(event);
    } else {
      onChange(evt);
    }
  };
  render() {
    const {
      id,
      name,
      label,
      value,
      options,
      required,
      disabled,
      style,
      classes,
      renderValue,
      MenuProps,
    } = this.props;

    const className = classes && classes.formControl;

    return (
      <FormControl
        required={required}
        fullWidth
        className={className || styles.formControl}
      >
        <InputLabel htmlFor={name} shrink>
          {label}
        </InputLabel>
        <Select
          style={style}
          disabled={disabled}
          value={value}
          multiple
          onChange={this.handleChange}
          input={<Input name={name} id={id} value={value} />}
          renderValue={renderValue}
          MenuProps={MenuProps}
        >
          {value.length === 0 && (
            <MenuItem key="selectAll" value="selectAll">
              <Button color="primary" variant="outlined">
                <FormattedMessage {...messages.selectAll} />
              </Button>
            </MenuItem>
          )}
          {value.length > 0 && (
            <MenuItem key="unselectAll" value="unselectAll">
              <Button color="primary" variant="outlined">
                <FormattedMessage {...messages.unselectAll} />
              </Button>
            </MenuItem>
          )}
          <Divider />
          {options.map((item) => (
            <MenuItem key={item.id} value={item.name}>
              <Checkbox
                id={item.name}
                checked={value.indexOf(item.name) > -1}
              />
              <ListItemText primary={item.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
  static get propTypes() {
    return {
      required: PropTypes.bool,
      name: PropTypes.string,
      id: PropTypes.string,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
        PropTypes.object,
        PropTypes.array,
      ]),
      onChange: PropTypes.func,
      label: PropTypes.object,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
          name: PropTypes.string,
        }),
      ),
      disabled: PropTypes.bool,
      style: PropTypes.object,
      classes: PropTypes.object,
      renderValue: PropTypes.func,
      MenuProps: PropTypes.object,
    };
  }
}

export default MultiSelectUI;
