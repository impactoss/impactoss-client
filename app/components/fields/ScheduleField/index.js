import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedDate } from 'react-intl';

import appMessages from 'containers/App/messages';

import FieldWrap from 'components/fields/FieldWrap';
import Label from 'components/fields/Label';
import ScheduleItem from 'components/fields/ScheduleItem';
import ScheduleItemStatus from 'components/fields/ScheduleItemStatus';
import ToggleAllItems from 'components/fields/ToggleAllItems';
import EmptyHint from 'components/fields/EmptyHint';

const DATEMAX = 3;

class ScheduleField extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.state = {
      showAllDates: false,
    };
  }
  render() {
    const { field } = this.props;
    return (
      <FieldWrap>
        <Label>
          <FormattedMessage {...appMessages.entities.due_dates.plural} />
        </Label>
        {
          field.values.map((value, i) => (this.state.showAllDates || i < DATEMAX) && (
            <ScheduleItem key={i} overdue={value.overdue}>
              <FormattedDate value={new Date(value.date)} />
              {
                value.overdue &&
                <ScheduleItemStatus>
                  <FormattedMessage {...appMessages.entities.due_dates.overdue} />
                </ScheduleItemStatus>
              }
              {
                value.due &&
                <ScheduleItemStatus>
                  <FormattedMessage {...appMessages.entities.due_dates.due} />
                </ScheduleItemStatus>
              }
            </ScheduleItem>
          ))
        }
        { field.values && field.values.length > DATEMAX &&
          <ToggleAllItems
            onClick={() =>
              this.setState({ showAllDates: !this.state.showAllDates })
            }
          >
            { this.state.showAllDates &&
              <FormattedMessage {...appMessages.entities.due_dates.showLess} />
            }
            { !this.state.showAllDates &&
              <FormattedMessage {...appMessages.entities.due_dates.showAll} />
            }
          </ToggleAllItems>
        }
        { (!field.values || field.values.length === 0) &&
          <EmptyHint>
            <FormattedMessage {...appMessages.entities.due_dates.empty} />
          </EmptyHint>
        }
      </FieldWrap>
    );
  }
}

ScheduleField.propTypes = {
  field: PropTypes.object.isRequired,
};

export default ScheduleField;
