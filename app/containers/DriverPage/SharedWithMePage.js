import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { makeSelectLoading } from '../App/selectors';
import { RESTART_ON_REMOUNT } from 'utils/constants';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import { styles } from './styles';
import { fromJS } from 'immutable';
import AlertDialogSlideUI from 'components/AlertDialogSlideUI';
import FolderModal from './FolderModal.js';
import RenameModal from './RenameModal.js';
import DocumentShareModal from './DocumentShareModal.js';
import { FormattedMessage } from 'react-intl';
import messages from './messages.js';
import {
  getRootFolderId,
  getDocument,
  getListLinkFolders,
  getStateUsersShared,
  getStateMetaUsersShared,
  getStateUsersNotShared,
  getStateMetaUsersNotShared,
  getPermissions,
} from './selectors';
import {
  getInit,
  addFolder,
  getDocumentById,
  addFile,
  deleteFolder,
  deleteFile,
  editFolder,
  editFile,
  downloadFolder,
  downloadFile,
  addItemToListLinkFolder,
  getUsersShared,
  shareDocument,
  unShareDocument,
  getUsersNotShared,
  getDocumentSharedWithMe,
} from './actions';
import {
  Grid, Table, TableRow, TableCell, TableHead, TableBody, Card,
  Avatar, Button, Fab, Tooltip, Select, MenuItem, Checkbox
} from '@material-ui/core';
import {
  FaFolder, FaLink, FaDownload, FaArrowUp, FaArrowDown,
  FaFolderPlus, FaFileUpload, FaTrash, FaPen, FaUserPlus,
} from 'react-icons/fa';
import { MdFolderShared } from 'react-icons/md';
import { IoIosArrowForward } from 'react-icons/io';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MoreVert, } from '@material-ui/icons';
import { generateIconDocument, generateSizeFile, changeSelectedIds, convertDateTimeDisplay, getPermissionEditByListLinkDocument } from './DriverUtil.js';

const headers = [
  {
    id: 'name',
    label: <FormattedMessage {...messages.name} />
  },
  {
    id: 'owner',
    label: <FormattedMessage {...messages.owner} />
  },
  {
    id: 'updatedOn',
    label: <FormattedMessage {...messages.updatedOn} />
  },
  {
    id: 'size',
    label: <FormattedMessage {...messages.size} />
  },
  {
    id: 'action',
    label: '##'
  },
]

export class SharedWithMePage extends React.Component {
  state = {
    isOpenFolderModal: false,
    openViewMoreAction: false,
    rowIsViewMoreAction: null,
    isOpenRenameModal: false,
    tempRecord: null,
    openViewMoreLink: false,
    isDeleteDocument: false,
    isOpenDocumentShareModel: false,
    selectedDocumentIds: [],
    sortColumnId: null,
    sortDirectionId: 'asc',
  }

  componentDidMount = async () => {
    await this.props.onGetInit(0);
  }

  toggleFolderModal = () => {
    this.setState({
      isOpenFolderModal: !this.state.isOpenFolderModal,
    });
  }

  clickViewMoreAction = (n) => {
    this.setState({
      openViewMoreAction: true,
      rowIsViewMoreAction: n.id,
    });
  };

  handleCloseViewMore = () => {
    this.setState({
      openViewMoreAction: false,
      rowIsViewMoreAction: null,
    });
  };

  handleDocumentClick = (event) => {
    if (!this.selectRef || !this.selectRef.contains(event.target)) {
      this.handleCloseViewMore();
    }
  };

  addOrEditFolder = (name) => {
    const { tempRecord } = this.state;
    const { listLinkFolders } = this.props;
    if (tempRecord && tempRecord.folderId) {
      this.props.onAddFolder({
        parentId: tempRecord.folderId,
        name: name,
      }, listLinkFolders.slice(-1)[0].id);
    } else {
      this.props.onAddFolder({
        parentId: listLinkFolders.slice(-1)[0].id,
        name: name,
      }, listLinkFolders.slice(-1)[0].id);
    }

    this.toggleFolderModal();
  }

  handleFileChange = (event) => {
    const { tempRecord } = this.state;
    const { listLinkFolders } = this.props;
    if (tempRecord && tempRecord.folderId) {
      this.props.onAddFile(event.target.files, listLinkFolders.slice(-1)[0].id, tempRecord.folderId);
      this.setState({
        tempRecord: null,
      });
    } else {
      this.props.onAddFile(event.target.files, listLinkFolders.slice(-1)[0].id);
    }
  }

