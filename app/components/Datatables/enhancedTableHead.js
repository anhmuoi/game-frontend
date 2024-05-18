import React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
// import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import Checkbox from '@material-ui/core/Checkbox';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { getStyleCellTableWidth } from './enhancedTableUtilities';

class EnhancedTableHead extends React.Component {
  state = {
    anchorEl: null,
  };

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    const { onPatchHeaderColumns, headers } = this.props;
    this.setState({ anchorEl: null });
    if (onPatchHeaderColumns) {
      onPatchHeaderColumns(headers);
    }
  };

  createSortHandler = (property) => (event) => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { anchorEl } = this.state;

    const {
      onSelectAllClick,
      order,
      orderBy,
      checkAll,
      classes,
      headers,
      isNotCheckedRow,
      backGroundHeader,
      extendHeader,
      hasIndex,
      useCheckNotAll,
      checkOnlyOne,
      notViewAction,
    } = this.props;
    return (
      <TableHead className="p-datatable-thead">
        {extendHeader && (
          <TableRow>
            {extendHeader.map((ext, idx) => (
              <TableCell
                key={ext.id}
                className={`${classes.tableHeader} ${
                  ext.center ? classes.tableHeaderCenter : ''
                } ${backGroundHeader}`}
                colSpan={ext.colspan}
                padding="checkbox"
                style={getStyleCellTableWidth(extendHeader, idx)}
              >
                {ext.label}
              </TableCell>
            ))}
          </TableRow>
        )}
        <TableRow>
          <TableCell
            align="right"
            padding="none"
            className={`${classes.tableHeader} ${classes.tableHeaderCenter} ${backGroundHeader}`}
            style={{ width: '15px' }}
          >
            <MoreVertIcon onClick={this.handleClick} />
          </TableCell>
          {!isNotCheckedRow &&
            (!useCheckNotAll ? (
              <TableCell
                padding="checkbox"
                className={`${classes.cellTableCheckBoxHeader} ${backGroundHeader}`}
                id="selectAll"
              >
                <Checkbox
                  disabled={checkOnlyOne}
                  checked={checkAll}
                  onChange={onSelectAllClick}
                />
                {/* <div className={classes.topLine} /> */}
              </TableCell>
            ) : (
              <TableCell
                padding="checkbox"
                className={`${classes.cellTableCheckBoxHeader} ${backGroundHeader}`}
              />
            ))}
          {hasIndex && (
            <TableCell
              padding="checkbox"
              style={{ padding: '12px', textAlign: 'left' }}
              className={`${classes.cellTableCheckBoxHeader} ${backGroundHeader}`}
            >
              <FormattedMessage {...messages.index} />
            </TableCell>
          )}
          {headers.map(
            (row, idx) =>
              row.id !== 'id' &&
              (!notViewAction || row.id !== 'action') &&
              row.isVisible && (
                <TableCell
                  style={getStyleCellTableWidth(headers, idx)}
                  key={row.id}
                  padding="checkbox"
                  sortDirection={orderBy === row.id ? order : false}
                  className={`${classes.tableHeader} ${
                    row.center ? classes.tableHeaderCenter : ''
                  } ${backGroundHeader}`}
                >
                  <FormattedMessage {...messages.rightClickToHide}>
                    {(message) => (
                      <Tooltip title={message}>
                        <span>{row.label}</span>
                      </Tooltip>
                    )}
                  </FormattedMessage>
                  {/* <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    // onClick={this.createSortHandler(row.id)}
                  >
                    <span className="p-column-title">{row.label}</span>
                  </TableSortLabel>
                </Tooltip> */}

                  {/* <div className={classes.topLine} /> */}
                </TableCell>
              ),
            this,
          )}
        </TableRow>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          {headers.map(
            (header) =>
              header.id.toLowerCase() !== 'action' &&
              header.id.toLowerCase() !== 'id' &&
              !header.id.includes('#') && (
                <MenuItem
                  key={header.id}
                  onClick={() => this.props.selectColumn(header.id)}
                >
                  <Checkbox checked={header.isVisible} /> {header.label}
                </MenuItem>
              ),
          )}
        </Menu>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  checkAll: PropTypes.bool,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string,
  orderBy: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  headers: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  extendHeader: PropTypes.array,
  isNotCheckedRow: PropTypes.bool,
  backGroundHeader: PropTypes.string,
  hasIndex: PropTypes.bool,
  useCheckNotAll: PropTypes.bool,
  selectColumn: PropTypes.func,
  checkOnlyOne: PropTypes.bool,
  onPatchHeaderColumns: PropTypes.func,
  notViewAction: PropTypes.bool,
};

EnhancedTableHead.defaultProps = {
  checkOnlyOne: false,
  notViewAction: true,
};

export default EnhancedTableHead;
