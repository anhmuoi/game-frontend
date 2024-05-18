import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

const styles = theme => ({
  iconBtn: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    padding: 0,
  },
});

export class PaginationActions extends React.PureComponent {
  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  render() {
    const { classes, count, page, rowsPerPage } = this.props;

    return (
      <React.Fragment>
        <IconButton
          className={classes.iconBtn}
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
          id="btn-previous-page"
        >
          <KeyboardArrowLeft />
        </IconButton>
        <IconButton
          className={classes.iconBtn}
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          id="btn-next-page"
          aria-label="Next Page"
        >
          <KeyboardArrowRight />
        </IconButton>
      </React.Fragment>
    );
  }
}

PaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default withStyles(styles, {
  withTheme: true,
})(PaginationActions);
