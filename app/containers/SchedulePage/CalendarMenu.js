import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Button, Typography } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import { Editor } from '@tinymce/tinymce-react';

import InputUI from 'components/InputUI';
import ModalMaterialUi from 'components/Modal';
import SelectUI from 'components/SelectUI';
import DateTimePickerUI from 'components/DateTimePickerUI';
import messages from './messages';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "./bigCalendar.css";
const moment = require('moment-timezone');
const dateFormat = 'YYYY-MM-DD';

const Dot = ({ eventTypes}) => (
  <span
    style={{
      position: 'relative',
      display: 'block',
      height: '20px',
      width: '20px',
    }}
  >
    <React.Fragment>
      {eventTypes.map((eventType, index) => (
         <span
          key={index}
          style={{
            position: 'absolute',
            display: 'block',
            height: '6px',
            width: '6px',
            borderRadius: '50%',
            backgroundColor: eventType === 0 ? 'rgb(53, 124, 210)' : 'rgb(234, 122, 87)', 
            top: 'calc(50% - 8px)',
            left: eventTypes.length === 1 ? 'calc(50% - 3px)' : `calc(50% - 8px + ${index * 10}px)`,
            transform: 'translateY(50%)',
          }}
        ></span>
      ))}
    </React.Fragment>
  </span>
);

class CalendarMenu extends Component {
  state = {
    showDialog: false,
  };
  onchange = (date) => {
    this.props.onChangeDate(date);
  }
  getEventType = (date) => {
    const { events } = this.props;

    const dateString = moment(date).format(dateFormat);

    const filteredEvents = events.filter(event => {
      const eventStartDateString = moment(event.start).format(dateFormat)
      const eventEndDateString = moment(event.end).format(dateFormat);
  
      return dateString >= eventStartDateString && dateString <= eventEndDateString;
    });
  
    const eventTypes = filteredEvents.map(event => event.type);

    return [...new Set(eventTypes)];
  };

  render() {
    const { classes, today } = this.props;
    
    return (
      <Calendar
        key={today.getTime()}
        value={today}
        className={`${classes.calendar} ${classes.roundedCorner}`}
        onChange={this.onchange}
        onClickMonth={this.onchange}
        tileContent={({ date, view }) => <Dot eventTypes={this.getEventType(date)}/>}
      />
    );
  }
}

CalendarMenu.propTypes = {
  // PropTypes
  classes: PropTypes.object,
  onChangeDate: PropTypes.func,
  events: PropTypes.array,
  today: PropTypes.any
};

export default CalendarMenu;
