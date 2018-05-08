import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import styled from 'styled-components';

import { Map, List } from 'immutable';

// import { isEqual } from 'lodash/lang';
import { PARAMS } from 'containers/App/constants';

import Messages from 'components/Messages';

import EntityListItems from './EntityListItems';
import EntityListHeader from './EntityListHeader';
import EntityListFooter from './EntityListFooter';
import EntityListGroupHeader from './EntityListGroupHeader';

import { getPager } from './pagination';
// import { groupEntities } from './group-entities';
  // getGroupedEntitiesForPage,
import messages from './messages';

const ListEntitiesMain = styled.div`
  padding-top: 0.5em;
`;
const ListEntitiesEmpty = styled.div``;
const ListEntitiesGroup = styled.div`
  padding-bottom: 20px;
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    padding-bottom: 40px;
  }
`;
const ListEntitiesSubGroup = styled.div`
  padding-bottom: 10px;
  &:last-child {
    padding-bottom: 0;
  }
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    padding-bottom: 25px;
  }
`;

const PAGE_SIZE = 20;
const PAGE_SIZE_MAX = 100;

const countEntities = (entityGroups) =>
  entityGroups.reduce((memo, group) => {
    if (group.get('entities')) {
      return memo + group.get('entities').size;
    }
    if (group.get('entityGroups')) {
      return memo + countEntities(group.get('entityGroups'));
    }
    return memo;
  }, 0);

const sliceGroup = (group, pager, groupStartIndex, groupEndIndex, formatMessage) => {
  // group wholly contained
  if (groupStartIndex >= pager.startIndex && groupEndIndex <= pager.endIndex) {
    return group;
  }
  // group not wholly contained
  let slicedGroup = group;
  if (groupStartIndex < pager.startIndex) {
    if (formatMessage) {
      slicedGroup = slicedGroup.set('label', formatMessage(messages.continued, { label: slicedGroup.get('label') }));
    }
    slicedGroup = slicedGroup.set('entities', slicedGroup.get('entities').slice(pager.startIndex - groupStartIndex, group.get('entities').size));
  }
  if (groupEndIndex > pager.endIndex) {
    slicedGroup = slicedGroup.set('entities', slicedGroup.get('entities').slice(0, pager.endIndex - groupEndIndex));
  }
  return slicedGroup;
};

const pageEntityGroups = (entityGroups, pager, formatMessage) => {
  let groupStartIndex = 0;

  return entityGroups.reduce((slicedEntityGroups, group) => {
    if (groupStartIndex > pager.endIndex) {
      return slicedEntityGroups;
    }
    if (group.get('entityGroups')) {
      const groupCount = countEntities(group.get('entityGroups'));
      const groupEndIndex = (groupCount + groupStartIndex) - 1;
      if (groupStartIndex <= pager.endIndex && groupEndIndex >= pager.startIndex) {
        // group wholly contained
        if (groupStartIndex >= pager.startIndex && groupEndIndex <= pager.endIndex) {
          groupStartIndex += groupCount;
          return slicedEntityGroups.push(group);
        }
        let subgroupStartIndex = groupStartIndex;
        const slicedGroup = group.set('entityGroups', group.get('entityGroups').reduce((slicedEntitySubgroups, subgroup) => {
          if (subgroup.get('entities')) {
            const subgroupEndIndex = subgroup.get('entities').size + (subgroupStartIndex - 1);
            if (subgroupStartIndex <= pager.endIndex && subgroupEndIndex >= pager.startIndex) {
              const slicedSubgroup = sliceGroup(subgroup, pager, subgroupStartIndex, subgroupEndIndex, formatMessage);
              subgroupStartIndex += subgroup.get('entities').size;
              return slicedEntitySubgroups.push(slicedSubgroup);
            }
            subgroupStartIndex += subgroup.get('entities').size;
          }
          return slicedEntitySubgroups;
        }, List()));
        groupStartIndex += groupCount;
        return slicedEntityGroups.push(slicedGroup);
      }
      groupStartIndex += groupCount;
      return slicedEntityGroups;
    }
    if (group.get('entities') && !group.get('entityGroups')) {
      const groupEndIndex = group.get('entities').size + (groupStartIndex - 1);
      if (groupStartIndex <= pager.endIndex && groupEndIndex >= pager.startIndex) {
        const slicedGroup = sliceGroup(group, pager, groupStartIndex, groupEndIndex, formatMessage);
        groupStartIndex += group.get('entities').size;
        return slicedEntityGroups.push(slicedGroup);
      }
      groupStartIndex += group.get('entities').size;
    }
    return slicedEntityGroups;
  }, List());
};


