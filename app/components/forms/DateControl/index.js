import React from 'react';
import PropTypes from 'prop-types';

import { Control } from 'react-redux-form/immutable';

import DatePicker from './DatePicker';

export class DateControl extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { model, ...props } = this.props;
    return (
      <Control
        type="date"
        component={DatePicker}
        model={model}
        mapProps={{
          onChange: (cprops) => cprops.onChange,
          error: ({ fieldValue }) => !fieldValue.valid,
        }}
        {...props}
      />
    );
  }
}

DateControl.propTypes = {
  model: PropTypes.string.isRequired,
};

export default DateControl;
