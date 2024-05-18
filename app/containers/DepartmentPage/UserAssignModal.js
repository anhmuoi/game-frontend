import ModalMaterialUi from 'components/Modal';
import { fromJS } from 'immutable';
import { PropTypes } from 'prop-types';
import { Typography, Button } from '@material-ui/core';
// import DoneIcon from '@material-ui/icons/Save';
// import SelectUI from 'components/SelectUI';
import { FormattedMessage, injectIntl } from 'react-intl';
// import { fade } from '@material-ui/core/styles/colorManipulator';
import React from 'react';
import {
  Grid,
  // List,
  // ListItem,
  // ListItemText,
  // ListItemSecondaryAction,
  Toolbar,
  // Fab,
  // Tooltip,
  // Checkbox,
  // IconButton,
  // Collapse,
} from '@material-ui/core';
// import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
// import EditIcon from '@material-ui/icons/Edit';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
// import TablePagination from '@material-ui/core/TablePagination';
import classNames from 'classnames';
// import SearchIcon from '@material-ui/icons/Search';
import Input from '@material-ui/core/Input';
// import { compose } from 'redux';
import EnhancedTable from 'components/Datatables';
import { responseCode } from '../../utils/request';
import messages from './messages';

class UserAssignModal extends React.Component {
  onCloseModal = () => {
    const { store } = this.props;
    store.toggleAssignUser();
  };

  onSubmit = async () => {
    try {
      const { store, enqueueSnackbar } = this.props;
      const data = await store.assignUsersToDepartment();

      if (data.statusCode !== responseCode.ok) {
        const err = { message: data.message };
        throw err;
      }

      const { deparmentDetail } = store.state;

      // reload user page after assign
      store.toggleAssignUser();
      await store.getDepartmentUsers(deparmentDetail);
      await enqueueSnackbar(data.message, {
        variant: 'success',
      });

      return true;
    } catch (error) {
      this.props.enqueueSnackbar(
        error.errors.map(err => err.message).join(' '),
        {
          variant: 'error',
        },
      );
      console.log(error);
    }
    return true;
  };

