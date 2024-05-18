import {
  Fab,
  Grid,
  Hidden,
  Toolbar,
  Tooltip,
  Typography,
  withStyles,
} from '@material-ui/core';
import { PropTypes } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
// import SelectUI from 'components/SelectUI';
import { fade, lighten } from '@material-ui/core/styles/colorManipulator';
import DeleteIcon from '@material-ui/icons/Delete';
import AlertDialogSlideUI from 'components/AlertDialogSlideUI';
import MultiSelectUI from 'components/MultiSelectUI/MultiSelect';
import SearchUI from '../../components/SearchUI/index.js';
import { colorDelete } from '../../utils/constants.js';
import { localstoreUtilites } from '../../utils/persistenceData';
import messages from './messages';

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

class WorkLogToolbar extends React.Component {
  state = {
    showDialog: false,
  };

  onChangeFilterWorkLog = (name, value) => {
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

  render() {
    const {
      classes,
      onSearchDataTable,
      search,
      isSelectMultiesRow,

      userIds,
      userDataSelector,
      folderLogs,
      folderLogsListSelector,

      onChangeFilterWorkLog,
    } = this.props;

    const { showDialog } = this.state;

    const lang = localstoreUtilites.getLanguageFromLocalStorage();
    const permissions = localstoreUtilites.getPermissionsFromLocalStorage()
      .user;

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
          <Hidden smDown>
            <React.Fragment>
              <div className={classes.title}>
                <Typography variant="h6" id="tableTitle">
                  <FormattedMessage {...messages.workLog} />
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
                name="search"
                onSearchData={(e) => onChangeFilterWorkLog(e)}
              />
            </Grid>
            <Grid item md={2} style={{ marginRight: '16px' }}>
              <MultiSelectUI
                value={userIds}
                onChange={onChangeFilterWorkLog}
                options={userDataSelector}
                name="userIds"
                label={<FormattedMessage {...messages.user} />}

                // textHelperError={status.errorMessage}
              />
            </Grid>

            <Grid item />
            <Grid item md={2}>
              <MultiSelectUI
                value={folderLogs}
                onChange={onChangeFilterWorkLog}
                options={folderLogsListSelector}
                name="folderLogs"
                label={<FormattedMessage {...messages.folderLog} />}

                // textHelperError={status.errorMessage}
              />
            </Grid>
            <Grid item>
              <div className={classes.actions} id="toolbarBtn">
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
                  <FormattedMessage {...messages.deleteWorkLog}>
                    {(titleDelete) => (
                      <Tooltip title={titleDelete}>
                        <DeleteIcon />
                      </Tooltip>
                    )}
                  </FormattedMessage>
                </Fab>
              </div>
            </Grid>
          </Grid>
        </Toolbar>
      </React.Fragment>
    );
  }
}

WorkLogToolbar.propTypes = {
  classes: PropTypes.object,
  statusListSelector: PropTypes.array,
  onSearchDataTable: PropTypes.func,
  onDeleteMultiesRow: PropTypes.func,
  isSelectMultiesRow: PropTypes.bool,

  statusFilter: PropTypes.array,
  departmentsIdFilter: PropTypes.array,

  // statusList: PropTypes.array,
  onChangeFilterWorkLog: PropTypes.func,
  search: PropTypes.string,
};

export default withStyles(toolbarStyles)(WorkLogToolbar);