export class EntityListGroups extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  transformMessage = (msg, entityId) => this.context.intl
  ? this.context.intl.formatMessage(messages.entityNoLongerPresent, { entityId })
  : msg;

  hasLocationQueryFilters = (locationQuery) =>
    locationQuery.reduce((hasFilters, value, arg) =>
      hasFilters || ['items', 'page', 'group', 'subgroup', 'sort', 'order'].indexOf(arg) === -1
    , false);

  render() {
    // console.log('error EntityListGroups.render')
    const {
      entityIdsSelected,
      config,
      entityIcon,
      onEntityClick,
      isManager,
      isContributor,
      onEntitySelect,
      onExpand,
      expandNo,
      entityTitle,
      onEntitySelectAll,
      locationQuery,
      groupSelectValue,
      subgroupSelectValue,
      entities,
      errors,
      entityGroups,
    } = this.props;

    const pageSize = Math.min(
      (locationQuery.get('items') && parseInt(locationQuery.get('items'), 10)) || PAGE_SIZE,
      PAGE_SIZE_MAX
    );
    let entityIdsOnPage;
    let entityGroupsPaged;
    let pager;
    // grouping and paging
    // if grouping required
    if (groupSelectValue && groupSelectValue !== PARAMS.GROUP_RESET) {
      // count grouped entities (includes duplicates)
      const entityGroupsCount = countEntities(entityGroups);
      // if paging required
      if (entityGroupsCount > pageSize) {
        // get new pager object for specified page
        pager = getPager(
          entityGroupsCount,
          locationQuery.get('page') && parseInt(locationQuery.get('page'), 10),
          pageSize
        );
        // pick only entities within oage range while preserving hierarchical groups shape
        entityGroupsPaged = pageEntityGroups(entityGroups, pager, this.context.intl ? this.context.intl.formatMessage : null);
        // flatten entities for select all
        entityIdsOnPage = entityGroupsPaged.map((group) => group.get('entityGroups')
          ? group.get('entityGroups').map((subgroup) => subgroup.get('entities').map((entity) => entity.get('id'))).flatten(1)
          : group.get('entities').map((entity) => entity.get('id'))
        ).flatten(1);
      } else {
        entityIdsOnPage = entities.map((entity) => entity.get('id'));
        entityGroupsPaged = entityGroups;
      }
    // no grouping required, paging required
    } else if (entities.size > pageSize) {
      // get new pager object for specified page
      pager = getPager(
        entities.size,
        locationQuery.get('page') && parseInt(locationQuery.get('page'), 10),
        pageSize
      );
      const entitiesOnPage = entities.slice(pager.startIndex, pager.endIndex + 1);
      entityGroupsPaged = List().push(Map({ entities: entitiesOnPage }));
      entityIdsOnPage = entitiesOnPage.map((entity) => entity.get('id'));
    } else {
      // neither grouping nor paging required
      entityIdsOnPage = entities.map((entity) => entity.get('id'));
      entityGroupsPaged = List().push(Map({ entities }));
    }

    const errorsWithoutEntities = errors && errors.filter((error, id) =>
      !entities.find((entity) => entity.get('id') === id)
    );

    return (
      <div>
        <EntityListHeader
          selectedTotal={entityIdsSelected.toSet().size}
          pageTotal={entityIdsOnPage.toSet().size}
          entitiesTotal={entities.size}
          allSelected={entityIdsSelected.toSet().size === entities.size}
          allSelectedOnPage={entityIdsSelected.toSet().size === entityIdsOnPage.toSet().size}
          expandNo={expandNo}
          expandableColumns={config.expandableColumns}
          onExpand={onExpand}
          isManager={isManager}
          entityTitle={entityTitle}
          sortOptions={config.sorting}
          sortBy={locationQuery.get('sort')}
          sortOrder={locationQuery.get('order')}
          onSortBy={this.props.onSortBy}
          onSortOrder={this.props.onSortOrder}
          onSelect={(checked) => {
            onEntitySelectAll(checked ? entityIdsOnPage.toArray() : []);
          }}
          onSelectAll={() => {
            onEntitySelectAll(entities.map((entity) => entity.get('id')).toArray());
          }}
        />
        <ListEntitiesMain>
          { entityIdsOnPage.size === 0 && this.hasLocationQueryFilters(locationQuery) && (!errors || errors.size === 0) &&
            <ListEntitiesEmpty>
              <FormattedMessage {...messages.listEmptyAfterQuery} />
            </ListEntitiesEmpty>
          }
          { entityIdsOnPage.size === 0 && !this.hasLocationQueryFilters(locationQuery) && (!errors || errors.size === 0) &&
            <ListEntitiesEmpty>
              <FormattedMessage {...messages.listEmpty} />
            </ListEntitiesEmpty>
          }
          { entityIdsOnPage.size === 0 && this.hasLocationQueryFilters(locationQuery)
            && errorsWithoutEntities && errorsWithoutEntities.size > 0
            && errors && errors.size > 0
            &&
            <ListEntitiesEmpty>
              <FormattedMessage {...messages.listEmptyAfterQueryAndErrors} />
            </ListEntitiesEmpty>
          }
          { errorsWithoutEntities && errorsWithoutEntities.size > 0 && !this.hasLocationQueryFilters(locationQuery) &&
            errorsWithoutEntities.map((entityErrors, entityId) => (
              entityErrors.map((updateError, i) => (
                <Messages
                  key={i}
                  type="error"
                  messages={updateError.getIn(['error', 'messages']).map((msg) => this.transformMessage(msg, entityId)).toArray()}
                  onDismiss={() => this.props.onDismissError(updateError.get('key'))}
                  preMessage={false}
                />
              ))
            )).toList()
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
                      entityGroup.get('entityGroups').toList().map((entitySubGroup, j) => (
                        <ListEntitiesSubGroup key={j}>
                          { subgroupSelectValue && entitySubGroup.get('label') &&
                            <EntityListGroupHeader group={entitySubGroup} level={2} />
                          }
                          <EntityListItems
                            taxonomies={this.props.taxonomies}
                            connections={this.props.connections}
                            config={config}
                            entities={entitySubGroup.get('entities')}
                            errors={errors}
                            entityIdsSelected={entityIdsSelected}
                            entityIcon={entityIcon}
                            onEntityClick={onEntityClick}
                            isManager={isManager}
                            isContributor={isContributor}
                            onEntitySelect={onEntitySelect}
                            expandNo={expandNo}
                            onExpand={onExpand}
                            scrollContainer={this.props.scrollContainer}
                            onDismissError={this.props.onDismissError}
                          />
                        </ListEntitiesSubGroup>
                      ))
                    }
                    { entityGroup.get('entities') && !entityGroup.get('entityGroups') &&
                      <EntityListItems
                        taxonomies={this.props.taxonomies}
                        connections={this.props.connections}
                        errors={errors}
                        config={config}
                        entities={entityGroup.get('entities')}
                        entityIdsSelected={entityIdsSelected}
                        entityIcon={entityIcon}
                        onEntityClick={onEntityClick}
                        isManager={isManager}
                        isContributor={isContributor}
                        onEntitySelect={onEntitySelect}
                        expandNo={expandNo}
                        onExpand={onExpand}
                        scrollContainer={this.props.scrollContainer}
                        onDismissError={this.props.onDismissError}
                      />
                    }
                  </ListEntitiesGroup>
                ))
              }
            </div>
          }
        </ListEntitiesMain>
        { entityGroupsPaged.size > 0 &&
          <EntityListFooter
            pageSize={pageSize}
            pager={pager}
            onPageSelect={this.props.onPageSelect}
            onPageItemsSelect={this.props.onPageItemsSelect}
          />
        }
      </div>
    );
  }
}

