import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Fab,
  Grid,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes, { string } from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { RESTART_ON_REMOUNT } from 'utils/constants';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { localstoreUtilites } from '../../utils/persistenceData';
import { makeSelectLoading } from '../App/selectors';
import GroupList from './GroupList';
import InputUI from 'components/InputUI';
import SelectUI from 'components/SelectUI';
import DateTimePickerUI from 'components/DateTimePickerUI';
import Autocomplete from 'components/Autocomplete';
import classNames from 'classnames';
import { Editor } from '@tinymce/tinymce-react';
import ModalMaterialUi from 'components/Modal';
import EnhancedTable from 'components/Datatables';
import { FaMeetup } from 'react-icons/fa';
import {
  changeGroupModel,
  changeMeetingModel,
  changePageNumberFolderLog,
  changePageNumberWorkLog,
  changePageSizeFolderLog,
  changePageSizeWorkLog,
  changeWorkLogModel,
  clearModal,
  createMeeting,
  createWorkLog,
  deleteDailyReport,
  deleteMeeting,
  deleteMultiesFolderLog,
  deleteMultiesMeeting,
  deleteMultiesWorkLog,
  deleteSchedule,
  deleteWorkLog,
  editMeeting,
  editWorkLog,
  getFolderLogDatas,
  getFolderLogInit,
  getGroupDetail,
  getMeetingDetail,
  getSortDirectionWorkLogList,
  getSortWorkLogList,
  getWorkLogData,
  getWorkLogDetail,
  saveGroup,
  selectGroup,
  setSearch,
} from './actions';
import { styles } from './constants';
import reducer from './reducer';
import saga from './saga';
import {
  getAccountListSelector,
  getFolderSelectedSelector,
  getMetaPagingWorkLog,
  getSearchDataSelector,
  makeAjaxInfoSelector,
  makeGrouModelSelector,
  makeGroupDataSelector,
  makeGroupPagingSelector,
  meetingDetailSelector,
  userDataSelector,
  workLogDataSelector,
  workLogDetailSelector,
} from './selectors';
import { FormattedMessage } from 'react-intl';
import messages from './messages.js';
import {
  Description,
  Edit,
  Folder,
  Forum,
  MoreVert,
  Save,
} from '@material-ui/icons';
import { MdWork } from 'react-icons/md';
import {
  mapModelMeetingUiToApi,
  mapModelWorkLogUiToApi,
} from './folderLogUtilities.js';
import { makeTableHeader } from '../App/appUtilities.js';
import { API_COLUMNS } from '../../utils/constants.js';
import WorkLogToolbar from './WorkLogToolbar.js';
import { IoIosArrowForward } from 'react-icons/io';
import { FaFolder } from 'react-icons/fa';
import { CgWorkAlt } from 'react-icons/cg';

const localUsername = localstoreUtilites.getUsernameFromLocalStorage();
export const headerFolder = [
  {
    id: 'name',
    label: <FormattedMessage {...messages.name} />,
  },
  {
    id: 'updatedBy',
    label: <FormattedMessage {...messages.owner} />,
  },
  {
    id: 'updatedOn',
    label: <FormattedMessage {...messages.updatedOn} />,
  },
];

export class FolderLogPage extends React.Component {
  state = {
    stateTableDetails: false,
    selectedGroupIds: [],
    groupName: '',
    isOpenModal: false,

    typeFileSelected: 'folder',

    // work log
    openModalWorkLog: false,
    workLogIdSelected: [],
    userIds: [],
    folderLogs: [],
    search: '',
    // meeting
    openModalMeeting: false,
    meetingIdSelected: [],
    // folder
    openViewMoreLink: false,
    sortColumnId: null,
    sortDirectionId: 'asc',
    listLinkFolders: [],
  };

  componentDidMount = () => {
    this.props.onGetFolderLogsInit();
  };
  closeModal = () => this.setState({ isOpenModal: false });
  openModal = (createGroup) => {
    let state = { isOpenModal: true };
    if (createGroup) {
      state = { isOpenModal: true, selectedGroupIds: [], groupName: '' };
    }
    this.setState(state);
  };

  showTableDetail = (state) => {
    this.setState({
      stateTableDetails: state,
      typeFileSelected: 'folder',
    });
  };

  generateArrLink = (data, newData, groupId) => {
    data.map((item) => {
      if (item.id === groupId) {
        newData.push({ id: item.id, name: item.name });
        if (item.parentId) {
          this.generateArrLink(data, newData, item.parentId);
        } else {
          return;
        }
      }
    });
    return newData;
  };
  getChildrenWorkMeetingFolderLog = (data, newData) => {
    data.map((item) => {
      if (item.children) {
        this.getChildrenWorkMeetingFolderLog(item.children, newData);
      }
      // if (item.workLog.length > 0) {
      //   item.workLog.map((w) => {
      //     if (typeof w.id === 'number') {
      //       newData.push({
      //         id: 'work_' + w.id,
      //         name: w.title,
      //         title: w.title,
      //         parentId: item.id,
      //       });
      //     } else {
      //       newData.push(w);
      //     }
      //   });
      // }
      // if (item.meeting.length > 0) {
      //   item.meeting.map((w) => {
      //     if (typeof w.id === 'number') {
      //       newData.push({
      //         id: 'meeting_' + w.id,
      //         name: w.title,
      //         title: w.title,
      //         parentId: item.id,
      //       });
      //     } else {
      //       newData.push(w);
      //     }
      //   });
      // }
      newData.push(item);
    });
    return newData;
  };
  handleSelectGroup = (newGroup, nameGroup) => {
    if (nameGroup === 'work') {
      this.handleClickWorkLogDetail(newGroup[0]);
    }
    if (nameGroup === 'meeting') {
      this.handleClickMeetingDetail(newGroup[0]);
    }
    const { groupData } = this.props;
    this.props.onSelectGroup(newGroup);
    // Tìm vị trí của newGroup trong listLinkFolders
    const index = this.state.listLinkFolders.findIndex(
      (group) => group.id === newGroup[0],
    );

    const dataListLink = this.generateArrLink(
      this.getChildrenWorkMeetingFolderLog(groupData, []),
      [],
      newGroup[0],
    );
    this.setState({
      listLinkFolders: dataListLink.reverse(),
    });
  };

