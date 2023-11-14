import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import Icon from 'components/Icon';

import appMessages from 'containers/App/messages';

const Styled = styled.div`
  padding-right: ${(props) => props.theme.sizes && props.theme.sizes.mainListItem.paddingHorizontal}px;
  padding-left: ${(props) => props.theme.sizes && props.theme.sizes.mainListItem.paddingHorizontal}px;
  padding-top: ${(props) => props.theme.sizes && props.theme.sizes.mainListItem.paddingTop}px;
  padding-bottom: ${(props) => {
    if (props.theme.sizes) {
      return props.scheduled
        ? props.theme.sizes.mainListItem.paddingBottom
        : props.theme.sizes.mainListItem.paddingTop;
    }
    return 0;
  }}px;
  position: relative;
  color:  ${(props) => props.overdue ? palette('reports', 0) : palette('text', 1)};
  background-color: ${palette('mainListItem', 1)};
  margin-bottom: 3px;
`;
const Status = styled.div`
  font-size: ${(props) => props.theme.sizes && props.theme.sizes.text.listItemTop};
  color:  ${(props) => props.unscheduled ? palette('text', 1) : 'inherit'};
  @media print {
    font-size: ${(props) => props.theme.sizes.print.listItemTop};
  }
`;
const DueDate = styled.div`
  font-weight: 500;
`;
const IconWrap = styled.div`
  color: ${palette('text', 2)};
  background-color:  ${(props) => props.overdue ? palette('reports', 0) : palette('text', 1)};
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
    const { intl } = this.context;
    const date = dates.get('scheduled');
    const scheduled = !!date;
    const overdue = scheduled && date.getIn(['attributes', 'overdue']);
    const due = scheduled && date.getIn(['attributes', 'due']);

    return (
      <Styled overdue={overdue} scheduled={scheduled}>
        { scheduled
          && (
            <span>
              <IconWrap overdue={overdue}>
                <Icon name="reminder" />
              </IconWrap>
              <Status>
                { overdue
                && (
                  <span>
                    {intl && intl.formatMessage(appMessages.entities.due_dates.overdueNext)}
                  </span>
                )
                }
                { due
                && (
                  <span>
                    {intl && intl.formatMessage(appMessages.entities.due_dates.dueNext)}
                  </span>
                )
                }
                { !overdue && !due
                && (
                  <span>
                    {intl && intl.formatMessage(appMessages.entities.due_dates.scheduledNext)}
                  </span>
                )
                }
              </Status>
              <DueDate overdue={overdue}>
                { intl && intl.formatDate(new Date(date.getIn(['attributes', 'due_date'])))}
              </DueDate>
            </span>
          )
        }
        { !scheduled
          && (
            <span>
              <IconWrapUnscheduled overdue={overdue}>
                <Icon name="reminder" />
              </IconWrapUnscheduled>
              <Status unscheduled>
                {intl && intl.formatMessage(appMessages.entities.due_dates.empty)}
              </Status>
            </span>
          )
        }
      </Styled>
    );
  }
}

EntityListNestedReportDateItem.contextTypes = {
  intl: PropTypes.object,
};

export default EntityListNestedReportDateItem;
