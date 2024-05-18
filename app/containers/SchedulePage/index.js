/* eslint-disable indent */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Grid, Typography, Popper, Button } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import ScheduleIcon from '@material-ui/icons/Schedule';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import Tooltip from '@material-ui/core/Tooltip';
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import InputUI from 'components/InputUI';
import moment from "moment";
import { FormattedMessage, injectIntl } from 'react-intl';
import { isSameHour, sub } from 'date-fns';
import messages from './messages';
import { colorDelete } from '../../utils/constants.js';

import "./bigCalendar.css";
import AlertDialogSlideUI from 'components/AlertDialogSlideUI';
import { RESTART_ON_REMOUNT } from 'utils/constants';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import { styles } from './styles';
import { makeSelectLoading } from '../App/selectors';
import { localstoreUtilites } from 'utils/persistenceData';
import AddScheduleModal from './AddScheduleModal'
import CalendarMenu from './CalendarMenu';
import FilterSchedule from './FilterSchedule';
import {
  getScheduleData,
  getScheduleInit,
  changeTextField,
  resetScheduleModel,
  getScheduleInfo,
  postScheduleAdd,
  putScheduleUpdate,
  validateSchedule,
  deleteSchedule,
  getRemainingHoliday
} from './actions';
import {
  getAjaxInfo,
  getCategoryListData,
  getCreatedByListData,
  getDepartmentListData,
  getCategoryTypesData,
  getTypeScheduleListData,
  makeScheduleDataSelector,
  makeScheduleModelSelector,
  getRemainingHolidaySelector
} from './selectors';
import { CATEGORY_TYPES } from './constants.js';
import { mapScheduleModelUiToApi, getColorFromId } from './scheduleUtilities'

moment.locale("en", {
	week: {
		dow: 1
	}
});
const localizer = momentLocalizer(moment);
const permission = localstoreUtilites.getPermissionsFromLocalStorage();
const accountId = localstoreUtilites.getAccountIdFromLocalStorage();
const DragAndDropCalendar = withDragAndDrop(Calendar);

export class SchedulePage extends React.Component {
  state = {
    currentDate: new Date(),
    eventsData: [],
    event: null,
    isOpenModal: false,
    currentScheduleId: 0,
    scheduleData: {},
    anchorEl: null,
    openDetail: false,
    showDialogConfirm: false,
    accountFilter: [],
    departmentFilter: [],
    categoryTypesFilter: [],
    isHoliday: false,
    types: [],
    contextMenuPosition: null,
    startDateHandleSlot: new Date(),
    endDateHandleSlot: new Date(),
  };

  componentDidMount() {
    const folderLogId = this.props.match.params.folderId;
    const { currentDate } = this.state;
    this.props.onGetScheduleInit();
    setTimeout(() => {
      this.props.onGetScheduleData({
        pageNumber: 1,
        pageSize: 999999,
        sortColumn: 0,
        sortDirection: 'desc',
        search: '',
        folderLogId: [],
        date: currentDate,
        accounts: this.state.accountFilter,
        departments: this.state.departmentFilter,
        categoryTypes: this.state.categoryTypesFilter,
        types: this.state.types
      });
    }, 500);
    document.addEventListener('click', this.handleDocumentClick);
  }
  componentWillUnmount(){
    document.removeEventListener('click', this.handleDocumentClick);
  }
  componentDidUpdate(prevProps, prevState) {
    const { currentDate } = this.state;
    const prevCurrentDate = prevState.currentDate;

    if (currentDate.getMonth() !== prevCurrentDate.getMonth()) {
        this.props.onGetScheduleData({
            pageNumber: 1,
            pageSize: 999999,
            sortColumn: 0,
            sortDirection: 'desc',
            search: '',
            folderLogId: [],
            date: currentDate,
            accounts: this.state.accountFilter,
            departments: this.state.departmentFilter,
            categoryTypes: this.state.categoryTypesFilter,
            types: this.state.types
        });
    }

    if (prevProps.datas !== this.props.datas) {
        this.mapData();
    }
  }
  componentWillReceiveProps(nextProps) {
    const ajaxSuccess = nextProps.ajaxInfo.toJS();
    if (ajaxSuccess.value) {
      this.props.enqueueSnackbar(ajaxSuccess.message, {
        variant: 'success',
      });
    }
  }
  mapData = () => {
    const { datas, accounts } = this.props;
    const mappedData = datas.map(item => {
      const startDate = new Date(item.startDate);
      const endDate = new Date(item.endDate);
      const createdBy = accounts.find(account => account.id === item.createdBy);

      return {
        id: item.id,
        title: item.title,
        start: startDate,
        end: endDate,
        type: item.type,
        desc: item.content,
        createdBy: item.createdBy,
        createdByName: createdBy ? createdBy.name : "Unknown"
      };
    });
    this.setState({ eventsData:  mappedData });
  };
  
