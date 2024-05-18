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
import Input from '@material-ui/core/Input';
import { fade, lighten } from '@material-ui/core/styles/colorManipulator';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import AlertDialogSlideUI from 'components/AlertDialogSlideUI';
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

class RoomGameManagementToolbar extends React.Component {
  state = {
    showDialog: false,
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

  render() {
    const { functionLists } = this;
    const {
      classes,
      onSearchDataTable,
      searchTxt,
      isSelectMultiesRow,
      onAddRoomGame,

      onChangeFilter,
    } = this.props;

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
                    <FormattedMessage {...messages.titleRoomGame} />
                  </Typography>
                </div>
              </React.Fragment>
            </Hidden>
          </Grid>
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="center"
          >
            <Grid item>
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <FormattedMessage {...messages.placeholderSearchBox}>
                  {(searchText) => (
                    <Input
                      id="search-input"
                      placeholder={searchText}
                      disableUnderline
                      classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                      }}
                      onChange={(e) => onSearchDataTable(e.target.value)}
                      value={searchTxt}
                    />
                  )}
                </FormattedMessage>
              </div>
            </Grid>
            <Grid item>
              <div className={classes.actions} id="toolbarBtn">
                <Fab
                  color="primary"
                  aria-label="Add"
                  className={classes.button}
                  onClick={onAddRoomGame}
                  id="btnAdd"
                >
                  <AddIcon />
                </Fab>
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
              </div>
            </Grid>
          </Grid>
        </Toolbar>
      </React.Fragment>
    );
  }
}

RoomGameManagementToolbar.propTypes = {
  classes: PropTypes.object,
  statusListSelector: PropTypes.array,
  onSearchDataTable: PropTypes.func,
  onDeleteMultiesRow: PropTypes.func,
  isSelectMultiesRow: PropTypes.bool,
  onAddRoomGame: PropTypes.func,

  // statusList: PropTypes.array,
  onChangeFilter: PropTypes.func,
  searchTxt: PropTypes.string,
};

export default withStyles(toolbarStyles)(RoomGameManagementToolbar);
