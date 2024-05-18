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

  enablePermission = (permission, enable) => {
    if (permission && permission.isEnabled !== undefined)
      permission.isEnabled = enable;
  };

  checkReportPerm = (currentPerm, newPerm) => {
    if (newPerm.length > 0) {
      const viewPermission = newPerm.find((obj) => obj.title === 'ViewReport');
      const viewAllPermission = newPerm.find(
        (obj) => obj.title === 'ViewAllReport',
      );
      switch (currentPerm) {
        case 'ViewReport':
          if (!viewPermission.isEnabled) {
            this.enablePermission(viewAllPermission, false);
          }
          break;
        case 'ViewAllReport':
          if (viewAllPermission.isEnabled) {
            this.enablePermission(viewPermission, true);
          }
          break;
        default:
          break;
      }
    }
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

      const required = group.title === 'VisitArmyManagement';

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
        if (group.title === 'Report') {
          this.checkReportPerm(permissionName, newPerm);
        }
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
                  this.enablePermission(addPermission, false);
                  this.enablePermission(editPermission, false);
                  this.enablePermission(deletePermission, false);
                }
                break;
              case crudList[1]:
                // Add
                if (addPermission.isEnabled) {
                  this.enablePermission(viewPermission, true);
                } else {
                  this.enablePermission(editPermission, false);
                  this.enablePermission(deletePermission, false);
                }
                break;
              case crudList[2]:
                // Edit
                if (editPermission.isEnabled) {
                  this.enablePermission(viewPermission, true);
                  this.enablePermission(addPermission, true);
                } else {
                  this.enablePermission(deletePermission, false);
                }
                break;
              case crudList[3]:
                // Delete
                if (deletePermission.isEnabled) {
                  this.enablePermission(viewPermission, true);
                  this.enablePermission(addPermission, true);
                  this.enablePermission(editPermission, true);
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
            // prevent unchecking to keep at least 1 permission
            if (required) {
              const ablePermission = group.permissions.filter(
                (per) => per.isEnabled === true,
              );
              if (
                ablePermission.length === 1 &&
                clickedPerm.isEnabled === false
              ) {
                this.enablePermission(clickedPerm, true);
              }
            }
            if (clickedPerm.isEnabled) {
              this.enablePermission(viewPermission, true);
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
              {permission.groupName}
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
                    title={perm.description}
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
                      label={perm.permissionName}
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
    const { classes, roleModel } = this.props;
    const permissionData = roleModel.permissionGroups.value;
    const isDefault = roleModel.isDefault.value;
    // const enableDepartmentLevel = roleModel.enableDepartmentLevel.value;

    return (
      <Paper className={`${classes.center} ${classes.permissionListPaper}`}>
        {/* Permission Lists */}
        <Grid container>
          <Grid item xs={12} sm={12} md={12}>
            {/* <Tooltip
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
            </Tooltip> */}
          </Grid>
          <Grid item xs={6} sm={6} md={6} id="leftSide">
            {permissionData.map(
              (permission, index) =>
                index % 2 === 0 && this.renderPermission(isDefault, permission),
            )}
          </Grid>
          <Grid item xs={6} sm={6} md={6} id="rightSide">
            {permissionData.map(
              (permission, index) =>
                index % 2 === 1 && this.renderPermission(isDefault, permission),
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
  // onEnableDepartmentLevel: PropTypes.func,
};

export default Permissions;