  components = {
    event: ({ event }) => {
      const { classes } = this.props;
      const [colorMain, colorFaint] = getColorFromId(event.createdBy);
      if (event) {
        return <Grid className={classes.eventPublic} style={{backgroundColor: `${colorMain}`}}>
          <Typography style={{color: 'white'}}>({event.createdByName}) <strong>{event.title}</strong></Typography>
        </Grid>;
      } else {
        return null;
      }
    }
  };
  openModal = (event) => {
    if (event.id !== 0) {
      this.props.onEditRow(event.id);
    }
    this.setState({ 
      isOpenModal: true,
      openDetail: false,
      currentScheduleId: event.id,
    });
    this.props.onGetRemainingHoliday();
  };

  closeModal = () => {
    this.setState({ isOpenModal: false, isModalDetailOpen: false, isHoliday: false });
  };
  saveSchedule = (currentScheduleId) => {
    const { onAddNewSchedule, onEditSchedule, scheduleModel, match } = this.props;
    const { currentDate } = this.state;
    const folderLogId = match.params.folderId;

    if (currentScheduleId === 0) {
      onAddNewSchedule(mapScheduleModelUiToApi(scheduleModel.toJS(), false)); // add
    } else {
      onEditSchedule(currentScheduleId, mapScheduleModelUiToApi(scheduleModel.toJS(), true)); // edit
    }
    this.closeModal();
    setTimeout(() => {
      this.props.onGetScheduleData({
        pageNumber: 1,
        pageSize: 999999,
        sortColumn: 0,
        sortDirection: 'desc',
        search: '',
        folderLogId: [],
        date: currentDate,
        accounts: this.state.accountFilter,
        departments: this.state.departmentFilter,
        categoryTypes: this.state.categoryTypesFilter,
        types: this.state.types
      });
    }, 500);
    this.mapData();
  };

  handleSelectSlot = (slotInfo) => {

    console.log(slotInfo);
    const { start, end, box, bounds, action } = slotInfo;
    if (box) {
      const position = { left: box.clientX , top: box.clientY };
      if (action === 'click') {
        this.setState({ 
          contextMenuPosition: position,
          startDateHandleSlot: start,
          endDateHandleSlot: end,
        });
      }
    }
    else if (bounds) {
      const position = { left: bounds.x, top: bounds.y};
    
      if (action === 'select') {
        this.setState({ 
          contextMenuPosition: position,
          startDateHandleSlot: start,
          endDateHandleSlot: end,
        });
      }
    }
    else{
      this.props.resetModel();
      this.props.onChangeTextField('startDate', start);
      this.props.onChangeTextField('endDate', this.convertToPreviousDayNoon(end));

      const event = {
        id: 0
      };
      this.openModal(event)
    }
  };
  handleSelectSlotSub = (categoryType) => {

    const { startDateHandleSlot, endDateHandleSlot } = this.state;
    this.props.resetModel();
    this.props.onChangeTextField('startDate', startDateHandleSlot);
    this.props.onChangeTextField('endDate', this.convertToPreviousDayNoon(endDateHandleSlot));

    const event = {
      id: 0
    };
    if (categoryType === CATEGORY_TYPES.HOLIDAY) {
      this.setState({ isHoliday: true });
    }
    this.openModal(event)
  };
  handleDocumentClick = (event) => {
    const { classes } = this.props;
    const contextMenu = document.querySelector(`.${classes.contextMenu}`);
    if (contextMenu && !contextMenu.contains(event.target)) {
      this.setState({ contextMenuPosition: null });
    }
  }

