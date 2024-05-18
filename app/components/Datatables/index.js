/* eslint-disable no-prototype-builtins */
/* eslint-disable react/no-danger */
/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import HTMLReactParser from 'html-react-parser';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import Switch from '@material-ui/core/Switch';
import RefreshIcon from '@material-ui/icons/Refresh';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import SettingsBackupRestore from '@material-ui/icons/SettingsBackupRestore';
import FileCopy from '@material-ui/icons/FileCopy';
import Compare from '@material-ui/icons/Compare';
import Tooltip from '@material-ui/core/Tooltip';
import Link from '@material-ui/core/Link';
import StopIcon from '@material-ui/icons/Stop';
import ClearIcon from '@material-ui/icons/ClearAll';
import UpdateIcon from '@material-ui/icons/SaveAlt';
import RestoreIcon from '@material-ui/icons/Restore';
import NotificationsIcon from '@material-ui/icons/Notifications';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import PrintIcon from '@material-ui/icons/Print';
import Sort from '@material-ui/icons/Sort';
import Sync from '@material-ui/icons/Sync';
import MenuItem from '@material-ui/core/MenuItem';
import { CSSTransition } from 'react-transition-group';
import { FaDoorOpen, FaDoorClosed } from 'react-icons/fa';
import { IoIosDocument } from 'react-icons/io';
import CardIcon from '@material-ui/icons/CreditCard';
import { Fab, Grid, Collapse } from '@material-ui/core';
import SelectUI from 'components/SelectUI';
import AlertDialogSlideUI from 'components/AlertDialogSlideUI';
import { ContextMenuTrigger, ContextMenu } from 'react-contextmenu';
import { secondsToString } from 'utils/dateTimeHelper';
import TimezoneTooltip from './TimezoneTooltip.js';
import EnhancedTableHead from './enhancedTableHead';
import messages from './messages';
import notiMessages from '../Notification/messages';
import ProgressBarSp from './ProgressBarSp';
import './style.css';
import './contextmenu.css';
import { countCreatedDuration } from '../Notification/utils';

import {
  styles,
  // getSorting,
  // stableSort,
  getStyleCellTableWidth,
} from './enhancedTableUtilities';
import { colorDelete } from '../../utils/constants.js';

export const TypeDialog = {
  RESET_DOOR: 'RESET_DOOR',
  REINSTALL_DOOR: 'REINSTALL_DOOR',
  TOGGLE_STATUS: 'TOGGLE_STATUS',
  DELETE_ROW: 'DELETE_ROW',
};

class EnhancedTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      headers: [],
      checkAll: false,
      selected: [],
      showDialog: false,
      idSelected: null,
      sortDirection: 'desc',
      orderBy: '',
      idToggleStatus: null,
      toogleStatus: null,
      typeDialog: '',
      alertMessage: messages.titleChangeStatus,
      alertTooltip: null,
      alertTitle: '',
      headerScroll: (Math.random() * 1000).toFixed(0),
      bodyScroll: (Math.random() * 1000).toFixed(0),
      bodyClient: (Math.random() * 1000).toFixed(0),
      selectedId: 0, // should use with isEnableSelectedRow
      selectedCompany: 0,
      hoverRow: null,
      offsetX: 0,
      offsetY: 0,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.initSelected &&
      nextProps.data.length !== this.props.data.length
    ) {
      const { selected } = this.state;
      const { data, rowsSelected } = this.props;
      let newSelected = selected;
      const nextIds = nextProps.data.map((item) => item.id);
      const ids = data.map((item) => item.id);
      nextIds.forEach((item) => {
        if (!ids.includes(item)) {
          newSelected = [...newSelected, item];
        }
      });
      this.setState({ selected: newSelected, checkAll: true });
      rowsSelected(newSelected);
    }
    if (nextProps.selectAll) {
      const ids = nextProps.data.map((item) => item.id);
      this.setState({ selected: ids });
    }
    if (this.props.selectAll && !nextProps.selectAll) {
      this.setState({ selected: [] });
    }
    if (nextProps.refreshSelect) {
      this.setState({ selected: [] });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const nextIds = nextProps.data ? nextProps.data.map((item) => item.id) : [];
    const selected = [];

    // nextState.selected.forEach((item) => {
    //   if (nextIds.includes(item)) {
    //     selected.push(item);
    //   }
    // });
    // if (nextState.selected.length !== selected.length) {
    //   this.setState({ selected });
    //   this.props.rowsSelected(selected);
    //   return false;
    // }
    // if (
    //   nextState.checkAll &&
    //   ((nextProps.data && nextProps.data.length === 0) ||
    //     nextProps.data.length !== selected.length)
    // ) {
    //   this.setState({ checkAll: false });
    //   return false;
    // }
    if (
      !nextState.checkAll &&
      nextProps.data &&
      nextProps.data.length !== 0 &&
      nextProps.data.length === selected.length
    ) {
      this.setState({ checkAll: true });
      return false;
    }
    // this.props.rowsSelected

    if (nextProps.headers !== this.props.headers) {
      const { headers } = nextProps;
      this.setState({
        headers: headers.map((header) => ({
          ...header,
          isVisible: header.isVisible === undefined ? true : header.isVisible,
        })),
      });
      const savedHeaders = JSON.parse(localStorage.getItem(this.props.id));
      if (savedHeaders) {
        this.setState({
          headers: headers.map((header) => ({
            ...header,
            isVisible: savedHeaders.includes(header.id),
          })),
        });
      }
      return false;
    }
    return true;
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let sortDirection = 'desc';

    if (
      this.state.orderBy === property &&
      this.state.sortDirection === 'desc'
    ) {
      sortDirection = 'asc';
    }

    this.setState({ sortDirection, orderBy });
  };

  handleSelectAllClick = (event) => {
    let checkAll;
    if (event.target.checked) {
      const { data, rowsSelected } = this.props;
      const ids = data.map((n) => n.id);
      checkAll = true;
      this.setState({ selected: ids, checkAll });
      // set rows selected for state parent
      rowsSelected(ids);
      return;
    }
    checkAll = false;
    this.setState({ selected: [], checkAll });
    this.props.rowsSelected([]);
  };

  handleClick = (event, id) => {
    const { selected, selectedCompany } = this.state;
    const {
      rowsSelected,
      data,
      isNotCheckedRow,
      isEnableSelectedRow,
      checkOnlyOne,
    } = this.props;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = checkOnlyOne ? [id] : newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    const idArr = data.map((item) => item.id);
    // newSelected = newSelected.filter((item) => idArr.includes(item));
    const checkAll = newSelected.length === idArr.length;
    if (!isNotCheckedRow) {
      this.setState({ selected: newSelected, checkAll });
    } else if (isEnableSelectedRow) {
      this.setState({ selectedId: id });
    }

    if (checkOnlyOne) {
      if (selectedCompany === id) {
        this.setState({ selectedCompany: 0 });
      } else {
        this.setState({ selectedCompany: id });
      }
    }
    // set rows selected for state parent
    rowsSelected(newSelected);
  };

  /**
   * @param(event) object: event happen when onclick change number page
   * @param(pageNumberUI) number: page number
   */
  handleChangePage = async (event, pageNumberUI) => {
    await this.props.onChangePageNumber(pageNumberUI + 1);
    await this.pagingRemote(pageNumberUI, null);
  };

  handleChangeRowsPerPage = async (event) => {
    if (event.target.value !== 0) {
      await this.props.onChangePageSize(event.target.value);
      await this.pagingRemote(null, event.target.value);
    }
  };

  onscrollLeft = (event) => {
    document.getElementById(`${this.state.headerScroll}`).style.marginLeft = `${
      -1 * event.target.scrollLeft
    }px`;
  };

  /**
   * 200406
   * Remove this function because can not understand its purpose
   * author WooCheol
   */
  // resizeEvent = () => {
  //   const divClient = document.getElementById(this.state.bodyClient);
  //   const divScroll = document.getElementById(this.state.bodyScroll);

  //   if (divClient && divScroll) {
  //     document.getElementById(this.state.headerScroll).style.marginRight =
  //       divScroll.clientHeight > divClient.clientHeight
  //         ? window.chrome
  //           ? '8px'
  //           : '17px'
  //         : '0px';
  //     document.getElementById(this.state.headerScroll).style.width = `${
  //       divClient.scrollWidth
  //     }px`;
  //   }
  // };

  hideColumn = (id) => {
    const { headers } = this.state;
    const { onChangeHeaderVisibles } = this.props;

    // Only do when id props is exist
    if (this.props.id) {
      const newHeaders = headers.map((header) => ({
        ...header,
        isVisible: header.id === id ? !header.isVisible : header.isVisible,
      }));
      this.setState({
        headers: newHeaders,
      });
      if (!onChangeHeaderVisibles) {
        localStorage.setItem(
          this.props.id,
          JSON.stringify(
            newHeaders
              .filter((saved) => saved.isVisible)
              .map((saved) => saved.id),
          ),
        );
      } else {
        onChangeHeaderVisibles(newHeaders);
      }
    }
  };

  getSelectedColumns = async () => {
    const { headers } = this.props;
    await this.setState({
      headers: headers.map((header) => ({
        ...header,
        isVisible: header.isVisible === undefined ? true : header.isVisible,
      })),
    });
    const savedHeaders = JSON.parse(localStorage.getItem(this.props.id));
    if (savedHeaders) {
      await this.setState({
        headers: headers.map((header) => ({
          ...header,
          isVisible: savedHeaders.includes(header.id),
        })),
      });
    }
  };

  async componentDidMount() {
    // window.addEventListener('resize', this.resizeEvent);
    await this.getSelectedColumns();
    this.setState({
      selected: this.props.selectedIdsDefault || [],
    });
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    // this.resizeEvent();
  }

  componentWillUnmount() {
    // window.removeEventListener('resize', this.resizeEvent);
  }

  // 26.02.2019 KSJ ADD to remove error of eslint or prettier
  handleChangeProgressBar = (row) => {
    if (row.progressbar.length > 0) {
      return row.progressbar.map((item) => {
        const key = item + row.id;
        return <ProgressBarSp key={key} progressId={item} />;
      });
    }
    return null;
  };

  // 19.03.2019 KSJ ADD
  handleProcessesAction = (row) => {
    const {
      classes,
      onClearProgrecesses,
      onStopProgrecesses,
      onRestoreProcesses,
      onActionProcesses,
      onReinstallDoor,
      onTransmitAllData,
    } = this.props;
    const func = onActionProcesses(row.progressbar);
    return func ? (
      <Button
        color="primary"
        aria-label="Update-action"
        className={classes.iconActionInCell}
        onClick={(event) => {
          event.stopPropagation();
          if (func === onReinstallDoor) {
            this.onShowDialog([row.id], TypeDialog.REINSTALL_DOOR);
          } else if (func === onTransmitAllData) {
            // this.onShowTransmitModal(row.id);
            // this.setState({ selected: [row.id] });
            this.props.showTransmitModal([row.id]);
          } else {
            func([row.id]);
          }
        }}
      >
        {func === onStopProgrecesses ? (
          <Tooltip
            key="TooltipActionStop"
            title={<FormattedMessage {...messages.btnActionStop} />}
          >
            <StopIcon />
          </Tooltip>
        ) : func === onClearProgrecesses ? (
          <Tooltip
            key="TooltipActionClear"
            title={<FormattedMessage {...messages.btnActionClear} />}
          >
            <ClearIcon />
          </Tooltip>
        ) : func === onRestoreProcesses ? (
          <Tooltip
            key="TooltipActionRestore"
            title={<FormattedMessage {...messages.btnActionRestore} />}
          >
            <RestoreIcon />
          </Tooltip>
        ) : func === onReinstallDoor ? (
          <Tooltip
            key="TooltipReinstall"
            title={<FormattedMessage {...messages.btnReinstall} />}
          >
            <SettingsBackupRestore />
          </Tooltip>
        ) : func === onTransmitAllData ? (
          <Tooltip
            key="TooltipTransmitAllData"
            title={<FormattedMessage {...messages.btnTransmitAllData} />}
          >
            <SettingsBackupRestore />
          </Tooltip>
        ) : (
          <Tooltip
            key="TooltipActionUpdate"
            title={<FormattedMessage {...messages.btnActionUpdate} />}
          >
            <UpdateIcon />
          </Tooltip>
        )}
      </Button>
    ) : null;
  };

  pagingRemote = (pageNumberUI, pageSizeUI) => {
    const { data, meta } = this.props;
    const {
      pageNumber,
      pageSize,
      // sortDirection,
      // sortColumn,
      // parentSelectedId,
      // cloneSortColumn,
    } = meta.toJS();
    if (data && pageNumber !== 0) {
      const pageNext = pageNumberUI != null ? pageNumberUI + 1 : pageNumber;
      const pageSizeCount = pageSizeUI != null ? pageSizeUI : pageSize;
      this.props.onPagingRemote({
        ...meta.toJS(),
        pageNumber: pageNext,
        pageSize: pageSizeCount,
      });
      // this.props.onPagingRemote({
      //   pageNumber: pageNext,
      //   pageSize: pageSizeCount,
      //   // orderBy: 0,
      //   sortColumn,
      //   sortDirection,
      //   parentSelectedId,
      //   // cloneSortColumn,
      // });
    }
  };

  editRow = (n) => {
    const {
      viewOnly,
      onEditRow,
      isEditShowModal,
      assignModal,
      history,
      onAddCardUser,
    } = this.props;
    if (assignModal) {
      onEditRow();
    } else {
      if (!viewOnly && onEditRow) {
        if (!isEditShowModal) {
          history.push(onEditRow(`/${n.id}`));
        } else {
          onEditRow(n.id, n);
        }
      }
      if (!viewOnly && onAddCardUser) {
        onAddCardUser();
      }
    }
  };

  /**
   * @param(id) number: id of user is selected on table
   */
  isSelected = (id) => {
    if (this.props.checkOnlyOne === true) {
      if (this.state.selected === []) {
        // return this.state.selected.indexOf(id) !== 0;
        return this.state.selectedCompany !== id;
      }
      // return this.state.selected.indexOf(id) === 0;
      return this.state.selectedCompany === id;
    }
    return (
      this.state.selectedId === id || this.state.selected.indexOf(id) !== -1
    );
  };

  htmlparse = (plainText) =>
    typeof plainText === 'string' ? HTMLReactParser(plainText) : plainText;
  /**
   * @param(row) object: row data display on table, row is transmitted from parent component
   * @param(classes) object: style for row
   */
  renderRows = (row, classes, copyToClipboard) => {
    const { headers } = this.state;
    const { id, intl } = this.props;

    return (
      <React.Fragment>
        {headers
          .filter((header) => header.isVisible && row.hasOwnProperty(header.id))
          .map((header) => header.id)
          .map((property) => {
            const idx = headers.map((item) => item.id).indexOf(property);
            if (property === 'id' || property === 'action') return null;
            if(property === 'color'){
              return (
                <TableCell
                  scope="row"
                  padding="checkbox"
                  key={row.id + idx}
                  className={
                    headers[idx] && headers[idx].contentCenter
                      ? classes.cellTableBodyCenter
                      : classes.cellTableBody
                  }
                  style={getStyleCellTableWidth(headers, idx)}
                >
                  <Grid style={{width: 20, height: 20, backgroundColor: `${row.color}`, borderRadius: 2}}></Grid>
                </TableCell>
              );
            }
            if (property === 'progressbar') {
              return (
                <TableCell
                  scope="row"
                  padding="checkbox"
                  key={row.id + idx}
                  className={classes.cellTableBody}
                  style={getStyleCellTableWidth(headers, idx)}
                >
                  {this.handleChangeProgressBar(row)}
                </TableCell>
              );
            } /* else if (property === 'timezone') {
              return (
                <TableCell
                  scope="row"
                  padding="checkbox"
                  onMouseEnter={() => this.setState({ hoverRow: row.id })}
                  onMouseLeave={() => this.setState({ hoverRow: null })}
                  key={row.id + idx}
                  className={
                    headers[idx] && headers[idx].contentCenter
                      ? classes.cellTableBodyCenter
                      : classes.cellTableBody
                  }
                  style={getStyleCellTableWidth(headers, idx)}
                >
                  {row[property]}
                  {this.state.hoverRow === row.id ? (
                    <TimezoneTooltip timezoneId={row.tzId} />
                  ) : (
                    ''
                  )}
                </TableCell>
              );
            } */ else if (
              property === 'processStatus'
            ) {
              const isLong = row[property] && row[property].length > 12;
              const displayVal = isLong
                ? row[property].substr(0, 11).concat('...')
                : row[property];
              return (
                <Tooltip
                  key={row[property]}
                  title={isLong ? row[property] : ''}
                >
                  <TableCell
                    scope="row"
                    padding="checkbox"
                    key={row.id + idx}
                    className={
                      headers[idx] && headers[idx].contentCenter
                        ? classes.cellTableBodyCenter
                        : classes.cellTableBody
                    }
                    style={getStyleCellTableWidth(headers, idx)}
                    onMouseEnter={() => this.setState({ hoverRow: row.id })}
                    onMouseLeave={() => this.setState({ hoverRow: null })}
                  >
                    {displayVal}
                  </TableCell>
                </Tooltip>
              );
            } else if (property === 'type' && id === 'notificationTbl') {
              return (
                <TableCell
                  scope="row"
                  padding="checkbox"
                  key={row.id + idx}
                  className={
                    headers[idx] && headers[idx].contentCenter
                      ? classes.cellTableBodyCenter
                      : classes.cellTableBody
                  }
                  style={getStyleCellTableWidth(headers, idx)}
                >
                  <span className={classes[`notif${row[property]}TypeText`]}>
                    {row.transType}
                  </span>
                </TableCell>
              );
            } else if (property === 'createdOn' && id === 'notificationTbl') {
              return (
                <TableCell
                  scope="row"
                  padding="checkbox"
                  key={row.id + idx}
                  className={
                    headers[idx] && headers[idx].contentCenter
                      ? classes.cellTableBodyCenter
                      : classes.cellTableBody
                  }
                  style={getStyleCellTableWidth(headers, idx)}
                >
                  {countCreatedDuration(row[property], intl, notiMessages)}
                </TableCell>
              );
            } else if (property === 'content' && id === 'notificationTbl') {
              return (
                <TableCell
                  scope="row"
                  padding="checkbox"
                  key={row.id + idx}
                  className={
                    headers[idx] && headers[idx].contentCenter
                      ? classes.cellTableBodyCenter
                      : classes.cellTableBody
                  }
                  style={getStyleCellTableWidth(headers, idx)}
                >
                  <Link href={row.relatedUrl} underline="none">
                    <span dangerouslySetInnerHTML={{ __html: row[property] }} />
                  </Link>
                </TableCell>
              );
            } else if (property === 'payLoad') {
              return (
                <TableCell
                  scope="row"
                  padding="checkbox"
                  className={classes.cellTableBody}
                  style={getStyleCellTableWidth(headers, idx)}
                  onClick={() => copyToClipboard(row[property])}
                  key={row.id + idx}
                >
                  <div
                    style={{
                      cursor: 'pointer',
                      overflow: 'hidden',
                      width: '200px',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {row.htmlparse
                      ? this.htmlparse(row[property])
                      : row[property]}
                  </div>
                </TableCell>
              );
            } else if (property === 'fwVersion') {
              return (
                <TableCell
                  scope="row"
                  padding="checkbox"
                  key={row.id + idx}
                  className={
                    headers[idx] && headers[idx].contentCenter
                      ? classes.cellTableBodyCenter
                      : classes.cellTableBody
                  }
                  style={getStyleCellTableWidth(headers, idx)}
                >
                  {row[property].version && row[property].version}
                  {row[property].inCardReader && (
                    <div>[In]: {row[property].inCardReader}</div>
                  )}
                  {row[property].outCardReader && (
                    <div>[Out]: {row[property].outCardReader}</div>
                  )}
                  {row[property].nfcModule && (
                    <div>[NfcModule]: {row[property].nfcModule}</div>
                  )}
                </TableCell>
              );
            } else if (
              property === 'cardList' ||
              property === 'plateNumberList'
            ) {
              return (
                <TableCell
                  scope="row"
                  padding="checkbox"
                  key={row.id + idx}
                  className={
                    headers[idx] && headers[idx].contentCenter
                      ? classes.cellTableBodyCenter
                      : classes.cellTableBody
                  }
                  style={getStyleCellTableWidth(headers, idx)}
                >
                  {row[property] && row[property].length > 0 ? (
                    row[property].length > 1 ? (
                      <Tooltip
                        key={property}
                        title={
                          <div>
                            {row[property].map((i) => (
                              <span key={i.cardId}>
                                {i.cardId}
                                <br />
                              </span>
                            ))}
                          </div>
                        }
                      >
                        <div>{row[property][0].cardId}, ...</div>
                      </Tooltip>
                    ) : (
                      row[property][0].cardId
                    )
                  ) : (
                    ''
                  )}
                </TableCell>
              );
            } else if (property === 'upTime') {
              return (
                <TableCell
                  scope="row"
                  padding="checkbox"
                  key={row.id + idx}
                  className={
                    headers[idx] && headers[idx].contentCenter
                      ? classes.cellTableBodyCenter
                      : classes.cellTableBody
                  }
                  style={getStyleCellTableWidth(headers, idx)}
                  // onMouseEnter={() => this.setState({ hoverRow: row.id })}
                  // onMouseLeave={() => this.setState({ hoverRow: null })}
                >
                  <Tooltip
                    key={property}
                    title={secondsToString(row.upTimeOnlineDevice * 60)}
                  >
                    <span>{row[property]}%</span>
                  </Tooltip>
                </TableCell>
              );
            } else if (property && property.toLowerCase().includes('name')) {
              // 2020.05.22 WooCheolKim
              // Display full text when property is about name.
              // It will be fixed when there is better way to display rows
              return (
                <TableCell
                  scope="row"
                  padding="checkbox"
                  key={row.id + idx}
                  className={
                    headers[idx] && headers[idx].contentCenter
                      ? classes.cellTableBodyCenter
                      : classes.cellTableBody
                  }
                  style={getStyleCellTableWidth(headers, idx)}
                >
                  {row[property] && row[property].image ? (
                    <img
                      src={row[property].image}
                      alt=""
                      height="15"
                      width="15"
                      title={row[property].name}
                    />
                  ) : (
                    row[property]
                  )}
                </TableCell>
              );
            } else if (property !== 'id') {
              return (
                <TableCell
                  scope="row"
                  padding="checkbox"
                  key={row.id + idx}
                  className={
                    headers[idx] && headers[idx].contentCenter
                      ? classes.cellTableBodyCenter
                      : classes.cellTableBody
                  }
                  style={getStyleCellTableWidth(headers, idx)}
                >
                  {row[property] && row[property].image ? (
                    <img
                      src={row[property].image}
                      alt=""
                      height="15"
                      width="15"
                      title={row[property].name}
                    />
                  ) : row.htmlparse ? (
                    this.htmlparse(row[property])
                  ) : (
                    row[property]
                  )}
                </TableCell>
              );
            }
            return null;
          })}
      </React.Fragment>
    );
  };

  onCloseDialog = () => {
    this.setState({
      showDialog: false,
    });
  };

  onActionAgreeConfirm = () => {
    const { idSelected, typeDialog, idToggleStatus, toogleStatus } = this.state;
    switch (typeDialog) {
      case TypeDialog.TOGGLE_STATUS:
        if (idToggleStatus) {
          this.props.onChangeStatus(idToggleStatus, toogleStatus);
        }
        break;
      case TypeDialog.REINSTALL_DOOR:
        this.props.onReinstallDoor(idSelected);
        break;
      case TypeDialog.RESET_DOOR:
        this.props.onResetDevice(idSelected);
        this.setState({ alertMessage: messages.commonConfirm });
        break;
      default:
        if (idSelected) {
          this.props.onDeleteRow(idSelected);
        }
        break;
    }
  };

  onShowDialog = (id, type) => {
    let alertMessage;
    let alertTooltip;
    let alertTitle;

    switch (type) {
      case TypeDialog.REINSTALL_DOOR:
        alertTitle = messages.confirmReInstall;
        alertMessage = messages.warning;
        alertTooltip = messages.confirmReInstallTooltip;
        break;
      case TypeDialog.RESET_DOOR:
        alertMessage = messages.commonConfirm;
        break;
      case TypeDialog.DELETE_ROW:
        alertMessage = this.props.deleteRowMsg;
        break;
      default:
        alertMessage = messages.commonConfirm;
        break;
    }
    this.setState({
      showDialog: true,
      idSelected: id,
      typeDialog: type,
      alertTitle,
      alertMessage,
      alertTooltip,
    });
  };

  onToggleStatus = (id, status) => {
    /**
     * handle something, e.g: alert information to user about switch
     */
    this.setState({
      showDialog: true,
      idToggleStatus: id,
      toogleStatus: !status,
      alertMessage: status
        ? messages.confirmChangeInvalid
        : messages.confirmChangeValid,
      alertTooltip: messages.confirmChangeStatusTooltip,
      typeDialog: TypeDialog.TOGGLE_STATUS,
    });
  };

  handleChangeSelectOrder = async (event) => {
    // const { orderHeader } = this.props;
    await this.props.onChangeSortColumn(
      `${event.target.value}`,
      `${event.target.value}`,
    );
    await this.pagingRemote();
  };

  onClickSortDirection = async () => {
    await this.props.onChangeSortDirection();
    await this.pagingRemote();
  };

  onMouseMove = (e) => {
    this.setState({
      offsetX: e.nativeEvent.clientX,
      offsetY: e.nativeEvent.clientY,
    });
  };

  renderTableChild = (n, index) => {
    const {
      classes,
      onEditRow,
      onDeleteRow,
      meta,
      onChangeStatus,
      isNotPaging,
      isNotCheckedRow,
      viewOnly,
      onViewDetail,
      onSelectInlineRow,
      options,
      onOpenDoor,
      onResetDevice,
      onSendCurrentTime,
      isModifiedRow,
      disableModifiedRow,
      onCopySettingDevice,
      onChangeFilePath,
      onActionProcesses,
      copyToClipboard,
      onCompare,
      notViewAction,
      hasIndex,
      localUsername,
      onAssignCardId,
      contextMenu,
      actionButtons,
      onShowDeviceHistory,
      onHover,
      onDoubleClick,
      onChangeAlarmStatus,
      onIssueCard,
      onPrintCard,
      bActionButtonFrontOf,
      hideEditBtn,
      actionFirst,
    } = this.props;
    const { headers, hoverRow, offsetX, offsetY } = this.state;
    const { pageNumber, pageSize } = isNotPaging ? {} : meta.toJS();
    const isSelected = this.isSelected(n.id);
    return (
      <React.Fragment key={n.id}>
        <CSSTransition
          key={n.id}
          in={n.newMessage}
          appear={n.newMessage}
          classNames={n.newMessageColor}
          timeout={1000}
        >
          <TableRow
            hover
            onDoubleClick={() =>
              onDoubleClick ? onDoubleClick(n) : this.editRow(n)
            }
            onClick={(event) => this.handleClick(event, n.id)}
            role="checkbox"
            aria-checked={isSelected}
            tabIndex={-1}
            key={n.id}
            id={n.id}
            selected={isSelected}
            className="p-datatable-row"
            style={n.style ? n.style : { height: 28, position: 'relative' }}
            onMouseMove={this.onMouseMove}
          >
            <TableCell
              align="right"
              padding="none"
              className={classes.cellTableBody}
              style={{ width: '15px' }}
            >
              &nbsp;
            </TableCell>
            {!isNotCheckedRow && (
              <TableCell
                className={classes.cellTableCheckBox}
                padding="checkbox"
              >
                <Checkbox
                  checked={isSelected}
                  style={{ paddingTop: 0, paddingBottom: 0 }}
                />
              </TableCell>
            )}
            {hasIndex && (
              <TableCell
                style={{
                  width: '50px',
                  // textAlign: 'right',
                  whiteSpace: 'nowrap',
                }}
                className={classes.cellTableBody}
                padding="checkbox"
              >
                {pageSize && pageNumber ? (
                  <div>{pageSize * (pageNumber - 1) + index}</div>
                ) : (
                  <div>{index}</div>
                )}
              </TableCell>
            )}
            {actionFirst ? (
              <React.Fragment>
                {!notViewAction && (
                  <TableCell
                    align="left"
                    padding="none"
                    className={classes.cellTableBody}
                    style={getStyleCellTableWidth(headers, headers.length - 1)}
                  >
                    {actionButtons &&
                      bActionButtonFrontOf &&
                      actionButtons(n, classes)}
                    {!viewOnly && onChangeAlarmStatus && n.useAlarmRelay ? (
                      <Button
                        color="primary"
                        aria-label="alarm"
                        variant="contained"
                        className={classes.iconActionInCell}
                        onClick={(event) => {
                          event.stopPropagation();
                          onChangeAlarmStatus(n.id, !n.alarmStatus);
                        }}
                      >
                        <FormattedMessage {...messages.alarm} />{' '}
                        {n.alarmStatus ? (
                          <NotificationsIcon />
                        ) : (
                          <NotificationsOffIcon />
                        )}
                      </Button>
                    ) : null}
                    {!viewOnly && onChangeStatus ? (
                      <FormattedMessage {...messages.titleChangeStatus}>
                        {(titleChangeStatus) => (
                          <Switch
                            value={n.status.toString()}
                            classes={{
                              checked: classes.colorChecked,
                              bar: classes.colorBar,
                            }}
                            color="primary"
                            title={titleChangeStatus}
                            onChange={() => this.onToggleStatus(n.id, n.status)}
                            checked={n.status}
                            style={{
                              paddingTop: 0,
                              paddingBottom: 0,
                              height: 20,
                            }}
                          />
                        )}
                      </FormattedMessage>
                    ) : null}
                    {!viewOnly && !hideEditBtn && onEditRow ? (
                      <Button
                        color="primary"
                        aria-label="Edit"
                        className={classes.iconActionInCell}
                        onClick={(event) => {
                          event.stopPropagation();
                          this.editRow(n);
                        }}
                      >
                        <Tooltip
                          key="TooltipEdit"
                          title={<FormattedMessage {...messages.btnEdit} />}
                        >
                          <EditIcon />
                        </Tooltip>
                      </Button>
                    ) : null}
                    {!viewOnly && onPrintCard ? (
                      <Button
                        color="primary"
                        aria-label="alarm"
                        // variant="contained"
                        className={classes.iconActionInCell}
                        onClick={(event) => {
                          event.stopPropagation();
                          onPrintCard(n.id);
                        }}
                      >
                        <PrintIcon />
                      </Button>
                    ) : null}
                    {!viewOnly && onIssueCard ? (
                      <Button
                        color="primary"
                        aria-label="alarm"
                        // variant="contained"
                        className={classes.iconActionInCell}
                        onClick={(event) => {
                          event.stopPropagation();
                          onIssueCard(n.id);
                        }}
                      >
                        <CardIcon />
                      </Button>
                    ) : null}
                    {viewOnly && onViewDetail ? (
                      <Button
                        color="primary"
                        aria-label="ViewDetail"
                        className={classes.iconActionInCell}
                        onClick={(event) => {
                          event.stopPropagation();
                          onViewDetail(n.id);
                        }}
                      >
                        <Tooltip
                          key="TooltipViewDetail"
                          title={
                            <FormattedMessage {...messages.btnViewDetail} />
                          }
                        >
                          <IoIosDocument size={24} />
                        </Tooltip>
                      </Button>
                    ) : null}
                    {!viewOnly && onDeleteRow ? (
                      <Button
                        color="secondary"
                        aria-label="Delete"
                        className={classes.iconActionInCell}
                        onClick={(event) => {
                          event.stopPropagation();
                          this.onShowDialog(n.id, TypeDialog.DELETE_ROW);
                        }}
                        disabled={n.username === localUsername}
                        style={
                          n.username === localUsername
                            ? {}
                            : { color: 'white', background: colorDelete }
                        }
                      >
                        <Tooltip
                          key="TooltipDelete"
                          title={<FormattedMessage {...messages.btnDelete} />}
                        >
                          <DeleteIcon />
                        </Tooltip>
                      </Button>
                    ) : null}
                    {!viewOnly && isModifiedRow ? (
                      <SelectUI
                        fullWidth
                        value={n.tzId}
                        onChange={(evt) => onSelectInlineRow(evt, n.id)}
                        options={options}
                        name="tzId"
                        id="tzId"
                        style={{ marginTop: 0 }}
                        disabled={disableModifiedRow}
                      />
                    ) : null}
                    {!viewOnly && onOpenDoor ? (
                      <Button
                        color="primary"
                        aria-label="open-door"
                        className={classes.iconActionInCell}
                        onClick={(event) => {
                          event.stopPropagation();
                          onOpenDoor(n.id, n);
                        }}
                      >
                        <Tooltip
                          key="TooltipOpenDoor"
                          title={<FormattedMessage {...messages.btnOpenDoor} />}
                        >
                          {n.openDoor ? (
                            <FaDoorOpen size={24} />
                          ) : (
                            <FaDoorClosed size={24} />
                          )}
                        </Tooltip>
                      </Button>
                    ) : null}
                    {!viewOnly && onResetDevice ? (
                      <Button
                        color="primary"
                        aria-label="reset-device"
                        className={classes.iconActionInCell}
                        onClick={(event) => {
                          event.stopPropagation();
                          this.onShowDialog(n.id, TypeDialog.RESET_DOOR);
                        }}
                      >
                        <Tooltip
                          key="TooltipResetDevice"
                          title={
                            <FormattedMessage {...messages.btnResetDevice} />
                          }
                        >
                          <RefreshIcon />
                        </Tooltip>
                      </Button>
                    ) : null}
                    {onSendCurrentTime ? (
                      <Button
                        color="primary"
                        aria-label="set-time"
                        className={classes.iconActionInCell}
                        onClick={(event) => {
                          event.stopPropagation();
                          onSendCurrentTime(n.id, n);
                        }}
                      >
                        <Tooltip
                          key="TooltipSetTime"
                          title={
                            <FormattedMessage
                              {...messages.btnSendCurrentTime}
                            />
                          }
                        >
                          <Sync />
                        </Tooltip>
                      </Button>
                    ) : null}
                    {/* {!viewOnly && onReinstallDoor ? (
                          <Button
                            color="primary"
                            aria-label="reinstall-door"
                            className={classes.iconActionInCell}
                            onClick={event => {
                              event.stopPropagation();
                              this.onShowDialog(
                                n.id,
                                TypeDialog.REINSTALL_DOOR,
                              );
                            }}
                          >
                            <Tooltip
                              title={
                                <FormattedMessage
                                  {...messages.btnReinstall}
                                />
                              }
                            >
                              <SettingsBackupRestore />
                            </Tooltip>
                          </Button>
                        ) : null} */}
                    {!viewOnly && onCopySettingDevice ? (
                      <Button
                        color="primary"
                        aria-label="copy-setting"
                        className={classes.iconActionInCell}
                        onClick={(event) => {
                          onCopySettingDevice(n.id);
                          event.stopPropagation();
                        }}
                      >
                        <Tooltip
                          key="TooltipCopySetting"
                          title={
                            <FormattedMessage
                              {...messages.btnCopySettingDevice}
                            />
                          }
                        >
                          <FileCopy />
                        </Tooltip>
                      </Button>
                    ) : null}
                    {/* 21.02.2019 KSJ ADD */}
                    {onChangeFilePath ? ( // !viewOnly
                      <input
                        name={n.target}
                        type="file"
                        id={n.target}
                        onChange={onChangeFilePath}
                      />
                    ) : null}
                    {onAssignCardId && (
                      <Button
                        color="primary"
                        aria-label="assign-card-visitor"
                        className={classes.iconActionInCell}
                        onClick={(event) => {
                          onAssignCardId(4, [n.id]);
                          event.stopPropagation();
                        }}
                      >
                        <Tooltip
                          key="TooltipAssignCardVisitor"
                          title={
                            <FormattedMessage {...messages.btnAssignCard} />
                          }
                        >
                          <CardIcon />
                        </Tooltip>
                      </Button>
                    )}
                    {/* 21.03.2019 KSJ ADD */}
                    {onActionProcesses ? this.handleProcessesAction(n) : null}
                    {onCompare ? (
                      <Button
                        color="primary"
                        aria-label="copy-setting"
                        className={classes.iconActionInCell}
                        onClick={() => onCompare(n)}
                      >
                        <Tooltip
                          key="TooltipOnCompare"
                          title={<FormattedMessage {...messages.btnCompare} />}
                        >
                          <Compare />
                        </Tooltip>
                      </Button>
                    ) : null}
                    {onShowDeviceHistory ? (
                      <Button
                        color="primary"
                        aria-label="device-history"
                        className={classes.iconActionInCell}
                        onClick={(event) => {
                          event.stopPropagation();
                          onShowDeviceHistory(n.id);
                        }}
                      >
                        <Tooltip
                          key="TooltipDeviceHistory"
                          title={
                            <FormattedMessage {...messages.deviceHistory} />
                          }
                        >
                          <AccessTimeIcon />
                        </Tooltip>
                      </Button>
                    ) : null}
                    {actionButtons &&
                      !bActionButtonFrontOf &&
                      actionButtons(n, classes)}
                  </TableCell>
                )}
                {this.renderRows(n, classes, copyToClipboard)}
              </React.Fragment>
            ) : (
              <React.Fragment>
                {this.renderRows(n, classes, copyToClipboard)}
                {!notViewAction && (
                  <TableCell
                    align="right"
                    padding="none"
                    className={classes.cellTableBody}
                    style={getStyleCellTableWidth(headers, headers.length - 1)}
                  >
                    {actionButtons &&
                      bActionButtonFrontOf &&
                      actionButtons(n, classes)}
                    {!viewOnly && onChangeAlarmStatus && n.useAlarmRelay ? (
                      <Button
                        color="primary"
                        aria-label="alarm"
                        variant="contained"
                        className={classes.iconActionInCell}
                        onClick={(event) => {
                          event.stopPropagation();
                          onChangeAlarmStatus(n.id, !n.alarmStatus);
                        }}
                      >
                        <FormattedMessage {...messages.alarm} />{' '}
                        {n.alarmStatus ? (
                          <NotificationsIcon />
                        ) : (
                          <NotificationsOffIcon />
                        )}
                      </Button>
                    ) : null}
                    {!viewOnly && onChangeStatus ? (
                      <FormattedMessage {...messages.titleChangeStatus}>
                        {(titleChangeStatus) => (
                          <Switch
                            value={n.status.toString()}
                            classes={{
                              checked: classes.colorChecked,
                              bar: classes.colorBar,
                            }}
                            color="primary"
                            title={titleChangeStatus}
                            onChange={() => this.onToggleStatus(n.id, n.status)}
                            checked={n.status}
                            style={{
                              paddingTop: 0,
                              paddingBottom: 0,
                              height: 20,
                            }}
                          />
                        )}
                      </FormattedMessage>
                    ) : null}
                    {!viewOnly && !hideEditBtn && onEditRow ? (
                      <Button
                        color="primary"
                        aria-label="Edit"
                        className={classes.iconActionInCell}
                        onClick={(event) => {
                          event.stopPropagation();
                          this.editRow(n);
                        }}
                      >
                        <Tooltip
                          key="TooltipEdit"
                          title={<FormattedMessage {...messages.btnEdit} />}
                        >
                          <EditIcon />
                        </Tooltip>
                      </Button>
                    ) : null}
                    {!viewOnly && onPrintCard ? (
                      <Button
                        color="primary"
                        aria-label="alarm"
                        // variant="contained"
                        className={classes.iconActionInCell}
                        onClick={(event) => {
                          event.stopPropagation();
                          onPrintCard(n.id);
                        }}
                      >
                        <PrintIcon />
                      </Button>
                    ) : null}
                    {!viewOnly && onIssueCard ? (
                      <Button
                        color="primary"
                        aria-label="alarm"
                        // variant="contained"
                        className={classes.iconActionInCell}
                        onClick={(event) => {
                          event.stopPropagation();
                          onIssueCard(n.id);
                        }}
                      >
                        <CardIcon />
                      </Button>
                    ) : null}
                    {viewOnly && onViewDetail ? (
                      <Button
                        color="primary"
                        aria-label="ViewDetail"
                        className={classes.iconActionInCell}
                        onClick={(event) => {
                          event.stopPropagation();
                          onViewDetail(n.id);
                        }}
                      >
                        <Tooltip
                          key="TooltipViewDetail"
                          title={
                            <FormattedMessage {...messages.btnViewDetail} />
                          }
                        >
                          <IoIosDocument size={24} />
                        </Tooltip>
                      </Button>
                    ) : null}
                    {!viewOnly && onDeleteRow ? (
                      <Button
                        color="primary"
                        aria-label="Delete"
                        className={classes.iconActionInCell}
                        onClick={(event) => {
                          event.stopPropagation();
                          this.onShowDialog(n.id, TypeDialog.DELETE_ROW);
                        }}
                        disabled={n.username === localUsername}
                      >
                        <Tooltip
                          key="TooltipDelete"
                          title={<FormattedMessage {...messages.btnDelete} />}
                        >
                          <DeleteIcon />
                        </Tooltip>
                      </Button>
                    ) : null}
                    {!viewOnly && isModifiedRow ? (
                      <SelectUI
                        fullWidth
                        value={n.tzId}
                        onChange={(evt) => onSelectInlineRow(evt, n.id)}
                        options={options}
                        name="tzId"
                        id="tzId"
                        style={{ marginTop: 0 }}
                        disabled={disableModifiedRow}
                      />
                    ) : null}
                    {!viewOnly && onOpenDoor ? (
                      <Button
                        color="primary"
                        aria-label="open-door"
                        className={classes.iconActionInCell}
                        onClick={(event) => {
                          event.stopPropagation();
                          onOpenDoor(n.id, n);
                        }}
                      >
                        <Tooltip
                          key="TooltipOpenDoor"
                          title={<FormattedMessage {...messages.btnOpenDoor} />}
                        >
                          {n.openDoor ? (
                            <FaDoorOpen size={24} />
                          ) : (
                            <FaDoorClosed size={24} />
                          )}
                        </Tooltip>
                      </Button>
                    ) : null}
                    {!viewOnly && onResetDevice ? (
                      <Button
                        color="primary"
                        aria-label="reset-device"
                        className={classes.iconActionInCell}
                        onClick={(event) => {
                          event.stopPropagation();
                          this.onShowDialog(n.id, TypeDialog.RESET_DOOR);
                        }}
                      >
                        <Tooltip
                          key="TooltipResetDevice"
                          title={
                            <FormattedMessage {...messages.btnResetDevice} />
                          }
                        >
                          <RefreshIcon />
                        </Tooltip>
                      </Button>
                    ) : null}
                    {onSendCurrentTime ? (
                      <Button
                        color="primary"
                        aria-label="set-time"
                        className={classes.iconActionInCell}
                        onClick={(event) => {
                          event.stopPropagation();
                          onSendCurrentTime(n.id, n);
                        }}
                      >
                        <Tooltip
                          key="TooltipSetTime"
                          title={
                            <FormattedMessage
                              {...messages.btnSendCurrentTime}
                            />
                          }
                        >
                          <Sync />
                        </Tooltip>
                      </Button>
                    ) : null}
                    {/* {!viewOnly && onReinstallDoor ? (
                          <Button
                            color="primary"
                            aria-label="reinstall-door"
                            className={classes.iconActionInCell}
                            onClick={event => {
                              event.stopPropagation();
                              this.onShowDialog(
                                n.id,
                                TypeDialog.REINSTALL_DOOR,
                              );
                            }}
                          >
                            <Tooltip
                              title={
                                <FormattedMessage
                                  {...messages.btnReinstall}
                                />
                              }
                            >
                              <SettingsBackupRestore />
                            </Tooltip>
                          </Button>
                        ) : null} */}
                    {!viewOnly && onCopySettingDevice ? (
                      <Button
                        color="primary"
                        aria-label="copy-setting"
                        className={classes.iconActionInCell}
                        onClick={(event) => {
                          onCopySettingDevice(n.id);
                          event.stopPropagation();
                        }}
                      >
                        <Tooltip
                          key="TooltipCopySetting"
                          title={
                            <FormattedMessage
                              {...messages.btnCopySettingDevice}
                            />
                          }
                        >
                          <FileCopy />
                        </Tooltip>
                      </Button>
                    ) : null}
                    {/* 21.02.2019 KSJ ADD */}
                    {onChangeFilePath ? ( // !viewOnly
                      <input
                        name={n.target}
                        type="file"
                        id={n.target}
                        onChange={onChangeFilePath}
                      />
                    ) : null}
                    {onAssignCardId && (
                      <Button
                        color="primary"
                        aria-label="assign-card-visitor"
                        className={classes.iconActionInCell}
                        onClick={(event) => {
                          onAssignCardId(4, [n.id]);
                          event.stopPropagation();
                        }}
                      >
                        <Tooltip
                          key="TooltipAssignCardVisitor"
                          title={
                            <FormattedMessage {...messages.btnAssignCard} />
                          }
                        >
                          <CardIcon />
                        </Tooltip>
                      </Button>
                    )}
                    {/* 21.03.2019 KSJ ADD */}
                    {onActionProcesses ? this.handleProcessesAction(n) : null}
                    {onCompare ? (
                      <Button
                        color="primary"
                        aria-label="copy-setting"
                        className={classes.iconActionInCell}
                        onClick={() => onCompare(n)}
                      >
                        <Tooltip
                          key="TooltipOnCompare"
                          title={<FormattedMessage {...messages.btnCompare} />}
                        >
                          <Compare />
                        </Tooltip>
                      </Button>
                    ) : null}
                    {onShowDeviceHistory ? (
                      <Button
                        color="primary"
                        aria-label="device-history"
                        className={classes.iconActionInCell}
                        onClick={(event) => {
                          event.stopPropagation();
                          onShowDeviceHistory(n.id);
                        }}
                      >
                        <Tooltip
                          key="TooltipDeviceHistory"
                          title={
                            <FormattedMessage {...messages.deviceHistory} />
                          }
                        >
                          <AccessTimeIcon />
                        </Tooltip>
                      </Button>
                    ) : null}
                    {actionButtons &&
                      !bActionButtonFrontOf &&
                      actionButtons(n, classes)}
                  </TableCell>
                )}
              </React.Fragment>
            )}
          </TableRow>
        </CSSTransition>

        {contextMenu && contextMenu(n)}
        {onHover && hoverRow === n.id && (
          <div
            style={{
              position: 'fixed',
              top: offsetY,
              left: offsetX,
              width: '100%',
              zIndex: 999,
            }}
          >
            {onHover(n)}
          </div>
        )}
      </React.Fragment>
    );
  };

  renderTable = () => {
    const {
      classes,
      data,
      // meta,
      // isNotPaging,
      tableHeight,
      isFold,
      collapsedHeight,
      contextMenu,
    } = this.props;
    const { bodyScroll, bodyClient, headers } = this.state;
    // const { orderBy, bodyScroll, bodyClient, headers } = this.state;
    // const { sortDirection } = isNotPaging ? {} : meta.toJS();
    let index = 0;
    return (
      <div
        className={classNames(
          'p-datatable-scrollable-body',
          classes.tableWrapper,
        )}
        style={{
          borderBottom: '1px solid black',
          height: !isFold
            ? !collapsedHeight
              ? typeof tableHeight === 'object'
                ? tableHeight.height
                : tableHeight
              : collapsedHeight
            : tableHeight || '',
        }}
        id={bodyClient}
        onScroll={(event) => this.onscrollLeft(event)}
      >
        <Table className="p-datatable-scrollable-body-table" style={{ top: 0 }}>
          <TableBody className="p-datatable-tbody" id={bodyScroll}>
            {data && data.length > 0 ? (
              // stableSort(data, getSorting(sortDirection, orderBy))
              data.slice(0, data.length).map((n) => {
                index += 1;
                return contextMenu ? (
                  <ContextMenuTrigger
                    id={`contextmenu_${n.id}`}
                    key={`key_${n.id}`}
                  >
                    {this.renderTableChild(n, index)}
                  </ContextMenuTrigger>
                ) : (
                  this.renderTableChild(n, index)
                );
              })
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={headers.length}>
                  <FormattedMessage {...messages.noData} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  };

  renderIndex = () => {
    const {
      classes,
      data,
      children,
      meta,
      isNotPaging,
      isNotCheckedRow,
      stylePaging,
      extendClasses,
      extendHeader,
      hasIndex,
      orderHeader,
      notShowSortColumn,
      collapsedHeight,
      isFold,
      useCheckNotAll,
      id,
      checkOnlyOne,
      onPatchHeaderColumns,
      notViewAction,
      contentEdit,
    } = this.props;
    const {
      checkAll,
      showDialog,
      orderBy,
      alertTitle,
      alertMessage,
      alertTooltip,
      headerScroll,
      headers,
    } = this.state;
    const {
      pageNumber,
      pageSize,
      recordsFiltered,
      sortDirection,
      sortColumn,
    } = isNotPaging ? {} : meta.toJS();
    return (
      <React.Fragment>
        <AlertDialogSlideUI
          onOpen={showDialog}
          messsage={alertTitle ? <FormattedMessage {...alertTitle} /> : null}
          title={
            <span>
              <FormattedMessage {...alertMessage} />
            </span>
          }
          tooltip={alertTooltip ? <FormattedMessage {...alertTooltip} /> : null}
          onActionAgree={this.onActionAgreeConfirm}
          onCloseDialog={this.onCloseDialog}
        />
        {children}

        {contentEdit ? (
          <Grid container spacing={8} style={{ marginTop: 10 }}>
            <Grid item md={4}>
              <Paper style={{ padding: 12 }}>
                <div className="p-datatable p-component p-datatable-scrollable">
                  <div className="p-datatable-scrollable-view">
                    <div className="p-datatable-scrollable-header">
                      <div
                        id={headerScroll}
                        className="p-datatable-scrollable-header-box"
                      >
                        <ContextMenuTrigger id={`headerColumns_${id || ''}`}>
                          <Table className="p-datatable-scrollable-header-table">
                            <EnhancedTableHead
                              backGroundHeader={extendClasses.slice()[0]}
                              checkAll={checkAll}
                              order={sortDirection}
                              orderBy={orderBy}
                              onSelectAllClick={this.handleSelectAllClick}
                              onRequestSort={this.handleRequestSort}
                              rowCount={data ? data.length : 0}
                              classes={classes}
                              headers={headers}
                              isNotCheckedRow={isNotCheckedRow}
                              extendHeader={extendHeader}
                              hasIndex={hasIndex}
                              useCheckNotAll={useCheckNotAll}
                              selectColumn={this.hideColumn}
                              checkOnlyOne={checkOnlyOne}
                              onPatchHeaderColumns={onPatchHeaderColumns}
                              notViewAction={notViewAction}
                            />
                          </Table>
                        </ContextMenuTrigger>
                        <ContextMenu
                          id={`headerColumns_${id || ''}`}
                          onHide={() => {
                            if (onPatchHeaderColumns) {
                              onPatchHeaderColumns(headers);
                            }
                          }}
                        >
                          {headers.map(
                            (header) =>
                              header.id.toLowerCase() !== 'action' &&
                              header.id.toLowerCase() !== 'id' &&
                              !header.id.includes('#') && (
                                <MenuItem
                                  key={header.id}
                                  onClick={() => this.hideColumn(header.id)}
                                >
                                  <Checkbox checked={header.isVisible} />{' '}
                                  {header.label}
                                </MenuItem>
                              ),
                          )}
                        </ContextMenu>
                      </div>
                    </div>
                    {isFold ? (
                      <Collapse
                        in={isFold}
                        collapsedHeight={collapsedHeight}
                        timeout={500}
                      >
                        {this.renderTable()}
                      </Collapse>
                    ) : (
                      <div>{this.renderTable()}</div>
                    )}
                  </div>
                </div>
                {!isNotPaging && (
                  <React.Fragment>
                    {orderHeader ? (
                      <Grid
                        container
                        style={{
                          justifyContent: 'flex-end',
                          marginTop: '10px',
                        }}
                      >
                        {!notShowSortColumn ? (
                          <React.Fragment>
                            <Grid item>
                              <Fab
                                className={classes.fab}
                                id="btn-sort-direction"
                                onClick={this.onClickSortDirection}
                                color="primary"
                                style={
                                  sortDirection === 'asc'
                                    ? { transform: 'rotateX(180deg)' }
                                    : {}
                                }
                              >
                                <Tooltip
                                  key="TooltipBtnSortDirection"
                                  title={
                                    sortDirection === 'asc' ? (
                                      <FormattedMessage
                                        {...messages.ascending}
                                      />
                                    ) : (
                                      <FormattedMessage
                                        {...messages.descending}
                                      />
                                    )
                                  }
                                >
                                  <Sort />
                                </Tooltip>
                              </Fab>
                            </Grid>
                            <Grid item style={{ width: '15%' }}>
                              <SelectUI
                                name="selectSort"
                                label={
                                  <FormattedMessage {...messages.changeSort} />
                                }
                                onChange={this.handleChangeSelectOrder}
                                options={orderHeader}
                                value={sortColumn}
                              />
                            </Grid>
                          </React.Fragment>
                        ) : null}
                        <Grid item style={contentEdit ? { maxWidth: 360 } : {}}>
                          <TablePagination
                            className={stylePaging}
                            component="div"
                            count={recordsFiltered}
                            rowsPerPage={pageSize}
                            page={pageNumber - 1}
                            backIconButtonProps={{
                              'aria-label': 'Previous Page',
                            }}
                            nextIconButtonProps={{
                              'aria-label': 'Next Page',
                            }}
                            onChangePage={this.handleChangePage}
                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                            rowsPerPageOptions={[5, 10, 25, 50, 100]}
                            labelRowsPerPage={
                              <FormattedMessage {...messages.rowsPerPage} />
                            }
                          />
                        </Grid>
                      </Grid>
                    ) : (
                      <TablePagination
                        className={stylePaging}
                        component="div"
                        count={recordsFiltered}
                        rowsPerPage={pageSize}
                        page={pageNumber - 1}
                        backIconButtonProps={{
                          'aria-label': 'Previous Page',
                        }}
                        nextIconButtonProps={{
                          'aria-label': 'Next Page',
                        }}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25, 50, 100]}
                        labelRowsPerPage={
                          <FormattedMessage {...messages.rowsPerPage} />
                        }
                        style={{ marginTop: '10px' }}
                      />
                    )}
                  </React.Fragment>
                )}
              </Paper>
            </Grid>
            <Grid item md={8}>
              {contentEdit}
            </Grid>
          </Grid>
        ) : (
          <React.Fragment>
            <div className="p-datatable p-component p-datatable-scrollable">
              <div className="p-datatable-scrollable-view">
                <div className="p-datatable-scrollable-header">
                  <div
                    id={headerScroll}
                    className="p-datatable-scrollable-header-box"
                  >
                    <ContextMenuTrigger id={`headerColumns_${id || ''}`}>
                      <Table className="p-datatable-scrollable-header-table">
                        <EnhancedTableHead
                          backGroundHeader={extendClasses.slice()[0]}
                          checkAll={checkAll}
                          order={sortDirection}
                          orderBy={orderBy}
                          onSelectAllClick={this.handleSelectAllClick}
                          onRequestSort={this.handleRequestSort}
                          rowCount={data ? data.length : 0}
                          classes={classes}
                          headers={headers}
                          isNotCheckedRow={isNotCheckedRow}
                          extendHeader={extendHeader}
                          hasIndex={hasIndex}
                          useCheckNotAll={useCheckNotAll}
                          selectColumn={this.hideColumn}
                          checkOnlyOne={checkOnlyOne}
                          onPatchHeaderColumns={onPatchHeaderColumns}
                          notViewAction={notViewAction}
                        />
                      </Table>
                    </ContextMenuTrigger>
                    <ContextMenu
                      id={`headerColumns_${id || ''}`}
                      onHide={() => {
                        if (onPatchHeaderColumns) {
                          onPatchHeaderColumns(headers);
                        }
                      }}
                    >
                      {headers.map(
                        (header) =>
                          header.id.toLowerCase() !== 'action' &&
                          header.id.toLowerCase() !== 'id' &&
                          !header.id.includes('#') && (
                            <MenuItem
                              key={header.id}
                              onClick={() => this.hideColumn(header.id)}
                            >
                              <Checkbox checked={header.isVisible} />{' '}
                              {header.label}
                            </MenuItem>
                          ),
                      )}
                    </ContextMenu>
                  </div>
                </div>
                {isFold ? (
                  <Collapse
                    in={isFold}
                    collapsedHeight={collapsedHeight}
                    timeout={500}
                  >
                    {this.renderTable()}
                  </Collapse>
                ) : (
                  <div>{this.renderTable()}</div>
                )}
              </div>
            </div>
            {!isNotPaging && (
              <React.Fragment>
                {orderHeader ? (
                  <Grid
                    container
                    style={{ justifyContent: 'flex-end', marginTop: '10px' }}
                  >
                    {!notShowSortColumn ? (
                      <React.Fragment>
                        <Grid item>
                          <Fab
                            className={classes.fab}
                            id="btn-sort-direction"
                            onClick={this.onClickSortDirection}
                            color="primary"
                            style={
                              sortDirection === 'asc'
                                ? { transform: 'rotateX(180deg)' }
                                : {}
                            }
                          >
                            <Tooltip
                              key="TooltipBtnSortDirection"
                              title={
                                sortDirection === 'asc' ? (
                                  <FormattedMessage {...messages.ascending} />
                                ) : (
                                  <FormattedMessage {...messages.descending} />
                                )
                              }
                            >
                              <Sort />
                            </Tooltip>
                          </Fab>
                        </Grid>
                        <Grid item style={{ width: '15%' }}>
                          <SelectUI
                            name="selectSort"
                            label={
                              <FormattedMessage {...messages.changeSort} />
                            }
                            onChange={this.handleChangeSelectOrder}
                            options={orderHeader}
                            value={sortColumn}
                          />
                        </Grid>
                      </React.Fragment>
                    ) : null}
                    <Grid item>
                      <TablePagination
                        className={stylePaging}
                        component="div"
                        count={recordsFiltered}
                        rowsPerPage={pageSize}
                        page={pageNumber - 1}
                        backIconButtonProps={{
                          'aria-label': 'Previous Page',
                        }}
                        nextIconButtonProps={{
                          'aria-label': 'Next Page',
                        }}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25, 50, 100]}
                        labelRowsPerPage={
                          <FormattedMessage {...messages.rowsPerPage} />
                        }
                      />
                    </Grid>
                  </Grid>
                ) : (
                  <TablePagination
                    className={stylePaging}
                    component="div"
                    count={recordsFiltered}
                    rowsPerPage={pageSize}
                    page={pageNumber - 1}
                    backIconButtonProps={{
                      'aria-label': 'Previous Page',
                    }}
                    nextIconButtonProps={{
                      'aria-label': 'Next Page',
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    labelRowsPerPage={
                      <FormattedMessage {...messages.rowsPerPage} />
                    }
                    style={{ marginTop: '10px' }}
                  />
                )}
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  };

  render() {
    const { classes, isRenderOnPaper, extendClasses } = this.props;

    const classTable = extendClasses.slice();
    classTable.push(classes.root);
    return isRenderOnPaper ? (
      <Paper className={classTable.join(' ')}>{this.renderIndex()}</Paper>
    ) : (
      <React.Fragment>{this.renderIndex()}</React.Fragment>
    );
  }
}

EnhancedTable.propTypes = {
  id: PropTypes.string,
  onChangeSortDirection: PropTypes.func,
  onChangeSortColumn: PropTypes.func,
  extendClasses: PropTypes.array,
  onOpenDoor: PropTypes.func,
  onResetDevice: PropTypes.func,
  onSendCurrentTime: PropTypes.func,
  onSelectInlineRow: PropTypes.func,
  isEditShowModal: PropTypes.bool,
  history: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  classes: PropTypes.object.isRequired,
  headers: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.element,
  ]),
  onPagingRemote: PropTypes.func.isRequired,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  meta: PropTypes.object,
  onChangePageNumber: PropTypes.func,
  onChangePageSize: PropTypes.func,
  rowsSelected: PropTypes.func,
  onChangeStatus: PropTypes.func,
  onReinstallDoor: PropTypes.func,
  onCopySettingDevice: PropTypes.func,
  isNotPaging: PropTypes.bool,
  isNotCheckedRow: PropTypes.bool,
  viewOnly: PropTypes.bool,
  stylePaging: PropTypes.string,
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  isModifiedRow: PropTypes.bool,
  disableModifiedRow: PropTypes.bool,
  deleteRowMsg: PropTypes.object,
  onChangeFilePath: PropTypes.func,
  onClearProgrecesses: PropTypes.func,
  onStopProgrecesses: PropTypes.func,
  onActionProcesses: PropTypes.func,
  copyToClipboard: PropTypes.func,
  notViewAction: PropTypes.bool,
  selectAll: PropTypes.bool,
  onCompare: PropTypes.func,
  extendHeader: PropTypes.array,
  onRestoreProcesses: PropTypes.func,
  onViewDetail: PropTypes.func,
  initSelected: PropTypes.bool, // 11.06.2019 KSJ change array to bool because warning on building page
  hasIndex: PropTypes.bool,
  localUsername: PropTypes.string,
  isEnableSelectedRow: PropTypes.bool,
  tableHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onAssignCardId: PropTypes.func,
  orderHeader: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  isFold: PropTypes.bool,
  collapsedHeight: PropTypes.string,
  onTransmitAllData: PropTypes.func,
  onAddCardUser: PropTypes.func,
  useCheckNotAll: PropTypes.bool,
  checkOnlyOne: PropTypes.bool,
  contextMenu: PropTypes.func,
  actionButtons: PropTypes.func,
  onShowDeviceHistory: PropTypes.func,
  onHover: PropTypes.func,
  intl: PropTypes.any,
  assignModal: PropTypes.any,
  showTransmitModal: PropTypes.func,
  onDoubleClick: PropTypes.func,
  bActionButtonFrontOf: PropTypes.bool,
  hideEditBtn: PropTypes.bool,
  onChangeAlarmStatus: PropTypes.func,
  onIssueCard: PropTypes.func,
  onPrintCard: PropTypes.func,
  isRenderOnPaper: PropTypes.bool,
  onPatchHeaderColumns: PropTypes.func,
  onChangeHeaderVisibles: PropTypes.func,
  refreshSelect: PropTypes.bool,
  actionFirst: PropTypes.bool,
  notShowSortColumn: PropTypes.bool,
  contentEdit: PropTypes.element,
};

EnhancedTable.defaultProps = {
  isNotCheckedRow: false,
  selectAll: false,
  extendClasses: [],
  stylePaging: '',
  deleteRowMsg: messages.commonConfirm,
  notViewAction: true,
  initSelected: false,
  hasIndex: false,
  localUsername: '',
  isFold: false,
  useCheckNotAll: false,
  assignModal: false,
  bActionButtonFrontOf: false,
  hideEditBtn: false,
  checkOnlyOne: false,
  isRenderOnPaper: true,
  actionFirst: false,
  notShowSortColumn: false,
};

export default injectIntl(withStyles(styles)(EnhancedTable));
