import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  withStyles,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  // TablePagination,
  Toolbar,
  Grid,
  Tooltip,
  Hidden,
  Fab,
  Radio,
  // Input,
} from '@material-ui/core';
// import SearchIcon from '@material-ui/icons/Search';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';

import AlertDialogSlideUI from 'components/AlertDialogSlideUI';
import messages from './messages';
import { styles } from './styles';
import AddRoleModal from './AddRoleModal';
import { colorDelete } from './constants';
import { TYPE_ACCOUNT } from '../../utils/constants.js';

export class RoleList extends React.Component {
  state = {
    isOpenModal: false,
    showDialog: false,
    checkedRoleIds: [],
  };
  componentDidMount() {
    //
  }

  openModal = (evt) => {
    if (evt.currentTarget.getAttribute('aria-label') === 'Add') {
      this.props.onChangeSelectedRoleId(null);
      this.props.onGetIndexRole(0);
    } else {
      const getId = evt.currentTarget.id.split('-');
      const id = parseInt(getId[1], 10);
      this.props.onChangeSelectedRoleId(id);
      this.props.onGetIndexRole(id);
    }
    this.setState({ isOpenModal: true });
  };

  closeModal = () => {
    this.setState({ isOpenModal: false });
  };

  selectRole = (evt) => {
    const getId = evt.currentTarget.id.split(';_;');
    const id = parseInt(getId[1], 10);
    // console.log('select Role selectedRoleId:', id);
    this.props.onChangeSelectedRoleId(id);
    if (evt.target.nodeName !== 'path' && evt.target.nodeName !== 'svg') {
      this.props.onGetIndexRole(id);
    }
  };

  clickCheckRole = (evt) => {
    const { checkedRoleIds } = this.state;
    const id = evt.target.id && parseInt(evt.target.id, 10);
    // this.props.onChangeSelectedRoleId(id);
    if (checkedRoleIds.includes(id)) {
      this.setState({
        checkedRoleIds: checkedRoleIds.filter((item) => item !== id),
      });
    } else {
      const newArr = [...checkedRoleIds];
      newArr.push(id);
      this.setState({
        checkedRoleIds: newArr,
      });
    }
  };

  deleteRoles = () => {
    this.setState({ showDialog: true });
  };

  closeDialog = () => {
    this.setState({ showDialog: false });
  };

  onConfirmAgree = () => {
    const { checkedRoleIds } = this.state;
    this.props.onDeleteCheckedRoles(checkedRoleIds);
    this.closeDialog();
  };

  createMessage = () => {
    const { checkedRoleIds } = this.state;
    const { roleData } = this.props;
    const checkedRoles = checkedRoleIds.map((id) =>
      roleData.find((role) => role.id === id),
    );
    const result = checkedRoles.map((role) => (
      <span style={{ display: 'block', textAlign: 'center' }}>
        {role && role.roleName}
      </span>
    ));
    return result;
  };

