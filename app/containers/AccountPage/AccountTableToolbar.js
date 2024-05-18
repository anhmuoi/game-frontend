import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { lighten, fade } from '@material-ui/core/styles/colorManipulator';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import Input from '@material-ui/core/Input';
import SearchIcon from '@material-ui/icons/Search';
import Fab from '@material-ui/core/Fab';

import { Grid, Hidden, Tooltip } from '@material-ui/core';
import AlertDialogSlideUI from 'components/AlertDialogSlideUI';
import messages from './messages';
import { colorDelete } from '../../utils/constants.js';
import SearchUI from '../../components/SearchUI/index.js';

export const toolbarStyles = (theme) => ({
  root: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  actions: {
    color: theme.palette.text.secondary,
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

export class AccountTableToolbar extends React.Component {
  state = {
    showDialog: false,
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

  changeTextSearch = (e) => this.props.onSearchDataTable(e.target.value);

  render() {
    const { classes, title, onAddAccount, isSelectMultiesRow } = this.props;
    const { showDialog } = this.state;

    return (
      <React.Fragment>
        <AlertDialogSlideUI
          onOpen={showDialog}
          messsage={<span />}
          title={<FormattedMessage {...messages.confirmDelete} />}
          onActionAgree={this.onActionAgreeConfirm}
          onCloseDialog={this.onCloseDialog}
        />
        <Toolbar className={classNames(classes.root)}>
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
            alignItems="center"
            justify="flex-end"
          >
            <Grid item>
              <SearchUI onSearchData={this.changeTextSearch} />
            </Grid>
            <Grid item>
              <div className={classes.actions}>
                <Fab
                  id="addAccount"
                  color="primary"
                  aria-label="Add"
                  className={classes.button}
                  onClick={onAddAccount}
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
                  style={
                    !isSelectMultiesRow
                      ? {}
                      : { color: 'white', background: colorDelete }
                  }
                >
                  <FormattedMessage {...messages.titleUserToolBarDelete}>
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

AccountTableToolbar.propTypes = {
  onAddAccount: PropTypes.func,
  classes: PropTypes.object.isRequired,
  title: PropTypes.object.isRequired,
  onSearchDataTable: PropTypes.func,
  onDeleteMultiesRow: PropTypes.func,
  isSelectMultiesRow: PropTypes.bool,
};

export default withStyles(toolbarStyles)(AccountTableToolbar);
