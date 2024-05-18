/* eslint-disable indent */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Grid, Typography } from '@material-ui/core';
import { format } from 'date-fns';
import { utcToZonedTime } from "date-fns-tz";
import { RESTART_ON_REMOUNT } from 'utils/constants';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { styles } from './styles';
import { makeSelectLoading } from '../App/selectors';
import { localstoreUtilites } from 'utils/persistenceData';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "./calendar.css";
import {
  getData
} from './actions';
import {
  getDashboardDataSelector
} from './selectors';

const dateFormat = 'MM/dd EEE';
const LIST_CULTURE = [
  {
    language: 'en-US',
    cultureCode: 0,
    dateTimeFormat: 'MM.dd.yyyy HH:mm:ss',
  },
  {
    language: 'ko-KR',
    cultureCode: 2,
    dateTimeFormat: 'yyyy.MM.dd HH:mm:ss',
  },
  {
    language: 'vi-VN',
    cultureCode: 3,
    dateTimeFormat: 'dd/MM/yyyy HH:mm:ss',
  },
];
const apiKey = '5d5b9a732bc42da9bbcd7ca897eb20f2';
const apiBase = 'https://api.openweathermap.org/data/2.5/';

export class DashboardPage extends React.Component {
  state = {
    currentDate: new Date(),
    nextDay1: new Date(),
    nextDay2: new Date(),
    weather: {}
  };

  componentDidMount() {
    this.props.onGetData();

    this.getWeather();

    const nextDay1 = new Date(this.state.currentDate);
    nextDay1.setDate(nextDay1.getDate() + 1);
    const nextDay2 = new Date(this.state.currentDate);
    nextDay2.setDate(nextDay2.getDate() + 2);

    this.setState({ nextDay1: nextDay1 });
    this.setState({ nextDay2: nextDay2 });

  }