  onEventDrop = ({ event, start, end }) => {
    const { onEditSchedule, datas } = this.props;

    this.props.onChangeTextField('startDate', start);
    this.props.onChangeTextField('endDate', this.convertToPreviousDayNoon(end));
    this.props.onChangeTextField('id', event.id);
    this.props.onChangeTextField('title', event.title);
    this.props.onChangeTextField('type', event.type);
    this.props.onChangeTextField('content', event.desc);
    this.props.onChangeTextField('categoryId', datas.filter(item => item.id === event.id).map(item => item.categoryId)[0]);
    
    const { scheduleModel } = this.props;
    onEditSchedule(event.id, mapScheduleModelUiToApi(scheduleModel.toJS(), true)); // edit

    setTimeout(() => {
      this.props.onGetScheduleData({
        pageNumber: 1,
        pageSize: 999999,
        sortColumn: 0,
        sortDirection: 'desc',
        search: '',
        folderLogId: [],
        date: currentDate,
        accounts: this.state.accountFilter,
        departments: this.state.departmentFilter,
        categoryTypes: this.state.categoryTypesFilter,
        types: this.state.types
      });
    }, 500);
    this.mapData();
  };
  convertToPreviousDayNoon = (date) => {
    const newDate = new Date(date); 
    const currentHour = newDate.getHours();
    const currentMinute = newDate.getMinutes();
    
    if (currentHour === 0 && currentMinute === 0) {
      newDate.setHours(-12);
      return newDate;
    } else {
      return date;
    }
  };
  onNavigate = (date) => {
    this.setState({currentDate: date})
  };

  handleEventSelect = (event, e) => {
    this.setState({ 
      anchorEl: e.currentTarget,
      event,
      openDetail: !this.state.openDetail
    });
  };
  onClose = () =>{
    this.setState({ openDetail: false });
  };
  onChangeDate = (date) => {
    this.setState({ currentDate: date })
  }

  // modal delete
  onShowDialogConfirm = () =>{
    this.setState({ showDialogConfirm: true });
  };
  onCloseDialogConfirm = () => {
    this.setState({
      showDialogConfirm: false,
    });
  };

  onActionAgreeConfirm = () => {
    const { event, currentDate} = this.state;
    const folderLogId = this.props.match.params.folderId;
    this.props.onDeleteSchedule(event.id);

    this.setState({ openDetail: false })

    setTimeout(() => {
      this.props.onGetScheduleData({
        pageNumber: 1,
        pageSize: 999999,
        sortColumn: 0,
        sortDirection: 'desc',
        search: '',
        folderLogId: [],
        date: currentDate,
        accounts: this.state.accountFilter,
        departments: this.state.departmentFilter,
        categoryTypes: this.state.categoryTypesFilter,
        types: this.state.types
      });
    }, 500);
  };

  onChangeFilter = async (filterAccounts) => {
    const { currentDate} = this.state;
    await this.setState({ accountFilter : filterAccounts });

    this.props.onGetScheduleData({
      pageNumber: 1,
      pageSize: 999999,
      sortColumn: 0,
      sortDirection: 'desc',
      search: '',
      folderLogId: [],
      date: currentDate,
      accounts: filterAccounts,
      departments: this.state.departmentFilter,
      categoryTypes: this.state.categoryTypesFilter,
      types: this.state.types
    });
  };
  onChangeCheckbox = (filter) => {
    const { currentDate} = this.state;
    this.setState({ categoryTypesFilter : filter});

    this.props.onGetScheduleData({
      pageNumber: 1,
      pageSize: 999999,
      sortColumn: 0,
      sortDirection: 'desc',
      search: '',
      folderLogId: [],
      date: currentDate,
      accounts: this.state.accountFilter,
      departments: this.state.departmentFilter,
      categoryTypes: filter,
      types: this.state.types
    });
  };
  onChangePrivate = (types) => {
    const { currentDate, categoryTypesFilter, accountFilter, departmentFilter} = this.state;
    this.setState({ types : types});
    this.props.onGetScheduleData({
      pageNumber: 1,
      pageSize: 999999,
      sortColumn: 0,
      sortDirection: 'desc',
      search: '',
      folderLogId: [],
      date: currentDate,
      accounts: accountFilter,
      categoryTypes: categoryTypesFilter,
      departments: departmentFilter,
      types: types
    });
  };
  onChangeDepartmentFilter = (departments) => {
    const { currentDate, categoryTypesFilter, accountFilter, types} = this.state;
    this.setState({ departmentFilter : departments});
    this.props.onGetScheduleData({
      pageNumber: 1,
      pageSize: 999999,
      sortColumn: 0,
      sortDirection: 'desc',
      search: '',
      folderLogId: [],
      date: currentDate,
      accounts: accountFilter,
      categoryTypes: categoryTypesFilter,
      departments: departments,
      types: types
    });
  };
  