  render() {
    const { show, classes, store } = this.props;
    const { deparmentDetail, usersUnAssign, selectedAssignUsers } = store.state;
    const { data, headers, pagination } = usersUnAssign;
    const btnName = messages.btnAssign;
    return (
      <ModalMaterialUi onCloseModal={this.onCloseModal} isOpenModal={show}>
        <React.Fragment>
          <Toolbar className={classes.noPaddingLeftRight}>
            <Grid container justify="space-between" alignItems="center">
              <Grid item xs={8} sm={8}>
                <Typography variant="h6">
                  <FormattedMessage {...messages.assignUser} />
                </Typography>
              </Grid>
              <Grid item xs={2} sm={2}>
                <div className={classes.search}>
                  <FormattedMessage {...messages.placeholderSearchBox}>
                    {searchText => (
                      <Input
                        id="user-search-input"
                        placeholder={searchText}
                        disableUnderline
                        classes={{
                          root: classes.inputRoot,
                          input: classes.inputInput,
                        }}
                        onChange={evt =>
                          store.getDepartmentUnAssignUsersSearch({
                            search: evt.target.value,
                            department: deparmentDetail,
                          })
                        }
                      />
                    )}
                  </FormattedMessage>
                </div>
              </Grid>
              <Grid item xs={2} sm={2}>
                <Button
                  variant="contained"
                  color="primary"
                  aria-label="Assign"
                  id="btn-assign-Object"
                  className={classes.Button}
                  onClick={this.onSubmit}
                  disabled={selectedAssignUsers.length === 0}
                  style={{ float: 'right' }}
                >
                  <FormattedMessage {...btnName} />
                  <AddIcon
                    className={classNames(classes.rightIcon, classes.iconSmall)}
                  />
                </Button>
              </Grid>
            </Grid>
          </Toolbar>
          {/* Table */}
          <EnhancedTable
            id="DepartmentUnAssignedUser"
            data={data}
            meta={fromJS(pagination)}
            headers={headers}
            // orderHeader={makeTableArmyHeader(headers)}
            spanColum={headers.length + 1}
            onPagingRemote={() =>
              store.getDepartmentUnAssignUsers(deparmentDetail)
            }
            rowsSelected={ids => store.selectedUserAsign(ids)}
            onChangePageNumber={pageNumber =>
              store.onChangeUnAssignedUserListMeta('pageNumber', pageNumber)
            }
            onChangePageSize={pageSize =>
              store.onChangeUnAssignedUserListMeta('pageSize', pageSize)
            }
            onChangeSortColumn={sortColumn =>
              store.onChangeUnAssignedUserListMeta('sortColumn', sortColumn)
            }
            onChangeSortDirection={() => {
              if (pagination.sortDirection === 'asc') {
                store.onChangeUnAssignedUserListMeta('sortDirection', 'desc');
              } else {
                store.onChangeUnAssignedUserListMeta('sortDirection', 'asc');
              }
            }}
            tableHeight="calc(100vh - 480px)"
            notViewAction={false}
            onPatchHeaderColumns={value => store.onPatchHeaderColumns(value)}
            onChangeHeaderVisibles={value =>
              store.onChangeHeaderVisibles('usersUnAssign', value)
            }
          />
          {/* <div className="p-datatable-scrollable-body">
            <Table id="timeAttendanceList">
              <TableHead className="p-datatable-thead">
                <TableRow>
                  <TableCell align="center">
                    <Checkbox
                      id="checkAll"
                      checked={
                        selectedAssignUsers.length == usersUnAssign.data.length
                      }
                      onChange={() => store.selectAllUnAssignUser()}
                    />
                  </TableCell>
                  {headers.map(row => (
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
                {usersUnAssign.data.length > 0 &&
                  usersUnAssign.data.map(row => (
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
                        <Checkbox
                          id={row.userName}
                          checked={selectedAssignUsers.includes(row.id)}
                          onChange={() => store.selectedUserAsign(row.id)}
                        />
                      </TableCell>
                      <TableCell align="center">{row.firstName}</TableCell>
                      <TableCell align="center">{row.userCode}</TableCell>
                      <TableCell align="center">{row.employeeNo}</TableCell>
                      <TableCell align="center">{row.expiredDate}</TableCell>
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
                {usersUnAssign.data.length === 0 && (
                  <TableRow>
                    <TableCell align="center" colSpan={headers.length}>
                      <FormattedMessage {...messages.noData} />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {usersUnAssign.data.length > 0 && (
              <Grid
                container
                style={{ justifyContent: 'flex-end', marginTop: '10px' }}
              >
                <Grid item>
                  <TablePagination
                    // className={stylePaging}
                    component="div"
                    count={usersUnAssign.total}
                    rowsPerPage={usersUnAssign.pagination.pageSize}
                    page={usersUnAssign.pagination.pageNumber}
                    backIconButtonProps={{
                      'aria-label': 'Previous Page',
                    }}
                    nextIconButtonProps={{
                      'aria-label': 'Next Page',
                    }}
                    onChangePage={(event, page) =>
                      store.getDepartmentUnAssignUsers({
                        department: deparmentDetail,
                        pageNumber: page,
                        pageSize: usersUnAssign.pagination.pageSize,
                      })
                    }
                    onChangeRowsPerPage={event =>
                      store.getDepartmentUnAssignUsers({
                        department: deparmentDetail,
                        pageNumber: usersUnAssign.pagination.pageNumber,
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
        </React.Fragment>
      </ModalMaterialUi>
    );
  }
}

UserAssignModal.propTypes = {
  classes: PropTypes.object,
  show: PropTypes.bool,
  store: PropTypes.object,
};

export default injectIntl(UserAssignModal);