  searchFolderLog = (event) => {
    this.props.onSearchFolderAndFile(event.target.value);
  };

  componentWillMount() {
    this.props.getFolderLogs(null, null);
  }

  selectItem = (idGroup, nameGroup) => {
    const { onSelectGroup } = this.props;
    onSelectGroup(idGroup);
    this.setGroupId(idGroup, nameGroup);
    this.showTableDetail(true);
  };

  componentWillReceiveProps(nextProps) {
    const ajaxSuccess = nextProps.ajaxInfo.toJS();
    if (ajaxSuccess.value) {
      this.props.enqueueSnackbar(ajaxSuccess.message, {
        variant: 'success',
      });

      this.closeModal();
    }
  }

  setGroupId = (idGroup, nameGroup) =>
    this.setState({
      selectedGroupIds: idGroup,
      groupName: nameGroup,
    });

  // work log
  handleClickWorkLogDetail = (id) => {
    if (typeof id === 'string') {
      this.props.onGetWorkLogDetail(id.split('_')[1]);
    } else {
      this.props.onGetWorkLogDetail(id);
    }
    this.setState({
      typeFileSelected: 'work',
      stateTableDetails: true,
    });
  };
  getChildrenFolderLog = (data, newData) => {
    data.map((item) => {
      if (item.children) {
        this.getChildrenFolderLog(item.children, newData);
      }
      newData.push(item);
    });
    return newData;
  };
  getFolderLog = (input) => {
    const { groupModel, groupData } = this.props;

    const dataFolderLog = this.getChildrenFolderLog(groupData, []);
    const allFolderLogs = dataFolderLog.filter((item) =>
      groupModel.id ? item.id !== groupModel.id.value : true,
    );

    const lang = localstoreUtilites.getLanguageFromLocalStorage();
    const notSelectObj = {
      'en-US': 'Not Select',
      'ko-KR': '선택 안함',
      'ja-JP': '選択しない',
      'vi-VN': 'Không chọn',
    };

    return [
      { id: 0, label: notSelectObj[lang] },
      ...allFolderLogs
        .filter((item) => item.name.toLowerCase().includes(input.toLowerCase()))
        // .slice(0, 5)
        .map((item) => ({
          id: item.id,
          label: `${item.name}`,
        })),
    ];
  };
  onSaveWorkLogDetail = () => {
    const { workLogDetail, onCreateWorkLog, onEditWorkLog } = this.props;
    const { id } = workLogDetail.toJS();
    const workLogApi = mapModelWorkLogUiToApi(this.props.workLogDetail.toJS());
    if (id.value) {
      onEditWorkLog(id.value, workLogApi);
    } else {
      onCreateWorkLog(workLogApi);
    }
    this.setState({
      openModalWorkLog: false,
    });
  };
  handleAddNewWorkLog = (folderLog) => {
    this.props.onGetWorkLogDetail(0);
    this.setState({
      typeFileSelected: 'work',
      stateTableDetails: true,
      openModalWorkLog: true,
    });
    this.props.onChangeTextFieldWorkLog('folderLogId', folderLog.id);
    const userId = localstoreUtilites.getUserIdFromLocalStorage();
    this.props.onChangeTextFieldWorkLog('userId', Number(userId));
  };
  handleDeleteWorkLog = (id) => {
    this.props.onDeleteWorkLog(typeof id === 'number' ? id : id.split('_')[1]);
    this.setState({
      typeFileSelected: 'folder',
      stateTableDetails: false,
    });
  };
  onOpenModalWorkLog = () => {
    this.setState({
      openModalWorkLog: true,
    });
  };
  onCloseModalWorkLog = () => {
    this.setState({
      openModalWorkLog: false,
    });
  };

  changePageNumberWorkLog = (pageNumber) =>
    this.props.onChangePageNumberWorkLog(pageNumber);
  changePageSizeWorkLog = (pageSize) =>
    this.props.onChangePageSizeWorkLog(pageSize);
  pagingRemoteWorkLog = () =>
    this.props.onGetWorkLogData(
      this.state.userIds,
      this.state.folderLogs,
      this.state.search,
    );

  getSortColumnWorkLog = (sortColumn, value) => {
    const cloneSortColumn = API_COLUMNS.WORKLOG.indexOf(value);
    this.props.onGetSortColumnWorkLog(sortColumn, cloneSortColumn);
  };

  getSortDirectionWorkLog = () => {
    this.props.onGetSortDirectionWorkLog();
  };
  rowsSelectedWorkLog = (ids) => this.setState({ workLogIdSelected: ids });
  deleteRowWorkLog = (id) => this.props.onDeleteWorkLog(id);

  onChangeFilterWorkLog = async (event) => {
    await this.setState({ [event.target.name]: event.target.value });
    this.props.onGetWorkLogData(
      this.state.userIds,
      this.state.folderLogs,
      this.state.search,
    );
  };
  deleteMultiesWorkLog = () => {
    const { workLogIdSelected } = this.state;
    this.props.onDeleteMultiesWorkLog(workLogIdSelected);
  };

