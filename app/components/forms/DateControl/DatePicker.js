import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment/min/moment-with-locales';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

import { DB_DATE_FORMAT } from 'containers/App/constants';

import InputComponent from './InputComponent';

class DatePicker extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    // console.log('DatePicker', this.props)
    const format = moment.localeData(this.context.intl.locale).longDateFormat('L');

    const formattedDay = this.props.value && moment(this.props.value, DB_DATE_FORMAT, true).isValid()
      ? moment(this.props.value).format(format)
      : this.props.value;
    // console.log('formattedDay', formattedDay)
    // onBlur={(evt) => {
    //   console.log('onBlur', evt.target.value)
    //   // (!evt.target.value || evt.target.value.format) &&
    //   this.props.onBlur(evt.target.value)
    // }}

    return (
      <DayPickerInput
        value={formattedDay}
        onDayChange={(value) => value && value.format && this.props.onChange(value.format(DB_DATE_FORMAT))}
        onChange={(evt) => this.props.onChange(evt.target.value)}
        format={format}
        component={InputComponent}
        placeholder={format}
        dayPickerProps={{
          locale: this.context.intl.locale,
          firstDayOfWeek: moment.localeData(this.context.intl.locale).firstDayOfWeek(),
        }}
      />
    );
  }
}

DatePicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

DatePicker.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default DatePicker;
