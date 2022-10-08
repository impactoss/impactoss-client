import React from 'react';
import PropTypes from 'prop-types';
import { toLower } from 'lodash/string';
import { format, parseISO, parse } from 'date-fns';

import validateDateFormat from 'components/forms/validators/validate-date-format';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { DATE_FORMAT, API_DATE_FORMAT } from 'themes/config';

import InputComponent from './InputComponent';

// Import DayPicker styles
import DatePickerStyle from './styles';

const UI_DATE_FORMAT = 'yyyy-MM-d';

class DatePicker extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { intl } = this.context;
    // format from db format to input format if valid
    const formattedDay = this.props.value
      && validateDateFormat(this.props.value)
      ? format(
        parseISO(this.props.value),
        DATE_FORMAT,
      )
      : this.props.value;
    return (
      <React.Fragment>
        <DayPickerInput
          // Date parser used for parsing the string typed in the input field
          // returns Date from text
          parseDate={(value) => {
            if (value.trim() !== '') {
              if (validateDateFormat(value, DATE_FORMAT)) {
                return parse(value, DATE_FORMAT, new Date());
              }
              if (validateDateFormat(value, UI_DATE_FORMAT)) {
                return parse(value, UI_DATE_FORMAT, new Date());
              }
              return false;
            }
            return null;
          }}
          value={formattedDay}
          onDayChange={(valueDate) => {
            // fires on day picker use
            // returns API format from Date
            if (valueDate) {
              const formattedAPI = format(valueDate, API_DATE_FORMAT);
              if (formattedAPI) {
                this.props.onChange(formattedAPI);
              }
            }
          }}
          inputProps={{
            onChange: ({ target }) => {
              // fires on input field change
              const { value } = target;
              // format string to db format if we have a valid input format
              if (
                value.trim() !== ''
                && validateDateFormat(value, DATE_FORMAT)
              ) {
                // parse from input format to db format
                const formattedAPI = format(
                  parse(value, DATE_FORMAT, new Date()),
                  API_DATE_FORMAT,
                );
                this.props.onChange(formattedAPI);
              } else {
                this.props.onChange(value);
              }
            },
          }}
          component={InputComponent}
          placeholder={toLower(DATE_FORMAT)}
          dayPickerProps={{
            locale: intl.locale,
            firstDayOfWeek: 1, // moment.localeData(intl.locale).firstDayOfWeek(),
            fixedWeeks: true,
            // todayButton: 'Go to Today',
          }}
        />
        <DatePickerStyle />
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
