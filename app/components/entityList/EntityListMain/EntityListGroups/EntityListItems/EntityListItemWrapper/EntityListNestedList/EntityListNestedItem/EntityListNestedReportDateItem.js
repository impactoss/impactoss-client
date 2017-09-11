import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import Icon from 'components/Icon';

import appMessages from 'containers/App/messages';

const Styled = styled.div`
  position: relative;
  padding: 10px 15px;
  background-color: ${palette('primary', 4)};
  color:  ${(props) => props.overdue ? palette('reports', 0) : palette('light', 4)};
  margin-bottom: 1px;
`;
const Status = styled.div`
  font-size: 1em;
  color:  ${(props) => props.unscheduled ? palette('light', 3) : 'inherit'};
`;
const DueDate = styled.div`
`;
const IconWrap = styled.div`
  color: ${palette('primary', 4)};
  background-color:  ${(props) => props.overdue ? palette('reports', 0) : palette('light', 4)};
  position: absolute;
  top: 0;
  right: 0;
  display: block;
  width: 32px;
  height: 32px;
  padding: 4px;
`;
const IconWrapUnscheduled = styled(IconWrap)`
  color: ${palette('light', 3)};
  background-color: transparent;
`;


class EntityListNestedReportDateItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    dates: PropTypes.instanceOf(Map),
  }

  render() {
    const { dates } = this.props;
    const date = dates.get('scheduled');
    const scheduled = !!date;
    const overdue = scheduled && date.getIn(['attributes', 'overdue']);
    const due = scheduled && date.getIn(['attributes', 'due']);

    return (
      <Styled overdue={overdue}>
        { scheduled &&
          <span>
            <IconWrap overdue={overdue}>
              <Icon name="reminder" />
            </IconWrap>
            <Status>
              { overdue &&
                <span>
                  {this.context.intl && this.context.intl.formatMessage(appMessages.entities.due_dates.overdueNext)}
                </span>
              }
              { due &&
                <span>
                  {this.context.intl && this.context.intl.formatMessage(appMessages.entities.due_dates.dueNext)}
                </span>
              }
              { !overdue && !due &&
                <span>
                  {this.context.intl && this.context.intl.formatMessage(appMessages.entities.due_dates.scheduledNext)}
                </span>
              }
            </Status>
            <DueDate overdue={overdue}>
              { this.context.intl && this.context.intl.formatDate(new Date(date.getIn(['attributes', 'due_date'])))}
            </DueDate>
          </span>
        }
        { !scheduled &&
          <span>
            <IconWrapUnscheduled overdue={overdue}>
              <Icon name="reminder" />
            </IconWrapUnscheduled>
            <Status unscheduled>
              {this.context.intl && this.context.intl.formatMessage(appMessages.entities.due_dates.empty)}
            </Status>
          </span>
        }
      </Styled>
    );
  }
}

EntityListNestedReportDateItem.contextTypes = {
  intl: PropTypes.object,
};

export default EntityListNestedReportDateItem;