  getCityName(language) {
    if (language === 'en-US') {
      return 'New York';
    } else if (language === 'ko-KR') {
      return 'Seoul';
    } else if (language === 'vi-VN') {
      return 'Hanoi';
    } else {
      return 'Hanoi';
    }
  }
  componentWillMount = async () => {
    const timezone = localstoreUtilites.getAccountTzFromLocalStorage();
    const utcDate = new Date();
    const zonedDate = utcToZonedTime(utcDate, timezone);
    this.setState({ currentDate: zonedDate })

    // timer
    this.timer(timezone);
  }
  timer = (timezone) => {
    this.f = setInterval(() => {
      const utcDate = new Date();
      const zonedDate = utcToZonedTime(utcDate, timezone);
      this.setState({ currentDate: zonedDate })
    }, 1000);
  }
  getWeather = () => {

    let lon = 0;
    let lat = 0;
    console.log(navigator.geolocation);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
          console.log(position.coords.longitude);
          lon = position.coords.longitude;
          lat = position.coords.latitude;

          fetch(`${apiBase}weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
          .then((res) => res.json())
          .then((result) => {
            this.setState({weather: result});
          });
      }
    );
    }
  };

  getCurrentCulture = () => {
    const language =
      localstoreUtilites.getLanguageFromLocalStorage() || 'en-US';
    let culture = LIST_CULTURE[0];

    for (let i = 0; i < LIST_CULTURE.length; i++) {
      if (LIST_CULTURE[i].language === language) {
        culture = LIST_CULTURE[i];
        break;
      }
    }

    return culture;
  };
  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  formatTimeTo12Hour(date) {
    const formattedTime = format(new Date(date), 'hh:mm a');
    return formattedTime;
}

  render() {
    const { classes, data } = this.props;
    const { currentDate, nextDay1, nextDay2, weather } = this.state;

    const currentDateFormatted = format(currentDate, dateFormat);
    const nextDay1Formatted = format(nextDay1, dateFormat);
    const nextDay2Formatted = format(nextDay2, dateFormat);

    const culture = this.getCurrentCulture();

    return (
        <Grid container className={classes.container}>
            <Paper className={`${classes.currentDate} ${classes.roundedCorner}`}>
                <Grid className={classes.titleDate} style={{fontSize:'xxx-large'}}>
                  {currentDateFormatted}
                </Grid>
                <Grid style={{ overflowY: 'auto', maxHeight: '89%' }}>
                  {data.schedules && data.schedules.filter(schedule => {
                        const startDate = new Date(schedule.startDate);
                        const endDate = new Date(schedule.endDate);
                        return startDate.getDate() <= currentDate.getDate() &&
                              startDate.getMonth() <= currentDate.getMonth() &&
                              startDate.getFullYear() <= currentDate.getFullYear() &&
                              endDate.getDate() >= currentDate.getDate() &&
                              endDate.getMonth() >= currentDate.getMonth() &&
                              endDate.getFullYear() >= currentDate.getFullYear();
                    }).map(schedule => (
                    <Typography key={schedule.id} className={classes.contentItem}>
                      {`${this.formatTimeTo12Hour(schedule.startDate)} ~ ${this.formatTimeTo12Hour(schedule.endDate)} ${schedule.title}`}
                    </Typography>
                  ))}
                  {data.meetings && data.meetings.filter(meeting => {
                        const startDate = new Date(meeting.startDate);
                        const endDate = new Date(schedule.endDate);
                        return startDate.getDate() <= currentDate.getDate() &&
                              startDate.getMonth() <= currentDate.getMonth() &&
                              startDate.getFullYear() <= currentDate.getFullYear() &&
                              endDate.getDate() >= currentDate.getDate() &&
                              endDate.getMonth() >= currentDate.getMonth() &&
                              endDate.getFullYear() >= currentDate.getFullYear();
                    }).map(meeting => (
                    <Typography key={meeting.id} className={classes.contentItem}>
                      {`${this.formatTimeTo12Hour(meeting.startDate)} ~ ${this.formatTimeTo12Hour(meeting.endDate)} ${meeting.title}`}
                    </Typography>
                  ))}
                </Grid>
            </Paper>
            <Paper className={`${classes.nextDate1} ${classes.roundedCorner}`}>
                <Grid className={classes.titleDate}>
                  {nextDay1Formatted}
                </Grid>
                <Grid style={{ overflowY: 'auto', maxHeight: '83%' }}>
                  {data.schedules && data.schedules.filter(schedule => {
                        const startDate = new Date(schedule.startDate);
                        const endDate = new Date(schedule.endDate);
                        return startDate.getDate() <= nextDay1.getDate() &&
                              startDate.getMonth() <= nextDay1.getMonth() &&
                              startDate.getFullYear() <= nextDay1.getFullYear() &&
                              endDate.getDate() >= nextDay1.getDate() &&
                              endDate.getMonth() >= nextDay1.getMonth() &&
                              endDate.getFullYear() >= nextDay1.getFullYear();
                    }).map(schedule => (
                    <Typography key={schedule.id} className={classes.contentItem}>
                      {`${this.formatTimeTo12Hour(schedule.startDate)} ~ ${this.formatTimeTo12Hour(schedule.endDate)} ${schedule.title}`}
                    </Typography>
                  ))}
                  {data.meetings && data.meetings.filter(meeting => {
                        const startDate = new Date(meeting.startDate);
                        const endDate = new Date(schedule.endDate);
                        return startDate.getDate() <= nextDay1.getDate() &&
                              startDate.getMonth() <= nextDay1.getMonth() &&
                              startDate.getFullYear() <= nextDay1.getFullYear() &&
                              endDate.getDate() >= nextDay1.getDate() &&
                              endDate.getMonth() >= nextDay1.getMonth() &&
                              endDate.getFullYear() >= nextDay1.getFullYear();
                    }).map(meeting => (
                    <Typography key={meeting.id} className={classes.contentItem}>
                      {`${this.formatTimeTo12Hour(meeting.startDate)} ~ ${this.formatTimeTo12Hour(meeting.endDate)} ${meeting.title}`}
                    </Typography>
                  ))}
                </Grid>
            </Paper>
            <Paper className={`${classes.nextDate2} ${classes.roundedCorner}`}>
                <Grid className={classes.titleDate}>
                  {nextDay2Formatted}
                </Grid>
                <Grid style={{ overflowY: 'auto', maxHeight: '83%' }}>
                  {data.schedules && data.schedules.filter(schedule => {
                        const startDate = new Date(schedule.startDate);
                        const endDate = new Date(schedule.endDate);
                        return startDate.getDate() <= nextDay2.getDate() &&
                              startDate.getMonth() <= nextDay2.getMonth() &&
                              startDate.getFullYear() <= nextDay2.getFullYear() &&
                              endDate.getDate() >= nextDay2.getDate() &&
                              endDate.getMonth() >= nextDay2.getMonth() &&
                              endDate.getFullYear() >= nextDay2.getFullYear();
                    }).map(schedule => (
                    <Typography key={schedule.id} className={classes.contentItem}>
                      {`${this.formatTimeTo12Hour(schedule.startDate)} ~ ${this.formatTimeTo12Hour(schedule.endDate)} ${schedule.title}`}
                    </Typography>
                  ))}
                  {data.meetings && data.meetings.filter(meeting => {
                        const startDate = new Date(meeting.startDate);
                        const endDate = new Date(schedule.endDate);
                        return startDate.getDate() <= nextDay2.getDate() &&
                              startDate.getMonth() <= nextDay2.getMonth() &&
                              startDate.getFullYear() <= nextDay2.getFullYear() &&
                              endDate.getDate() >= nextDay2.getDate() &&
                              endDate.getMonth() >= nextDay2.getMonth() &&
                              endDate.getFullYear() >= nextDay2.getFullYear();
                    }).map(meeting => (
                    <Typography key={meeting.id} className={classes.contentItem}>
                      {`${this.formatTimeTo12Hour(meeting.startDate)} ~ ${this.formatTimeTo12Hour(meeting.endDate)} ${meeting.title}`}
                    </Typography>
                  ))}
                </Grid>
            </Paper>
            <Paper className={`${classes.lock} ${classes.roundedCorner}`}>
                {currentDate && (
                  <div
                    style={{ textAlign: 'center', fontSize: 40}}
                  >
                    <span>{format(currentDate, culture.dateTimeFormat)}</span>
                  </div>
                )}
            </Paper>
            <Paper className={`${classes.weather} ${classes.roundedCorner}`}>
              {typeof weather.main !== 'undefined' ? (
                <Grid container spacing={2}>
                  <Grid item xs={6} className={classes.iconWeather}>
                    <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}/>
                  </Grid>
                  <Grid item xs={6} className={classes.weather}>
                    <Grid container direction="column" spacing={1}>
                      <Grid item>
                        <Typography variant="h5" style={{marginBottom: 5}}>{(weather.main.temp - 273.15).toFixed(2)}°C</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h8" style={{marginBottom: 5}}>{weather.weather[0].main}</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h8">{this.capitalizeFirstLetter(weather.weather[0].description.toLowerCase())}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              ) : 
              <Grid style={{textAlign: 'center', padding: '0 20px'}}>
                <FormattedMessage {...messages.msgNotiAllowLocation} />
              </Grid>}
            </Paper>
            <Calendar value={currentDate} className={`${classes.calendar} ${classes.roundedCorner}`}/>
        </Grid>
    );
  }
}

DashboardPage.propTypes = {
  classes: PropTypes.object,
  onGetData: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onGetData: () => dispatch(getData()),
  };
}

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  data: getDashboardDataSelector(),
});

const withReducer = injectReducer({ key: 'dashboard', reducer });
const withSaga = injectSaga({
  key: 'dashboard',
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
)(withStyles(styles)(DashboardPage));
