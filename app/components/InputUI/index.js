import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import NumberFormat from 'react-number-format';

import { convertHexString, convertNumber } from 'utils/ime';
import { TextField } from '@material-ui/core';

const styles = () => ({
  formControl: {
    // some css style for component
  },
});

const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(
  props,
  ref,
) {
  const { onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
    />
  );
});

NumberFormatCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

class InputUI extends PureComponent {
  state = {
    oldValue: '',
    changing: false,
    char: '',
    // onKeyDown 에서 selection 정보를 받아 onChange 에서 사용
    selectionStart: 0,
    selectionEnd: 0,
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.isClear) {
      this.setState({
        oldValue: '',
        changing: false,
        char: '',
        selectionStart: 0,
        selectionEnd: 0,
      });
      this.props.onChangeClearVal();
    }
  }
  getValue = () => {
    const { oldValue, char, selectionStart, selectionEnd } = this.state;

    return `${oldValue.substring(0, selectionStart)}${char}${oldValue.substring(
      selectionEnd,
      oldValue.length,
    )}`;
  };

  onChange = (evt) => {
    if (
      (this.props.hexstring || this.props.onlyNum) &&
      this.state.char !== 'Backspace' &&
      this.state.char !== 'Delete'
    ) {
      if (this.state.changing) {
        // 한글 입력 시 버그가 있어 changing 이 true 일 때는 버그를 처리한다
      } else {
        if (evt.nativeEvent.inputType === 'insertFromPaste') {
          this.setState({ oldValue: evt.target.value });
          this.props.onChange(evt);
          return;
        }
        // changing 이 false 면 정상 동작
        const value = this.getValue();
        const newEvt = {
          target: {
            value,
            name: this.props.name,
          },
        };
        this.setState({ oldValue: value, changing: true });
        this.props.onChange(newEvt);
      }
    } else {
      this.setState({ oldValue: evt.target.value });
      this.props.onChange(evt);
    }
  };

  onKeyDown = (evt) => {
    const ctl = document.getElementById(this.props.id);
    this.setState({
      selectionStart: ctl.selectionStart,
      selectionEnd: ctl.selectionEnd,
    });
    if (this.props.hexstring)
      this.setState({ char: convertHexString(evt.nativeEvent) });
    if (this.props.onlyNum)
      this.setState({ char: convertNumber(evt.nativeEvent) });
  };

  onKeyUp = () => {
    if (this.state.char !== '') {
      const ctl = document.getElementById(this.props.name);
      ctl.selectionStart = this.state.selectionStart + 1;
      ctl.selectionEnd = this.state.selectionStart + 1;
    }
    this.setState({ changing: false });
  };

  render() {
    const {
      classes,
      id,
      name,
      value,
      defaultValue,
      label,
      textHelperError,
      textHelper,
      typeInput,
      required,
      multiline,
      rows,
      autoFocus,
      disabled,
      viewOnly,
      InputProps,
      styleLabel,
      onKeyPress,
      notThousandSeparator,
      icon,
    } = this.props;

    const trueValue = true;
    const className = classes && classes.formControl;

    return (
      <React.Fragment>
        <FormControl
          required={required}
          fullWidth
          className={className || styles.formControl}
          error={textHelperError ? trueValue : false}
        >
          {!viewOnly &&
            (typeInput === 'number' && !notThousandSeparator ? (
              <TextField
                label={label}
                id={typeof id === 'object' ? id.value : id}
                name={typeof name === 'object' ? name.value : name}
                value={value}
                onChange={this.onChange}
                autoComplete="off"
                multiline={multiline}
                rows={rows}
                autoFocus={autoFocus}
                disabled={disabled}
                defaultValue={defaultValue}
                onKeyUp={this.onKeyUp}
                onKeyDown={this.onKeyDown}
                onKeyPress={onKeyPress}
                required={required}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  inputComponent: NumberFormatCustom,
                  endAdornment: icon,
                }}
                variant="standard"
                {...InputProps}
              />
            ) : (
              <React.Fragment>
                {label && (
                  <InputLabel htmlFor={name} style={styleLabel} shrink>
                    {label}
                  </InputLabel>
                )}
                <Input
                  id={typeof id === 'object' ? id.value : id}
                  name={typeof name === 'object' ? name.value : name}
                  value={value}
                  onChange={this.onChange}
                  type={typeInput}
                  autoComplete="off"
                  multiline={multiline}
                  rows={rows}
                  autoFocus={autoFocus}
                  disabled={disabled}
                  defaultValue={defaultValue}
                  onKeyUp={this.onKeyUp}
                  onKeyDown={this.onKeyDown}
                  onKeyPress={onKeyPress}
                  {...InputProps}
                  endAdornment={icon}
                  // classes={classes}
                />
              </React.Fragment>
            ))}
          {textHelperError ? (
            <FormHelperText id="component-error-text">
              {textHelperError}
            </FormHelperText>
          ) : null}
          {textHelper ? (
            <FormHelperText id="component-error-text">
              {textHelper}
            </FormHelperText>
          ) : null}
        </FormControl>
        {viewOnly && <Typography>{value}</Typography>}
      </React.Fragment>
    );
  }
  static get propTypes() {
    return {
      classes: PropTypes.object,
      name: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
        PropTypes.object,
      ]),
      defaultValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
        PropTypes.object,
      ]),
      onChange: PropTypes.func,
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      textHelperError: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string,
        PropTypes.object,
      ]),
      typeInput: PropTypes.string,
      required: PropTypes.bool,
      multiline: PropTypes.bool,
      rows: PropTypes.string,
      autoFocus: PropTypes.bool,
      disabled: PropTypes.bool,
      hexstring: PropTypes.bool,
      onlyNum: PropTypes.bool,
      isClear: PropTypes.bool,
      onChangeClearVal: PropTypes.func,
      viewOnly: PropTypes.bool,
      textHelper: PropTypes.any,
      InputProps: PropTypes.any,
      notThousandSeparator: PropTypes.bool,
      icon: PropTypes.any,
      styleLabel: PropTypes.any,
    };
  }
}

export default InputUI;
