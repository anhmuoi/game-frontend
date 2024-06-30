/* eslint-disable indent */
/* eslint-disable no-lonely-if */
/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Button,
  Paper,
  Grid,
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Checkbox,
  FormControlLabel,
  Tooltip,
} from '@material-ui/core';
// import HelpIcon from '@material-ui/icons/Help';
import SaveIcon from '@material-ui/icons/Save';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import classNames from 'classnames';
import messages from './messages';

export class Permissions extends Component {
  state = {
    expanded: [],
  };

  componentWillUnmount() {
    //
  }

  handleExpansion = (panel) => (event, expanded) => {
    const newArr = [...this.state.expanded];
    if (expanded) {
      if (!newArr.includes(panel)) newArr.push(panel);
    } else {
      const index = newArr.indexOf(panel);
      if (index > -1) {
        newArr.splice(index, 1);
      }
    }
    this.setState({
      expanded: newArr,
    });
  };

  changeEnabled = (evt) => {
    const { roleModel } = this.props;
    const permissionData = roleModel.permissionGroups.value;
    const splitString = evt.target.name.split('_');
    const orgGroupName = splitString[0];
    const permissionName = splitString[1];
    let groupName = orgGroupName;
    if (orgGroupName === 'Time attendance report') {
      groupName = 'Attendance';
    } else if (orgGroupName === 'Visit management') {
      groupName = 'Visit';
    }
    const newData = permissionData.map((group) => {
      const crudList =
        groupName === 'Attendance' || groupName === 'Visit'
          ? [
              'View'.concat(groupName),
              'Add'.concat(groupName),
              'Edit'.concat(groupName),
              'Delete'.concat(groupName),
            ]
          : [
              'View'.concat(group.title),
              'Add'.concat(group.title),
              'Edit'.concat(group.title),
              'Delete'.concat(group.title),
            ];
      if (group.groupName === orgGroupName) {
        const newPerm = group.permissions.map((perm) => {
          if (perm.title === permissionName) {
            return {
              ...perm,
              isEnabled: !perm.isEnabled,
            };
          }
          return perm;
        });
        for (let i = 0; i < group.permissions.length; i += 1) {
          if (crudList.includes(permissionName) > 0) {
            const viewPermission = newPerm.find(
              (obj) => obj.title === crudList[0],
            );
            const addPermission = newPerm.find(
              (obj) => obj.title === crudList[1],
            );
            const editPermission = newPerm.find(
              (obj) => obj.title === crudList[2],
            );
            const deletePermission = newPerm.find(
              (obj) => obj.title === crudList[3],
            );
            switch (permissionName) {
              case crudList[0]:
                // View
                if (!viewPermission.isEnabled) {
                  if (addPermission) {
                    addPermission.isEnabled = false;
                  }
                  if (editPermission) {
                    editPermission.isEnabled = false;
                  }
                  if (deletePermission) {
                    deletePermission.isEnabled = false;
                  }
                }
                break;
              case crudList[1]:
                // Add
                if (addPermission.isEnabled) {
                  if (viewPermission) {
                    viewPermission.isEnabled = true;
                  }
                } else {
                  // true -> false
                  if (editPermission) {
                    editPermission.isEnabled = false;
                  }
                  if (deletePermission) {
                    deletePermission.isEnabled = false;
                  }
                }
                break;
              case crudList[2]:
                // Edit
                if (editPermission.isEnabled) {
                  // false -> true
                  if (viewPermission) {
                    viewPermission.isEnabled = true;
                  }
                  if (addPermission) {
                    addPermission.isEnabled = true;
                  }
                } else {
                  // true -> false
                  if (deletePermission) {
                    deletePermission.isEnabled = false;
                  }
                }
                break;
              case crudList[3]:
                // Delete
                if (deletePermission.isEnabled) {
                  // false -> true
                  if (viewPermission) {
                    viewPermission.isEnabled = true;
                  }
                  if (addPermission) {
                    addPermission.isEnabled = true;
                  }
                  if (editPermission) {
                    editPermission.isEnabled = true;
                  }
                } else {
                  // true -> false
                }
                break;
              default:
                break;
            }
          } else {
            const viewPermission = newPerm.find(
              (obj) => obj.title === crudList[0],
            );
            const clickedPerm = newPerm.find(
              (obj) => obj.title === permissionName,
            );
            if (clickedPerm.isEnabled) {
              // false -> true
              if (viewPermission) {
                viewPermission.isEnabled = true;
              }
            }
          }
        }
        return { ...group, permissions: newPerm };
      }
      return group;
    });

    this.props.onChangePermissionEnabled(newData);
  };

  savePermission = () => {
    this.props.onSavePermissionData();
    this.setState({ expanded: [] });
  };

