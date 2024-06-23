import {
  Fab,
  Grid,
  Hidden,
  Toolbar,
  Tooltip,
  Typography,
  withStyles,
} from '@material-ui/core';
import CloudDownload from '@material-ui/icons/CloudDownload';
import CloudUpload from '@material-ui/icons/CloudUpload';
import { PropTypes } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
// import SelectUI from 'components/SelectUI';
import Input from '@material-ui/core/Input';
import { fade, lighten } from '@material-ui/core/styles/colorManipulator';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import AlertDialogSlideUI from 'components/AlertDialogSlideUI';
import MultiSelectUI from 'components/MultiSelectUI/MultiSelect';
import { localstoreUtilites } from '../../utils/persistenceData.js';
import ExportUI from './ExportUI.js';
import ImportUI from './ImportUI.js';
import messages from './messages.js';
import { colorDelete } from '../../utils/constants.js';
import SearchUI from '../../components/SearchUI/index.js';

const toolbarStyles = (theme) => ({
  root: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  actions: {
    color: theme.palette.text.secondary,
    display: 'flex',
    justifyContent: 'flex-end',
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
});

class MyProfileManagementToolbar extends React.Component {
  state = {
    showExport: false,
    showImport: false,
    showDialog: false,
  };

  functionLists = {
    onExport: (file) => {
      this.props.onExport(file);
      this.setState({ showExport: false });
    },
  };
  onCancelImport = () => {
    this.setState({ showImport: false });
  };
  importMyProfile = (file, format) => {
    this.setState({ showImport: false });
    this.props.onImport(file, format);
  };

  onExportMyProfile = (fileType, text) => {
    this.setState({ showExport: false });
    this.props.onExport(fileType, text);
  };
  importFormat = [
    { name: 'Excel', value: 'excel' },
    { name: 'CSV', value: 'csv' },
  ];

  exportFormat = [
    { name: 'Excel', value: 'excel' },
    { name: 'CSV', value: 'csv' },
  ];

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

  onShowExport = () => {
    this.setState({
      showExport: true,
    });
  };

  onShowImport = () => {
    this.setState({
      showImport: true,
    });
  };

  redirectTo = () => {
    this.props.history.replace('/myProfile/add');
  };

  render() {
    const { functionLists } = this;
    const { showExport, showImport } = this.state;
    const {
      classes,
      onSearchDataTable,
      searchTxt,
      isSelectMultiesRow,
      onAddMyProfile,

      statusListSelector,
      departmentListSelector,
      statusFilter,
      departmentsIdFilter,

      onChangeFilter,
    } = this.props;

    const { showDialog } = this.state;

    const lang = localstoreUtilites.getLanguageFromLocalStorage();
    const permissions = localstoreUtilites.getPermissionsFromLocalStorage()
      .myProfile;

    return (
      <React.Fragment>
        <AlertDialogSlideUI
          onOpen={showDialog}
          messsage={<span />}
          title={<FormattedMessage {...messages.confirmDelete} />}
          onActionAgree={this.onActionAgreeConfirm}
          onCloseDialog={this.onCloseDialog}
        />
        <ImportUI
          id="import"
          show={showImport}
          onCancelImport={this.onCancelImport}
          onImport={this.importMyProfile}
          onExport={this.onExportMyProfile}
          acceptFormats={this.importFormat}
          defaultFormat="excel"
        />
        <ExportUI
          id="export"
          show={showExport}
          onExport={this.onExportMyProfile}
          acceptFormats={this.exportFormat}
          defaultFormat="excel"
          onCancelExport={() => this.setState({ showExport: false })}
        />
        <Toolbar className={classes.root}>
          <Hidden smDown>
            <React.Fragment>
              <div className={classes.title}>
                <Typography variant="h6" id="tableTitle">
                  <FormattedMessage {...messages.titleMyProfile} />
                </Typography>
              </div>
            </React.Fragment>
          </Hidden>
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="flex-end"
          >
            <Grid item style={{ marginRight: '16px' }}>
              <SearchUI
                placeholder=""
                onSearchData={(e) => onSearchDataTable(e.target.value)}
              />
            </Grid>
            <Grid item md={2} style={{ marginRight: '16px' }}>
              <MultiSelectUI
                value={statusFilter}
                onChange={onChangeFilter}
                options={statusListSelector}
                name="statusFilter"
                label={<FormattedMessage {...messages.status} />}

                // textHelperError={status.errorMessage}
              />
            </Grid>

            <Grid item />
            <Grid item md={2}>
              <MultiSelectUI
                value={departmentsIdFilter}
                onChange={onChangeFilter}
                options={departmentListSelector}
                name="departmentsIdFilter"
                label={<FormattedMessage {...messages.departmentId} />}

                // textHelperError={status.errorMessage}
              />
            </Grid>
            <Grid item>
              <div className={classes.actions} id="toolbarBtn">
                {permissions.addMyProfile ? (
                  <Fab
                    color="primary"
                    aria-label="Add"
                    className={classes.button}
                    onClick={this.redirectTo}
                    id="btnAdd"
                  >
                    <AddIcon />
                  </Fab>
                ) : null}
                {/* <Fab
                  id="export"
                  color="primary"
                  aria-label="Export"
                  className={classes.button}
                  onClick={this.onShowExport}
                >
                  <FormattedMessage {...messages.btnExport}>
                    {(titleExport) => (
                      <Tooltip title={titleExport}>
                        <CloudDownload />
                      </Tooltip>
                    )}
                  </FormattedMessage>
                </Fab> */}
                {/* <Fab
                  id="import"
                  color="secondary"
                  aria-label="Import"
                  className={classes.button}
                  onClick={this.onShowImport}
                >
                  <FormattedMessage {...messages.btnImport}>
                    {(titleImport) => (
                      <Tooltip title={titleImport}>
                        <CloudUpload />
                      </Tooltip>
                    )}
                  </FormattedMessage>
                </Fab> */}
                {permissions.deleteMyProfile ? (
                  <Fab
                    id="delete_multi"
                    color="secondary"
                    aria-label="DeleteMulties"
                    className={classes.button}
                    onClick={this.onShowDialog}
                    disabled={!isSelectMultiesRow}
                    style={
                      !isSelectMultiesRow
                        ? {}
                        : { color: 'white', background: colorDelete }
                    }
                  >
                    <FormattedMessage {...messages.titleToolBarDelete}>
                      {(titleDelete) => (
                        <Tooltip title={titleDelete}>
                          <DeleteIcon />
                        </Tooltip>
                      )}
                    </FormattedMessage>
                  </Fab>
                ) : null}
              </div>
            </Grid>
          </Grid>
        </Toolbar>
      </React.Fragment>
    );
  }
}

MyProfileManagementToolbar.propTypes = {
  classes: PropTypes.object,
  statusListSelector: PropTypes.array,
  onSearchDataTable: PropTypes.func,
  onDeleteMultiesRow: PropTypes.func,
  isSelectMultiesRow: PropTypes.bool,
  onAddMyProfile: PropTypes.func,
  onExport: PropTypes.func,
  onImport: PropTypes.func,

  statusFilter: PropTypes.array,
  departmentsIdFilter: PropTypes.array,

  // statusList: PropTypes.array,
  onChangeFilter: PropTypes.func,
  searchTxt: PropTypes.string,
};

export default withStyles(toolbarStyles)(MyProfileManagementToolbar);
