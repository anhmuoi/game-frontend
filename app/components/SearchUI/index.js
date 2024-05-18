/* eslint-disable no-prototype-builtins */
/* eslint-disable react/no-danger */
/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
import { withStyles } from '@material-ui/core';
import Input from '@material-ui/core/Input';
import SearchIcon from '@material-ui/icons/Search';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from './messages.js';
import { styles } from './styles.js';

class SearchUI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes, value, onSearchData, placeholder, name } = this.props;

    return (
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <FormattedMessage {...messages.searchBox}>
          {(searchBox) => (
            <Input
              name={name}
              placeholder={placeholder}
              // disableUnderline
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              onChange={onSearchData}
            />
          )}
        </FormattedMessage>
      </div>
    );
  }
}

SearchUI.propTypes = {
  value: PropTypes.string,
  classes: PropTypes.object,
  onSearchData: PropTypes.func,
};

export default injectIntl(withStyles(styles)(SearchUI));