  openLinkFolderRow = (itemLink, index) => {
    if (typeof itemLink.id === 'number') {
      this.setState({
        typeFileSelected: 'folder',
      });
    }
    this.handleSelectGroup([itemLink.id], itemLink.name);
  };

  // meeting
  handleClickMeetingDetail = (id) => {
    if (typeof id === 'string') {
      this.props.onGetMeetingDetail(id.split('_')[1]);
    } else {
      this.props.onGetMeetingDetail(id);
    }
    this.setState({
      typeFileSelected: 'meeting',
      stateTableDetails: true,
    });
  };
  onSaveMeetingDetail = () => {
    const { meetingDetail, onCreateMeeting, onEditMeeting } = this.props;
    const { id } = meetingDetail.toJS();
    const meetingApi = mapModelMeetingUiToApi(this.props.meetingDetail.toJS());
    if (id.value) {
      onEditMeeting(id.value, meetingApi);
    } else {
      onCreateMeeting(meetingApi);
    }
    this.setState({
      openModalMeeting: false,
    });
  };
  handleAddNewMeeting = (folderLog) => {
    this.props.onGetMeetingDetail(0);
    this.setState({
      typeFileSelected: 'meeting',
      stateTableDetails: true,
      openModalMeeting: true,
    });
    this.props.onChangeTextFieldMeeting('folderLogId', folderLog.id);
    const userId = localstoreUtilites.getUserIdFromLocalStorage();
    this.props.onChangeTextFieldMeeting('userId', Number(userId));
  };
  handleDeleteMeeting = (id) => {
    this.props.onDeleteMeeting(typeof id === 'number' ? id : id.split('_')[1]);
    this.setState({
      typeFileSelected: 'folder',
      stateTableDetails: false,
    });
  };
  onOpenModalMeeting = () => {
    this.setState({
      openModalMeeting: true,
    });
  };
  onCloseModalMeeting = () => {
    this.setState({
      openModalMeeting: false,
    });
  };
  deleteMultiesMeeting = () => {
    const { meetingIdSelected } = this.state;
    this.props.onDeleteMultiesMeeting(meetingIdSelected);
  };

