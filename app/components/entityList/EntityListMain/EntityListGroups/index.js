import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import styled from 'styled-components';

import { Map, List } from 'immutable';

// import { isEqual } from 'lodash/lang';

import EntityListItems from './EntityListItems';
import EntityListHeader from './EntityListHeader';
import EntityListFooter from './EntityListFooter';
import EntityListGroupHeader from './EntityListGroupHeader';

import { getPager } from './pagination';
import { groupEntities } from './group-entities';
  // getGroupedEntitiesForPage,
import messages from './messages';

const ListEntitiesMain = styled.div`
  padding-top: 0.5em;
`;
const ListEntitiesEmpty = styled.div``;
const ListEntitiesGroup = styled.div``;
const ListEntitiesSubGroup = styled.div``;

export class EntityListGroups extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    // console.log('EntityListGroups.render')
    const {
      entityIdsSelected,
      config,
      header,
      onEntityClick,
      isManager,
      onEntitySelect,
      onExpand,
      expandNo,
      entityTitle,
      onEntitySelectAll,
      entities,
      locationQuery,
      taxonomies,
      connectedTaxonomies,
      groupSelectValue,
      subgroupSelectValue,
    } = this.props;
    // grouping and paging
    // group entities , regardless of page items
    const entityGroups = groupSelectValue
      ? groupEntities(entities, taxonomies, connectedTaxonomies, config, groupSelectValue, subgroupSelectValue)
      : List().push(Map({ entities }));

    // flatten all entities
    let entityGroupsFlattened;
    if (groupSelectValue) {
      // flatten groups for pagination, important as can include duplicates
      entityGroupsFlattened = entityGroups.map((group, gIndex) => group.get('entityGroups')
        ? group.get('entityGroups').map(
          (subgroup, sgIndex) => subgroup.get('entities').map(
            (entity) => Map({ group: gIndex, subgroup: sgIndex, entity })
          )
        ).flatten(1)
        : group.get('entities').map((entity) => Map({ group: gIndex, entity }))
      ).flatten(1);
    }

    // get new pager object for specified page
    const pager = getPager(
      groupSelectValue ? entityGroupsFlattened.size : entities.size,
      locationQuery.get('page') && parseInt(locationQuery.get('page'), 10),
      locationQuery.get('items') && parseInt(locationQuery.get('items'), 10)
    );

    let entityGroupsPaged = entityGroups;
    let entitiesOnPage;
    if (pager.totalPages > 1) {
      // group again if necessary, this time just for items on page
      if (groupSelectValue) {
        entitiesOnPage = entityGroupsFlattened.map((item) => item.get('entity')).slice(pager.startIndex, pager.endIndex + 1);
        entityGroupsPaged = groupEntities(entitiesOnPage, taxonomies, connectedTaxonomies, config, groupSelectValue, subgroupSelectValue);
      } else {
        entitiesOnPage = entities.slice(pager.startIndex, pager.endIndex + 1);
        entityGroupsPaged = List().push(Map({ entities: entitiesOnPage }));
      }
    } else {
      entitiesOnPage = entities;
    }

    return (
      <div>
        <EntityListHeader
          selectedTotal={entityIdsSelected.size}
          pageTotal={entitiesOnPage.size}
          expandNo={expandNo}
          expandableColumns={config.expandableColumns}
          onExpand={onExpand}
          isManager={isManager}
          entityTitle={entityTitle}
          onSelect={(checked) => {
            onEntitySelectAll(checked ? entitiesOnPage.map((entity) => entity.get('id')).toArray() : []);
          }}
        />
        <ListEntitiesMain>
          { entityGroupsPaged.size === 0 && locationQuery &&
            <ListEntitiesEmpty>
              <FormattedMessage {...messages.listEmptyAfterQuery} />
            </ListEntitiesEmpty>
          }
          { entityGroupsPaged.size === 0 && !locationQuery &&
            <ListEntitiesEmpty>
              <FormattedMessage {...messages.listEmpty} />
            </ListEntitiesEmpty>
          }
          { entityGroupsPaged.size > 0 &&
            <div>
              {
                entityGroupsPaged.map((entityGroup, i) => (
                  <ListEntitiesGroup key={i}>
                    { groupSelectValue && entityGroup.get('label') &&
                      <EntityListGroupHeader group={entityGroup} level={1} />
                    }
                    {
                      entityGroup.get('entityGroups') &&
                      entityGroup.get('entityGroups').map((entitySubGroup, j) => (
                        <ListEntitiesSubGroup key={j}>
                          { subgroupSelectValue && entitySubGroup.get('label') &&
                            <EntityListGroupHeader group={entitySubGroup} level={2} />
                          }
                          <EntityListItems
                            taxonomies={this.props.taxonomies}
                            config={config}
                            entities={entitySubGroup.get('entities')}
                            entityIdsSelected={entityIdsSelected}
                            entityIcon={header.icon}
                            onEntityClick={onEntityClick}
                            isManager={isManager}
                            onEntitySelect={onEntitySelect}
                            expandNo={expandNo}
                            onExpand={onExpand}
                            scrollContainer={this.props.scrollContainer}
                          />
                        </ListEntitiesSubGroup>
                      ))
                    }
                    { entityGroup.get('entities') && !entityGroup.get('entityGroups') &&
                      <EntityListItems
                        taxonomies={this.props.taxonomies}
                        config={config}
                        entities={entityGroup.get('entities')}
                        entityIdsSelected={entityIdsSelected}
                        entityIcon={header.icon}
                        onEntityClick={onEntityClick}
                        isManager={isManager}
                        onEntitySelect={onEntitySelect}
                        expandNo={expandNo}
                        onExpand={onExpand}
                        scrollContainer={this.props.scrollContainer}
                      />
                    }
                  </ListEntitiesGroup>
                ))
              }
            </div>
          }
        </ListEntitiesMain>
        <EntityListFooter
          pager={pager}
          onPageSelect={this.props.onPageSelect}
        />
      </div>
    );
  }
}

EntityListGroups.propTypes = {
  entities: PropTypes.instanceOf(List),
  taxonomies: PropTypes.instanceOf(Map),
  connectedTaxonomies: PropTypes.instanceOf(Map),
  entityIdsSelected: PropTypes.instanceOf(List),
  locationQuery: PropTypes.instanceOf(Map),
  entityTitle: PropTypes.object,
  config: PropTypes.object,
  header: PropTypes.object,
  isManager: PropTypes.bool,
  expandNo: PropTypes.number,
  onExpand: PropTypes.func.isRequired,
  onPageSelect: PropTypes.func.isRequired,
  onEntityClick: PropTypes.func.isRequired,
  onEntitySelect: PropTypes.func.isRequired,
  onEntitySelectAll: PropTypes.func.isRequired,
  scrollContainer: PropTypes.object,
  groupSelectValue: PropTypes.string,
  subgroupSelectValue: PropTypes.string,
};


EntityListGroups.defaultProps = {
  sortBy: 'id',
  sortOrder: 'desc',
};


export default EntityListGroups;
