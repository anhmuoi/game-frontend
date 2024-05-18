import React from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import { Grid, Hidden } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import messages from './messages';
import SearchUI from '../SearchUI/index.js';

class FindSoldierTableToolbar extends React.Component {
  componentDidMount() {
    // Nothing to do
  }
  render() {
    const { classes, onSearchDataTable, title, meta } = this.props;
    const { search } = meta.toJS();
    return (
      <React.Fragment>
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
            {/* <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <FormattedMessage {...messages.searchBox}>
                {searchBox => (
                  <Input
                    placeholder={searchBox}
                    // disableUnderline
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                    onChange={onSearchDataTable}
                    value={search}
                  />
                )}
              </FormattedMessage>
            </div> */}
          </Grid>
        </Toolbar>
      </React.Fragment>
    );
  }

  static get propTypes() {
    return {
      classes: PropTypes.object.isRequired,
      onSearchDataTable: PropTypes.func,
      title: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
      meta: PropTypes.object,
    };
  }
}

export default FindSoldierTableToolbar;
