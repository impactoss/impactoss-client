import React from 'react';
import PropTypes from 'prop-types';
import { toLower } from 'lodash/string';
import { format, parse } from 'date-fns';

import validateDateFormat from 'components/forms/validators/validate-date-format';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { DATE_FORMAT, DB_DATE_FORMAT } from 'themes/config';

import InputComponent from './InputComponent';

// Import DayPicker styles
import DatePickerStyle from './styles';

class DatePicker extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { intl } = this.context;

    // format from db format to input format if valid
    const formattedDay = this.props.value
      && validateDateFormat(this.props.value, DB_DATE_FORMAT)
      ? format(
        parse(this.props.value, DB_DATE_FORMAT, new Date()),
        DATE_FORMAT,
      )
      : this.props.value;

    return (
      <React.Fragment>
        <DayPickerInput
          parseDate={(value) => {
            if (
              value.trim() !== ''
              && validateDateFormat(value, DATE_FORMAT)
            ) {
              return parse(value, DATE_FORMAT, new Date());
            }
            return null;
          }}
          value={formattedDay}
          onDayChange={(valueDate) => {
            // format to DB format
            if (valueDate) {
              const formattedDB = valueDate && format(valueDate, DB_DATE_FORMAT);
              return formattedDB && this.props.onChange(formattedDB);
            }
            return null;
          }}
          inputProps={{
            onChange: ({ target }) => {
              const { value } = target;
              // format string to db format if in valid input format
              if (
                value.trim() !== ''
                && validateDateFormat(value, DATE_FORMAT)
              ) {
                // parse from input format to db format
                const formattedDB = format(
                  parse(value, DATE_FORMAT, new Date()),
                  DB_DATE_FORMAT,
                );
                this.props.onChange(formattedDB);
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
