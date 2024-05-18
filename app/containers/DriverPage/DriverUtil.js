import {
  FaFolder, FaFile, FaFilePdf, FaFileCsv, FaImage, FaFileWord, FaLink, FaDownload,
  FaFilePowerpoint, FaFolderPlus, FaFileUpload, FaTrash, FaPen, FaUserPlus,
} from 'react-icons/fa';
import { MdFolderShared, MdPeople } from 'react-icons/md';
import React from 'react';
import { localstoreUtilites } from 'utils/persistenceData';
import { format, utcToZonedTime } from 'date-fns-tz';
import { DATE_FORMAT } from 'utils/constants';

export const generateIconDocument = (fileName) => {
  const size = 18;
  try {
    switch (fileName.split('.').slice(-1)[0].toLowerCase()) {
      case 'pdf':
        return <FaFilePdf size={size} />;
      case 'csv':
      case 'xlsx':
        return <FaFileCsv size={size} />;
      case 'docx':
      case 'docm':
      case 'doc':
      case 'dot':
        return <FaFileWord size={size} />;
      case 'ppt':
      case 'pptx':
      case 'pptm':
        return <FaFilePowerpoint size={size} />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'webm':
      case 'webp':
        return <FaImage size={size} />;
      default:
        return <FaFile size={size} />;
    }
  } catch (error) {
    return <FaFile size={size} />;
  }
}

export const generateIconDocumentFolder = (shared) => {
  const size = 18;
  if (shared) {
    return <MdFolderShared size={size} />;
  } else {
    return <FaFolder size={size} />;
  }
}

export const generateSizeFile = (size) => {
  if (size == 0) {
    return '-';
  }
  else {
    let tempSize = size;
    if (size > 1000) {
      tempSize = (size / 1000).toFixed(2);
      if (tempSize > 1000) {
        tempSize = (size / (1000 * 1000)).toFixed(2);
        if (tempSize > 1000) {
          tempSize = (size / (1000 * 1000 * 1000)).toFixed(2);
          if (tempSize > 1000) {
            tempSize = (size / (1000 * 1000 * 1000 * 1000)).toFixed(2);
            return `${tempSize} TB`;
          }
          return `${tempSize} GB`;
        }
        return `${tempSize} MB`;
      }
      return `${tempSize} KB`;
    }
    return `${size} B`;
  }
}

export const changeSelectedIds = (array, id) => {
  try {
    if (array.includes(id)) {
      return array.filter(m => m != id);
    } else {
      return [...array, id];
    }

  } catch (error) {
    return array;
  }
}

export const convertDateTimeDisplay = (dateTime) => {
  try {
    const lang = localstoreUtilites.getLanguageFromLocalStorage() || 'en-US';
    const timezone = localstoreUtilites.getAccountTzFromLocalStorage();
    var arr = dateTime.split(' ');
    var arrDate = arr[0].split('.');
    var arrTime = arr[1].split(':');

    return format(utcToZonedTime(new Date(arrDate[2], arrDate[0] - 1, arrDate[1], arrTime[0], arrTime[1], arrTime[2]), timezone), DATE_FORMAT[lang]);
  } catch (error) {
    return dateTime;
  }
}

export const getPermissionEditByListLinkDocument = (listLinkFolders) => {
  try {
    return listLinkFolders.slice(-1)[0].canBeEdit;
  } catch (error) {
    return false;
  }
}