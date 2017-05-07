import React, { PropTypes } from 'react';
import styled from 'styled-components';

import EntityListChildItem from './EntityListChildItem';
import EntityListChildReportItems from './EntityListChildReportItems';

const ChildItems = styled.span`
  display: inline-block;
  width: 50%;
  vertical-align: top;
`;

export class EntityListChildItems extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  mapToEntityListItem = (entity, props) => {
    const {
      entityLinkTo,
      expand,
      expandable,
      expandableColumns,
      showDate,
      onExpand,
    } = props;

    return {
      id: entity.id,
      title: entity.attributes.name || entity.attributes.title,
      reference: entity.attributes.number || entity.id,
      linkTo: `${entityLinkTo}${entity.id}`,
      status: entity.attributes.draft ? 'draft' : null,
      updated: showDate ? entity.attributes.updated_at.split('T')[0] : null,
      expandables: expandable && !expand
        ? expandableColumns.map((column, i) => ({
          type: column.type,
          label: column.label,
          count: column.getCount && column.getCount(entity),
          info: column.getInfo && column.getInfo(entity),
          onClick: () => onExpand(true, i + 2),
        }))
        : [],
    };
  };

  render() {
    const {
      entities,
      expand,
      expandable,
      expandableColumns,
    } = this.props;

    return (
      <ChildItems>
        {
          entities.map((entity, i) =>
            <div key={i}>
              <EntityListChildItem
                entity={this.mapToEntityListItem(entity, this.props)}
                expand={expand}
              />
              {expandable && expand > 0 && expandableColumns.length > 0 &&
                <EntityListChildReportItems
                  reports={expandableColumns[0].getReports(entity)}
                  dates={expandableColumns[0].getDates(entity)}
                  entityLinkTo={expandableColumns[0].entityLinkTo}
                />
              }
            </div>
          )
        }
      </ChildItems>
    );
  }
}

EntityListChildItems.propTypes = {
  entities: PropTypes.array.isRequired,
  showDate: PropTypes.bool,
  entityLinkTo: PropTypes.string,
  expand: PropTypes.number,
  expandable: PropTypes.bool,
  expandableColumns: PropTypes.array,
  onExpand: PropTypes.func,
};

export default EntityListChildItems;
