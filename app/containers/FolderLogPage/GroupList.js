/* eslint-disable indent */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import SearchIcon from '@material-ui/icons/Search';
import Input from '@material-ui/core/Input';
import {
  withStyles,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  TablePagination,
  Toolbar,
  Grid,
  Tooltip,
  Hidden,
  createMuiTheme,
  Collapse,
} from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { CgWorkAlt } from 'react-icons/cg';
import { FaMeetup } from 'react-icons/fa';
import PaginationActions from './PaginationWrapped';
import messages from './messages';
import { colorDelete, styles } from './constants';
import AddFolderLogModal from './AddFolderLogModal';
import { getFolderLogByGivenId } from './folderLogUtilities';
import SearchUI from '../../components/SearchUI/index.js';
import Autocomplete from 'components/Autocomplete';

import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import {
  Chat,
  Description,
  Folder,
  Forum,
  Note,
  Textsms,
} from '@material-ui/icons';
import { localstoreUtilites } from '../../utils/persistenceData.js';

const permission = localstoreUtilites.getPermissionsFromLocalStorage();
export class GroupList extends React.Component {
  state = {
    groupDetailId: 0, // Only for use add/edit folderLog
    selectedGroupIds: [],
    selectedGroupNames: [],
    openFolderLogs: [],

    arrSuggestion: [],
    searchItemSelect: {},
  };

  selectGroup = (idGroup, nameGroup) => () => {
    const { setGroupId, onSelectGroup, showTableDetail } = this.props;
    onSelectGroup(idGroup, nameGroup);
    setGroupId(idGroup, nameGroup);
    showTableDetail(true);
  };

  addFolderLog = () => {
    this.props.showTableDetail(false);
    this.props.onClearModal();
    this.props.openModal(true);
  };

  editGroup = (groupId) => () => {
    this.setState({ groupDetailId: groupId });
    this.props.onGetGroupDetail(groupId);
    this.props.openModal(false);
  };

  deleteMultiesDoor = () => {
    const clone = this.state.selectedGroupIds.slice();
    this.props.onDeleteMultiesGroup(clone);
    const newOpenFolderLogs = this.state.openFolderLogs.filter(
      (item) => !clone.includes(item),
    );
    this.setState({
      ...this.state,
      selectedGroupIds: [],
      selectedGroupNames: [],
      openFolderLogs: newOpenFolderLogs,
    });
    this.props.setGroupId([], '');
    this.props.showTableDetail(false);
    // this.setState({
    //   selectedGroupIds: [],
    // });
  };

  onClickCheckBox = (groupId, groupName) => {
    const { selectedGroupIds, selectedGroupNames, openFolderLogs } = this.state;
    const {
      groupData,
      setGroupId,
      onSelectGroup,
      showTableDetail,
      getFolderLog,
    } = this.props;
    const groupsClone = [groupId];

    const nameTemp = getFolderLog('').find((item) => item.id === groupId);
    const groupNameClone = [nameTemp.label];
    // const index = groupsClone.indexOf(groupId);
    // const { children } = getFolderLogByGivenId(groupData, groupId);
    // const childArr = children || [];
    // const groupNameIdx = selectedGroupNames.indexOf(groupName);
    // if (index > -1) {
    //   // Uncheck
    //   groupsClone.splice(index, 1);
    //   groupNameClone.splice(groupNameIdx, 1);
    //   childArr.forEach((child) => {
    //     const idx = groupsClone.indexOf(child.id);
    //     if (idx > -1) {
    //       groupsClone.splice(idx, 1);
    //     }
    //     const nameIdx = groupNameClone.indexOf(child.name);
    //     if (nameIdx > -1) {
    //       groupNameClone.splice(nameIdx, 1);
    //     }
    //   });
    // } else {
    //   // Check
    //   groupsClone.push(groupId);
    //   groupNameClone.push(groupName);
    //   if (childArr.length > 0) {
    //     childArr.forEach((child) => {
    //       groupsClone.push(child.id);
    //       groupNameClone.push(child.name);
    //     });
    //     // Expand folderLog if it is fold
    //     if (!openFolderLogs.includes(groupId)) {
    //       this.toggleChildFolderLog(groupId);
    //     }
    //   }
    // }
    const newSelectedGroupIds = [...new Set(groupsClone)];
    const newSelectedGroupNames = [...new Set(groupNameClone)];
    const groupsName = newSelectedGroupNames.join(', ');

    this.setState({
      selectedGroupIds: newSelectedGroupIds,
      selectedGroupNames: newSelectedGroupNames,
    });
    if (newSelectedGroupIds.length > 0) {
      onSelectGroup(newSelectedGroupIds, groupsName);
      setGroupId(newSelectedGroupIds, groupsName);
      showTableDetail(true);
    } else {
      showTableDetail(false);
    }
  };