  renderPermission = (isDefault, permission) => {
    const { expanded } = this.state;
    const { classes } = this.props;
    return (
      <Grid
        id={permission.groupName}
        key={permission.title}
        item
        xs={10}
        sm={10}
        md={10}
        style={{ margin: '0 auto' }}
      >
        <ExpansionPanel
          className={classes.panel}
          expanded={expanded.includes(permission.title)}
          onChange={this.handleExpansion(permission.title)}
        >
          <ExpansionPanelSummary
            className={classes.permission}
            expandIcon={<ExpandMoreIcon nativeColor="white" />}
          >
            <Typography className={classes.heading}>
              {permission.title === 'Department'
                ? permission.groupName.replace('Department', 'Group')
                : permission.groupName}
            </Typography>
          </ExpansionPanelSummary>
          {permission.permissions.map(
            (perm) =>
              perm.permissionName && (
                <ExpansionPanelDetails
                  key={perm.permissionName}
                  style={{ padding: '0 0 0 10px' }}
                >
                  <Tooltip
                    title={
                      permission.title.includes('Department')
                        ? perm.description
                            .replace('department', 'Group')
                            .replace('department', 'Group')
                        : perm.description
                    }
                    placement="right-end"
                    style={{
                      alignSelf: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          id={perm.title}
                          name={`${permission.groupName}_${perm.title}`}
                          checked={perm.isEnabled}
                          value={String(perm.isEnabled)}
                          onChange={this.changeEnabled}
                          disabled={isDefault}
                        />
                      }
                      label={
                        permission.title.includes('Department')
                          ? perm.permissionName
                              .replace('department', 'Group')
                              .replace('department', 'Group')
                          : perm.permissionName
                      }
                    />
                  </Tooltip>
                  {/* <FormControlLabel
              control={
                <Checkbox
                  name={`${permission.groupName}_${perm.title}`}
                  checked={perm.isEnabled}
                  onChange={this.changeEnabled}
                />
              }
              label={perm.permissionName}
            />
            <Tooltip
              title={perm.description}
              style={{ alignSelf: 'center', cursor: 'pointer' }}
            >
              <HelpIcon color="primary" />
            </Tooltip> */}
                </ExpansionPanelDetails>
              ),
          )}
        </ExpansionPanel>
      </Grid>
    );
  };

  render() {
    const { classes, roleModel, onEnableDepartmentLevel } = this.props;
    const permissionData = roleModel.permissionGroups.value;
    const isDefault = roleModel.isDefault.value;

    return (
      <Paper className={`${classes.center} ${classes.permissionListPaper}`}>
        {/* Permission Lists */}
        <Grid container>
          {/* <Grid item xs={12} sm={12} md={12}>
            <Tooltip
              title={
                <FormattedMessage {...messages.enableDepartmentLevelTooltip} />
              }
            >
              <FormControlLabel
                control={
                  <Checkbox
                    id="enableDepartmentLevel"
                    name="enableDepartmentLevel"
                    checked={enableDepartmentLevel}
                    onChange={evt =>
                      onEnableDepartmentLevel(evt.target.checked)
                    }
                  />
                }
                label={<FormattedMessage {...messages.enableDepartmentLevel} />}
              />
            </Tooltip>
          </Grid> */}
          <Grid item xs={6} sm={6} md={6} id="leftSide">
            {permissionData.map(
              (permission, index) =>
                permission.title === 'DashBoard' &&
                this.renderPermission(isDefault, permission),
            )}
            {permissionData.map(
              (permission, index) =>
                permission.title === 'Account' &&
                this.renderPermission(isDefault, permission),
            )}
            {permissionData.map(
              (permission, index) =>
                permission.title === 'Notice' &&
                this.renderPermission(isDefault, permission),
            )}
            {permissionData.map(
              (permission, index) =>
                permission.title === 'Store' &&
                this.renderPermission(isDefault, permission),
            )}

            {permissionData.map(
              (permission, index) =>
                permission.title === 'User' &&
                this.renderPermission(isDefault, permission),
            )}

            {permissionData.map(
              (permission, index) =>
                permission.title === 'Prepaid' &&
                this.renderPermission(isDefault, permission),
            )}
            {permissionData.map(
              (permission, index) =>
                permission.title === 'PrepaidSetting' &&
                this.renderPermission(isDefault, permission),
            )}
          </Grid>
          <Grid item xs={6} sm={6} md={6} id="rightSide">
            {permissionData.map(
              (permission, index) =>
                permission.title === 'Member' &&
                this.renderPermission(isDefault, permission),
            )}
            {permissionData.map(
              (permission, index) =>
                permission.title === 'MemberBadge' &&
                this.renderPermission(isDefault, permission),
            )}
            {permissionData.map(
              (permission, index) =>
                permission.title === 'MembershipSetting' &&
                this.renderPermission(isDefault, permission),
            )}

            {permissionData.map(
              (permission, index) =>
                permission.title === 'Coupon' &&
                this.renderPermission(isDefault, permission),
            )}
            {permissionData.map(
              (permission, index) =>
                permission.title === 'MarketingSetting' &&
                this.renderPermission(isDefault, permission),
            )}
            {permissionData.map(
              (permission, index) =>
                permission.title === 'Waiting' &&
                this.renderPermission(isDefault, permission),
            )}
            {permissionData.map(
              (permission, index) =>
                permission.title === 'Department' &&
                this.renderPermission(isDefault, permission),
            )}
          </Grid>
        </Grid>
        {/* Buttons */}
        {!isDefault && (
          <Grid item xs={12} sm={12} md={12} style={{ margin: '0 auto' }}>
            <Button
              className={classes.button}
              color="primary"
              variant="contained"
              onClick={this.savePermission}
            >
              <SaveIcon
                className={classNames(classes.rightIcon, classes.iconSmall)}
              />
              <FormattedMessage {...messages.save} />
            </Button>
          </Grid>
        )}
      </Paper>
    );
  }
}

Permissions.propTypes = {
  // propTypes
  classes: PropTypes.object,
  roleModel: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onChangePermissionEnabled: PropTypes.func,
  onSavePermissionData: PropTypes.func,
  onEnableDepartmentLevel: PropTypes.func,
};

export default Permissions;