  render() {
    const { 
      datas, 
      classes, 
      types, 
      categories,
      onChangeTextField, 
      scheduleModel, 
      onValidateSchedule, 
      intl,
      accounts,
      departments,
      categoryTypes,
      remainingHoliday
    } = this.props;
    const { 
      currentDate,
      eventsData, 
      isOpenModal, 
      currentScheduleId,
      scheduleData,
      anchorEl,
      openDetail,
      event,
      isHoliday,
      contextMenuPosition
    } = this.state;

    const { showDialogConfirm } = this.state;

    let formattedDateTime = '';
    let maincolorDetail = '';
    let paintcolorDetail = '';
    if (event) {
      const startDate = new Date(event.start);
      const endDate = new Date(event.end);


      if (startDate.toDateString() !== endDate.toDateString()) {
        const formattedStart = moment(startDate).format("MMMM dd, yyyy (hh:mm a)");
        const formattedEnd = moment(endDate).format("MMMM dd, yyyy (hh:mm a)");
        formattedDateTime = `${formattedStart} - ${formattedEnd}`;
      } else {
        const formattedStart = moment(startDate).format("MMMM dd, yyyy (hh:mm a");
        const formattedEnd = moment(endDate).format("hh:mm a)");
        formattedDateTime = `${formattedStart} - ${formattedEnd}`;
      }

      // get color
      const [colorMain, colorFaint] = getColorFromId(event.createdBy);
      maincolorDetail = colorMain;
      paintcolorDetail = colorFaint;
    }

    return (
        <Paper container>
          <AlertDialogSlideUI
            onOpen={showDialogConfirm}
            messsage={<span />}
            title={<FormattedMessage {...messages.confirmDelete} />}
            onActionAgree={this.onActionAgreeConfirm}
            onCloseDialog={this.onCloseDialogConfirm}
          />
          <AddScheduleModal
            classes={classes}
            isOpenModal={isOpenModal && permission.schedule.addSchedule}
            onCloseModal={this.closeModal}
            currentScheduleId={currentScheduleId}
            scheduleModel={scheduleModel.toJS()}
            scheduleData={scheduleData}
            types={types}
            categories={categories}
            onChangeTextField={onChangeTextField}
            onSaveSchedule={this.saveSchedule}
            onValidateSchedule={onValidateSchedule}
            intl={intl}
            isHoliday={isHoliday}
            remainingHoliday={remainingHoliday}
          />
          <Grid container style={{display: 'flex', justifyContent: 'space-evenly',flexDirection: 'row'}}>
            <Grid item xs={2} sm={2} style={{display: 'flex', flexDirection: 'column', justifyContent:'flex-start', 
            paddingTop: '10px', overflowY: 'auto', maxHeight: 'calc(100vh - 64px)'}}>
                <Grid item className={classes.subBtnAdd}>
                  <Button
                    variant="contained"
                    color="primary"
                    aria-label="Add"
                    className={classes.btnAddSchedule}
                    onClick={() => {
                      this.handleSelectSlot({start: new Date(), end: new Date()});
                    }}
                  >
                    <Tooltip
                      key="TooltipAdd"
                      title={<FormattedMessage {...messages.addSchedule} />}
                    >
                      <FormattedMessage {...messages.addSchedule} />
                    </Tooltip>
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    aria-label="Add"
                    className={classes.btnAddSchedule}
                    onClick={() => {
                      this.handleSelectSlot({start: new Date(), end: new Date()});
                      this.setState({ isHoliday: true });
                    }}
                  >
                    <Tooltip
                      key="TooltipAdd"
                      title={<FormattedMessage {...messages.addHoliday} />}
                    >
                      <FormattedMessage {...messages.addHoliday} />
                    </Tooltip>
                  </Button>
                </Grid>
              <CalendarMenu classes={classes} onChangeDate={this.onChangeDate} events={eventsData} today={currentDate}/>
              <FilterSchedule 
                classes={classes}
                onChangeFilter={this.onChangeFilter}
                accountListSelector={[...accounts]}
                accountFilter={this.state.accountFilter}
                departmentListSelector={[...departments]}
                departmentFilter={this.state.departmentFilter}
                onChangeDepartments={this.onChangeDepartmentFilter}
                onChangeCheckbox={this.onChangeCheckbox}
                onChangePrivate={this.onChangePrivate}
                categoryTypesCheck={[...categoryTypes]}
              />
            </Grid>
            <Grid item xs={10} sm={10} style={{ padding: '0px 5px 5px 5px'}}>
              <DragAndDropCalendar
                views={["day","week","month","agenda"]}
                selectable
                localizer={localizer}
                culture="en"
                date={currentDate}
                defaultView="month"
                events={eventsData}
                components={this.components}
                style={{ height: "100vh" }}
                onSelectEvent={this.handleEventSelect}
                onSelectSlot={this.handleSelectSlot}
                onNavigate={this.onNavigate}
                onEventDrop={this.onEventDrop}
                onEventResize={this.onEventDrop}
              />
              {contextMenuPosition && (
              <Paper 
                className={classes.contextMenu} 
                style={{ top: contextMenuPosition.top, left: contextMenuPosition.left}}
              >
                <Button
                    variant="contained"
                    aria-label="Add"
                    className={classes.contextMenuButton}
                    onClick={() => {
                      this.handleSelectSlotSub(CATEGORY_TYPES.SCHEDULE);
                    }}
                  >
                    <Tooltip
                      key="TooltipAdd"
                      title={<FormattedMessage {...messages.addSchedule} />}
                    >
                      <FormattedMessage {...messages.addSchedule} />
                    </Tooltip>
                  </Button>
                  <Button
                    variant="contained"
                    aria-label="Add"
                    className={classes.contextMenuButton}
                    onClick={() => {
                      this.handleSelectSlotSub(CATEGORY_TYPES.HOLIDAY);
                      this.setState({ isHoliday: true });
                    }}
                  >
                    <Tooltip
                      key="TooltipAdd"
                      title={<FormattedMessage {...messages.addHoliday} />}
                    >
                      <FormattedMessage {...messages.addHoliday} />
                    </Tooltip>
                  </Button>
              </Paper>
          )}
            </Grid>
          </Grid>
          <Popper
            open={openDetail}
            anchorEl={anchorEl}
            placement="left-start"
            modifiers={[
              {
                name: 'offset',
                options: {
                  offset: [0, 10],
                },
                flip: {
                  enabled: true,
                },
              },
            ]}
            className="custom-popper"
          >
            {event && <Paper>
              <Grid container spacing={16} className={classes.ePopup}>
                <Grid item xs={12} sm={12} className={classes.epopupHeader}>
                  <Grid className={classes.eHeaderIcon}>
                    <Button onClick={this.onClose} aria-label="Close" className={classes.iconActionInCell}>
                      <Tooltip
                        key="TooltipClose"
                        title={<FormattedMessage {...messages.titleClose} />}
                      >
                        <CloseIcon />
                      </Tooltip>
                    </Button>
                  </Grid>
                  <Grid className={classes.eHeaderTitle}>
                    {<Typography 
                      className={classes.eTitleWrap} style={{background: `${paintcolorDetail}`, borderLeft: `6px solid ${maincolorDetail}`}}>
                            {event.title}
                        </Typography>}
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={12} className={classes.epopupContent}>
                  <Grid item className={classes.detailEvent} style={{alignItems:'flex-start'}}>
                    <ScheduleIcon />
                    <Typography className={classes.detailEventText}>{formattedDateTime}</Typography>
                  </Grid>
                  <Grid item className={classes.detailEvent}>
                    <PermIdentityIcon />
                    <Typography className={classes.detailEventText}>{event.createdByName}</Typography>
                  </Grid>
                  {event.type === 1 && (
                    <Grid item className={classes.detailEvent}>
                      <LockOutlinedIcon />
                      <Typography className={classes.detailEventText}><FormattedMessage {...messages.titlePrivate} /></Typography>
                    </Grid>
                  )}
                </Grid>
                <Grid
                  item
                  container
                  sm={12}
                  justify="flex-end"
                  style={{padding:10}}
                  className={classes.epopupFooter}
                >
                  {(event.createdBy == accountId) && permission.schedule.editSchedule && <Button
                    color="primary"
                    aria-label="Edit"
                    className={classes.iconActionInCell}
                    onClick={() => {
                      this.openModal(event);
                    }}
                  >
                    <Tooltip
                      key="TooltipEdit"
                      title={<FormattedMessage {...messages.titleEdit} />}
                    >
                      <EditIcon />
                    </Tooltip>
                  </Button>}
                  {(event.createdBy == accountId) && permission.schedule.deleteSchedule && <Button
                    color="primary"
                    aria-label="Delete"
                    className={classes.iconActionInCell}
                    onClick={this.onShowDialogConfirm}
                  >
                    <Tooltip
                      key="TooltipDelete"
                      title={<FormattedMessage {...messages.btnDelete} />}
                    >
                      <DeleteIcon />
                    </Tooltip>
                  </Button>}
                </Grid>
              </Grid>
            </Paper>}
          </Popper>
        </Paper>
    );
  }
}