  deleteDocument = (item) => {
    const { listLinkFolders } = this.props;
    let ids = [];
    if (item.folderId) {
      ids.push(item.folderId);
      this.props.onDeleteFolder(ids, listLinkFolders.slice(-1)[0].id);
    } else if (item.fileId) {
      ids.push(item.fileId);
      this.props.onDeleteFile(ids, listLinkFolders.slice(-1)[0].id);
    }
  }

  toggleRenameModal = (tempRecord) => {
    this.setState({
      isOpenRenameModal: !this.state.isOpenRenameModal,
      tempRecord: tempRecord,
    });
  }

  handleChangeFieldTempRecord = (name, value) => {
    this.setState({
      tempRecord: {
        ...this.state.tempRecord,
        [name]: value,
      }
    });
  }

  editName = () => {
    const { tempRecord } = this.state;
    const { listLinkFolders } = this.props;
    if (tempRecord.folderId) {
      this.props.onEditFolder({
        name: tempRecord.name,
        id: tempRecord.folderId,
      }, listLinkFolders.slice(-1)[0].id);
    } else if (tempRecord.fileId) {
      this.props.onEditFile({
        name: tempRecord.name,
        id: tempRecord.fileId,
      }, listLinkFolders.slice(-1)[0].id);
    }
    this.toggleRenameModal(null);
  }

  downloadDocument = (item) => {
    if (item.folderId) {
      this.props.onDownloadFolder(item.folderId, item.name);
    } else if (item.fileId) {
      this.props.onDownloadFile(item.fileId, item.name);
    }
  }

  openFolderRow = (item) => {
    if (item.folderId) {
      const { history, listLinkFolders } = this.props;
      this.setState({
        tempRecord: null,
        sortColumnId: null,
        sortDirectionId: 'asc',
      });
      this.props.onGetDocumentById(item.folderId);
      this.props.onAddItemToListLinkFolder([...listLinkFolders, { id: item.folderId, name: item.name, canBeEdit: item.canBeEdit }]);
    }
  }

  openLinkFolderRow = (itemLink, index) => {
    const { history, listLinkFolders, rootFolderId } = this.props;
    if (itemLink.id == 0) {
      this.props.onGetDocumentSharedWithMe();
    } else {
      this.props.onGetDocumentById(itemLink.id);
    }
    this.props.onAddItemToListLinkFolder(listLinkFolders.slice(0, index + 1));
    this.setState({
      sortColumnId: null,
      sortDirectionId: 'asc',
    })
  }

  toggleDeleteDocument = (tempRecord) => {
    this.setState({
      isDeleteDocument: !this.state.isDeleteDocument,
      tempRecord: tempRecord,
    });
  }

  onConfirmDeleteDocument = () => {
    try {
      const { tempRecord } = this.state;
      if (tempRecord && (tempRecord.fileId || tempRecord.folderId)) {
        this.deleteDocument(tempRecord);
      } else {
        this.handleDeleteMultiDocuments();
      }

    } catch (error) {
      console.log(error);
    }
    this.toggleDeleteDocument(null);
  }

  toggleDocumentShareModal = (tempRecord) => {
    if (tempRecord) {
      let folderId = tempRecord.folderId;
      let fileId = tempRecord.fileId;
      this.props.onGetUsersShared({
        name: '',
        pageNumber: 1,
        pageSize: 25,
        sortColumn: 'name',
        sortDirection: 'asc',
        recordsTotal: 0,
        recordsFiltered: 0,
      }, folderId, fileId);

      this.props.onGetUsersNotShared({
        name: '',
        pageNumber: 1,
        pageSize: 25,
        sortColumn: 'name',
        sortDirection: 'asc',
        recordsTotal: 0,
        recordsFiltered: 0,
      }, folderId, fileId);
    }
    this.setState({
      isOpenDocumentShareModel: !this.state.isOpenDocumentShareModel,
      tempRecord: tempRecord,
    });
  }

  changeMetaUsersShared = (meta) => {
    const { tempRecord } = this.state;
    if (tempRecord) {
      let folderId = tempRecord.folderId;
      let fileId = tempRecord.fileId;
      this.props.onGetUsersShared(meta, folderId, fileId);
    }
  }

