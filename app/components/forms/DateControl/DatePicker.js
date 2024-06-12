import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { toLower } from 'lodash/string';
// import { useIntl } from 'react-intl';

import {
  isValid, format, parse, startOfToday, getYear, getMonth,
} from 'date-fns';

import validateDateFormat from 'components/forms/validators/validate-date-format';
import { DayPicker } from 'react-day-picker';

import { DATE_FORMAT, DB_DATE_FORMAT } from 'themes/config';

import InputComponent from './InputComponent';
import DatePickerStyle from './styles';

const DatePicker = ({ value, onChange }) => {
  // const intl = useIntl();
  const inputRef = useRef(null);
  const [showDayPicker, setShowDayPicker] = useState(false);

  const handleDateChange = (valueDate) => {
    if (valueDate) {
      const formattedDB = format(valueDate, DB_DATE_FORMAT);
      if (formattedDB) {
        setShowDayPicker(false);
        return onChange(formattedDB);
      }
    }
    return null;
  };

  const handleInputChange = ({ target }) => {
    const inputValue = target.value;
    // if it's the right format, store as db format
    if (inputValue !== '' && validateDateFormat(inputValue, DATE_FORMAT)) {
      // parse from input format to db format
      const formattedDB = format(
        parse(inputValue, DATE_FORMAT, new Date()),
        DB_DATE_FORMAT,
      );
      onChange(formattedDB);
    } else {
      // wrong format but store value for input field
      onChange(inputValue);
    }
  };

  const formattedDay = value
    && validateDateFormat(value, DB_DATE_FORMAT)
    ? format(parse(value, DB_DATE_FORMAT, new Date()), DATE_FORMAT)
    : value;

  const selected = validateDateFormat(value, DB_DATE_FORMAT) ? parse(value, DB_DATE_FORMAT, new Date()) : null;

  const handleInputFocus = () => {
    setShowDayPicker(true);
  };

  const handleInputBlur = (event) => {
    // on click outside, close day picker
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setShowDayPicker(false);
    }
  };
  const getDefaultMonth = (selectedDate) => {
    const defaultDate = isValid(selectedDate) ? selectedDate : startOfToday();
    const year = getYear(defaultDate);
    const month = getMonth(defaultDate);
    return new Date(year, month);
  };

  return (
    <div onBlur={handleInputBlur} style={{ position: 'relative' }}>
      <InputComponent
        ref={inputRef}
        value={formattedDay}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder={toLower(DATE_FORMAT)}
      />
      {showDayPicker && (
        <DayPicker
          mode="single"
          defaultMonth={getDefaultMonth(selected)}
          selected={selected}
          onSelect={handleDateChange}
          placeholder={toLower(DATE_FORMAT)}
          // locale={'us-EN'}
          weekStartsOn={1}
          fixedWeeks
          showOutsideDays
        />
      )}
      <DatePickerStyle />
    </div>
  );
};

DatePicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default DatePicker;
