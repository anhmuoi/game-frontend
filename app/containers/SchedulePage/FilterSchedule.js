import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';
import Select from 'react-select';
import { Grid, Button, Typography, Checkbox } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import CancelIcon from '@material-ui/icons/Cancel';

import InputUI from 'components/InputUI';
import ModalMaterialUi from 'components/Modal';
import SelectUI from 'components/SelectUI';
import DateTimePickerUI from 'components/DateTimePickerUI';
import MultiSelectUI from 'components/MultiSelectUI/MultiSelect';

import SearchUI from '../../components/SearchUI/index.js';
import messages from './messages';
import { SCHEDULE_TYPES } from './constants.js';

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function MultiValue(props) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
}

function Menu(props) {
  console.log(props);
  return (
    <Paper square {...props.innerProps} >
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  ValueContainer,
};



class FilterSchedule extends Component {
  state = {
    checkedItems: [0,1],
    multiAccounts: null,
    multiDepartments: null,
    checkedPublic: false,
    checkedPrivate: false,
    checkedDepartment: false,
  };
  handleChange = name => value => {
    this.setState({
      [name]: value,
    });
    this.props.onChangeFilter(value.map(item => item.value))
  };
  handleChangeDepartment = name => value => {
    this.setState({
      [name]: value,
    });
    this.props.onChangeDepartments(value.map(item => item.value))
  };
  onChangeFilter = (name, value) => {
    this.setState({
      [name]: value,
    });
  };
  handleChangeCheckbox = (itemId) => {
    this.setState(prevState => {
      const isChecked = prevState.checkedItems.includes(itemId);
      const updatedCheckedItems = isChecked
        ? prevState.checkedItems.filter(item => item !== itemId)
        : [...prevState.checkedItems, itemId];

      this.props.onChangeCheckbox(updatedCheckedItems)
      return { checkedItems: updatedCheckedItems };
    });
  };
  handleChangeCheckboxPublic = () => {
    this.setState({ 
      checkedPublic: !this.state.checkedPublic, 
    })
    if (!this.state.checkedPublic === false) {
      this.props.onChangeFilter([]);
      this.setState({ multiAccounts: null })
    }
  }
  handleChangeCheckboxPrivate = () => {
    this.setState({ 
      checkedPrivate: !this.state.checkedPrivate,
    })
    if (!this.state.checkedPrivate === true) {
      this.props.onChangePrivate([SCHEDULE_TYPES.PRIVATE])
    }
    else{
      this.props.onChangePrivate([])
    }
  }
  handleChangeCheckboxDepartment = () => {
    this.setState({ 
      checkedDepartment: !this.state.checkedDepartment,
    })
  }

  render() {
    const { 
      classes, 
      accountFilter, 
      accountListSelector, 
      departmentListSelector, 
      categoryTypesCheck, 
    } = this.props;
    const { 
      checkedItems, 
      multiAccounts,
      multiDepartments,
      checkedPublic,
      checkedPrivate,
      checkedDepartment,
    } = this.state;
    
    const optionsFilterAccount = accountListSelector.map(account => ({ value: account.id, label: account.name }));
    const optionsFilterDepartment = departmentListSelector.map(department => ({ value: department.id, label: department.name }));

    return (
      <Grid container xs={12} sm={12}>
        <Grid item xs={12} sm={12} className={classes.filterCreatedBy}>
            <Grid item md={2} style={{ width: '100%', maxWidth: 'none', display:'flex', justifyContent:'space-around', maxHeight:'35px'}}>
              {categoryTypesCheck.map(item => (
                <Grid key={item.id} style={{ width: '50%' }}>
                  <Checkbox
                    style={{padding: '0px 12px 0px 0px'}}
                    checked={checkedItems.includes(item.id)}
                    onChange={() => this.handleChangeCheckbox(item.id)}
                  />
                  {item.id === 1 ? <FormattedMessage {...messages.titleHoliday}/> : <FormattedMessage {...messages.titleTable}/>}
                </Grid>
              ))}
            </Grid>
            <Grid item md={2} style={{ width: '100%', maxWidth: 'none', display:'flex', justifyContent:'space-around', maxHeight:'35px'}}>
                <Grid style={{ width: '50%' }}>
                  <Checkbox
                    style={{padding: '0px 12px 0px 0px'}}
                    checked={checkedPublic}
                    onChange={() => this.handleChangeCheckboxPublic()}
                  />
                  <FormattedMessage {...messages.titlePublic}/>
                </Grid>
                <Grid style={{ width: '50%' }}>
                  <Checkbox
                    style={{padding: '0px 12px 0px 0px'}}
                    checked={checkedPrivate}
                    onChange={() => this.handleChangeCheckboxPrivate()}
                  />
                  <FormattedMessage {...messages.titlePrivate}/>
                </Grid>
                
            </Grid>
            <Grid item md={2} style={{ width: '100%', maxWidth: 'none', display:'flex', justifyContent:'space-around', maxHeight:'35px'}}>
                <Grid >
                  <Checkbox
                    style={{padding: '0px 12px 0px 0px'}}
                    checked={checkedDepartment}
                    onChange={() => this.handleChangeCheckboxDepartment()}
                  />
                  <FormattedMessage {...messages.titleDepartment}/>
                </Grid>
            </Grid>
            
            {checkedPublic && <Grid item md={2} style={{ width: '96%', maxWidth: 'none', marginBottom: '10px' }}>
              <Select
                classes={classes}
                textFieldProps={{
                  label: <FormattedMessage {...messages.accountList} />,
                  InputLabelProps: {
                    shrink: true,
                  },
                }}
                options={optionsFilterAccount}
                components={components}
                value={multiAccounts}
                onChange={this.handleChange('multiAccounts')}
                placeholder={<FormattedMessage {...messages.searchAccounts} />}
                isMulti
              />
            </Grid>}
            {checkedDepartment && <Grid item md={2} style={{ width: '96%', maxWidth: 'none' }}>
              <Select
                classes={classes}
                textFieldProps={{
                  label: <FormattedMessage {...messages.departmentList} />,
                  InputLabelProps: {
                    shrink: true,
                  },
                }}
                options={optionsFilterDepartment}
                components={components}
                value={multiDepartments}
                onChange={this.handleChangeDepartment('multiDepartments')}
                placeholder={<FormattedMessage {...messages.searchDepartments} />}
                isMulti
              />
            </Grid>}
            
        </Grid>
      </Grid>
    );
  }
}

FilterSchedule.propTypes = {
  // PropTypes
  classes: PropTypes.object,
  onChangeFilter: PropTypes.func,
  onChangePrivate: PropTypes.func,
  accountFilter: PropTypes.array,
  accountListSelector: PropTypes.array,
  onChangeCheckbox: PropTypes.func,
  categoryTypesCheck: PropTypes.array,
  categoryTypesFilter: PropTypes.array,
  departmentListSelector: PropTypes.array,
  departmentFilter: PropTypes.array,
  onChangeDepartments: PropTypes.func
};

export default FilterSchedule;
