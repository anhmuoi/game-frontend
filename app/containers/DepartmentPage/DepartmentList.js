import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Toolbar,
  Typography,
  Fab,
  Tooltip,
  Checkbox,
  IconButton,
  Collapse,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import AlertDialogSlideUI from 'components/AlertDialogSlideUI';

import { TYPE_ACCOUNT, colorDelete } from '../../utils/constants';
import messages from './messages';
import { localstoreUtilites } from '../../utils/persistenceData';
const permissions = localstoreUtilites.getPermissionsFromLocalStorage().department;
class DepartmentList extends React.Component {
  state = {
    showDialog: false,
  };

  onCloseDialog = () => this.setState({ showDialog: false });
  onActionAgreeConfirm = () => this.onDelete();
  onShowDialog = () => this.setState({ showDialog: true });

  onDelete = async () => {
    const { store, enqueueSnackbar } = this.props;
    try {
      const data = await store.deleteDepartments();
      // console.log(data);
      await enqueueSnackbar(data.message, {
        variant: 'success',
      });
      await store.initData();
    } catch (error) {
      console.log(error);
      enqueueSnackbar(error.message, {
        variant: 'error',
      });
      console.log(error);
    }
  };

  componentDidMount() {
    const { store } = this.props;
    store.initData();
  }

  renderChilds = (department, departments) => {
    const { classes, store } = this.props;
    const { selectedDepartments, openDepartments } = store.state;

    return (
      <Collapse
        in={openDepartments.includes(department.id)}
        timeout="auto"
        unmountOnExit
        className={classes.nested}
      >
        <React.Fragment />
        <List component="div" disablePadding>
          {departments.map((dept) => (
            <React.Fragment key={`Fragment_${dept.id}`}>
              <ListItem
                classes={{ selected: classes.active }}
                button
                key={dept.id}
                onClick={() => {
                  store.getDepartmentUsers(dept);
                  store.toggleChildDeparment(dept.id);
                }}
              >
                {dept.children &&
                  dept.children.length > 0 &&
                  (openDepartments.includes(dept.id) ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  ))}
                {dept.children.length === 0 && (
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                )}
                <Checkbox
                  checked={selectedDepartments.includes(dept.id)}
                  onChange={() => store.selecteDepartment(dept.id)}
                />
                <ListItemText
                  classes={{ primary: classes.secondItemFont }}
                  variant="caption"
                  primary={dept.name}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    color="primary"
                    onClick={() => store.toogleAddDepartment(dept)}
                    className="btn-edit-group"
                  >
                    <FormattedMessage {...messages.update}>
                      {(message) => (
                        <Tooltip title={message}>
                          <EditIcon />
                        </Tooltip>
                      )}
                    </FormattedMessage>
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              {dept.children &&
                dept.children.length > 0 &&
                this.renderChilds(dept, dept.children)}
            </React.Fragment>
          ))}
        </List>
      </Collapse>
    );
  };

  render() {
    const { showDialog } = this.state;
    const { classes, store, role } = this.props;
    const { departments, selectedDepartments, openDepartments } = store.state;
    return (
      <React.Fragment>
        <AlertDialogSlideUI
          onOpen={showDialog}
          messsage={<span />}
          title={<FormattedMessage {...messages.confirmDelete} />}
          onActionAgree={this.onActionAgreeConfirm}
          onCloseDialog={this.onCloseDialog}
        />
        <Toolbar className={classes.noPaddingLeftRight}>
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h6">
                <FormattedMessage {...messages.titleTable} />
              </Typography>
            </Grid>

            <Grid item>
              {permissions.addDepartment ? (
                <Fab
                  className={classes.fab}
                  color="primary"
                  aria-label="Add"
                  onClick={() => store.toogleAddDepartment()}
                  id="add"
                >
                  <FormattedMessage {...messages.add}>
                    {(message) => (
                      <Tooltip title={message}>
                        <AddIcon />
                      </Tooltip>
                    )}
                  </FormattedMessage>
                </Fab>
              ) : null}
              {permissions.deleteDepartment ? (
                <Fab
                  className={classes.fab}
                  color="secondary"
                  aria-label="Delete"
                  onClick={this.onShowDialog}
                  disabled={selectedDepartments.length === 0}
                  style={
                    selectedDepartments.length === 0
                      ? {}
                      : { color: 'white', background: colorDelete }
                  }
                  id="delete"
                >
                  <FormattedMessage {...messages.delete}>
                    {(message) => (
                      <Tooltip title={message}>
                        <DeleteIcon />
                      </Tooltip>
                    )}
                  </FormattedMessage>
                </Fab>
              ) : null}
            </Grid>
          </Grid>
        </Toolbar>
        {/* <List dense>
          <ListItem disableripple="true" className={classes.headers}>
            <Checkbox
              checked={selectedDepartments.length === departments.length}
              onChange={() => store.selecteAllDepartment()}
            />
            <ListItemText
              primary={
                <Typography type="body2" className={classes.headerText}>
                  <FormattedMessage {...messages.name} />
                </Typography>
              }
            />
          </ListItem>
        </List> */}
        <div className="p-datatable-scrollable-body">
          <List dense className={classes.list}>
            {departments.map((dept) => (
              <React.Fragment key={dept.id}>
                <ListItem
                  classes={{ selected: classes.active }}
                  button
                  key={dept.id}
                  className={classes.noPaddingLeftRight}
                  onClick={() => {
                    store.getDepartmentUsers(dept);
                    store.toggleChildDeparment(dept.id);
                  }}
                >
                  {dept.children &&
                    dept.children.length > 0 &&
                    (openDepartments.includes(dept.id) ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    ))}
                  {dept.children.length === 0 && (
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  )}
                  <Checkbox
                    id={dept.name}
                    checked={selectedDepartments.includes(dept.id)}
                    onChange={() => store.selecteDepartment(dept.id)}
                  />
                  <ListItemText
                    classes={{ primary: classes.fontSize }}
                    variant="caption"
                    primary={dept.name}
                  />
                  <ListItemSecondaryAction>
                    {permissions.editDepartment ? (
                      <IconButton
                        id={`Update_${dept.id}`}
                        aria-label="Update"
                        color="primary"
                        onClick={() => store.toogleAddDepartment(dept)}
                        className="btn-edit-group"
                      >
                        <FormattedMessage {...messages.update}>
                          {(message) => (
                            <Tooltip title={message}>
                              <EditIcon />
                            </Tooltip>
                          )}
                        </FormattedMessage>
                      </IconButton>
                    ) : null}
                  </ListItemSecondaryAction>
                </ListItem>
                {dept.children &&
                  dept.children.length > 0 &&
                  this.renderChilds(dept, dept.children)}
              </React.Fragment>
            ))}
          </List>
        </div>
      </React.Fragment>
    );
  }
}

DepartmentList.propTypes = {
  classes: PropTypes.object.isRequired,
  store: PropTypes.object,
  role: PropTypes.number,
};

export default DepartmentList;
