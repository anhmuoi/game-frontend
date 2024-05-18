import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import CloudDownload from '@material-ui/icons/CloudDownload';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import { lighten, fade } from '@material-ui/core/styles/colorManipulator';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Input from '@material-ui/core/Input';
import { Grid, Hidden, Tooltip } from '@material-ui/core';
import CloudUpload from '@material-ui/icons/CloudUpload';
import AlertDialogSlideUI from 'components/AlertDialogSlideUI';
import SearchIcon from '@material-ui/icons/Search';
import messages from './messages';
import ExportUI from './ExportUI';
import ImportUI from './ImportUI';
import { colorDelete } from '../../utils/constants.js';
import SearchUI from '../../components/SearchUI/index.js';

const toolbarStyles = (theme) => ({
  root: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  spacer: {
    flex: '1 1 90%',
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
});

class DepartmentTableToolbar extends React.Component {
  state = {
    showImport: false,
    showDialog: false,
    showExport: false,
  };

  importFormat = [
    { name: 'Excel', value: 'excel' },
    { name: 'CSV', value: 'csv' },
  ];

  exportFormat = [
    { name: 'Excel', value: 'excel' },
    { name: 'CSV', value: 'csv' },
  ];

  onCancelImport = () => {
    this.setState({ showImport: false });
  };

  importUser = (file, format) => {
    this.setState({ showImport: false });
    this.props.onImport(file, format);
  };

  onShowImport = () => {
    this.setState({
      showImport: true,
    });
  };

  onExport = (fileType) => {
    this.setState({ showExport: false });
    this.props.onExport(fileType);
  };

  onCancelExport = () => {
    this.setState({ showExport: false });
  };

  onShowExport = () => {
    this.setState({
      showExport: true,
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

  render() {
    const {
      classes,
      title,
      onSearchDataTable,
      isSelectMultiesRow,
      addDepartment,
      viewOnly,
    } = this.props;
    const { showDialog } = this.state;

    return (
      <React.Fragment>
        <ImportUI
          show={this.state.showImport}
          onCancelImport={this.onCancelImport}
          onImport={this.importUser}
          acceptFormats={this.importFormat}
          defaultFormat="excel"
        />
        <ExportUI
          show={this.state.showExport}
          onExport={this.onExport}
          acceptFormats={this.exportFormat}
          defaultFormat="excel"
          onCancelExport={this.onCancelExport}
        />
        <AlertDialogSlideUI
          onOpen={showDialog}
          messsage={<span />}
          title={
            <span>
              <FormattedMessage {...messages.confirmDelete} />
            </span>
          }
          onActionAgree={this.onActionAgreeConfirm}
          onCloseDialog={this.onCloseDialog}
        />
        <Toolbar className={classes.root}>
          <Hidden smDown>
            <React.Fragment>
              <div className={classes.title}>
                <Typography variant="h6" id="tableTitle">
                  {title}
                </Typography>
              </div>
            </React.Fragment>
          </Hidden>
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="center"
          >
            <SearchUI onSearchData={onSearchDataTable} />

            {/* {!viewOnly && ( */}
            <div className={classes.actions} id="toolbarBtn">
              <Fab
                color="primary"
                aria-label="Add"
                className={classes.button}
                onClick={addDepartment}
              >
                <AddIcon />
              </Fab>
              <Fab
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
                <DeleteIcon />
              </Fab>
              <Fab
                id="export"
                color="primary"
                aria-label="Export"
                className={classes.button}
                onClick={this.onShowExport}
              >
                <FormattedMessage {...messages.titleDepartmentExport}>
                  {(titleExport) => (
                    <Tooltip title={titleExport}>
                      <CloudDownload />
                    </Tooltip>
                  )}
                </FormattedMessage>
              </Fab>
              <Fab
                id="import"
                color="secondary"
                aria-label="Import"
                className={classes.button}
                onClick={this.onShowImport}
              >
                <FormattedMessage {...messages.titleDepartmentImport}>
                  {(titleImport) => (
                    <Tooltip title={titleImport}>
                      <CloudUpload />
                    </Tooltip>
                  )}
                </FormattedMessage>
              </Fab>
            </div>
            {/* )} */}
          </Grid>
        </Toolbar>
      </React.Fragment>
    );
  }
}

DepartmentTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.object,
  onSearchDataTable: PropTypes.func,
  isSelectMultiesRow: PropTypes.bool,
  addDepartment: PropTypes.func,
  onDeleteMultiesRow: PropTypes.func,
  viewOnly: PropTypes.bool,
  onExport: PropTypes.func,
  onImport: PropTypes.func,
};
export default withStyles(toolbarStyles)(DepartmentTableToolbar);
