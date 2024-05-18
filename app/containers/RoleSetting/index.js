/* eslint-disable indent */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Grid, Typography } from '@material-ui/core';
import { RESTART_ON_REMOUNT } from 'utils/constants';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import { styles } from './styles';
import { makeSelectLoading } from '../App/selectors';
import RoleList from './RoleList';
import { Permissions } from './Permissions';
import { injectIntl } from 'react-intl';
import {
  getRoleList,
  changePermissionEnabled,
  changeRoleName,
  getIndexRole,
  deleteRoles,
  postAddRole,
  putEditRole,
  putEditPermission,
  changeSimilarId,
  // enableDepartmentLevel,
  onChangeDefaultRole,
  validateRole
} from './actions';
import {
  makeSelectRoleList,
  makeSelectRoleModel,
  makeSelectSimilarId,
} from './selectors';
import { mapRoleModelUiToApi } from './roleSettingUtilities';

export class RoleSettingPage extends React.Component {
  state = {
    selectedRoleId: null,
    showTableDetail: false,
  };

  componentDidMount() {
    this.props.onGetRoleList();
  }

  /**
   * Function for change role id state when click list of role
   * @param {number} id
   */
  changeSelectedRoleId = (id) => {
    // console.log('changeSelectedRoleId: ', id);
    let showTableDetail = true;
    if (id === null) {
      showTableDetail = false;
    }
    this.setState({ showTableDetail, selectedRoleId: id });
  };

  getIndexRole = (selectedRoleId) => {
    const { onGetIndexRole } = this.props;
    // console.log('getIndexRole selectedRoleId:', selectedRoleId);
    onGetIndexRole(selectedRoleId);
  };

  saveRole = (currentRoleId) => {
    const { onAddNewRole, onEditRole, roleModel } = this.props;
    if (currentRoleId === 0) {
      onAddNewRole(mapRoleModelUiToApi(roleModel.toJS(), false)); // add
    } else {
      onEditRole(currentRoleId, mapRoleModelUiToApi(roleModel.toJS(), true)); // edit
    }
    this.setState({
      selectedRoleId: null,
      showTableDetail: false,
    });
  };

  savePermissionData = () => {
    const { selectedRoleId } = this.state;
    const { roleModel, onSavePermissionData } = this.props;

    onSavePermissionData(
      selectedRoleId,
      mapRoleModelUiToApi(roleModel.toJS(), false),
    );
  };

  changePermissionEnabled = (newData) => {
    const { onChangePermissionEnabled } = this.props;
    onChangePermissionEnabled(newData);
  };

  deleteCheckedRoles = (ids) => {
    this.props.onDeleteCheckedRoles(ids);
    this.setState({
      selectedRoleId: null,
      showTableDetail: false,
    });
  };

  render() {
    const { showTableDetail, selectedRoleId } = this.state;
    const {
      classes,
      roleData,
      onChangeRoleName,
      roleModel,
      onChangeSimilarId,
      similarId,
      // onEnableDepartmentLevel,
      changeDefaultRole,
    } = this.props;

    // console.log('index render selectedRoleId:', selectedRoleId);

    return (
      <Paper className={classes.defaultPadding}>
        <Grid container>
          <Grid item xs={4} sm={4}>
            {/* Role List */}
            <RoleList
              selectedRoleId={selectedRoleId}
              onChangeSelectedRoleId={this.changeSelectedRoleId}
              roleData={roleData.toJS()}
              roleModel={roleModel.toJS()}
              onChangeRoleName={onChangeRoleName}
              onGetIndexRole={this.getIndexRole}
              onDeleteCheckedRoles={this.deleteCheckedRoles}
              onSaveRole={this.saveRole}
              onChangeSimilarId={onChangeSimilarId}
              similarId={similarId}
              changeDefaultRole={changeDefaultRole}
              onValidateRole={this.props.onValidateRole}
              intl={this.props.intl}
            />
          </Grid>
          <Grid
            item
            xs={8}
            sm={8}
            className={`${classes.defaultPadding} ${classes.defaultBackground} ${classes.borderRadius}`}
          >
            {/* Permissions */}
            {showTableDetail && selectedRoleId !== 0 && (
              <React.Fragment>
                {/*  */}
                <div className={classes.groupTitle}>
                  <Typography variant="h5">
                    {roleModel.toJS().roleName.value}
                  </Typography>
                </div>
                <div className={`${classes.halfMarginBottom}`}>
                  {/* Permissions */}
                  <Permissions
                    classes={classes}
                    roleModel={roleModel.toJS()}
                    onChangePermissionEnabled={this.changePermissionEnabled}
                    onSavePermissionData={this.savePermissionData}
                    // onEnableDepartmentLevel={onEnableDepartmentLevel}
                  />
                </div>
              </React.Fragment>
            )}
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

RoleSettingPage.propTypes = {
  classes: PropTypes.object,
  onGetRoleList: PropTypes.func,
  onChangePermissionEnabled: PropTypes.func,
  roleData: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onChangeRoleName: PropTypes.func,
  onGetIndexRole: PropTypes.func,
  roleModel: PropTypes.object,
  onDeleteCheckedRoles: PropTypes.func,
  onAddNewRole: PropTypes.func,
  onEditRole: PropTypes.func,
  onSavePermissionData: PropTypes.func,
  onChangeSimilarId: PropTypes.func,
  similarId: PropTypes.number,
  // onEnableDepartmentLevel: PropTypes.func,
  changeDefaultRole: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onGetRoleList: () => dispatch(getRoleList()),
    onChangePermissionEnabled: (data) =>
      dispatch(changePermissionEnabled(data)),
    onChangeRoleName: (name, value) => dispatch(changeRoleName(name, value)),
    onGetIndexRole: (id) => dispatch(getIndexRole(id)),
    onDeleteCheckedRoles: (ids) => dispatch(deleteRoles(ids)),
    onAddNewRole: (role) => dispatch(postAddRole(role)),
    onEditRole: (id, role) => dispatch(putEditRole(id, role)),
    onSavePermissionData: (id, role) => dispatch(putEditPermission(id, role)),
    onChangeSimilarId: (value) => dispatch(changeSimilarId(value)),
    // onEnableDepartmentLevel: data => dispatch(enableDepartmentLevel(data)),
    changeDefaultRole: (id) => dispatch(onChangeDefaultRole(id)),
    onValidateRole: (errors) => dispatch(validateRole(errors)),
  };
}

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  roleData: makeSelectRoleList(),
  roleModel: makeSelectRoleModel(),
  similarId: makeSelectSimilarId(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({ key: 'roleSetting', reducer });
const withSaga = injectSaga({
  key: 'roleSetting',
  saga,
  mode: RESTART_ON_REMOUNT,
});

export default compose(
  withReducer,
  withSaga,
  withConnect,
  injectIntl,
)(withStyles(styles)(RoleSettingPage));