  render() {
    const { isOpenModal, checkedRoleIds, showDialog } = this.state;
    const {
      classes,
      selectedRoleId,
      roleData,
      onChangeRoleName,
      roleModel,
      onSaveRole,
      onChangeSimilarId,
      similarId,
      changeDefaultRole,
    } = this.props;
    // console.log('rolelist render selectedRoleId:', selectedRoleId);
    return (
      <React.Fragment>
        <AlertDialogSlideUI
          id="dialog-delete"
          onOpen={showDialog}
          onActionAgree={this.onConfirmAgree}
          onCloseDialog={this.closeDialog}
          messsage={this.createMessage()}
          title={<FormattedMessage {...messages.deleteRoles} />}
        />
        <AddRoleModal
          classes={classes}
          isOpenModal={isOpenModal}
          onCloseModal={this.closeModal}
          currentRoleId={selectedRoleId}
          roleModel={roleModel}
          onChangeRoleName={onChangeRoleName}
          onSaveRole={onSaveRole}
          roleData={roleData}
          onChangeSimilarId={onChangeSimilarId}
          similarId={similarId}
          onValidateRole={this.props.onValidateRole}
          intl={this.props.intl}
        />
        <Toolbar className={classes.noPaddingLeftRight}>
          <Grid container justify="space-between" alignItems="center">
            <Hidden smDown>
              <Typography component="span" variant="h6">
                <FormattedMessage {...messages.titleRoleSetting} />
              </Typography>
            </Hidden>
            {/* <Grid item md={4} sm={12} xs={12}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <FormattedMessage {...messages.searchBox}>
                {searchBox => (
                  <Input
                    placeholder={searchBox}
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                    onChange={() => {}}
                  />
                )}
              </FormattedMessage>
            </Grid> */}
            <Grid item md={4} sm={12} xs={4} style={{ textAlign: 'right' }}>
              <Fab
                className={classes.fab}
                color="primary"
                aria-label="Add"
                onClick={this.openModal}
              >
                <FormattedMessage {...messages.addNewRole}>
                  {(addNewRole) => (
                    <Tooltip title={addNewRole}>
                      <AddIcon />
                    </Tooltip>
                  )}
                </FormattedMessage>
              </Fab>
              <Fab
                className={classes.fab}
                color="secondary"
                aria-label="Delete"
                onClick={this.deleteRoles}
                disabled={checkedRoleIds.length === 0}
                style={
                  checkedRoleIds.length === 0
                    ? {}
                    : { color: 'white', background: colorDelete }
                }
              >
                <FormattedMessage {...messages.deleteRole}>
                  {(deleteRole) => (
                    <Tooltip title={deleteRole}>
                      <DeleteIcon />
                    </Tooltip>
                  )}
                </FormattedMessage>
              </Fab>
            </Grid>
          </Grid>
        </Toolbar>
        {/* Role List */}
        <List dense>
          <ListItem>
            <ListItemText
              primary={
                <Typography type="h6" className={classes.headerText}>
                  <FormattedMessage {...messages.roleName} />
                </Typography>
              }
            />
            <ListItemSecondaryAction style={{ marginRight: 20 }}>
              <Typography type="h6" className={classes.headerText}>
                <IconButton className={classes.hiddenButton}>
                  <EditIcon />
                </IconButton>
                <FormattedMessage {...messages.default} />
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
        <div
          style={{ height: 'calc(100vh - 220px)', overflow: 'scroll' }}
          className={classes.scrollList}
        >
          <List dense>
            {roleData.map((role) => (
              <ListItem
                classes={{ selected: classes.active }}
                button
                key={role.id}
                selected={selectedRoleId === role.id}
                id={role.roleName.concat(`;_;${role.id}`)}
                name={role.roleName}
                onClick={this.selectRole}
                onDoubleClick={() => {}}
                className={classes.noPaddingLeftRight}
              >
                {role.roleType == TYPE_ACCOUNT.primaryManager ? (
                  <Checkbox
                    id={String(role.id)}
                    disabled
                    aria-label={role.roleName}
                  />
                ) : (
                  <Checkbox
                    id={String(role.id)}
                    onChange={this.clickCheckRole}
                    aria-label={role.roleName}
                  />
                )}
                <ListItemText variant="caption" primary={role.roleName} />
                <FormattedMessage {...messages.default}>
                  {(title) => (
                    <Radio
                      checked={role.isDefault}
                      onChange={() => {
                        changeDefaultRole(role.id.toString());
                      }}
                      value={role.id.toString()}
                      name="default"
                      title={title}
                    />
                  )}
                </FormattedMessage>
                <IconButton
                  color="primary"
                  id={role.roleName.concat(`-${role.id}`)}
                  onClick={this.openModal}
                  aria-label="Edit"
                  className="btn-edit-role"
                >
                  <FormattedMessage {...messages.editRole}>
                    {(editRole) => (
                      <Tooltip title={editRole}>
                        <EditIcon />
                      </Tooltip>
                    )}
                  </FormattedMessage>
                </IconButton>
              </ListItem>
            ))}
          </List>
        </div>
        {/* <FormattedMessage {...messages.rowsPerPage}>
          {rowsPerPage => (
            <TablePagination
              //   className={stylePaging}
              component="span"
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              count={1}
              rowsPerPage={25}
              page={1}
              onChangePage={() => {}}
              onChangeRowsPerPage={() => {}}
              //   ActionsComponent={PaginationActions}
              labelRowsPerPage={rowsPerPage}
            />
          )}
        </FormattedMessage> */}
      </React.Fragment>
    );
  }
}

RoleList.propTypes = {
  // Define propTypes
  classes: PropTypes.object,
  selectedRoleId: PropTypes.number,
  onChangeSelectedRoleId: PropTypes.func,
  roleData: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onChangeRoleName: PropTypes.func,
  onGetIndexRole: PropTypes.func,
  onDeleteCheckedRoles: PropTypes.func,
  onSaveRole: PropTypes.func,
  onChangeSimilarId: PropTypes.func,
  roleModel: PropTypes.object,
  similarId: PropTypes.number,
  onValidateRole: PropTypes.func,
  intl: PropTypes.any,
};

export default withStyles(styles)(RoleList);