  onClickList = (groupId, groupName) => (evt) => {
    if (evt.target.tagName === 'svg' || evt.target.tagName === 'path') {
      this.toggleChildFolderLog(groupId);
    } else {
      this.onClickCheckBox(groupId, groupName);
    }
  };

  changePageNumber = (event, pageNumberUI) => {
    this.props.onChangePageNumberGroup(pageNumberUI + 1);
    this.props.getFolderLogs();
  };

  handlePageChangeGroup = (ev) => {
    this.props.onChangePageSizeGroup(ev.target.value);
    this.props.getFolderLogs();
  };

  // funtion in context menu
  addChildFolderLog = (groupId) => {
    const {
      showTableDetail,
      onClearModal,
      onChangeGroupModel,
      openModal,
      getChildrenFolderLog,
      groupData,
    } = this.props;
    showTableDetail(false);
    onClearModal();
    onChangeGroupModel(groupId, 'parentId');
    const dataParentList = getChildrenFolderLog(groupData, []);
    onChangeGroupModel(dataParentList, 'parentFolderLogItem');
    openModal(true);
  };

  // work log
  openWorkLogDetail = (id) => {};

  renderChilds = (folderLog, folderLogs) => {
    const { openFolderLogs, selectedGroupIds } = this.state;
    const { classes, selectedGroupId, onDeleteSchedule } = this.props;
    return (
      <Collapse
        in={openFolderLogs.includes(folderLog.id)}
        timeout="auto"
        unmountOnExit
        className={classes.nested}
      >
        <React.Fragment />
        <List component="div" disablePadding>
          {folderLogs.map((group) => (
            <React.Fragment key={`Fragment_${group.id}`}>
              {typeof group.id === 'number' ? (
                <React.Fragment>
                  <ContextMenuTrigger id={group.id}>
                    <ListItem
                      classes={{ selected: classes.active }}
                      button
                      key={group.id}
                      selected={selectedGroupId === group.id}
                      className={classes.noPaddingLeftRight}
                      onClick={this.onClickList(group.id, group.name)}
                    >
                      {group.children &&
                        group.children.length > 0 &&
                        (openFolderLogs.includes(group.id) ? (
                          <ExpandLess
                            onClick={() => this.toggleChildFolderLog(group.id)}
                          />
                        ) : (
                          <ExpandMore
                            onClick={() => this.toggleChildFolderLog(group.id)}
                          />
                        ))}
                      {group.children && group.children.length === 0 && (
                        <span style={{ marginLeft: 6 }}></span>
                      )}
                      <Folder />
                      <ListItemText
                        classes={{ primary: classes.secondItemFont }}
                        variant="caption"
                        primary={group.name}
                      />
                      {/* <Checkbox
                    style={{ padding: 0 }}
                    onChange={() => this.onClickCheckBox(group.id, group.name)}
                    checked={selectedGroupIds.includes(group.id)}
                    // disabled={group.id === 1}
                  /> */}
                      {permission.folder.editFolder && (
                        <IconButton
                          color="primary"
                          onClick={this.editGroup(group.id)}
                          className="btn-edit-group"
                          style={{ padding: 0, marginLeft: 6, marginRight: 6 }}
                        >
                          <FormattedMessage {...messages.editFolderLog}>
                            {(editGroup) => (
                              <Tooltip title={editGroup}>
                                <EditIcon />
                              </Tooltip>
                            )}
                          </FormattedMessage>
                        </IconButton>
                      )}
                    </ListItem>
                  </ContextMenuTrigger>
                  <ContextMenu id={group.id}>
                    <MenuItem onClick={() => this.addChildFolderLog(group.id)}>
                      <FormattedMessage {...messages.addFolder} />
                    </MenuItem>
                    <MenuItem divider />
                    <MenuItem
                      onClick={() => this.props.handleAddNewWorkLog(group)}
                    >
                      <FormattedMessage {...messages.addWorkLog} />
                    </MenuItem>
                    <MenuItem divider />
                    <MenuItem
                      onClick={() => this.props.handleAddNewMeeting(group)}
                    >
                      <FormattedMessage {...messages.addMeetingLog} />
                    </MenuItem>
                  </ContextMenu>
                </React.Fragment>
              ) : null}
              {typeof group.id === 'string' && group.id.includes('work') ? (
                <React.Fragment>
                  <ContextMenuTrigger id={group.id}>
                    <ListItem
                      classes={{ selected: classes.active }}
                      button
                      key={group.id}
                      selected={selectedGroupId === group.id}
                      className={classes.noPaddingLeftRight}
                      onClick={() =>
                        this.props.onSelectGroup(
                          [
                            typeof group.id === 'string'
                              ? group.id
                              : 'work_' + group.id,
                          ],
                          'work',
                        )
                      }
                      style={{ paddingLeft: 4 }}
                    >
                      <CgWorkAlt style={{ width: 24, height: 24 }} />
                      <ListItemText
                        classes={{ primary: classes.secondItemFont }}
                        variant="caption"
                        primary={group.title}
                      />
                      {permission.workLog.deleteWorkLog && (
                        <IconButton
                          style={{ padding: 0, marginLeft: 6, marginRight: 6 }}
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            this.props.handleDeleteWorkLog(group.id);
                          }}
                          className="btn-edit-group"
                        >
                          <FormattedMessage {...messages.deleteWorkLog}>
                            {(editGroup) => (
                              <Tooltip title={editGroup}>
                                <DeleteIcon />
                              </Tooltip>
                            )}
                          </FormattedMessage>
                        </IconButton>
                      )}
                    </ListItem>
                  </ContextMenuTrigger>
                </React.Fragment>
              ) : null}
              {typeof group.id === 'string' && group.id.includes('meeting') ? (
                <React.Fragment>
                  <ContextMenuTrigger id={group.id}>
                    <ListItem
                      classes={{ selected: classes.active }}
                      button
                      key={group.id}
                      selected={selectedGroupId === group.id}
                      onClick={() =>
                        this.props.onSelectGroup(
                          [
                            typeof group.id === 'string'
                              ? group.id
                              : 'meeting_' + group.id,
                          ],
                          'meeting',
                        )
                      }
                      className={classes.noPaddingLeftRight}
                      style={{ paddingLeft: 4 }}
                    >
                      <FaMeetup style={{ width: 24, height: 24 }} />
                      <ListItemText
                        classes={{ primary: classes.secondItemFont }}
                        variant="caption"
                        primary={group.title}
                      />
                      {permission.meeting.deleteMeeting && (
                        <IconButton
                          style={{ padding: 0, marginLeft: 6, marginRight: 6 }}
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            this.props.handleDeleteMeeting(group.id);
                          }}
                          className="btn-edit-group"
                        >
                          <FormattedMessage {...messages.deleteMeetingLog}>
                            {(editGroup) => (
                              <Tooltip title={editGroup}>
                                <DeleteIcon />
                              </Tooltip>
                            )}
                          </FormattedMessage>
                        </IconButton>
                      )}
                    </ListItem>
                    {/* <ContextMenu id={`meeting_${meeting.id}`}>
                  <MenuItem>
                    <FormattedMessage {...messages.deleteMeetingLog} />
                  </MenuItem>
                </ContextMenu> */}
                  </ContextMenuTrigger>
                </React.Fragment>
              ) : null}

              {this.renderChilds(group, group.children)}
            </React.Fragment>
          ))}
        </List>
      </Collapse>
    );
  };

  toggleChildFolderLog = (id) => {
    const { openFolderLogs } = this.state;
    if (!openFolderLogs.includes(id)) {
      this.setState({
        openFolderLogs: [...openFolderLogs, id],
      });
    } else {
      this.setState({
        openFolderLogs: openFolderLogs.filter((selected) => selected !== id),
      });
    }
  };

  closeAddFolderLogModal = () => {
    this.setState({ groupDetailId: 0 });
    this.props.closeModal();
  };
  getSuggestions = () => {
    const { searchDataSelector } = this.props;
    let dataSearch = [];
    searchDataSelector.map((it) => {
      if (it.id.includes('work')) {
        dataSearch.push({
          id: it.id,
          label: (
            <React.Fragment>
              <CgWorkAlt style={{ width: 24, height: 24, marginRight: 5 }} />{' '}
              {it.name}
            </React.Fragment>
          ),
        });
      } else if (it.id.includes('meeting')) {
        dataSearch.push({
          id: it.id,
          label: (
            <React.Fragment>
              <FaMeetup style={{ width: 24, height: 24, marginRight: 5 }} />
              {it.name}
            </React.Fragment>
          ),
        });
      } else {
        dataSearch.push({
          id: it.id,
          name: it.name,
          label: (
            <React.Fragment>
              <Folder style={{ marginRight: 5 }} />
              {it.name}
            </React.Fragment>
          ),
        });
      }
    });

    return dataSearch;
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.searchDataSelector !== this.props.searchDataSelector) {
      this.setState({
        arrSuggestion: this.getSuggestions(),
      });
    }
  }

  render() {
    const { selectedGroupIds, openFolderLogs, groupDetailId } = this.state;
    const {
      classes,
      groupData,
      metaGroupList,
      groupModel,
      isOpenModal,
      onSaveGroup,
      onChangeGroupModel,
      selectedGroupId,
      onAssignDoorsToGroup,

      // search
      onSearchFolderAndFile,
      searchDataSelector,

      // closeModal,
      searchFolderLog,
      stylePaging,
      handleClickWorkLogDetail,

      // schedule
      onDeleteSchedule,
    } = this.props;
    const { recordsFiltered, pageNumber, pageSize } = metaGroupList;
    const tableHeight = styles(
      createMuiTheme({
        typography: {
          useNextVariants: true,
        },
      }),
    ).extendTableWrapperAssign.height;

    return (
      <React.Fragment>
        <AddFolderLogModal
          onChangeGroupModel={onChangeGroupModel}
          selectedGroupId={groupDetailId}
          closeModal={this.closeAddFolderLogModal}
          isOpenModal={isOpenModal}
          onSaveGroup={onSaveGroup}
          groupModel={groupModel}
          classes={classes}
          groupData={groupData}
        />

        <Hidden smDown>
          <Grid item md={4} sm={12} xs={12}>
            <Typography style={{ fontSize: 16, fontWeight: 'bold' }}>
              <FormattedMessage {...messages.folderLog} />
            </Typography>
          </Grid>
        </Hidden>
        <Toolbar className={classes.noPaddingLeftRight}>
          <Grid
            container
            justify="space-between"
            alignItems="center"
            style={{ marginLeft: 0, marginRight: 10 }}
          >
            <Grid
              item
              md={6}
              sm={12}
              xs={12}
              style={{ position: 'relative', height: 64 }}
            >
              <Grid style={{ position: 'absolute', top: 0, left: 0 }}>
                <Autocomplete
                  classes={classes}
                  id="search"
                  name="search"
                  suggestion={this.state.arrSuggestion}
                  getSuggestions={this.getSuggestions}
                  onChangeKeyword={async (value) => {
                    await onSearchFolderAndFile(value);
                    this.setState({
                      search: value,
                    });
                  }}
                  onSelect={async (item) => {
                    if (item) {
                      let newArr = [];
                      this.state.arrSuggestion.map((item) =>
                        newArr.push({ ...item, label: item.name }),
                      ),
                        this.setState({
                          searchItemSelect: item,
                          arrSuggestion: newArr,
                        });

                      if (item.id.includes('work')) {
                        this.props.onSelectGroup([item.id], 'work');
                      } else if (item.id.includes('meeting')) {
                        this.props.onSelectGroup([item.id], 'meeting');
                      } else {
                        this.onClickCheckBox(Number(item.id), item.name);
                      }
                    }
                  }}
                  placeholder={this.state.searchItemSelect.name}
                />
              </Grid>
              {/* <SearchUI onSearchData={searchFolderLog} /> */}
            </Grid>
            <Grid item md={4} sm={12} xs={12} style={{ textAlign: 'right' }}>
              {permission.folder.addFolder && (
                <Fab
                  className={classes.fab}
                  color="primary"
                  aria-label="Add"
                  onClick={this.addFolderLog}
                >
                  <FormattedMessage {...messages.addFolder}>
                    {(addNewGroup) => (
                      <Tooltip title={addNewGroup}>
                        <AddIcon />
                      </Tooltip>
                    )}
                  </FormattedMessage>
                </Fab>
              )}
              {permission.folder.deleteFolder && (
                <Fab
                  className={classes.fab}
                  color="secondary"
                  aria-label="Delete"
                  onClick={this.deleteMultiesDoor}
                  disabled={selectedGroupIds.length === 0}
                  style={
                    selectedGroupIds.length === 0
                      ? {}
                      : { color: 'white', background: colorDelete }
                  }
                >
                  <FormattedMessage {...messages.deleteFolderLog}>
                    {(deleteFolderLog) => (
                      <Tooltip title={deleteFolderLog}>
                        <DeleteIcon />
                      </Tooltip>
                    )}
                  </FormattedMessage>
                </Fab>
              )}
            </Grid>
          </Grid>
        </Toolbar>
        <div
          style={{ height: 'calc(100vh - 260px)', overflow: 'scroll' }}
          className={classes.scrollList}
        >
          <List dense className={classes.list}>
            {groupData.map((group) => (
              <React.Fragment key={group.id}>
                <ContextMenuTrigger id={group.id}>
                  <ListItem
                    classes={{ selected: classes.active }}
                    button
                    key={group.id}
                    selected={selectedGroupId === group.id}
                    className={classes.noPaddingLeftRight}
                    onClick={this.onClickList(group.id, group.name)}
                  >
                    {group.children &&
                      group.children.length > 0 &&
                      (openFolderLogs.includes(group.id) ? (
                        <ExpandLess
                          onClick={() => this.toggleChildFolderLog(group.id)}
                        />
                      ) : (
                        <ExpandMore
                          onClick={() => this.toggleChildFolderLog(group.id)}
                        />
                      ))}
                    {group.children.length === 0 && (
                      <span style={{ width: 24 }}></span>
                    )}
                    <Folder />
                    <ListItemText
                      classes={{ primary: classes.fontSizeStyle }}
                      variant="caption"
                      primary={group.name}
                    />

                    {/* <Checkbox
                      style={{ padding: 0 }}
                      onChange={() =>
                        this.onClickCheckBox(group.id, group.name)
                      }
                      checked={selectedGroupIds.includes(group.id)}
                      // disabled={group.id === 1}
                    /> */}
                    {permission.folder.editFolder && (
                      <IconButton
                        style={{ padding: 0, marginLeft: 6, marginRight: 6 }}
                        color="primary"
                        onClick={this.editGroup(group.id)}
                        className="btn-edit-group"
                      >
                        <FormattedMessage {...messages.editFolderLog}>
                          {(editGroup) => (
                            <Tooltip title={editGroup}>
                              <EditIcon />
                            </Tooltip>
                          )}
                        </FormattedMessage>
                      </IconButton>
                    )}
                  </ListItem>
                </ContextMenuTrigger>
                <ContextMenu id={group.id}>
                  <MenuItem onClick={() => this.addChildFolderLog(group.id)}>
                    <FormattedMessage {...messages.addFolder} />
                  </MenuItem>
                  <MenuItem divider />
                  <MenuItem
                    onClick={() => this.props.handleAddNewWorkLog(group)}
                  >
                    <FormattedMessage {...messages.addWorkLog} />
                  </MenuItem>
                  <MenuItem divider />
                  <MenuItem
                    onClick={() => this.props.handleAddNewMeeting(group)}
                  >
                    <FormattedMessage {...messages.addMeetingLog} />
                  </MenuItem>
                </ContextMenu>
                {this.renderChilds(group, group.children)}
              </React.Fragment>
            ))}
          </List>
        </div>
        <FormattedMessage {...messages.rowsPerPage}>
          {(rowsPerPage) => (
            <TablePagination
              className={stylePaging}
              component="span"
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              count={recordsFiltered}
              rowsPerPage={pageSize}
              page={pageNumber - 1}
              onChangePage={this.changePageNumber}
              onChangeRowsPerPage={this.handlePageChangeGroup}
              ActionsComponent={PaginationActions}
              labelRowsPerPage={rowsPerPage}
            />
          )}
        </FormattedMessage>
      </React.Fragment>
    );
  }
}

