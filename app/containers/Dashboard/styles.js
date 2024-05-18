import { lighten, fade } from '@material-ui/core/styles/colorManipulator';

const WidthWindow = window.innerWidth;
export const styles = (theme) => ({
  // defaultPadding: {
  //   width: '100%',
  //   height: '100%',
  //   display: 'flex',
  //   justifyContent: 'space-evenly',
  //   padding: theme.spacing.unit
  // },
  contentItem: {
    // backgroundColor: '#E6ECF2',
    fontSize: 'large',
    padding: `${theme.spacing.unit}px ${theme.spacing.unit}px 0px ${theme.spacing.unit*2}px`,
    color: '#000',
    height: '100%'
  },
  titleDate:{
    display: 'flex',
    justifyContent: 'center',
    fontSize: 'xx-large',
  },
  container:{
    display: 'grid',
    height: '89vh',
    gridTemplateColumns: '6fr 5fr 3fr',
    gridTemplateRows: '1fr 1fr 1fr 1fr',
    columnGap: '2vh',
    rowGap: '2vh',
  },
  currentDate:{
    gridRow: '1 / 5',
  },
  nextDate1:{
    gridRow: '1 / 3'
  },
  nextDate2:{
    gridRow: '3 / 5'
  },
  calendar:{
    gridRow: '3 / 5',
    boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)',
    border: 'none !important',
    width: 'auto !important',
  },
  lock:{
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  roundedCorner: {
    borderRadius: '10px',
  },
  weather:{
    display: 'flex',
    alignItems: 'center',
  },
  iconWeather:{
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  }
});
