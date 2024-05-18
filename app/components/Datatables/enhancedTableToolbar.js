import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import { lighten, fade } from '@material-ui/core/styles/colorManipulator';
import Fab from '@material-ui/core/Fab';

import AddIcon from '@material-ui/icons/Add';
import Input from '@material-ui/core/Input';
import SearchIcon from '@material-ui/icons/Search';

export const widthSearch = WINDOW_WIDTH =>
  WINDOW_WIDTH >= 768 ? WINDOW_WIDTH / 6 : WINDOW_WIDTH / 2;

export const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  spacer: {
    flex: '1 1 90%',
  },
  actions: {
    color: theme.palette.text.secondary,
    width: widthSearch(window.innerWidth),
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
    // color: theme.palette.text.primary,
    // backgroundColor: theme.palette.secondary.dark,
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
    // border: '1px solid #000',
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

const EnhancedTableToolbar = props => {
  const { numSelected, classes, title } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {window.innerWidth >= 768 ? (
        <React.Fragment>
          <div className={classes.title}>
            {numSelected > 0 ? (
              <Typography color="inherit" variant="subtitle1">
                {numSelected} selected
              </Typography>
            ) : (
              <Typography variant="h6" id="tableTitle">
                {title}
              </Typography>
            )}
          </div>
          <div className={classes.spacer} />
        </React.Fragment>
      ) : null}
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <Input
          placeholder="Search…"
          disableUnderline
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
        />
      </div>
      <div className={classes.actions}>
        <Fab color="primary" aria-label="Add" className={classes.button}>
          <AddIcon />
        </Fab>
        <Fab color="primary" aria-label="Edit" className={classes.button}>
          <DeleteIcon />
        </Fab>
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  title: PropTypes.object.isRequired,
};

export default withStyles(toolbarStyles)(EnhancedTableToolbar);
