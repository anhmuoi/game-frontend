import {
  Button,
  Collapse,
  Fab,
  Grid,
  Hidden,
  Toolbar,
  Tooltip,
  Typography,
  withStyles,
} from '@material-ui/core';
import { PropTypes } from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import { FormattedMessage } from 'react-intl';
// import SelectUI from 'components/SelectUI';
import MultiSelectUI from 'components/MultiSelectUI/MultiSelect';
import DatetimeRangePicker from 'components/DatetimeRangePicker';
import InputUI from 'components/InputUI';

import Input from '@material-ui/core/Input';
import { fade, lighten } from '@material-ui/core/styles/colorManipulator';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import AlertDialogSlideUI from 'components/AlertDialogSlideUI';
import { localstoreUtilites } from '../../utils/persistenceData';
import messages from './messages';
import SearchUI from '../../components/SearchUI/index.js';
import { Clear, Search } from '@material-ui/icons';
import imgFoldUp from 'images/foldup.svg';
import imgFoldDown from 'images/folddown.svg';
const toolbarStyles = (theme) => ({
  root: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  actions: {
    color: theme.palette.text.secondary,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  title: {
    flex: '0 0 auto',
  },
  button: {
    margin: theme.spacing.unit,
    height: 36,
    width: 36,
  },
  checkboxAction: {
    marginLeft: theme.spacing.unit,
    marginRight: 0,
  },
  highlight: {
    color: theme.palette.secondary.main,
    backgroundColor: lighten(theme.palette.secondary.light, 0.85),
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },
  fab: {
    margin: theme.spacing.unit,
    height: 36,
    width: 36,
  },
  buttonContainer: {
    textAlign: 'right',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  buttonToolbar: {
    marginLeft: 15,
  },
  foldBtn: {
    margin: theme.spacing.unit,
    width: 142,
  },
  fold: {
    padding: 8,
    height: 36,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '0.5px solid #D8D8D8',
    boxShadow: '0px 1px 3px 0px #0000001F',
    borderRadius: 20,
    gap: '5px',
    cursor: 'pointer',
  },
  filterContainer: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: '5px',
  },
});

class DailyReportManagementToolbar extends React.Component {
  state = {
    showDialog: false,
    isFold: false,
    foldOption: 0,
  };

  onChangeFilter = (name, value) => {
    this.setState({
      [name]: value,
    });
  };

  onCloseDialog = () => {
    this.setState({
      showDialog: false,
    });
  };

  onActionAgreeConfirm = () => {
    this.props.onDeleteMultiesRow();
  };

  onShowDialog = () => {
    this.setState({
      showDialog: true,
    });
  };

  foldOption = () => {
    if (this.state.foldOption === 0) {
      this.setState({ foldOption: 1 });
    } else {
      this.setState({ foldOption: 0 });
    }
    this.props.onFoldOption(this.state.isFold);
  };

  foldOption = () => {
    if (this.state.foldOption === 0) {
      this.setState({ foldOption: 1 });
    } else {
      this.setState({ foldOption: 0 });
    }
    this.props.onFoldOption();
  };
  render() {
    const { functionLists } = this;
    const {
      classes,
      onSearchDataTable,
      searchTxt,
      isSelectMultiesRow,
      onAddDailyReport,

      onChangeFilter,

      userIdsFilter,
      folderLogsFilter,
      reportersFilter,
      userList,
      folderLogList,
      reporterList,
      departmentList,
      departmentsFilter,

      search,
      isFold,
      startDate,
      endDate,
      onClearFilter,
    } = this.props;
    const permission = localstoreUtilites.getPermissionsFromLocalStorage()
      .dailyReport;

    const { showDialog } = this.state;

    const lang = localstoreUtilites.getLanguageFromLocalStorage();

    return (
      <React.Fragment>
        <AlertDialogSlideUI
          onOpen={showDialog}
          messsage={<span />}
          title={<FormattedMessage {...messages.confirmDelete} />}
          onActionAgree={this.onActionAgreeConfirm}
          onCloseDialog={this.onCloseDialog}
        />
        <Toolbar className={classes.root}>
          <Grid className={classes.title}>
            <Hidden smDown>
              <React.Fragment>
                <div>
                  <Typography variant="h6" id="tableTitle">
                    <FormattedMessage {...messages.titleDailyReport} />
                  </Typography>
                </div>
              </React.Fragment>
            </Hidden>
          </Grid>
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="flex-end"
            spacing={16}
          >
            <Grid item>
              <div className={classes.actions} id="toolbarBtn">
                <Grid
                  color="primary"
                  aria-label="Filter"
                  className={classes.fold}
                  onClick={this.foldOption}
                >
                  {this.state.foldOption === 1 ? (
                    <React.Fragment>
                      <FormattedMessage
                        {...messages.showOption}
                      ></FormattedMessage>
                      <FormattedMessage {...messages.showOption}>
                        {(msg) => (
                          <Tooltip title={msg}>
                            <img
                              alt=""
                              src={imgFoldDown}
                              style={{ width: 14 }}
                            />
                          </Tooltip>
                        )}
                      </FormattedMessage>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <FormattedMessage
                        {...messages.foldOption}
                      ></FormattedMessage>
                      <FormattedMessage {...messages.foldOption}>
                        {(msg) => (
                          <Tooltip title={msg}>
                            <img alt="" src={imgFoldUp} style={{ width: 14 }} />
                          </Tooltip>
                        )}
                      </FormattedMessage>
                    </React.Fragment>
                  )}
                </Grid>
                {/* {permission.addDailyReport && (
                  <Fab
                    color="primary"
                    aria-label="Add"
                    className={classes.button}
                    onClick={onAddDailyReport}
                    id="btnAdd"
                  >
                    <AddIcon />
                  </Fab>
                )} */}
                {/* {permission.deleteDailyReport && (
                  <Fab
                    id="delete_multi"
                    color="secondary"
                    aria-label="DeleteMulties"
                    className={classes.button}
                    onClick={this.onShowDialog}
                    disabled={!isSelectMultiesRow}
                  >
                    <FormattedMessage {...messages.titleToolBarDelete}>
                      {(titleDelete) => (
                        <Tooltip title={titleDelete}>
                          <DeleteIcon />
                        </Tooltip>
                      )}
                    </FormattedMessage>
                  </Fab>
                )} */}
              </div>
            </Grid>
          </Grid>
        </Toolbar>

        <Collapse in={!isFold} timeout={500}>
          <Grid container className={classes.filterContainer}>
            <Grid item md={12}>
              <Grid container spacing={24} direction="row">
                {/* Access Time */}
                <Grid item xs={12} md={2}>
                  <DatetimeRangePicker
                    disUseTimeStamp
                    label={
                      <div>
                        <FormattedMessage {...messages.startDate} /> -{' '}
                        <FormattedMessage {...messages.endDate} />
                      </div>
                    }
                    format={lang || 'en-US'}
                    startDate={startDate || new Date()}
                    endDate={endDate || new Date()}
                    onChange={(startDate, endDate) => {
                      this.props.onChangeDate(startDate, endDate);
                    }}
                  />
                </Grid>

                {/* <Grid item md={2} sm={12} xs={12}>
                  <InputUI
                    fullWidth
                    id="search"
                    name="search"
                    value={search}
                    onChange={onChangeFilter}
                    label={<FormattedMessage {...messages.title} />}
                    classes={{}}
                  />
                </Grid> */}
                {/* <Grid item md={2}>
                  <MultiSelectUI
                    value={reportersFilter}
                    onChange={onChangeFilter}
                    options={reporterList}
                    name="reportersFilter"
                    label={<FormattedMessage {...messages.reporter} />}
                  />
                </Grid> */}
                <Grid item md={2}>
                  <MultiSelectUI
                    value={userIdsFilter}
                    onChange={onChangeFilter}
                    options={userList}
                    name="userIdsFilter"
                    label={<FormattedMessage {...messages.author} />}
                  />
                </Grid>
                <Grid item md={2}>
                  <MultiSelectUI
                    value={departmentsFilter}
                    onChange={onChangeFilter}
                    options={departmentList}
                    name="departmentsFilter"
                    label={<FormattedMessage {...messages.department} />}
                  />
                </Grid>
              </Grid>

              <br />
              <br />
              <Grid container>
                <Grid
                  item
                  xs={12}
                  className={classes.buttonContainer}
                  style={{ margin: 0 }}
                >
                  <Button
                    className={classes.buttonToolbar}
                    variant="contained"
                    id="btn-clear"
                    onClick={onClearFilter}
                    color="default"
                  >
                    <Clear
                      className={classNames(
                        classes.rightIcon,
                        classes.iconSmall,
                      )}
                    />
                    <FormattedMessage {...messages.btnClear} />
                  </Button>
                  <Button
                    id="search"
                    // disabled={!searchable}
                    variant="contained"
                    className={classes.buttonToolbar}
                    onClick={onSearchDataTable}
                    color="primary"
                  >
                    <Search
                      className={classNames(
                        classes.rightIcon,
                        classes.iconSmall,
                      )}
                    />
                    <FormattedMessage {...messages.btnSearch} />
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Collapse>
      </React.Fragment>
    );
  }
}

DailyReportManagementToolbar.propTypes = {
  classes: PropTypes.object,
  statusListSelector: PropTypes.array,
  onSearchDataTable: PropTypes.func,
  onChangeDate: PropTypes.func,
  onDeleteMultiesRow: PropTypes.func,
  isSelectMultiesRow: PropTypes.bool,
  onAddDailyReport: PropTypes.func,

  // statusList: PropTypes.array,
  onChangeFilter: PropTypes.func,
  searchTxt: PropTypes.string,
};

export default withStyles(toolbarStyles)(DailyReportManagementToolbar);