  render() {
    const {
      stateTableDetails,
      selectedGroupIds,
      groupName,
      isOpenModal,
      hiddenDoorList,
      typeFileSelected,

      // work log
      openModalWorkLog,
      search,
      userIds,
      folderLogs,
      workLogIdSelected,

      // meeting
      openModalMeeting,

      // folder
      openViewMoreLink,
      sortColumnId,
      sortDirectionId,
      listLinkFolders,
    } = this.state;
    const {
      classes,
      groupModel,
      groupData,
      onSaveGroup,
      metaGroupList,
      onSelectGroup,
      onChangeDefaultGroup,
      changePageSizeGroup,
      changePageNumberGroup,
      onDeleteMultiesGroup,
      onChangeGroupModel,
      onGetGroupDetail,
      getFolderLogs,
      onClearModal,
      accountListSelector,

      // work log
      onGetWorkLogDetail,
      onDeleteWorkLog,
      onCreateWorkLog,
      onEditWorkLog,
      workLogDetail,
      onChangeTextFieldWorkLog,
      datasWorkLog,
      metaWorkLog,
      userDataSelector,
      history,
      folderSelectedSelector,

      // search
      onSearchFolderAndFile,
      searchDataSelector,

      // meeting
      onGetMeetingDetail,
      onDeleteMeeting,
      onCreateMeeting,
      onEditMeeting,
      meetingDetail,
      onChangeTextFieldMeeting,

      // schedule
      onDeleteSchedule,
      // daily report
      onDeleteDailyReport,
    } = this.props;
    const {
      title,
      content,
      startDate,
      endDate,
      folderLogId,
      userId,
    } = workLogDetail.toJS();
    const meetingModel = meetingDetail.toJS();
    const permission = localstoreUtilites.getPermissionsFromLocalStorage()
      .folder;

    const listFolderLog = this.getChildrenFolderLog(groupData, []);

    if (datasWorkLog && listFolderLog.length > 0) {
      const tmpFolderLog = [...listFolderLog];
      datasWorkLog.map((item) => {
        tmpFolderLog.map((stt) => {
          if (item.folderLogId === stt.id) {
            item.folderLogId = stt.name;
          }
        });
        userDataSelector.map((stt) => {
          if (item.userId === stt.id) {
            item.userId = stt.name;
          }
        });
      });
    }


    return (
      <Paper className={classes.defaultPadding}>
        <Grid container>
          <Grid item sm={3}>
            <GroupList
              searchFolderLog={this.searchFolderLog}
              getFolderLogs={getFolderLogs}
              onChangeGroupModel={onChangeGroupModel}
              groupModel={groupModel.toJS()}
              onChangeDefaultGroup={onChangeDefaultGroup}
              groupData={groupData}
              metaGroupList={metaGroupList.toJSON()}
              onChangePageSizeGroup={changePageSizeGroup}
              onChangePageNumberGroup={changePageNumberGroup}
              onSaveGroup={onSaveGroup}
              onSelectGroup={this.handleSelectGroup}
              onDeleteMultiesGroup={onDeleteMultiesGroup}
              onGetGroupDetail={onGetGroupDetail}
              onClearModal={onClearModal}
              showTableDetail={this.showTableDetail}
              selectedGroupIds={selectedGroupIds}
              setGroupId={this.setGroupId}
              openModal={this.openModal}
              isOpenModal={isOpenModal}
              closeModal={this.closeModal}
              permission={permission}
              history={history}
              getFolderLog={this.getFolderLog}
              // search
              getChildrenFolderLog={this.getChildrenFolderLog}
              onSearchFolderAndFile={onSearchFolderAndFile}
              searchDataSelector={searchDataSelector}
              // work log
              handleClickWorkLogDetail={this.handleClickWorkLogDetail}
              onGetWorkLogDetail={onGetWorkLogDetail}
              onDeleteWorkLog={onDeleteWorkLog}
              onCreateWorkLog={onCreateWorkLog}
              onEditWorkLog={onEditWorkLog}
              handleAddNewWorkLog={this.handleAddNewWorkLog}
              handleDeleteWorkLog={this.handleDeleteWorkLog}
              // meeting
              handleClickMeetingDetail={this.handleClickMeetingDetail}
              onGetMeetingDetail={onGetMeetingDetail}
              onDeleteMeeting={onDeleteMeeting}
              onCreateMeeting={onCreateMeeting}
              onEditMeeting={onEditMeeting}
              handleAddNewMeeting={this.handleAddNewMeeting}
              handleDeleteMeeting={this.handleDeleteMeeting}
              // schedule
              onDeleteSchedule={onDeleteSchedule}
              // daily report
              onDeleteDailyReport={onDeleteDailyReport}
            />
          </Grid>
          <Grid
            className={`${classes.defaultPadding} ${classes.defaultBackground} ${classes.borderRadius}`}
            item
            sm={9}
          >
            {stateTableDetails ? (
              <React.Fragment>
                {listLinkFolders.length > 3 && (
                  <td>
                    {!openViewMoreLink ? (
                      <Button
                        color="default"
                        onClick={() =>
                          this.setState({ openViewMoreLink: true })
                        }
                      >
                        ...
                      </Button>
                    ) : (
                      <Select
                        ref={(ref) => (this.selectRef = ref)}
                        value={''}
                        onClose={() =>
                          this.setState({ openViewMoreLink: false })
                        }
                        open={openViewMoreLink}
                        onChange={(e) => null}
                        MenuProps={{
                          anchorOrigin: {
                            vertical: 'center',
                            horizontal: 'center',
                          },
                          transformOrigin: {
                            vertical: 'center',
                            horizontal: 'center',
                          },
                          getContentAnchorEl: null,
                        }}
                      >
                        {listLinkFolders
                          .slice(0, listLinkFolders.length - 3)
                          .map((e, i) => (
                            <MenuItem value="" key={`itemLinkFolders_${e.id}`}>
                              <Button
                                color="primary"
                                aria-label="download"
                                className={classes.iconActionInCell}
                                onClick={(event) =>
                                  this.openLinkFolderRow(e, i)
                                }
                              >
                                <div className={classes.iconSelect}>
                                  <table>
                                    <tr>
                                      <td>
                                        <FaFolder size={18} />
                                        &nbsp;
                                      </td>
                                      <td>{e.name}</td>
                                    </tr>
                                  </table>
                                </div>
                              </Button>
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  </td>
                )}
                {listLinkFolders.length > 3 && (
                  <td>
                    <IoIosArrowForward height={15} />
                  </td>
                )}
                {listLinkFolders.length > 2 && (
                  <td>
                    <Button
                      color="default"
                      onClick={() =>
                        this.openLinkFolderRow(
                          listLinkFolders.slice(-3)[0],
                          listLinkFolders.length - 3,
                        )
                      }
                    >
                      {listLinkFolders.slice(-3)[0].name}
                    </Button>
                  </td>
                )}
                {listLinkFolders.length > 2 && (
                  <td>
                    <IoIosArrowForward height={15} />
                  </td>
                )}
                {listLinkFolders.length > 1 && (
                  <td>
                    <Button
                      color="default"
                      onClick={() =>
                        this.openLinkFolderRow(
                          listLinkFolders.slice(-2)[0],
                          listLinkFolders.length - 2,
                        )
                      }
                    >
                      {listLinkFolders.slice(-2)[0].name}
                    </Button>
                  </td>
                )}
                {listLinkFolders.length > 1 && (
                  <td>
                    <IoIosArrowForward height={15} />
                  </td>
                )}
                {listLinkFolders.length > 0 && (
                  <td>
                    <Button
                      color="default"
                      onClick={() =>
                        this.openLinkFolderRow(
                          listLinkFolders.slice(-1)[0],
                          listLinkFolders.length - 1,
                        )
                      }
                    >
                      {listLinkFolders.slice(-1)[0].name}
                    </Button>
                  </td>
                )}
                <div
                  className={`${classes.halfMarginBottom} ${
                    hiddenDoorList ? classes.hiddenDoorList : ''
                  }`}
                >
                  {typeFileSelected === 'folder' && (
                    <React.Fragment>
                      <Grid item sm={12}>
                        <Card>
                          <Table
                            id="myDriver"
                            className="p-datatable-scrollable-body-table"
                          >
                            <TableHead className="p-datatable-thead">
                              <TableRow>
                                {headerFolder.map((row) => (
                                  <TableCell
                                    key={row.id}
                                    className={`${classes.tableHeader}`}
                                  >
                                    {row.id == 'name' ? (
                                      <span
                                        className="p-column-title"
                                        style={{ marginLeft: 20 }}
                                      >
                                        {row.label}
                                      </span>
                                    ) : (
                                      <span className="p-column-title">
                                        {row.label}
                                      </span>
                                    )}
                                    {sortColumnId == row.id && (
                                      <Button
                                        onClick={() => {
                                          const sortDirectionChange =
                                            sortDirectionId == 'asc'
                                              ? 'desc'
                                              : 'asc';
                                          this.setState({
                                            sortDirectionId: sortDirectionChange,
                                          });
                                          this.props.onGetDocumentById(
                                            listLinkFolders.slice(-1)[0].id,
                                            {
                                              ...meta,
                                              sortDirection: sortDirectionChange,
                                            },
                                          );
                                        }}
                                      >
                                        {sortDirectionId == 'asc' ? (
                                          <FaArrowUp />
                                        ) : (
                                          <FaArrowDown />
                                        )}
                                      </Button>
                                    )}
                                  </TableCell>
                                ))}
                              </TableRow>
                            </TableHead>
                            <TableBody className="p-datatable-tbody">
                              {folderSelectedSelector.length > 0 &&
                                folderSelectedSelector[0] &&
                                folderSelectedSelector[0].children.map(
                                  (item) => (
                                    <TableRow
                                      style={{
                                        cursor: 'pointer',
                                      }}
                                      key={item.id}
                                      className="p-datatable-row"
                                      onDoubleClick={() => {
                                        this.openFolderRow(item);
                                      }}
                                      onClick={() => {
                                        this.handleSelectGroup(
                                          [item.id],
                                          item.name,
                                        );
                                      }}
                                    >
                                      <TableCell
                                        className={`${classes.cellTableBody}`}
                                      >
                                        <table
                                          style={{
                                            padding: 5,
                                          }}
                                        >
                                          <tr>
                                            <td>
                                              <Folder
                                                style={{
                                                  margin: '0 10px 0 20px',
                                                }}
                                              />
                                              {item.name}&ensp;
                                            </td>
                                          </tr>
                                        </table>
                                      </TableCell>

                                      <TableCell
                                        className={`${classes.cellTableBody}`}
                                      >
                                        <table>
                                          <tr>
                                            <td>
                                              <Avatar
                                                key={`${item.id}_avatar`}
                                                src={item.avatar}
                                                style={{
                                                  width: 30,
                                                  height: 30,
                                                }}
                                              />
                                            </td>
                                            <td>{item.updatedBy}</td>
                                          </tr>
                                        </table>
                                      </TableCell>
                                      <TableCell
                                        className={`${classes.cellTableBody}`}
                                      >
                                        {item.updatedOn}
                                      </TableCell>
                                    </TableRow>
                                  ),
                                )}
                              {folderSelectedSelector.length > 0 &&
                                folderSelectedSelector[0] &&
                                folderSelectedSelector[0].workLog.map(
                                  (item) => (
                                    <TableRow
                                      style={{
                                        cursor: 'pointer',
                                      }}
                                      key={item.id}
                                      className="p-datatable-row"
                                      onDoubleClick={() => {
                                        this.openFolderRow(item);
                                      }}
                                      onClick={() => {
                                        this.handleSelectGroup(
                                          [
                                            typeof item.id === 'string'
                                              ? item.id
                                              : 'work_' + item.id,
                                          ],
                                          'work',
                                        );
                                      }}
                                    >
                                      <TableCell
                                        className={`${classes.cellTableBody}`}
                                      >
                                        <table
                                          style={{
                                            padding: 5,
                                          }}
                                        >
                                          <tr>
                                            <td>
                                              <CgWorkAlt
                                                style={{
                                                  width: 24,
                                                  height: 24,
                                                  margin: '0 10px 0 20px',
                                                }}
                                              />
                                              {item.name}&ensp;
                                            </td>
                                          </tr>
                                        </table>
                                      </TableCell>

                                      <TableCell
                                        className={`${classes.cellTableBody}`}
                                      >
                                        <table>
                                          <tr>
                                            <td>
                                              <Avatar
                                                key={`${item.id}_avatar`}
                                                src={item.avatar}
                                                style={{
                                                  width: 30,
                                                  height: 30,
                                                }}
                                              />
                                            </td>
                                            <td>{item.updatedBy}</td>
                                          </tr>
                                        </table>
                                      </TableCell>
                                      <TableCell
                                        className={`${classes.cellTableBody}`}
                                      >
                                        {item.updatedOn}
                                      </TableCell>
                                    </TableRow>
                                  ),
                                )}
                              {folderSelectedSelector.length > 0 &&
                                folderSelectedSelector[0] &&
                                folderSelectedSelector[0].meeting.map(
                                  (item) => (
                                    <TableRow
                                      style={{
                                        cursor: 'pointer',
                                      }}
                                      key={item.id}
                                      className="p-datatable-row"
                                      onDoubleClick={() => {
                                        this.openFolderRow(item);
                                      }}
                                      onClick={() => {
                                        this.handleSelectGroup(
                                          [
                                            typeof item.id === 'string'
                                              ? item.id
                                              : 'meeting_' + item.id,
                                          ],
                                          'meeting',
                                        );
                                      }}
                                    >
                                      <TableCell
                                        className={`${classes.cellTableBody}`}
                                      >
                                        <table
                                          style={{
                                            padding: 5,
                                          }}
                                        >
                                          <tr>
                                            <td>
                                              <FaMeetup
                                                style={{
                                                  width: 24,
                                                  height: 24,
                                                  margin: '0 10px 0 20px',
                                                }}
                                              />
                                              {item.name}&ensp;
                                            </td>
                                          </tr>
                                        </table>
                                      </TableCell>

                                      <TableCell
                                        className={`${classes.cellTableBody}`}
                                      >
                                        <table>
                                          <tr>
                                            <td>
                                              <Avatar
                                                key={`${item.id}_avatar`}
                                                src={item.avatar}
                                                style={{
                                                  width: 30,
                                                  height: 30,
                                                }}
                                              />
                                            </td>
                                            <td>{item.updatedBy}</td>
                                          </tr>
                                        </table>
                                      </TableCell>
                                      <TableCell
                                        className={`${classes.cellTableBody}`}
                                      >
                                        {item.updatedOn}
                                      </TableCell>
                                    </TableRow>
                                  ),
                                )}
                            </TableBody>
                          </Table>
                        </Card>
                      </Grid>
                      {/* <EnhancedTable
                      id="workLogList"
                      data={datasWorkLog}
                      headers={headersWorkLog}
                      onPagingRemote={this.pagingRemoteWorkLog}
                      // onEditRow={this.editRow}
                      onDeleteRow={this.deleteRowWorkLog}
                      deleteRowMsg={messages.confirmDelete}
                      spanColum={headersWorkLog.length + 1}
                      rowsSelected={this.rowsSelectedWorkLog}
                      onChangePageNumber={this.changePageNumberWorkLog}
                      onChangePageSize={this.changePageSizeWorkLog}
                      meta={metaWorkLog}
                      localUsername={localUsername}
                      history={history}
                      notViewAction={false}
                      orderHeader={makeTableHeader(headersWorkLog)}
                      onChangeSortColumn={this.getSortColumnWorkLog}
                      onChangeSortDirection={this.getSortDirectionWorkLog}
                      isFold
                    >
                      <WorkLogToolbar
                        onDeleteMultiesRow={this.deleteMultiesWorkLog}
                        isSelectMultiesRow={workLogIdSelected.length !== 0}
                        search={search}
                        userIds={userIds}
                        userDataSelector={userDataSelector}
                        folderLogs={folderLogs}
                        folderLogsListSelector={listFolderLog}
                        onChangeFilterWorkLog={this.onChangeFilterWorkLog}
                      />
                    </EnhancedTable> */}
                    </React.Fragment>
                  )}
                  {typeFileSelected === 'work' && (
                    <React.Fragment>
                      <Grid md className={classes.headerWork}>
                        <Typography variant="h5">{title.value}</Typography>
                        <Fab
                          color="primary"
                          aria-label="Edit"
                          className={classes.fab}
                          onClick={() => this.onOpenModalWorkLog()}
                          id="btnEdit"
                        >
                          <Edit />
                        </Fab>
                      </Grid>
                      <hr />
                      <Grid item md={12}>
                        <div
                          style={{ maxWidth: '100%' }}
                          dangerouslySetInnerHTML={{ __html: content.value }}
                        ></div>
                      </Grid>
                      <ModalMaterialUi
                        isOpenModal={openModalWorkLog}
                        onCloseModal={this.onCloseModalWorkLog}
                        onCancel={this.onCloseModalWorkLog}
                        onSave={this.onSaveWorkLogDetail}
                        disableSave={!title.value || !folderLogId.value}
                      >
                        <Grid container style={{ marginTop: 10 }} spacing={16}>
                          <Grid item xs={12} sm={6}>
                            <InputUI
                              id="title"
                              name="title"
                              value={title.value}
                              onChange={onChangeTextFieldWorkLog}
                              label={<FormattedMessage {...messages.title} />}
                              textHelperError={title.errorMessage}
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Autocomplete
                              required
                              classes={{}}
                              id="folderLogId"
                              name="folderLogId"
                              label={
                                <FormattedMessage {...messages.folderLog} />
                              }
                              getSuggestions={this.getFolderLog}
                              placeholder={
                                this.getChildrenFolderLog(groupData, []).find(
                                  (el) => el.id === folderLogId.value,
                                )
                                  ? this.getChildrenFolderLog(
                                      groupData,
                                      [],
                                    ).find((el) => el.id === folderLogId.value)
                                      .name
                                  : ''
                              }
                              onSelect={async (item) => {
                                if (item) {
                                  this.props.onChangeTextFieldWorkLog(
                                    'folderLogId',
                                    item.id,
                                  );
                                }
                              }}
                            />{' '}
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <DateTimePickerUI
                              value={startDate.value || ''}
                              onChange={(date) =>
                                onChangeTextFieldWorkLog(
                                  'startDate',
                                  new Date(date),
                                )
                              }
                              name="startDate"
                              label={
                                <FormattedMessage {...messages.startDate} />
                              }
                              id="startDate"
                              textHelperError={
                                (!startDate.value && (
                                  <FormattedMessage
                                    {...messages.validateFieldRequire}
                                  />
                                )) ||
                                startDate.errorMessage
                              }
                              required
                              maxDate={
                                new Date(new Date(endDate.value).getTime())
                              }
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <DateTimePickerUI
                              value={endDate.value || ''}
                              onChange={(date) =>
                                onChangeTextFieldWorkLog(
                                  'endDate',
                                  new Date(date),
                                )
                              }
                              name="endDate"
                              label={<FormattedMessage {...messages.endDate} />}
                              id="endDate"
                              textHelperError={
                                (!endDate.value && (
                                  <FormattedMessage
                                    {...messages.validateFieldRequire}
                                  />
                                )) ||
                                endDate.errorMessage ||
                                new Date(
                                  new Date(endDate.value).getTime() +
                                    1000 * 24 * 3600,
                                ).getTime() <
                                  new Date(startDate.value).getTime()
                              }
                              required
                              minDate={
                                new Date(new Date(startDate.value).getTime())
                              }
                            />
                          </Grid>
                          <Grid item sm={12}>
                            <Editor
                              value={content.value}
                              apiKey="q4s5gv2f6brroclpx08k8jydm39k7iqgf79p6qp0mbcghwgb"
                              init={{
                                height: '100vh',
                                menubar: false,
                                plugins: [
                                  'advlist autolink lists link image imagetools preview',
                                  'searchreplace code',
                                  'insertdatetime table paste code template',
                                  'emoticons',
                                ],
                                toolbar:
                                  'undo redo searchreplace | formatselect | bold italic backcolor bullist numlist | \
                    alignleft aligncenter alignright alignjustify | \
                    outdent indent | link image imagetools insertdatetime table template emoticons | code',
                                content_style:
                                  'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                              }}
                              onEditorChange={(content) =>
                                this.props.onChangeTextFieldWorkLog(
                                  'content',
                                  content,
                                )
                              }
                            />
                          </Grid>
                        </Grid>
                      </ModalMaterialUi>
                    </React.Fragment>
                  )}
                  {typeFileSelected === 'meeting' && (
                    <React.Fragment>
                      <Grid md className={classes.headerWork}>
                        <Typography variant="h5">
                          {meetingModel.title.value}
                        </Typography>
                        <Fab
                          color="primary"
                          aria-label="Edit"
                          className={classes.fab}
                          onClick={() => this.onOpenModalMeeting()}
                          id="btnEdit"
                        >
                          <Edit />
                        </Fab>
                      </Grid>
                      <hr />
                      <Grid item md={12}>
                        <div
                          style={{ maxWidth: '100%' }}
                          dangerouslySetInnerHTML={{
                            __html: meetingModel.content.value,
                          }}
                        ></div>
                      </Grid>
                      <ModalMaterialUi
                        isOpenModal={openModalMeeting}
                        onCloseModal={this.onCloseModalMeeting}
                        onCancel={this.onCloseModalMeeting}
                        onSave={this.onSaveMeetingDetail}
                        disableSave={
                          !meetingModel.title.value ||
                          !meetingModel.folderLogId.value
                        }
                      >
                        <Grid container style={{ marginTop: 10 }} spacing={16}>
                          <Grid item xs={12} sm={6}>
                            <InputUI
                              id="title"
                              name="title"
                              value={meetingModel.title.value}
                              onChange={onChangeTextFieldMeeting}
                              label={<FormattedMessage {...messages.title} />}
                              textHelperError={meetingModel.title.errorMessage}
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Autocomplete
                              required
                              classes={{}}
                              id="folderLogId"
                              name="folderLogId"
                              label={
                                <FormattedMessage {...messages.folderLog} />
                              }
                              getSuggestions={this.getFolderLog}
                              placeholder={
                                this.getChildrenFolderLog(groupData, []).find(
                                  (el) =>
                                    el.id === meetingModel.folderLogId.value,
                                )
                                  ? this.getChildrenFolderLog(
                                      groupData,
                                      [],
                                    ).find(
                                      (el) =>
                                        el.id ===
                                        meetingModel.folderLogId.value,
                                    ).name
                                  : ''
                              }
                              onSelect={async (item) => {
                                if (item) {
                                  this.props.onChangeTextFieldMeeting(
                                    'folderLogId',
                                    item.id,
                                  );
                                }
                              }}
                            />{' '}
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <DateTimePickerUI
                              value={meetingModel.startDate.value || ''}
                              onChange={(date) =>
                                onChangeTextFieldMeeting(
                                  'startDate',
                                  new Date(date),
                                )
                              }
                              name="startDate"
                              label={
                                <FormattedMessage {...messages.startDate} />
                              }
                              id="startDate"
                              textHelperError={
                                (!meetingModel.startDate.value && (
                                  <FormattedMessage
                                    {...messages.validateFieldRequire}
                                  />
                                )) ||
                                meetingModel.startDate.errorMessage
                              }
                              required
                              maxDate={
                                new Date(
                                  new Date(
                                    meetingModel.endDate.value,
                                  ).getTime(),
                                )
                              }
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <DateTimePickerUI
                              value={meetingModel.endDate.value || ''}
                              onChange={(date) =>
                                onChangeTextFieldMeeting(
                                  'endDate',
                                  new Date(date),
                                )
                              }
                              name="endDate"
                              label={<FormattedMessage {...messages.endDate} />}
                              id="endDate"
                              textHelperError={
                                (!meetingModel.endDate.value && (
                                  <FormattedMessage
                                    {...messages.validateFieldRequire}
                                  />
                                )) ||
                                meetingModel.endDate.errorMessage ||
                                new Date(
                                  new Date(
                                    meetingModel.endDate.value,
                                  ).getTime() +
                                    1000 * 24 * 3600,
                                ).getTime() <
                                  new Date(
                                    meetingModel.startDate.value,
                                  ).getTime()
                              }
                              required
                              minDate={
                                new Date(
                                  new Date(
                                    meetingModel.startDate.value,
                                  ).getTime(),
                                )
                              }
                            />
                          </Grid>
                          <Grid item sm={12}>
                            <Editor
                              value={meetingModel.content.value}
                              apiKey="q4s5gv2f6brroclpx08k8jydm39k7iqgf79p6qp0mbcghwgb"
                              init={{
                                height: '100vh',
                                menubar: false,
                                plugins: [
                                  'advlist autolink lists link image imagetools preview',
                                  'searchreplace code',
                                  'insertdatetime table paste code template',
                                  'emoticons',
                                ],
                                toolbar:
                                  'undo redo searchreplace | formatselect | bold italic backcolor bullist numlist | \
                    alignleft aligncenter alignright alignjustify | \
                    outdent indent | link image imagetools insertdatetime table template emoticons | code',
                                content_style:
                                  'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                              }}
                              onEditorChange={(content) =>
                                this.props.onChangeTextFieldMeeting(
                                  'content',
                                  content,
                                )
                              }
                            />
                          </Grid>
                        </Grid>
                      </ModalMaterialUi>
                    </React.Fragment>
                  )}
                </div>
              </React.Fragment>
            ) : null}
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

FolderLogPage.propTypes = {
  classes: PropTypes.object,
  loading: PropTypes.bool,
  enqueueSnackbar: PropTypes.func.isRequired,
  ajaxInfo: PropTypes.object,
  /**
   * Group props
   *
   * @props using for folderLog component
   */
  folderSelectedSelector: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  accountListSelector: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  groupData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  metaGroupList: PropTypes.object,
  getFolderLogs: PropTypes.func,
  onChangeDefaultGroup: PropTypes.func,
  changePageSizeGroup: PropTypes.func,
  changePageNumberGroup: PropTypes.func,
  groupModel: PropTypes.object,
  onChangeGroupModel: PropTypes.func,
  onSaveGroup: PropTypes.func,
  onSelectGroup: PropTypes.func,
  onDeleteMultiesGroup: PropTypes.func,
  onGetGroupDetail: PropTypes.func,
  onClearModal: PropTypes.func,
  onGetFolderLogsInit: PropTypes.func,
  onSearchFolderAndFile: PropTypes.func,

  // work
  datasWorkLog: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  onGetWorkLogDetail: PropTypes.func,
  onDeleteWorkLog: PropTypes.func,
  onCreateWorkLog: PropTypes.func,
  onChangeTextFieldWorkLog: PropTypes.func,
  onEditWorkLog: PropTypes.func,
  onGetWorkLogData: PropTypes.func,
  onDeleteMultiesWorkLog: PropTypes.func,
  workLogDetail: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  metaWorkLog: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  userDataSelector: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),

  // schedule
  onDeleteSchedule: PropTypes.func,
  // daily report
  onDeleteDailyReport: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    // GroupList action
    onSearchFolderAndFile: (search) => dispatch(setSearch(search)),
    onGetFolderLogsInit: () => dispatch(getFolderLogInit()),
    getFolderLogs: (search, callback) =>
      dispatch(getFolderLogDatas(search, callback)),
    changePageNumberGroup: (pageNumber) =>
      dispatch(changePageNumberFolderLog(pageNumber)),
    changePageSizeGroup: (pageSize) =>
      dispatch(changePageSizeFolderLog(pageSize)),
    onChangeGroupModel: (value, name) =>
      dispatch(changeGroupModel(value, name)),
    onSaveGroup: (group, groupId) => dispatch(saveGroup(group, groupId)),
    onSelectGroup: (groupId) => dispatch(selectGroup(groupId)),
    onDeleteMultiesGroup: (groupIds) =>
      dispatch(deleteMultiesFolderLog(groupIds)),
    onGetGroupDetail: (groupId) => dispatch(getGroupDetail(groupId)),
    onClearModal: () => dispatch(clearModal()),

    // work log

    onGetWorkLogData: (userIds, folderLogs, search) =>
      dispatch(getWorkLogData(userIds, folderLogs, search)),
    onGetWorkLogDetail: (id) => dispatch(getWorkLogDetail(id)),
    onDeleteWorkLog: (id) => dispatch(deleteWorkLog(id)),
    onDeleteMultiesWorkLog: (ids) => dispatch(deleteMultiesWorkLog(ids)),
    onCreateWorkLog: (workLog) => dispatch(createWorkLog(workLog)),
    onEditWorkLog: (id, workLog) => dispatch(editWorkLog(id, workLog)),

    onChangeTextFieldWorkLog: (evt, data) => {
      if (!evt.target) {
        dispatch(changeWorkLogModel(evt, data));
      } else {
        dispatch(changeWorkLogModel(evt.target.name, evt.target.value));
      }
    },
    onChangePageNumberWorkLog: (pageNumber) =>
      dispatch(changePageNumberWorkLog(pageNumber)),
    onChangePageSizeWorkLog: (pageSize) =>
      dispatch(changePageSizeWorkLog(pageSize)),
    onGetSortColumnWorkLog: (sortColumn, cloneSortColumn) =>
      dispatch(getSortWorkLogList(sortColumn, cloneSortColumn)),
    onGetSortDirectionWorkLog: () => dispatch(getSortDirectionWorkLogList()),

    // meeting
    onGetMeetingDetail: (id) => dispatch(getMeetingDetail(id)),
    onDeleteMeeting: (id) => dispatch(deleteMeeting(id)),
    onDeleteMultiesMeeting: (ids) => dispatch(deleteMultiesMeeting(ids)),
    onCreateMeeting: (meetingLog) => dispatch(createMeeting(meetingLog)),
    onEditMeeting: (id, meetingLog) => dispatch(editMeeting(id, meetingLog)),

    onChangeTextFieldMeeting: (evt, data) => {
      if (!evt.target) {
        dispatch(changeMeetingModel(evt, data));
      } else {
        dispatch(changeMeetingModel(evt.target.name, evt.target.value));
      }
    },

    // schedule
    onDeleteSchedule: (id) => dispatch(deleteSchedule(id)),
    // daily report
    onDeleteDailyReport: (id) => dispatch(deleteDailyReport(id)),
  };
}

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  ajaxInfo: makeAjaxInfoSelector(),
  folderSelectedSelector: getFolderSelectedSelector(),
  // GroupList
  groupData: makeGroupDataSelector(),
  metaGroupList: makeGroupPagingSelector(),
  groupModel: makeGrouModelSelector(),
  accountListSelector: getAccountListSelector(),
  searchDataSelector: getSearchDataSelector(),

  // work log
  metaWorkLog: getMetaPagingWorkLog(),
  workLogDetail: workLogDetailSelector(),
  datasWorkLog: workLogDataSelector(),
  userDataSelector: userDataSelector(),

  // meeting
  meetingDetail: meetingDetailSelector(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'folderLog', reducer });
const withSaga = injectSaga({
  key: 'folderLog',
  saga,
  mode: RESTART_ON_REMOUNT,
});

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(withStyles(styles)(FolderLogPage));