GroupList.propTypes = {
  onAssignDoorsToGroup: PropTypes.func,
  setGroupId: PropTypes.func,
  showTableDetail: PropTypes.func,
  onClearModal: PropTypes.func,
  groupData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  searchDataSelector: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  classes: PropTypes.object,
  onSearchFolderAndFile: PropTypes.func,
  metaGroupList: PropTypes.object,
  openModal: PropTypes.func,
  closeModal: PropTypes.func,
  onSelectGroup: PropTypes.func,
  onChangePageSizeGroup: PropTypes.func,
  onChangePageNumberGroup: PropTypes.func,
  groupModel: PropTypes.object,
  onChangeGroupModel: PropTypes.func,
  onSaveGroup: PropTypes.func,
  onDeleteMultiesGroup: PropTypes.func,
  onGetGroupDetail: PropTypes.func,
  getFolderLogs: PropTypes.func,
  selectedGroupId: PropTypes.number,
  isOpenModal: PropTypes.bool,
  searchFolderLog: PropTypes.func,
  handleAddNewWorkLog: PropTypes.func,
  handleAddNewMeeting: PropTypes.func,
  handleClickWorkLogDetail: PropTypes.func,
  handleClickMeetingDetail: PropTypes.func,
  handleDeleteWorkLog: PropTypes.func,
  handleDeleteMeeting: PropTypes.func,
  onDeleteSchedule: PropTypes.func,
  onDeleteDailyReport: PropTypes.func,
  stylePaging: PropTypes.string,
};

export default withStyles(styles)(GroupList);
