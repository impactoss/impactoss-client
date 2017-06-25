import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import EntityListItems from 'components/EntityListItems';

import messages from './messages';

const ListEntitiesMain = styled.div`
  padding-top: 0.5em;
`;
const ListEntitiesEmpty = styled.div``;
const ListEntitiesGroup = styled.div``;
const ListEntitiesGroupHeader = styled.h3`
  margin-top: 30px;
`;
const ListEntitiesSubGroup = styled.div``;
const ListEntitiesSubGroupHeader = styled.h5`
  margin-top: 12px;
  font-weight: normal;
  margin-bottom: 20px;
`;

export class EntityListGroups extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  // shouldComponentUpdate(nextProps) {
  //   console.log(this.props.entitiesSorted[0], nextProps.entitiesSorted[0])
  //   return !isEqual(this.props.entitiesSorted, nextProps.entitiesSorted)
  //     || !isEqual(this.props.entityIdsSelected, nextProps.entityIdsSelected)
  //     || !isEqual(this.props.taxonomies, nextProps.taxonomies)
  //     || !isEqual(this.props.connectedTaxonomies, nextProps.connectedTaxonomies)
  //     || !isEqual(this.props.filters, nextProps.filters)
  //     || !isEqual(this.props.header, nextProps.header)
  //     || !isEqual(this.props.locationQuery, nextProps.locationQuery)
  //     || this.props.expandNo !== nextProps.expandNo;
  // }
  render() {
    // console.log('EntityListGroups.render')
    const {
      entitiesGrouped,
      entityIdsSelected,
      taxonomies,
      filters,
      locationQuery,
      header,
      entityLinkTo,
      isManager,
      onTagClick,
      onEntitySelect,
      expandNo,
      isExpandable,
      expandableColumns,
      handleExpandLink,
    } = this.props;

    const locationGroup = locationQuery.group;
    const locationSubGroup = locationQuery.subgroup;

    return (
      <ListEntitiesMain>
        { entitiesGrouped.length === 0 && locationQuery &&
          <ListEntitiesEmpty>
            <FormattedMessage {...messages.listEmptyAfterQuery} />
          </ListEntitiesEmpty>
        }
        { entitiesGrouped.length === 0 && !locationQuery &&
          <ListEntitiesEmpty>
            <FormattedMessage {...messages.listEmpty} />
          </ListEntitiesEmpty>
        }
        { entitiesGrouped.length > 0 &&
          <div>
            {
              entitiesGrouped.map((entityGroup, i) => (
                <ListEntitiesGroup key={i}>
                  { locationGroup && entityGroup.label &&
                    <ListEntitiesGroupHeader>
                      {entityGroup.label}
                    </ListEntitiesGroupHeader>
                  }
                  {
                    entityGroup.entitiesGrouped &&
                    entityGroup.entitiesGrouped.map((entitySubGroup, j) => (
                      <ListEntitiesSubGroup key={j}>
                        { locationSubGroup && entitySubGroup.label &&
                          <ListEntitiesSubGroupHeader>
                            {entitySubGroup.label}
                          </ListEntitiesSubGroupHeader>
                        }
                        <EntityListItems
                          taxonomies={taxonomies}
                          associations={filters}
                          entities={entitySubGroup.entities}
                          entityIdsSelected={entityIdsSelected}
                          entityIcon={header.icon}
                          entityLinkTo={entityLinkTo}
                          isSelect={isManager}
                          onTagClick={onTagClick}
                          onEntitySelect={onEntitySelect}
                          expandNo={expandNo}
                          isExpandable={isExpandable}
                          expandableColumns={expandableColumns}
                          onExpand={handleExpandLink}
                        />
                      </ListEntitiesSubGroup>
                    ))
                  }
                  { entityGroup.entities && !entityGroup.entitiesGrouped &&
                    <EntityListItems
                      taxonomies={taxonomies}
                      associations={filters}
                      entities={entityGroup.entities}
                      entityIdsSelected={entityIdsSelected}
                      entityIcon={header.icon}
                      entityLinkTo={entityLinkTo}
                      isSelect={isManager}
                      onTagClick={onTagClick}
                      onEntitySelect={onEntitySelect}
                      expandNo={expandNo}
                      isExpandable={isExpandable}
                      expandableColumns={expandableColumns}
                      onExpand={handleExpandLink}
                    />
                  }
                </ListEntitiesGroup>
              ))
            }
          </div>
        }
      </ListEntitiesMain>
    );
  }
}

EntityListGroups.propTypes = {
  entitiesGrouped: PropTypes.array.isRequired,
  entityIdsSelected: PropTypes.array.isRequired,
  expandableColumns: PropTypes.array,
  taxonomies: PropTypes.object,
  filters: PropTypes.object,
  header: PropTypes.object,
  locationQuery: PropTypes.object,
  entityLinkTo: PropTypes.string,
  isManager: PropTypes.bool,
  expandNo: PropTypes.number,
  isExpandable: PropTypes.bool,
  onEntitySelect: PropTypes.func.isRequired,
  onTagClick: PropTypes.func.isRequired,
  handleExpandLink: PropTypes.func.isRequired,
};

export default EntityListGroups;
