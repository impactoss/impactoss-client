import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { Map, List } from 'immutable';

// import { isEqual } from 'lodash/lang';
import { flatten } from 'lodash/array';
import { orderBy, map } from 'lodash/collection';

import { getEntitySortIteratee } from 'utils/sort';

import { STATES as CHECKBOX_STATES } from 'components/forms/IndeterminateCheckbox';

import EntityListItems from './EntityListItems';
import EntityListHeader from './EntityListHeader';
import EntityListFooter from './EntityListFooter';

import { getHeaderColumns } from './header';
import { getPager } from './pagination';
import {
  groupEntities,
  getGroupedEntitiesForPage,
} from './groupFactory';
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
  //   // console.log('locationQuery', isEqual(this.props.locationQuery, nextProps.locationQuery), nextProps.locationQuery)
  //   return this.props.entities !== nextProps.entities
  //   || this.props.locationQuery !== nextProps.locationQuery
  //   || this.props.entityIdsSelected !== nextProps.entityIdsSelected;
  // }
  render() {
    const {
      entityIdsSelected,
      filters,
      header,
      entityLinkTo,
      isManager,
      onTagClick,
      onEntitySelect,
      expandNo,
      isExpandable,
      expandableColumns,
      onExpand,
      sortBy,
      sortOrder,
      entityTitle,
      onEntitySelectAll,
    } = this.props;

    const entities = this.props.entities && this.props.entities.toJS();
    const locationQuery = this.props.locationQuery && this.props.locationQuery.toJS();
    const taxonomies = this.props.taxonomies && this.props.taxonomies.toJS();
    const connectedTaxonomies = this.props.connectedTaxonomies && this.props.connectedTaxonomies.toJS();

    // sorted entities: TODO consider moving to selector for caching?
    const entitiesSorted = entities
      ? orderBy(entities, getEntitySortIteratee(sortBy), sortOrder)
      : [];
    // grouping and paging
    // group entities
    const entitiesGrouped = entitiesSorted.length > 0
      ? groupEntities(entitiesSorted, taxonomies, connectedTaxonomies, filters, locationQuery)
      : [];

    // flatten groups for pagination, important as can include duplicates
    const entitiesGroupedFlattened = flatten(entitiesGrouped.map((group, gIndex) => group.entitiesGrouped
      ? flatten(group.entitiesGrouped.map((subgroup, sgIndex) =>
        subgroup.entities.map((entity) => ({ group: gIndex, subgroup: sgIndex, entity }))
      ))
      : group.entities.map((entity) => ({ group: gIndex, entity }))
    ));

    // get new pager object for specified page
    const pager = getPager(
      entitiesGroupedFlattened.length,
      locationQuery.page && parseInt(locationQuery.page, 10),
      locationQuery.items && parseInt(locationQuery.items, 10)
    );
    // get new page of items from items array
    const pageItems = entitiesGroupedFlattened.slice(pager.startIndex, pager.endIndex + 1);
    const entitiesGroupedForPage = getGroupedEntitiesForPage(pageItems, entitiesGrouped);

    // convert to JS if present
    let allChecked = CHECKBOX_STATES.INDETERMINATE;
    if (entityIdsSelected.size === 0) {
      allChecked = CHECKBOX_STATES.UNCHECKED;
    } else if (pageItems.length > 0 && entityIdsSelected.size === pageItems.length) {
      allChecked = CHECKBOX_STATES.CHECKED;
    }
    let listHeaderLabel = entityTitle.plural;
    if (entityIdsSelected.size === 1) {
      listHeaderLabel = `${entityIdsSelected.size} ${entityTitle.single} selected`;
    } else if (entityIdsSelected.size > 1) {
      listHeaderLabel = `${entityIdsSelected.size} ${entityTitle.plural} selected`;
    }
    const locationGroup = locationQuery.group;
    const locationSubGroup = locationQuery.subgroup;
    return (
      <div>
        <EntityListHeader
          columns={getHeaderColumns(
            listHeaderLabel,
            isManager,
            isExpandable,
            expandNo,
            expandableColumns,
            onExpand
          )}
          isSelect={isManager}
          isSelected={allChecked}
          onSelect={(checked) => {
            onEntitySelectAll(checked ? map(pageItems, (item) => item.entity.id) : []);
          }}
        />
        <ListEntitiesMain>
          { entitiesGroupedForPage.length === 0 && locationQuery &&
            <ListEntitiesEmpty>
              <FormattedMessage {...messages.listEmptyAfterQuery} />
            </ListEntitiesEmpty>
          }
          { entitiesGroupedForPage.length === 0 && !locationQuery &&
            <ListEntitiesEmpty>
              <FormattedMessage {...messages.listEmpty} />
            </ListEntitiesEmpty>
          }
          { entitiesGroupedForPage.length > 0 &&
            <div>
              {
                entitiesGroupedForPage.map((entityGroup, i) => (
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
                            entityIdsSelected={entityIdsSelected ? entityIdsSelected.toJS() : []}
                            entityIcon={header.icon}
                            entityLinkTo={entityLinkTo}
                            isSelect={isManager}
                            onTagClick={onTagClick}
                            onEntitySelect={onEntitySelect}
                            expandNo={expandNo}
                            isExpandable={isExpandable}
                            expandableColumns={expandableColumns}
                            onExpand={onExpand}
                          />
                        </ListEntitiesSubGroup>
                      ))
                    }
                    { entityGroup.entities && !entityGroup.entitiesGrouped &&
                      <EntityListItems
                        taxonomies={taxonomies}
                        associations={filters}
                        entities={entityGroup.entities}
                        entityIdsSelected={entityIdsSelected ? entityIdsSelected.toJS() : []}
                        entityIcon={header.icon}
                        entityLinkTo={entityLinkTo}
                        isSelect={isManager}
                        onTagClick={onTagClick}
                        onEntitySelect={onEntitySelect}
                        expandNo={expandNo}
                        isExpandable={isExpandable}
                        expandableColumns={expandableColumns}
                        onExpand={onExpand}
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
  entities: PropTypes.instanceOf(Map),
  taxonomies: PropTypes.instanceOf(Map),
  connectedTaxonomies: PropTypes.instanceOf(Map),
  entityIdsSelected: PropTypes.instanceOf(List).isRequired,
  locationQuery: PropTypes.instanceOf(Map),
  entityTitle: PropTypes.object,
  entityLinkTo: PropTypes.string,
  sortBy: PropTypes.string,
  sortOrder: PropTypes.string,
  filters: PropTypes.object,
  header: PropTypes.object,
  isManager: PropTypes.bool,
  expandNo: PropTypes.number,
  isExpandable: PropTypes.bool,
  expandableColumns: PropTypes.array,
  onExpand: PropTypes.func.isRequired,
  onTagClick: PropTypes.func.isRequired,
  onPageSelect: PropTypes.func.isRequired,
  onEntitySelect: PropTypes.func.isRequired,
  onEntitySelectAll: PropTypes.func.isRequired,
};


EntityListGroups.defaultProps = {
  sortBy: 'id',
  sortOrder: 'desc',
};


export default EntityListGroups;
