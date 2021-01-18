import React from 'react';
import PropTypes from 'prop-types';
import { toLower } from 'lodash/string';

import DayPickerInput from 'react-day-picker/DayPickerInput';
import { DB_DATE_FORMAT } from 'themes/config';

import InputComponent from './InputComponent';

// Import DayPicker styles
import GlobalStyle from './styles';

class DatePicker extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const localeFormat = 'MM/DD/YYYY';
    // TODO localise
    // moment.localeData(this.context.intl.locale).longDateFormat('L');

    const formattedDay = this.props.value;
    // && moment(this.props.value, DB_DATE_FORMAT, true).isValid()
    //   ? moment(this.props.value).format(localeFormat)
    //   : this.props.value;

    return (
      <React.Fragment>
        <DayPickerInput
          value={formattedDay}
          onChange={(evt) => this.props.onChange(evt.target.value)}
          onDayChange={(value) => value && value.format && this.props.onChange(value.format(DB_DATE_FORMAT))}
          format={localeFormat}
          component={InputComponent}
          placeholder={toLower(localeFormat)}
          dayPickerProps={{
            locale: this.context.intl.locale,
            firstDayOfWeek: 1, // moment.localeData(this.context.intl.locale).firstDayOfWeek(),
            fixedWeeks: true,
            // todayButton: 'Go to Today',
          }}
        />
        // Import DayPicker styles
        <GlobalStyle/>
      </React.Fragment>
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
