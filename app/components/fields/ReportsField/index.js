import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import appMessages from 'containers/App/messages';

import ButtonFactory from 'components/buttons/ButtonFactory';

import EntityListItemMainTop from 'components/EntityListItem/EntityListItemMain/EntityListItemMainTop';
import EntityListItemMainTitle from 'components/EntityListItem/EntityListItemMain/EntityListItemMainTitle';
import FieldWrap from 'components/fields/FieldWrap';
import ConnectionLabel from 'components/fields/ConnectionLabel';
import ConnectionLabelWrap from 'components/fields/ConnectionLabelWrap';
import ButtonWrap from 'components/fields/ButtonWrap';
import ReportListItem from 'components/fields/ReportListItem';
import ReportListTitleLink from 'components/fields/ReportListTitleLink';
import ToggleAllItems from 'components/fields/ToggleAllItems';
import EmptyHint from 'components/fields/EmptyHint';
import Clear from 'components/styled/Clear';

const REPORTSMAX = 5;
const StyledFieldWrap = styled(FieldWrap)`
  padding-top: 15px;
`;

class ReportsField extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.state = {
      showAllReports: false,
    };
  }
  getReportReference = (report) => {
    if (report.dueDate) {
      return this.context.intl.formatDate(report.dueDate);
    }
    const unscheduledShort = this.context.intl.formatMessage(appMessages.entities.progress_reports.unscheduled_short);
    return report.createdAt
      ? `${unscheduledShort} (${this.context.intl.formatDate(new Date(report.createdAt))})`
      : unscheduledShort;
  }

  render() {
    const { field } = this.props;

    return (
      <StyledFieldWrap>
        <ConnectionLabelWrap hasButton={field.button}>
          <ConnectionLabel>
            <FormattedMessage {...appMessages.entities.progress_reports.plural} />
          </ConnectionLabel>
          { field.button &&
            <ButtonWrap>
              <ButtonFactory button={field.button} />
            </ButtonWrap>
          }
        </ConnectionLabelWrap>
        { (field.values && field.values.length > 0) &&
          <div>
            { field.values.map((report, i) => (this.state.showAllReports || i < REPORTSMAX) && (
              <ReportListItem key={i}>
                <EntityListItemMainTop
                  entity={{
                    reference: this.getReportReference(report),
                    entityIcon: 'report',
                    draft: report.draft,
                  }}
                />
                <Clear />
                <ReportListTitleLink to={report.linkTo}>
                  <EntityListItemMainTitle>
                    {report.label}
                  </EntityListItemMainTitle>
                </ReportListTitleLink>
              </ReportListItem>
            ))}
            { field.values && field.values.length > REPORTSMAX &&
              <ToggleAllItems
                onClick={() =>
                  this.setState({ showAllReports: !this.state.showAllReports })
                }
              >
                { this.state.showAllReports &&
                  <FormattedMessage {...appMessages.entities.progress_reports.showLess} />
                }
                { !this.state.showAllReports &&
                  <FormattedMessage {...appMessages.entities.progress_reports.showAll} />
                }
              </ToggleAllItems>
            }
          </div>
        }
        { (!field.values || field.values.length === 0) &&
          <EmptyHint>
            <FormattedMessage {...appMessages.entities.progress_reports.empty} />
          </EmptyHint>
        }
      </StyledFieldWrap>
    );
  }
}

ReportsField.propTypes = {
  field: PropTypes.object.isRequired,
};

ReportsField.contextTypes = {
  intl: PropTypes.object,
};

export default ReportsField;
