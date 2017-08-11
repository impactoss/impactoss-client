import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

// import styled from 'styled-components';
// import { palette } from 'styled-theme';
import { DB_DATE_FORMAT } from 'containers/App/constants';
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
        validators={{
          date: (val) => val === '' || moment(val, DB_DATE_FORMAT, true).isValid(),
        }}
        validateOn="change"
        {...props}
      />
    );
  }
}

DateControl.propTypes = {
  model: PropTypes.string.isRequired,
};
// DateControl.contextTypes = {
//   intl: PropTypes.object.isRequired,
// };

export default DateControl;
