import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const styles = () => ({
  formControl: {
    // some css style for component
  },
});

class SelectUI extends PureComponent {
  render() {
    const {
      id,
      name,
      label,
      showLabel,
      value,
      options,
      onChange,
      defaultSelect,
      textHelperError,
      required,
      disabled,
      style,
      icon,
      classes,
      onClick,
      disableUnderline,
      open,
    } = this.props;

    const className = classes && classes.formControl;
    const bTrue = true;
    return (
      <FormControl
        required={required}
        fullWidth
        error={textHelperError ? bTrue : false}
        className={className || styles.formControl}
      >
        {showLabel === false ? null : (
          <InputLabel htmlFor={name} shrink>
            {label}
          </InputLabel>
        )}
        <Select
          onClick={onClick}
          style={style}
          disabled={disabled}
          value={value}
          disableUnderline={disableUnderline}
          onChange={onChange}
          open={open}
          className={classes && classes.select}
          input={
            <Input
              name={name}
              id={id}
              value={value}
              className={classes && classes.input}
            />
          }
        >
          {defaultSelect && (
            <MenuItem value="">
              <em>{defaultSelect}</em>
            </MenuItem>
          )}
          {options.map((item) => (
            <MenuItem value={item.id} key={item.id} >
              <Grid style={{display: 'flex'}}>
                {icon ? icon() : null}
                {item.color && icon ? <Grid style={{width: 20, height: 20, backgroundColor: `${item.color}`, borderRadius: 2, marginRight: 10}}></Grid> : null}
                <Typography>{item.name}</Typography>
              </Grid>
            </MenuItem>
          ))}
        </Select>
        {textHelperError ? (
          <FormHelperText id="component-error-text">
            {textHelperError}
          </FormHelperText>
        ) : null}
      </FormControl>
    );
  }

  static get propTypes() {
    return {
      required: PropTypes.bool,
      showLabel: PropTypes.bool,
      disableUnderline: PropTypes.bool,
      name: PropTypes.string,
      id: PropTypes.string,
      icon: PropTypes.any,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
        PropTypes.object,
      ]),
      onChange: PropTypes.func,
      label: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
      textHelperError: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string,
        PropTypes.object,
      ]),
      options: PropTypes.oneOfType([
        PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            name: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
          }),
        ),
        PropTypes.object,
      ]),
      defaultSelect: PropTypes.string,
      disabled: PropTypes.bool,
      open: PropTypes.bool,
      style: PropTypes.object,
      classes: PropTypes.object,
    };
  }
}

export default SelectUI;
