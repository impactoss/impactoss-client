import React, { PropTypes } from 'react';
import styled from 'styled-components';

import EntityListNestedReportItem from 'components/EntityListItem/EntityListNestedItem/EntityListNestedReportItem';
import EntityListNestedReportDateItem from 'components/EntityListItem/EntityListNestedItem/EntityListNestedReportDateItem';

const ChildItems = styled.span`
  display: inline-block;
  width: 50%;
  vertical-align: top;
`;

export class EntityListNestedReportList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  mapToEntityListItem = (entity, entityLinkTo) => ({
    id: entity.id,
    title: entity.attributes.name || entity.attributes.title,
    reference: this.context.intl.formatDate(new Date(entity.attributes.updated_at)),
    linkTo: `${entityLinkTo}${entity.id}`,
    status: entity.attributes.draft ? 'draft' : null,
  });

  render() {
    const { reports, dates, entityLinkTo } = this.props;

    return (
      <ChildItems>
        { dates &&
          <EntityListNestedReportDateItem
            dates={dates}
          />
        }
        {
          reports.map((report, i) =>
            <EntityListNestedReportItem
              key={i}
              report={this.mapToEntityListItem(report, entityLinkTo)}
            />
          )
        }
      </ChildItems>
    );
  }
}

EntityListNestedReportList.propTypes = {
  reports: PropTypes.array,
  dates: PropTypes.array,
  entityLinkTo: PropTypes.string,
};
EntityListNestedReportList.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

export default EntityListNestedReportList;