SchedulePage.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  classes: PropTypes.object,
  ajaxInfo: PropTypes.object,
  datas: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  onGetScheduleData: PropTypes.func,
  onGetScheduleInit: PropTypes.func,
  onGetRemainingHoliday: PropTypes.func,
  types : PropTypes.array,
  categories: PropTypes.array,
  accounts: PropTypes.array,
  departments: PropTypes.array,
  categoryTypes: PropTypes.array,
  scheduleModel: PropTypes.object,
  resetModel: PropTypes.func,
  onEditRow: PropTypes.func,
  onAddNewSchedule: PropTypes.func,
  onEditSchedule: PropTypes.func,
  onValidateSchedule: PropTypes.func,
  onDeleteSchedule: PropTypes.func,
  remainingHoliday: PropTypes.number
};

export function mapDispatchToProps(dispatch) {
  return {
    onGetScheduleData: queries => dispatch(getScheduleData(queries)),
    onGetScheduleInit: () => dispatch(getScheduleInit()),
    onGetRemainingHoliday: () => dispatch(getRemainingHoliday()),
    onChangeTextField: (ev, date) => {
      if (!ev.target) {
        dispatch(changeTextField(ev, date));
      } else {
        dispatch(changeTextField(ev.target.name, ev.target.value));
      }
    },
    resetModel: () => dispatch(resetScheduleModel()),
    onEditRow: id => dispatch(getScheduleInfo(id)),
    onAddNewSchedule: (schedule) => dispatch(postScheduleAdd(schedule)),
    onEditSchedule: (id, schedule) => dispatch(putScheduleUpdate(id, schedule)),
    onValidateSchedule: (errors) => dispatch(validateSchedule(errors)),
    onDeleteSchedule: id => dispatch(deleteSchedule(id)),
  };
}

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  ajaxInfo: getAjaxInfo(),
  datas: makeScheduleDataSelector(),
  types: getTypeScheduleListData(),
  categories: getCategoryListData(),
  accounts: getCreatedByListData(),
  departments: getDepartmentListData(),
  categoryTypes: getCategoryTypesData(),
  scheduleModel: makeScheduleModelSelector(),
  remainingHoliday: getRemainingHolidaySelector(),
});

const withReducer = injectReducer({ key: 'schedule', reducer });
const withSaga = injectSaga({
  key: 'schedule',
  saga,
  mode: RESTART_ON_REMOUNT,
});
const withConnect = connect(
  mapStateToProps, 
  mapDispatchToProps
);

export default compose(
  withReducer,
  withSaga,
  withConnect,
  injectIntl,
)(withStyles(styles)(SchedulePage));
