import React, { PropTypes } from 'react';
import styled from 'styled-components';

import EntityListChildReportItem from './EntityListChildReportItem';
import EntityListChildDateItem from './EntityListChildDateItem';

const ChildItems = styled.span`
  display: inline-block;
  width: 50%;
  vertical-align: top;
`;

export class EntityListChildReportItems extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  mapToEntityListItem = (entity, entityLinkTo) => ({
    id: entity.id,
    title: entity.attributes.name || entity.attributes.title,
    reference: entity.attributes.updated_at.split('T')[0],
    linkTo: `${entityLinkTo}${entity.id}`,
    status: entity.attributes.draft ? 'draft' : null,
  });

  render() {
    const { reports, dates, entityLinkTo } = this.props;

    return (
      <ChildItems>
        { dates && dates.length > 0 &&
          <EntityListChildDateItem
            date={dates[0]}
          />
        }
        {
          reports.map((report, i) =>
            <EntityListChildReportItem
              key={i}
              report={this.mapToEntityListItem(report, entityLinkTo)}
            />
          )
        }
      </ChildItems>
    );
  }
}

EntityListChildReportItems.propTypes = {
  reports: PropTypes.array,
  dates: PropTypes.array,
  entityLinkTo: PropTypes.string,
};

export default EntityListChildReportItems;
