import React, { PropTypes } from 'react';
import { FormattedMessage, FormattedDate } from 'react-intl';

import styled from 'styled-components';
import { palette } from 'styled-theme';

import Icon from 'components/Icon';

import appMessages from 'containers/App/messages';

const Styled = styled.div`
  position: relative;
  font-weight: bold;
  padding: 5px 10px;
  background-color: ${palette('primary', 4)};
  color:  ${(props) => props.overdue ? palette('primary', 0) : palette('greyscaleLight', 4)};
`;
const Status = styled.div`
  font-size: 1.2em;
  color:  ${(props) => props.unscheduled ? palette('greyscaleLight', 3) : 'inherit'};
`;
const DueDate = styled.div`
`;
const IconWrap = styled.div`
  color: ${palette('primary', 4)};
  background-color:  ${(props) => props.overdue ? palette('primary', 0) : palette('greyscaleLight', 4)};
  position: absolute;
  top: 0;
  right: 0;
  display: block;
  width: 32px;
  height: 32px;
  padding: 4px;
`;
const IconWrapUnscheduled = styled(IconWrap)`
  color: ${palette('greyscaleLight', 3)};
  background-color: transparent;
`;


export default class EntityListNestedReportDateItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    dates: PropTypes.array,
  }

  render() {
    const { dates } = this.props;
    const scheduled = dates && dates.length > 0;
    const overdue = scheduled && dates[0].attributes.overdue;
    return (
      <Styled overdue={overdue}>
        { scheduled &&
          <span>
            <IconWrap overdue={overdue}>
              <Icon name="reminder" />
            </IconWrap>
            <Status>
              { dates[0].attributes.overdue &&
                <FormattedMessage {...appMessages.entities.due_dates.overdue} />
              }
              { dates[0].attributes.due &&
                <FormattedMessage {...appMessages.entities.due_dates.due} />
              }
              { !dates[0].attributes.due && !dates[0].attributes.overdue &&
                <FormattedMessage {...appMessages.entities.due_dates.scheduled} />
              }
            </Status>
            <DueDate overdue={dates[0].attributes.overdue}>
              <FormattedDate value={new Date(dates[0].attributes.due_date)} />
            </DueDate>
          </span>
        }
        { !scheduled &&
          <span>
            <IconWrapUnscheduled overdue={overdue}>
              <Icon name="reminder" />
            </IconWrapUnscheduled>
            <Status unscheduled>
              <FormattedMessage {...appMessages.entities.due_dates.empty} />
            </Status>
          </span>
        }
      </Styled>
    );
  }
}
