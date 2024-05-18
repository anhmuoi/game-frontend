import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ApiClient from 'utils/axiosClient';
import axios from 'axios';
const styles = () => ({
  timezoneDetailContainer: {
    position: 'relative',
  },
  timezoneItem: {
    display: 'grid',
    gridTemplateColumns: '120px 1fr',
    borderBottom: '1px solid grey',
  },
  timezoneDetailContent: {
    position: 'absolute',
    left: '0',
    top: '0',
    transform: 'translate(-101%, -30px)',
    minWidth: '370px',
    backgroundColor: 'white',
    border: '1px solid grey',
    borderRadius: '7px',
    overflow: 'hidden',
    zIndex: '10',
  },
  range: {
    color: 'white',
    padding: '5px 10px',
    backgroundColor: '#0072ff',
    borderRadius: '7px',
    marginBottom: '3px',
    marginRight: '3px',
    display: 'inline-block',
  },
  itemTitle: {
    padding: '7px 14px',
    borderRight: '1px solid grey',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContent: {
    padding: '7px 14px',
  },
});

const timezoneHeaders = [
  {
    field: 'monday',
    header: 'Monday',
  },
  {
    field: 'tuesday',
    header: 'Tuesday',
  },
  {
    field: 'wednesday',
    header: 'Wednesday',
  },
  {
    field: 'thursday',
    header: 'Thursday',
  },
  {
    field: 'friday',
    header: 'Friday',
  },
  {
    field: 'saturday',
    header: 'Saturday',
  },
  {
    field: 'sunday',
    header: 'Sunday',
  },
  {
    field: 'holidayType1',
    header: 'Holiday 1',
  },
  {
    field: 'holidayType2',
    header: 'Holiday 2',
  },
  {
    field: 'holidayType3',
    header: 'Holiday 3',
  },
];

function pad(value) {
  if (value < 10) {
    return `0${value}`;
  }
  return value;
}

class TimezoneTooltip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      doorInfo: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
        holidayType1: [],
        holidayType2: [],
        holidayType3: [],
      },
    };
  }

  async componentDidMount() {
    try {
      this.axiosCancelSource = axios.CancelToken.source();
      const res = await ApiClient.get(
        `/access-times/${this.props.timezoneId}`,
        {
          cancelToken: this.axiosCancelSource.token,
        },
      );
      // eslint-disable-next-line
      this.setState({
        doorInfo: {
          ...res.data,
        },
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  componentWillUnmount() {
    this.axiosCancelSource.cancel('Axios request canceled.');
  }

  transformRangeTime = range =>
    `${pad(Math.floor(range.from / 60))}:${pad(range.from % 60)} - ${pad(
      Math.floor(range.to / 60),
    )}:${pad(range.to % 60)}`;

  render() {
    const { classes, timezoneId } = this.props;
    return (
      <div className={classes.timezoneDetailContainer}>
        <div className={classes.timezoneDetailContent}>
          {timezoneHeaders.map(header => (
            <div className={classes.timezoneItem} key={header.field}>
              <div className={classes.itemTitle}>{header.header}</div>
              <div className={classes.itemContent}>
                {this.state.doorInfo[header.field].map(item => (
                  <span
                    className={classes.range}
                    key={timezoneId + header.field + JSON.stringify(item)}
                  >
                    {this.transformRangeTime(item)}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
TimezoneTooltip.propTypes = {
  timezoneId: PropTypes.number,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TimezoneTooltip);