  changeMetaUsersNotShared = (meta) => {
    const { tempRecord } = this.state;
    if (tempRecord) {
      let folderId = tempRecord.folderId;
      let fileId = tempRecord.fileId;
      this.props.onGetUsersNotShared(meta, folderId, fileId);
    }
  }

  changePermission = (item, type) => {
    const { tempRecord } = this.state;
    const { metaUsersShared } = this.props;
    this.props.onShareDocument({
      userIds: [item.id],
      permissionId: type,
      folderId: tempRecord.folderId,
      fileId: tempRecord.fileId,
      metaShared: metaUsersShared,
    });
  }

  deletePermission = (item) => {
    const { tempRecord } = this.state;
    const { metaUsersShared, metaUsersNotShared } = this.props;
    this.props.onUnShareDocument({
      userIds: [item.id],
      permissionId: -1,
      folderId: tempRecord.folderId,
      fileId: tempRecord.fileId,
      metaShared: metaUsersShared,
      metaNotShared: metaUsersNotShared,
    });
  }

  shareDocumentToUsers = (userIds, type) => {
    const { tempRecord } = this.state;
    const { metaUsersShared, metaUsersNotShared } = this.props;
    this.props.onShareDocument({
      userIds: userIds,
      permissionId: type,
      folderId: tempRecord.folderId,
      fileId: tempRecord.fileId,
      metaShared: metaUsersShared,
      metaNotShared: metaUsersNotShared,
    });
  }

  handleDeleteMultiDocuments = () => {
    const { selectedDocumentIds } = this.state;
    const { document, listLinkFolders } = this.props;
    let folderIds = [];
    let fileIds = [];

    document.toJS().data.filter(m => selectedDocumentIds.includes(m.id)).forEach((e, i) => {
      if (e.folderId) {
        folderIds.push(e.folderId);
      }
      if (e.fileId) {
        fileIds.push(e.fileId);
      }
    });

    if (folderIds.length > 0) {
      this.props.onDeleteFolder(folderIds, listLinkFolders.slice(-1)[0].id);
    }

    if (fileIds.length > 0) {
      this.props.onDeleteFile(fileIds, listLinkFolders.slice(-1)[0].id);
    }

    this.setState({ selectedDocumentIds: [] });
  }

