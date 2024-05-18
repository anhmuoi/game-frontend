export const checkboxWidth = '40px';
export const columnWidth = '160px';

// departed
export function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

export function getSorting(order, orderBy) {
  return order === 'desc'
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

export function getStyleCellTableWidth(headers, idx) {
  const style = {
    width:
      headers[idx] && headers[idx].width ? headers[idx].width : columnWidth,
    minWidth:
      headers[idx] && headers[idx].minWidth ? headers[idx].minWidth : 'auto',
    wordBreak: 'break-all',
    textAlign:
      headers[idx] && headers[idx].textAlign ? headers[idx].textAlign : 'auto',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };
  return style;
}

export const styles = theme => ({
  root: {
    width: '100%',
    border: 'none',
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  table: {
    minWidth: 'auto',
  },
  tableWrapper: {
    height: 'calc(100vh - 305px)',
    // borderBottom: `1px solid ${theme.palette.primary.border}`,
  },
  tableHeader: {
    color: theme.palette.primary.color,
    // textAlign: 'left !important',
    flexDirection: 'row',
    fontWeight: 'bold',
    // border: '1px solid red',
    backgroundColor: '#ffffff',
    position: 'sticky',
    top: 0,
    zIndex: 1,
    borderBottom: `2px solid ${theme.palette.primary.border}`,
  },
  tableHeaderCenter: {
    textAlign: 'center',
  },
  cellTableCheckBoxHeader: {
    color: theme.palette.primary.color,
    minHeight: '40px',
    height: '40px',
    width: '50px',
    padding: '1px',
    // textAlign: 'left',
    flexDirection: 'row',
    fontWeight: 'bold',
    // border: '1px solid red',
    backgroundColor: '#ffffff',
    position: 'sticky',
    top: 0,
    zIndex: 1,
    borderBottom: `2px solid ${theme.palette.primary.border}`,
  },
  cellTableCheckBox: {
    color: theme.palette.primary.color,
    minHeight: '40px',
    height: '40px',
    width: '50px',
    padding: '1px',
    // border: '1px solid red',
  },
  cellTableBody: {
    color: theme.palette.primary.color,
    minHeight: '40px',
    height: '40px',
    minWidth: 'auto',
    // border: '1px solid black',
    // border: 'none',
    // whiteSpace: 'nowrap',
  },
  cellTableBodyCenter: {
    color: theme.palette.primary.color,
    // border: 'none',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    minHeight: '40px',
    height: '40px',
    // border: '1px solid black',
  },
  iconActionInCell: {
    padding: 3,
    minWidth: '1.3em',
  },
  notifACTIONTypeText: {
    color: 'red',
    textTransform: 'uppercase',
  },
  notifWARNINGTypeText: {
    color: 'orange',
    textTransform: 'uppercase',
  },
  notifINFORMTypeText: {
    color: '#1074de',
    textTransform: 'uppercase',
  },
  colorBar: {},
  colorChecked: {},
  topLine: {
    backgroundColor: theme.palette.primary.border,
    position: 'absolute',
    bottom: 0,
    marginLeft: -12,
    marginRight: -12,
    width: '100%',
    height: 1,
    content: '" "',
  },
  newRecivedMessage: {
    backgroundColor: '#a0edc1',
    animation: 'fade 5s forwards',
  },
  '@keyframes fade': {
    from: { backgroundColor: '#a0edc1' },
    to: { backgroundColor: '#d6dee8' },
  },
  fab: {
    margin: theme.spacing.unit,
    height: 36,
    width: 36,
  },
});
