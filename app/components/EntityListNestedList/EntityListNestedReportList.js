import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Map, List } from 'immutable';

import A from 'components/styled/A';
import appMessages from 'containers/App/messages';

import EntityListNestedReportItem from './EntityListNestedItem/EntityListNestedReportItem';
import EntityListNestedReportDateItem from './EntityListNestedItem/EntityListNestedReportDateItem';
import EntityListNestedNoItem from './EntityListNestedItem/EntityListNestedNoItem';

const ChildItems = styled.span`
  display: inline-block;
  width: 50%;
  vertical-align: top;
`;

const ShowAll = styled(A)`
  font-size: 0.8em;
  display: block;
  text-align: center;
  font-weight: 500;
`;

const REPORT_MAX = 5;

class EntityListNestedReportList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor() {
    super();
    this.state = {
      showAll: false,
    };
  }

  onShowAllToggle = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    this.setState({ showAll: !this.state.showAll });
  };

  render() {
    const { reports, dates, onEntityClick, isContributor, nestLevel } = this.props;
    return (
      <ChildItems>
        { isContributor && dates &&
          <EntityListNestedReportDateItem
            dates={dates}
          />
        }
        { reports.size === 0 &&
          <EntityListNestedNoItem type="reports" nestLevel={nestLevel} />
        }
        {
          reports
          .sortBy(
            (report) => report.get('date') ? report.getIn(['date', 'attributes', 'due_date']) : report.getIn(['attributes', 'updated_at']),
            (a, b) => new Date(a) < new Date(b)
          )
          .map((report, i) => this.state.showAll || i < REPORT_MAX
            ? <EntityListNestedReportItem
              key={i}
              report={report}
              onEntityClick={() => onEntityClick(report.get('id'), 'reports')}
            />
            : null
          )
        }
        { reports.size > REPORT_MAX &&
          <ShowAll href="/" onClick={this.onShowAllToggle}>
            { this.context.intl &&
              this.context.intl.formatMessage(this.state.showAll
                ? appMessages.entities.progress_reports.showLess
                : appMessages.entities.progress_reports.showAll
              )
            }
          </ShowAll>
        }
      </ChildItems>
    );
  }
}

EntityListNestedReportList.propTypes = {
  reports: PropTypes.instanceOf(List),
  dates: PropTypes.instanceOf(Map),
  onEntityClick: PropTypes.func,
  isContributor: PropTypes.bool,
  nestLevel: PropTypes.number,
};

EntityListNestedReportList.contextTypes = {
  intl: PropTypes.object,
};

export default EntityListNestedReportList;
