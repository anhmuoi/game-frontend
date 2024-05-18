/* eslint-disable indent */
import React from 'react';
import PropTypes from 'prop-types';
import DateTimeRangeContainer from 'react-advanced-datetimerange-picker';
import moment from 'moment';
import InputUI from 'components/InputUI';
import Helmet from 'react-helmet';

export default class DateTimeRangePicker extends React.Component {
  applyCallback = (startDate, endDate) => {
    // console.log(startDate.toDate(), endDate.toDate());
    this.props.onChange(startDate.toDate(), endDate.toDate());
  };

  render() {
    const {
      label,
      format,
      startDate,
      endDate,
      InputProps,
      children,
      disUseTimeStamp,
    } = this.props;

    const locales = disUseTimeStamp
      ? {
          'en-US': 'MM.DD.YYYY',
          'ko-KR': 'YYYY.MM.DD',
          'ja-JP': 'YYYY.MM.DD',
          'vi-VN': 'DD/MM/YYYY',
        }
      : {
          'en-US': 'MM.DD.YYYY HH:mm',
          'ko-KR': 'YYYY.MM.DD HH:mm',
          'ja-JP': 'YYYY.MM.DD HH:mm',
          'vi-VN': 'DD/MM/YYYY HH:mm',
        };

    const rangesKey = {
      last1Hours: {
        'en-US': 'Last 1 hour',
        'ko-KR': '지난 1 시간',
        'ja-JP': '過去 1 時間',
        'vi-VN': '1 tiếng đồng hồ vừa qua',
      },
      last12Hours: {
        'en-US': 'Last 12 hours',
        'ko-KR': '지난 12 시간',
        'ja-JP': '過去 12 時間',
        'vi-VN': '12 tiếng đồng hồ vừa qua',
      },
      today: {
        'en-US': 'Today',
        'ko-KR': '오늘',
        'ja-JP': '今日',
        'vi-VN': 'Hôm nay',
      },
      yesterday: {
        'en-US': 'Yesterday',
        'ko-KR': '어제',
        'ja-JP': '昨日',
        'vi-VN': 'Hôm qua',
      },
      last7days: {
        'en-US': 'Last 7 days',
        'ko-KR': '지난 7일',
        'ja-JP': '7 日間続く',
        'vi-VN': '7 ngày vừa qua',
      },
      last30days: {
        'en-US': 'Last 30 days',
        'ko-KR': '지난 30일',
        'ja-JP': '30 日間続く',
        'vi-VN': 'kéo dài 30 ngày',
      },
    };

    const ranges = {
      [rangesKey.last1Hours[format]]: [
        moment(new Date()).subtract(1, 'hour'),
        moment(new Date()),
      ],
      [rangesKey.last12Hours[format]]: [
        moment(new Date()).subtract(12, 'hours'),
        moment(new Date()),
      ],
      [rangesKey.today[format]]: [
        moment(new Date()).startOf('day'),
        moment(new Date()).endOf('day'),
      ],
      [rangesKey.yesterday[format]]: [
        moment(new Date()).subtract(1, 'days').startOf('day'),
        moment(new Date()).subtract(1, 'days').endOf('day'),
      ],
      [rangesKey.last7days[format]]: [
        moment(new Date()).subtract(7, 'days'),
        moment(new Date()),
      ],
      [rangesKey.last30days[format]]: [
        moment(new Date()).subtract(30, 'days'),
        moment(new Date()),
      ],
    };

    if (disUseTimeStamp) {
      delete ranges[rangesKey.last1Hours[format]];
      delete ranges[rangesKey.last12Hours[format]];
      delete rangesKey.last1Hours;
      delete rangesKey.last12Hours;
    }

    const localVal =
      format === 'ko-KR'
        ? {
            days: ['월', '화', '수', '목', '금', '토', '일'],
            months: [
              '1월',
              '2월',
              '3월',
              '4월',
              '5월',
              '6월',
              '7월',
              '8월',
              '9월',
              '10월',
              '11월',
              '12월',
            ],
            apply: '적용하기',
            cancel: '취소',
            fromDate: '시작 날짜',
            toDate: '마지막 날짜',
            custom: '사용자 설정',
          }
        : {};
    const local = {
      format: locales[format],
      sundayFirst: false,
      ...localVal,
    };
    const input = (
      <InputUI
        id="DateTimeRange"
        name="DateTimeRange"
        label={label}
        styleLabel={{ width: '125%' }}
        value={`${moment(startDate).format(local.format)} -- ${moment(
          endDate,
        ).format(local.format)}`}
        InputProps={InputProps}
      />
    );

    const customRangeEl = Array.from(document.querySelectorAll('div')).find(
      (el) => el.textContent === 'Custom Range',
    );
    if (customRangeEl && format === 'ko-KR') {
      const string = customRangeEl.innerHTML;
      const replacedString = string.replace('Custom Range', '사용자 설정');
      customRangeEl.innerHTML = replacedString;
    }

    const daterangepicker = this.props.styleDateRangePicker || '';
    const customStyles = {
      fromDot: { backgroundColor: '#3A4856' },
      toDot: { backgroundColor: '#3A4856' },
      fromDate: {
        backgroundColor: '#3A4856',
      },
      toDate: { backgroundColor: '#3A4856' },
      betweenDates: {
        color: 'white',
        backgroundColor: '#3A4856',
      },
      customRangeButtons: {
        color: '#3A4856',
        outline: '#3A4856 !important',
      },
      customRangeSelected: {
        backgroundColor: '#3A4856',
        outline: '#bec2c6',
      },
      standaloneLayout: { display: 'flex', maxWidth: 'fit-content' },
      applyButton: {
        backgroundColor: 'black', // Green color as an example
        color: 'white',
      },
    };
    return (
      <React.Fragment>
        <DateTimeRangeContainer
          ranges={ranges}
          start={moment(startDate)}
          end={moment(endDate)}
          local={local}
          applyCallback={this.applyCallback}
          {...this.props}
          style={customStyles}
        >
          {typeof children === 'function' && children(input)}
          {!children && input}
        </DateTimeRangeContainer>
        <Helmet>
          <style>{`
                ${daterangepicker}
                .dateTimeLabel {
                  display: none;
                }
                .fromDateHourContainer {
                  text-align: center;
                }
                .inputDate {
                  width: 90%;
                  text-align: center;
                  border: 1px solid #333;
                  border-radius: 5px;
                }
              `}</style>
        </Helmet>
      </React.Fragment>
    );
  }
}

DateTimeRangePicker.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  format: PropTypes.string,
  onChange: PropTypes.func,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  InputProps: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.any,
  disUseTimeStamp: PropTypes.bool,
  styleDateRangePicker: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
};
