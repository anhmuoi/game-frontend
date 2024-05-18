import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { Checkbox, ListItemText, Divider, Button } from '@material-ui/core';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

const styles = () => ({
  formControl: {
    // some css style for component
  },
});

class MultiSelectUI extends PureComponent {
  handleChange = (evt) => {
    const { onChange, options, id } = this.props;
    if (evt.target.value.includes('selectAll')) {
      const event = {
        ...evt,
        target: {
          ...evt.target,
          value: options.map((item) => item.id),
          type: 'MultiSelect',
          id,
        },
      };
      onChange(event);
    } else if (evt.target.value.includes('unselectAll')) {
      const event = {
        ...evt,
        target: {
          ...evt.target,
          value: [],
          type: 'MultiSelect',
          id,
        },
      };
      onChange(event);
    } else {
      const event = {
        ...evt,
        target: {
          ...evt.target,
          type: 'MultiSelect',
          id,
        },
      };
      onChange(event);
    }
  };
  renderValue = (selected) => {
    const { name, options } = this.props;
    return options
      .filter((opt) => selected.includes(opt.id))
      .map((item, index, array) => (
        <span key={`${name}_${index + 1}`}>
          {item.name}
          {index < array.length - 1 ? ', ' : ''}
        </span>
      ));
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
          renderValue={renderValue || this.renderValue}
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
          {options
            .sort((a, b) => {
              try {
                if (a.id === 0 || b.id === 0) {
                  // eslint-disable-next-line no-nested-ternary
                  return a.id === 0 ? -1 : b.id === 0 ? 1 : 0;
                }
                const firstCharA = a.name.charAt(0).toLowerCase();
                const firstCharB = b.name.charAt(0).toLowerCase();

                if (firstCharA < firstCharB) {
                  return -1;
                }
                if (firstCharA > firstCharB) {
                  return 1;
                }
                return 0;
              } catch (e) {
                return 0;
              }
            })
            .map((item) => (
              <MenuItem key={item.id} value={item.id}>
                <Checkbox
                  id={String(item.id)}
                  checked={value.indexOf(item.id) > -1}
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
      options: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            name: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
          }),
        ),
      ]),
      disabled: PropTypes.bool,
      style: PropTypes.object,
      classes: PropTypes.object,
      renderValue: PropTypes.func,
      MenuProps: PropTypes.object,
    };
  }
}

export default MultiSelectUI;