  render() {
    const { isOpenFolderModal, openViewMoreAction, rowIsViewMoreAction, isOpenDocumentShareModel,
      isOpenRenameModal, tempRecord, openViewMoreLink, isDeleteDocument, selectedDocumentIds,
      sortColumnId, sortDirectionId } = this.state;
    const { document, classes, listLinkFolders, enqueueSnackbar, usersShared, metaUsersShared,
      permissions, usersNotShared, metaUsersNotShared, } = this.props;
    const { data, meta } = document.toJS();

    const rootCanBeEdit = getPermissionEditByListLinkDocument(listLinkFolders);
    return (
      <React.Fragment>
        <AlertDialogSlideUI
          onOpen={isDeleteDocument}
          messsage={<span />}
          title={<FormattedMessage {...messages.confirmDeleteDocument} />}
          onActionAgree={this.onConfirmDeleteDocument}
          onCloseDialog={() => this.toggleDeleteDocument(null)}
        />
        <FolderModal
          isOpenModal={isOpenFolderModal}
          closeModal={this.toggleFolderModal}
          classes={classes}
          addOrEditFolder={this.addOrEditFolder}
        />
        <RenameModal
          isOpenModal={isOpenRenameModal}
          closeModal={this.toggleRenameModal}
          classes={classes}
          editName={this.editName}
          nameDocument={tempRecord ? tempRecord.name : ''}
          changeTextField={this.handleChangeFieldTempRecord}
        />
        <DocumentShareModal
          isOpenModal={isOpenDocumentShareModel}
          closeModal={this.toggleDocumentShareModal}
          classes={classes}
          tempRecord={tempRecord}
          usersShared={usersShared}
          metaUsersShared={metaUsersShared.pageNumber ? fromJS(metaUsersShared) : metaUsersShared}
          permissions={permissions}
          changePermission={this.changePermission}
          deletePermission={this.deletePermission}
          changeMetaUsersShared={this.changeMetaUsersShared}
          usersNotShared={usersNotShared}
          metaUsersNotShared={metaUsersNotShared.pageNumber ? fromJS(metaUsersNotShared) : metaUsersNotShared}
          changeMetaUsersNotShared={this.changeMetaUsersNotShared}
          shareDocument={this.shareDocumentToUsers}
        />
        <Grid container spacing={24}>
          <Grid item sm={6}>
            {listLinkFolders && (<React.Fragment>
              <table>
                <tr>
                  {listLinkFolders.length > 2 && <td>
                    {!openViewMoreLink
                      ? <Button
                        color='default'
                        style={{ marginTop: 20 }}
                        onClick={() => this.setState({ openViewMoreLink: true })}
                      >...</Button>
                      : <Select
                        ref={(ref) => (this.selectRef = ref)}
                        value={''}
                        onClose={() => this.setState({ openViewMoreLink: false })}
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
                        {listLinkFolders.slice(0, listLinkFolders.length - 2).map((e, i) =>
                          <MenuItem value="" key={`itemLinkFolders_${e.id}`}>
                            <Button
                              color="primary"
                              aria-label="download"
                              className={classes.iconActionInCell}
                              onClick={(event) => this.openLinkFolderRow(e, i)}
                            >
                              <div className={classes.iconSelect}>
                                <table>
                                  <tr>
                                    <td><FaFolder size={18} />&nbsp;</td>
                                    <td>{e.name}</td>
                                  </tr>
                                </table>
                              </div>
                            </Button>
                          </MenuItem>)}
                      </Select>}
                  </td>}
                  {listLinkFolders.length > 2 && <td><IoIosArrowForward height={15} style={{ marginTop: 20 }} /></td>}
                  {listLinkFolders.length > 1 && <td><Button
                    color='default'
                    style={{ marginTop: 20 }}
                    onClick={() => this.openLinkFolderRow(listLinkFolders.slice(-2)[0], listLinkFolders.length - 2)}
                  >{listLinkFolders.slice(-2)[0].name}</Button></td>}
                  {listLinkFolders.length > 1 && <td><IoIosArrowForward height={15} style={{ marginTop: 20 }} /></td>}
                  {listLinkFolders.length > 0 && <td><Button
                    color='default'
                    style={{ marginTop: 20 }}
                    onClick={() => this.openLinkFolderRow(listLinkFolders.slice(-1)[0], listLinkFolders.length - 1)}
                  >{listLinkFolders.slice(-1)[0].name}</Button></td>}
                </tr>
              </table>
            </React.Fragment>)}
          </Grid>
          <Grid item sm={6} style={{ textAlign: 'right' }}>
            <Fab
              id="add_folder"
              color="primary"
              aria-label="AddFolder"
              className={classes.button}
              onClick={this.toggleFolderModal}
              disabled={!rootCanBeEdit || (listLinkFolders && listLinkFolders.length == 1)}
            >
              <FormattedMessage {...messages.addFolder}>
                {(title) => (
                  <Tooltip title={title}>
                    <FaFolderPlus size={20} />
                  </Tooltip>
                )}
              </FormattedMessage>
            </Fab>
            <Fab
              id="add_file"
              color="primary"
              aria-label="AddFile"
              className={classes.button}
              onClick={() => window.document.getElementById("uploadFile_add_file").click()}
              disabled={!rootCanBeEdit || (listLinkFolders && listLinkFolders.length == 1)}
            >
              <FormattedMessage {...messages.addFile}>
                {(title) => (
                  <Tooltip title={title}>
                    <FaFileUpload size={20} />
                  </Tooltip>
                )}
              </FormattedMessage>
              <input type='file' onChange={this.handleFileChange} id='uploadFile_add_file' style={{ display: 'none' }} multiple />
            </Fab>
            <Fab
              id="download_folder"
              color="primary"
              aria-label="DownloadFolder"
              className={classes.button}
              onClick={() => {
                var currentFolder = listLinkFolders.slice(-1)[0];
                this.downloadDocument({
                  folderId: currentFolder.id,
                  name: currentFolder.name,
                });
              }}
              disabled={listLinkFolders && listLinkFolders.length == 1}
            >
              <FormattedMessage {...messages.download}>
                {(title) => (
                  <Tooltip title={title}>
                    <FaDownload size={20} />
                  </Tooltip>
                )}
              </FormattedMessage>
            </Fab>
            <Fab
              id="delete_document"
              color="secondary"
              aria-label="DeleteDocument"
              className={classes.button}
              style={!rootCanBeEdit || selectedDocumentIds.length == 0 ? {} : { color: 'white', background: '#B23535' }}
              onClick={this.toggleDeleteDocument}
              disabled={!rootCanBeEdit || selectedDocumentIds.length == 0}
            >
              <FormattedMessage {...messages.delete}>
                {(title) => (
                  <Tooltip title={title}>
                    <FaTrash size={20} />
                  </Tooltip>
                )}
              </FormattedMessage>
            </Fab>
          </Grid>
          <Grid item sm={12}>
            <Card>
              <Table id="myDriver" className="p-datatable-scrollable-body-table">
                <TableHead className="p-datatable-thead">
                  <TableRow>
                    <TableCell key='selectId' className={`${classes.tableHeader}`} style={{ width: '5px' }}>
                      <Checkbox
                        checked={data && selectedDocumentIds.length == data.length}
                        onChange={(event) => {
                          if (!event.target.checked) {
                            this.setState({ selectedDocumentIds: [] });
                          } else if (data) {
                            this.setState({ selectedDocumentIds: data.map(m => m.id) });
                          }
                        }}
                      />
                    </TableCell>
                    {headers.map(row => (
                      <TableCell
                        key={row.id}
                        className={`${classes.tableHeader}`}
                        onClick={() => {
                          if (row.id != 'action' && row.id != sortColumnId) {
                            this.setState({ sortColumnId: row.id });
                            if (listLinkFolders.length == 1) {
                              this.props.onGetDocumentSharedWithMe({
                                ...meta,
                                sortColumn: row.id,
                              });
                            } else {
                              this.props.onGetDocumentById(listLinkFolders.slice(-1)[0].id, {
                                ...meta,
                                sortColumn: row.id,
                              });
                            }
                          }
                        }}
                      >
                        {row.id == 'name'
                          ? <span className="p-column-title" style={{ marginLeft: 20 }}>{row.label}</span>
                          : <span className="p-column-title">{row.label}</span>
                        }
                        {sortColumnId == row.id && <Button
                          onClick={() => {
                            const sortDirectionChange = sortDirectionId == 'asc' ? 'desc' : 'asc';
                            this.setState({ sortDirectionId: sortDirectionChange });
                            if (listLinkFolders.length == 1) {
                              this.props.onGetDocumentSharedWithMe({
                                ...meta,
                                sortDirection: sortDirectionChange,
                              });
                            } else {
                              this.props.onGetDocumentById(listLinkFolders.slice(-1)[0].id, {
                                ...meta,
                                sortDirection: sortDirectionChange,
                              });
                            }
                          }}
                        >
                          {sortDirectionId == 'asc' ? <FaArrowUp /> : <FaArrowDown />}
                        </Button>}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody className="p-datatable-tbody">
                  {data && data.map(item => (
                    <TableRow
                      key={item.id}
                      className="p-datatable-row"
                      onDoubleClick={() => { this.openFolderRow(item); }}
                      onClick={() => { this.setState({ selectedDocumentIds: changeSelectedIds(selectedDocumentIds, item.id) }); }}
                    >
                      <TableCell className={`${classes.cellTableBody}`}>
                        <Checkbox
                          checked={selectedDocumentIds.includes(item.id)}
                          onChange={() => { this.setState({ selectedDocumentIds: changeSelectedIds(selectedDocumentIds, item.id) }); }}
                        />
                      </TableCell>
                      <TableCell>
                        <table>
                          <tr>
                            {item.folderId
                              ? <td><MdFolderShared size={18} />&nbsp;</td>
                              : <td>{generateIconDocument(item.name)}&nbsp;</td>
                            }
                            <td>{item.name}</td>
                          </tr>
                        </table>
                      </TableCell>
                      <TableCell className={`${classes.cellTableBody}`}>
                        <table>
                          <tr>
                            <td>
                              <Avatar
                                key={`${item.id}_avatar`}
                                src={item.ownerAvatar}
                                style={{ width: 30, height: 30 }}
                              />
                            </td>
                            <td>{item.ownerName}</td>
                          </tr>
                        </table>
                      </TableCell>
                      <TableCell className={`${classes.cellTableBody}`}>
                        {convertDateTimeDisplay(item.updatedOn)}
                      </TableCell>
                      <TableCell className={`${classes.cellTableBody}`}>
                        {generateSizeFile(item.size)}
                      </TableCell>
                      {!(openViewMoreAction && rowIsViewMoreAction === item.id) && (
                        <TableCell className={`${classes.cellTableBody}`} style={{ width: '80px' }}>
                          <Button
                            color="primary"
                            aria-label="more"
                            className={classes.iconActionInCell}
                            onClick={(event) => {
                              event.stopPropagation();
                              this.clickViewMoreAction(item);
                            }}
                          >
                            <Tooltip
                              key="more"
                              title={<FormattedMessage {...messages.viewAction} />}
                            >
                              <MoreVert />
                            </Tooltip>
                          </Button>
                        </TableCell>
                      )}
                      {openViewMoreAction && rowIsViewMoreAction === item.id && (
                        <TableCell className={`${classes.cellTableBody}`} style={{ width: '80px' }}>
                          <Select
                            ref={(ref) => (this.selectRef = ref)}
                            value={''}
                            onClose={this.handleCloseViewMore}
                            open={openViewMoreAction}
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
                            <MenuItem value="">
                              <Button
                                color="primary"
                                aria-label="download"
                                className={classes.iconActionInCell}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  this.handleCloseViewMore();
                                  this.downloadDocument(item);
                                }}
                              >
                                <div className={classes.iconSelect}>
                                  <table>
                                    <tr>
                                      <td><FaDownload size={18} />&nbsp;</td>
                                      <td><FormattedMessage {...messages.download} /></td>
                                    </tr>
                                  </table>
                                </div>
                              </Button>
                            </MenuItem>
                            {item.folderId && (<MenuItem value="">
                              <CopyToClipboard text={`${window.document.location.origin}/folders/${item.folderId}`}>
                                <Button
                                  color="primary"
                                  aria-label="copyLink"
                                  className={classes.iconActionInCell}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    this.handleCloseViewMore();
                                    enqueueSnackbar(<FormattedMessage {...messages.msgCopyLinkSuccess} />, {
                                      variant: 'success',
                                    });
                                  }}
                                >
                                  <div className={classes.iconSelect}>
                                    <table>
                                      <tr>
                                        <td><FaLink size={18} />&nbsp;</td>
                                        <td><FormattedMessage {...messages.copyLink} /></td>
                                      </tr>
                                    </table>
                                  </div>
                                </Button>
                              </CopyToClipboard>
                            </MenuItem>)}
                            {item.canBeEdit && <MenuItem value="">
                              <Button
                                color="primary"
                                aria-label="share"
                                className={classes.iconActionInCell}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  this.handleCloseViewMore();
                                  this.toggleDocumentShareModal(item);
                                }}
                              >
                                <div className={classes.iconSelect}>
                                  <table>
                                    <tr>
                                      <td><FaUserPlus size={18} />&nbsp;</td>
                                      <td><FormattedMessage {...messages.share} /></td>
                                    </tr>
                                  </table>
                                </div>
                              </Button>
                            </MenuItem>}
                            {item.folderId && item.canBeEdit && (<MenuItem value="">
                              <Button
                                color="primary"
                                aria-label="addFolder"
                                className={classes.iconActionInCell}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  this.handleCloseViewMore();
                                  this.setState({ tempRecord: item });
                                  this.toggleFolderModal();
                                }}
                              >
                                <div className={classes.iconSelect}>
                                  <table>
                                    <tr>
                                      <td><FaFolderPlus size={18} />&nbsp;</td>
                                      <td><FormattedMessage {...messages.addFolder} /></td>
                                    </tr>
                                  </table>
                                </div>
                              </Button>
                            </MenuItem>)}
                            {item.folderId && item.canBeEdit && (<MenuItem value="">
                              <Button
                                color="primary"
                                aria-label="addFile"
                                className={classes.iconActionInCell}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  this.handleCloseViewMore();
                                  this.setState({ tempRecord: item });
                                  window.document.getElementById("uploadFile_add_file").click();
                                }}
                              >
                                <div className={classes.iconSelect}>
                                  <table>
                                    <tr>
                                      <td><FaFileUpload size={18} />&nbsp;</td>
                                      <td><FormattedMessage {...messages.addFile} /></td>
                                    </tr>
                                  </table>
                                </div>
                              </Button>
                            </MenuItem>)}
                            {item.canBeEdit && <MenuItem value="">
                              <Button
                                color="primary"
                                aria-label="rename"
                                className={classes.iconActionInCell}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  this.handleCloseViewMore();
                                  this.toggleRenameModal(item);
                                }}
                              >
                                <div className={classes.iconSelect}>
                                  <table>
                                    <tr>
                                      <td><FaPen size={18} />&nbsp;</td>
                                      <td><FormattedMessage {...messages.rename} /></td>
                                    </tr>
                                  </table>
                                </div>
                              </Button>
                            </MenuItem>}
                            {item.canBeEdit && <MenuItem value="">
                              <Button
                                color="primary"
                                aria-label="delete"
                                className={classes.iconActionInCell}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  this.handleCloseViewMore();
                                  this.toggleDeleteDocument(item);
                                }}
                              >
                                <div className={classes.iconSelect}>
                                  <table>
                                    <tr>
                                      <td><FaTrash size={18} />&nbsp;</td>
                                      <td><FormattedMessage {...messages.delete} /></td>
                                    </tr>
                                  </table>
                                </div>
                              </Button>
                            </MenuItem>}
                          </Select>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }
}

