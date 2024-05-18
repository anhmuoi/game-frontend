import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { fromJS } from 'immutable';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
// import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
// import IconButton from '@material-ui/core/IconButton';
// import EditIcon from '@material-ui/icons/Edit';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
// import AssignUI from '../../components/AssignUI';
// import { createMuiTheme } from '@material-ui/core';
import EnhancedTable from 'components/Datatables';
import UserAssignModal from './UserAssignModal';

import messages from './messages';

const styles = (theme) => ({
  root: {
    width: '100%',
    border: 'none',
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  table: {
    minWidth: 'auto',
  },
  tableWrapper: {
    height: 'calc(100vh - 305px)',
    // borderBottom: `1px solid ${theme.palette.primary.border}`,
  },
  tableHeader: {
    color: theme.palette.primary.color,
    textAlign: 'left',
    flexDirection: 'row',
    fontWeight: 'bold',
    // border: '1px solid red',
    backgroundColor: '#ffffff',
    position: 'sticky',
    top: 0,
    zIndex: 1,
    borderBottom: `2px solid ${theme.palette.primary.border}`,
  },
  tableHeaderCenter: {
    textAlign: 'center',
  },
  cellTableCheckBoxHeader: {
    color: theme.palette.primary.color,
    minHeight: '40px',
    height: '40px',
    width: '50px',
    padding: '1px',
    textAlign: 'left',
    flexDirection: 'row',
    fontWeight: 'bold',
    // border: '1px solid red',
    backgroundColor: '#ffffff',
    position: 'sticky',
    top: 0,
    zIndex: 1,
    borderBottom: `2px solid ${theme.palette.primary.border}`,
  },
  cellTableCheckBox: {
    color: theme.palette.primary.color,
    minHeight: '40px',
    height: '40px',
    width: '50px',
    padding: '1px',
    // border: '1px solid red',
  },
  cellTableBody: {
    color: theme.palette.primary.color,
    minHeight: '40px',
    height: '40px',
    minWidth: 'auto',
    // border: '1px solid black',
    // border: 'none',
    // whiteSpace: 'nowrap',
  },
  cellTableBodyCenter: {
    color: theme.palette.primary.color,
    // border: 'none',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    minHeight: '40px',
    height: '40px',
    // border: '1px solid black',
  },
  iconActionInCell: {
    padding: 3,
    minWidth: '1.3em',
  },
  formControl: {
    marginTop: '0 !important',
  },
  input: {
    marginTop: '0 !important',
    '&::before': {
      borderBottom: 'none !important',
    },
  },
  button: {
    margin: theme.spacing.unit,
    height: 36,
    width: 36,
  },
  groupTitle: { textAlign: 'center', fontWeight: 'bold' },
  halfMarginTop: { marginTop: theme.spacing.unit * 2 },
  halfMarginBottom: { marginBottom: theme.spacing.unit * 2 },
});

export const headers = [
  {
    id: 'name',
    label: <FormattedMessage {...messages.name} />,
  },

  {
    id: 'position',
    label: <FormattedMessage {...messages.position} />,
  },

  {
    id: 'phone',
    label: <FormattedMessage {...messages.phone} />,
  },

  {
    id: 'Action',
    numeric: true,
    disablePadding: false,
    label: '##',
    width: '60px',
  },
];

class UserList extends React.Component {
  state = {
    // userData: [],
    // willBeRegisterUsers: [],
    // unassignedUserData: [],
  };

  render() {
    const { classes, store, enqueueSnackbar } = this.props;
    const { users, deparmentDetail } = store.state;
    return (
      <React.Fragment>
        <div className={classes.groupTitle}>
          <Typography variant="h5">
            {deparmentDetail && deparmentDetail.name}
          </Typography>
        </div>
        <div className={`${classes.halfMarginTop}`}>
          <Paper className={classes.root}>
            <Grid container direction="row" spacing={24}>
              <Grid item md={11} xs={11} sm={11}>
                {users.department && (
                  <Typography variant="subtitle1">
                    <FormattedMessage {...messages.managerEmail} />:{' '}
                    {users.department.departmentManager}
                  </Typography>
                )}
              </Grid>
              <Grid item md={1} xs={1} sm={1}>
                {users.department && (
                  <Fab
                    color="primary"
                    aria-label="Add"
                    className={classes.button}
                    onClick={() =>
                      store.getDepartmentUnAssignUsers(deparmentDetail)
                    }
                  >
                    <AddIcon />
                  </Fab>
                )}

                <UserAssignModal
                  store={store}
                  classes={classes}
                  show={store.state.isOpenAssignUser}
                  enqueueSnackbar={enqueueSnackbar}
                />
              </Grid>
              <Grid item md={12} xs={12} sm={12}>
                <EnhancedTable
                  id="DepartmentUser"
                  data={users.data}
                  meta={fromJS(users.pagination)}
                  headers={headers}
                  // orderHeader={makeTableArmyHeader(headers)}
                  spanColum={headers.length + 1}
                  onPagingRemote={() =>
                    store.getDepartmentUsers(deparmentDetail)
                  }
                  rowsSelected={() => {}}
                  onEditRow={(id) => {
                    window.open(
                      `${document.baseURI}user/edit/${id}`,
                      '_blank',
                    );
                  }}
                  onChangePageNumber={(pageNumber) =>
                    store.onChangeAssignedUserListMeta('pageNumber', pageNumber)
                  }
                  onChangePageSize={(pageSize) =>
                    store.onChangeAssignedUserListMeta('pageSize', pageSize)
                  }
                  onChangeSortColumn={(sortColumn) =>
                    store.onChangeAssignedUserListMeta('sortColumn', sortColumn)
                  }
                  onChangeSortDirection={() => {
                    if (users.pagenation.sortDirection === 'asc') {
                      store.onChangeAssignedUserListMeta(
                        'sortDirection',
                        'desc',
                      );
                    } else {
                      store.onChangeAssignedUserListMeta(
                        'sortDirection',
                        'asc',
                      );
                    }
                  }}
                  f
                  tableHeight="calc(100vh - 480px)"
                  isEditShowModal
                  isNotCheckedRow
                  notViewAction={false}
                  onPatchHeaderColumns={(headers) =>
                    store.onPatchHeaderColumns(headers)
                  }
                  onChangeHeaderVisibles={(headers) =>
                    store.onChangeHeaderVisibles('users', headers)
                  }
                />

                {/* <div className="p-datatable-scrollable-body">
                  <Table id="timeAttendanceList">
                    <TableHead className="p-datatable-thead">
                      <TableRow>
                        {users.headers.map(row => (
                          <TableCell
                            key={row.id}
                            className={`${classes.tableHeader} ${
                              !row.center ? classes.tableHeaderCenter : ''
                            }`}
                          >
                            <span className="p-column-title">{row.label}</span>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.data.length > 0 &&
                        users.data.map(row => (
                          <TableRow
                            key={row.id}
                            onDoubleClick={() =>
                              window.open(
                                `${document.baseURI}user/edit/${row.id}`,
                                '_blank',
                              )
                            }
                          >
                            <TableCell align="center">
                              {row.firstName}
                            </TableCell>
                            <TableCell align="center">{row.userCode}</TableCell>
                            <TableCell align="center">
                              {row.employeeNo}
                            </TableCell>
                            <TableCell align="center">
                              {row.expiredDate}
                            </TableCell>
                            <TableCell align="center">
                              {row.cardList.map(card => card.cardId).join(', ')}
                            </TableCell>
                            <TableCell>
                              <IconButton
                                color="primary"
                                onClick={() => {
                                  window.open(
                                    `${document.baseURI}user/edit/${row.id}`,
                                    '_blank',
                                  );
                                }}
                                className="btn-edit-group"
                              >
                                <EditIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      {users.data.length === 0 && (
                        <TableRow>
                          <TableCell
                            align="center"
                            colSpan={users.headers.length}
                          >
                            <FormattedMessage {...messages.noData} />
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  {users.data.length > 0 && (
                    <Grid
                      container
                      style={{ justifyContent: 'flex-end', marginTop: '10px' }}
                    >
                      <Grid item>
                        <TablePagination
                          // className={stylePaging}
                          component="div"
                          count={users.total}
                          rowsPerPage={users.pagination.pageSize}
                          page={users.pagination.pageNumber}
                          backIconButtonProps={{
                            'aria-label': 'Previous Page',
                          }}
                          nextIconButtonProps={{
                            'aria-label': 'Next Page',
                          }}
                          onChangePage={(event, page) =>
                            store.getDepartmentUsers({
                              department: deparmentDetail,
                              pageNumber: page,
                              pageSize: users.pagination.pageSize,
                            })
                          }
                          onChangeRowsPerPage={event =>
                            store.getDepartmentUsers({
                              department: deparmentDetail,
                              pageNumber: users.pagination.pageNumber,
                              pageSize: event.target.value,
                            })
                          }
                          rowsPerPageOptions={[5, 10, 25, 50, 100]}
                          labelRowsPerPage={
                            <FormattedMessage {...messages.rowsPerPage} />
                          }
                          style={{ marginTop: '10px' }}
                        />
                      </Grid>
                    </Grid>
                  )}
                </div> */}
              </Grid>
            </Grid>
          </Paper>
        </div>
      </React.Fragment>
    );
  }
}

UserList.propTypes = {
  classes: PropTypes.object.isRequired,
  store: PropTypes.object,
  enqueueSnackbar: PropTypes.func,
};

export default withStyles(styles)(UserList);