EntityListGroups.propTypes = {
  entities: PropTypes.instanceOf(List),
  entityGroups: PropTypes.instanceOf(List),
  taxonomies: PropTypes.instanceOf(Map),
  connections: PropTypes.instanceOf(Map),
  entityIdsSelected: PropTypes.instanceOf(List),
  locationQuery: PropTypes.instanceOf(Map),
  errors: PropTypes.instanceOf(Map),
  entityTitle: PropTypes.object,
  config: PropTypes.object,
  entityIcon: PropTypes.func,
  isManager: PropTypes.bool,
  isContributor: PropTypes.bool,
  expandNo: PropTypes.number,
  onExpand: PropTypes.func.isRequired,
  onPageSelect: PropTypes.func.isRequired,
  onPageItemsSelect: PropTypes.func.isRequired,
  onEntityClick: PropTypes.func.isRequired,
  onEntitySelect: PropTypes.func.isRequired,
  onEntitySelectAll: PropTypes.func.isRequired,
  onSortBy: PropTypes.func.isRequired,
  onSortOrder: PropTypes.func.isRequired,
  onDismissError: PropTypes.func.isRequired,
  scrollContainer: PropTypes.object,
  groupSelectValue: PropTypes.string,
  subgroupSelectValue: PropTypes.string,
};

EntityListGroups.defaultProps = {
  sortBy: 'id',
  sortOrder: 'desc',
};

EntityListGroups.contextTypes = {
  intl: PropTypes.object,
};


export default EntityListGroups;