SharedWithMePage.propTypes = {
  classes: PropTypes.object,
  history: PropTypes.object,
  onGetInit: PropTypes.func,
  onAddFolder: PropTypes.func,
  onGetDocumentById: PropTypes.func,
  onAddFile: PropTypes.func,
  onDeleteFolder: PropTypes.func,
  onDeleteFile: PropTypes.func,
  onEditFolder: PropTypes.func,
  onEditFile: PropTypes.func,
  onDownloadFolder: PropTypes.func,
  onDownloadFile: PropTypes.func,
  onAddItemToListLinkFolder: PropTypes.func,
  listLinkFolders: PropTypes.array,
  usersShared: PropTypes.array,
  metaUsersShared: PropTypes.object,
  onGetUsersShared: PropTypes.func,
  permissions: PropTypes.array,
  onShareDocument: PropTypes.func,
  onUnShareDocument: PropTypes.func,
  usersNotShared: PropTypes.array,
  metaUsersNotShared: PropTypes.object,
  onGetUsersNotShared: PropTypes.func,
  onGetDocumentSharedWithMe: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onGetInit: (rootFolderId) => dispatch(getInit(rootFolderId)),
    onAddFolder: (folder, rootFolderId) => dispatch(addFolder(folder, rootFolderId)),
    onGetDocumentById: (id, meta) => dispatch(getDocumentById(id, meta)),
    onAddFile: (files, folderId, parentId) => dispatch(addFile(files, folderId, parentId)),
    onDeleteFolder: (ids, parenId) => dispatch(deleteFolder(ids, parenId)),
    onDeleteFile: (ids, parenId) => dispatch(deleteFile(ids, parenId)),
    onEditFolder: (data, parentId) => dispatch(editFolder(data, parentId)),
    onEditFile: (data, parentId) => dispatch(editFile(data, parentId)),
    onDownloadFolder: (id, name) => dispatch(downloadFolder(id, name)),
    onDownloadFile: (id, name) => dispatch(downloadFile(id, name)),
    onAddItemToListLinkFolder: (data) => dispatch(addItemToListLinkFolder(data)),
    onGetUsersShared: (meta, folderId, fileId) => dispatch(getUsersShared(meta, folderId, fileId)),
    onShareDocument: (data) => dispatch(shareDocument(data)),
    onUnShareDocument: (data) => dispatch(unShareDocument(data)),
    onGetUsersNotShared: (meta, folderId, fileId) => dispatch(getUsersNotShared(meta, folderId, fileId)),
    onGetDocumentSharedWithMe: (meta) => dispatch(getDocumentSharedWithMe(meta)),
  };
}

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  rootFolderId: getRootFolderId(),
  document: getDocument(),
  listLinkFolders: getListLinkFolders(),
  usersShared: getStateUsersShared(),
  metaUsersShared: getStateMetaUsersShared(),
  permissions: getPermissions(),
  usersNotShared: getStateUsersNotShared(),
  metaUsersNotShared: getStateMetaUsersNotShared(),
});

const withReducer = injectReducer({ key: 'driver', reducer });
const withSaga = injectSaga({
  key: 'driver',
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
)(withStyles(styles)(SharedWithMePage));
