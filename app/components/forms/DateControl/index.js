import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { toLower } from 'lodash/string';

// eslint-disable-next-line import/no-unresolved
import { isValid, format, parse, startOfToday, getYear, getMonth } from 'date-fns';
import validateDateFormat from 'components/forms/validators/validate-date-format';
import { DayPicker } from 'react-day-picker';
import { useField, useFormikContext } from "formik";

import { DATE_FORMAT, API_DATE_FORMAT } from 'themes/config';

import InputComponent from './InputComponent';
import DatePickerStyle from './styles';

const DateControl = (props) => {
  const { value, onChange } = props;
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);

  const inputRef = useRef(null);
  const [showDayPicker, setShowDayPicker] = useState(false);

  const handleDateChange = (valueDate) => {
    if (valueDate) {
      const formattedDB = format(valueDate, API_DATE_FORMAT);
      if (formattedDB) {
        setShowDayPicker(false);
        setFieldValue(field.name, formattedDB);
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
        API_DATE_FORMAT,
      );
      setFieldValue(field.name, formattedDB);
      onChange(formattedDB);
    } else {
      // wrong format but store value for input field
      setFieldValue(field.name, inputValue);
      onChange(inputValue);
    }
  };

  const formattedDay = value
    && validateDateFormat(value, API_DATE_FORMAT)
    ? format(parse(value, API_DATE_FORMAT, new Date()), DATE_FORMAT)
    : value;

  const selected = value && validateDateFormat(value, API_DATE_FORMAT) ? parse(value, API_DATE_FORMAT, new Date()) : null;

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
        {...props}
        ref={inputRef}
        value={formattedDay}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder={toLower(DATE_FORMAT)}
      />
      {showDayPicker && (
        <DayPicker
          mode="single"
          name="date"
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

DateControl.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default DateControl;
