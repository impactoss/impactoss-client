import React from 'react';
import PropTypes from 'prop-types';

import appMessages from 'containers/App/messages';

import FieldWrap from 'components/fields/FieldWrap';
import FieldIcon from 'components/fields/FieldIcon';
import Label from 'components/fields/Label';
import EmptyHint from 'components/fields/EmptyHint';
import DateValue from 'components/fields/DateValue';
import Icon from 'components/Icon';

class DateField extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { field } = this.props;
    return (
      <FieldWrap>
        <FieldIcon>
          <Icon name="calendar" />
        </FieldIcon>
        <Label>
          {field.label || this.context.intl.formatMessage(appMessages.attributes.date)}
        </Label>
        { field.value &&
          <DateValue>
            {field.value}
          </DateValue>
        }
        { !field.value &&
          <EmptyHint>{field.showEmpty}</EmptyHint>
        }
      </FieldWrap>
    );
  }
}

DateField.propTypes = {
  field: PropTypes.object.isRequired,
};
DateField.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default DateField;
