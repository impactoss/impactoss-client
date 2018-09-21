/*
 *
 * EntityListMain
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { ScrollContainer } from 'scrollmonitor-react';
import { Map, List } from 'immutable';
import styled from 'styled-components';

import { jumpToComponent } from 'utils/scroll-to-component';
import { lowerCase } from 'utils/string';

import ContainerWithSidebar from 'components/styled/Container/ContainerWithSidebar';
import Container from 'components/styled/Container';
import Content from 'components/styled/Content';
import Loading from 'components/Loading';
import ContentHeader from 'components/ContentHeader';
import TagSearch from 'components/TagSearch';

import { CONTENT_LIST, PARAMS } from 'containers/App/constants';
import appMessages from 'containers/App/messages';

import EntityListGroups from './EntityListGroups';

import EntityListOptions from './EntityListOptions';
import { currentFilters, currentFilterArgs } from './current-filters';
import { getGroupOptions, getGroupValue } from './group-options';
import { groupEntities } from './group-entities';

import messages from './messages';

const EntityListSearch = styled.div`
  padding-bottom: 1em;
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    padding-bottom: 2em;
  }
`;

const ListEntities = styled.div``;
const ListWrapper = styled.div``;

class EntityListMain extends React.Component { // eslint-disable-line react/prefer-stateless-function
  shouldComponentUpdate(nextProps) {
    if (nextProps.listUpdating) {
      return false;
    }
    if (this.props.listUpdating && !nextProps.listUpdating) {
      return true;
    }
    return this.props.entities !== nextProps.entities
      || this.props.entityIdsSelected !== nextProps.entityIdsSelected
      || this.props.dataReady !== nextProps.dataReady
      || this.props.locationQuery !== nextProps.locationQuery
      || this.props.errors !== nextProps.errors
      || typeof this.props.scrollContainer !== typeof nextProps.scrollContainer;
  }
  componentDidUpdate() {
    if (this.props.scrollContainer) {
      this.props.scrollContainer.recalculateLocations();
    }
  }
  scrollToTop = () => {
    jumpToComponent(
      this.ScrollTarget,
      this.ScrollReference,
      this.ScrollContainer
    );
  }

  render() {
    const {
      config,
      header,
      entityTitle,
      dataReady,
      isManager,
      isContributor,
      onGroupSelect,
      onSubgroupSelect,
      onExpand,
      onSearch,
      onResetFilters,
      onTagClick,
      taxonomies,
      connections,
      connectedTaxonomies,
      locationQuery,
      entityIcon,
      entities,
      errors,
    } = this.props;

    const expandNo = config.expandableColumns && locationQuery.get('expand')
      ? parseInt(locationQuery.get('expand'), 10)
      : 0;
    const groupSelectValue = locationQuery.get('group')
    || (config.taxonomies && getGroupValue(taxonomies, connectedTaxonomies, config.taxonomies.defaultGroupAttribute, 1));
    const subgroupSelectValue = groupSelectValue && groupSelectValue !== PARAMS.GROUP_RESET
      ? locationQuery.get('subgroup')
        || (config.taxonomies && getGroupValue(taxonomies, connectedTaxonomies, config.taxonomies.defaultGroupAttribute, 2))
      : null;

    const headerTitle = entities && dataReady
      ? `${entities.size} ${entities.size === 1 ? entityTitle.single : entityTitle.plural}`
      : entityTitle.plural;

    // group all entities, regardless of page items
    const entityGroups = groupSelectValue && groupSelectValue !== PARAMS.GROUP_RESET
    ? groupEntities(
      entities,
      taxonomies,
      connectedTaxonomies,
      config,
      groupSelectValue,
      subgroupSelectValue !== PARAMS.GROUP_RESET && subgroupSelectValue,
      {
        without: this.context.intl && this.context.intl.formatMessage(messages.without),
      },
      this.context.intl || null
    )
    : null;

    const subtitle = dataReady && entityGroups && groupSelectValue && this.context.intl
    ? this.context.intl.formatMessage(messages.groupSubtitle, {
      size: entityGroups.size,
      type: lowerCase(this.context.intl.formatMessage(entityGroups.size === 1
        ? appMessages.entities.taxonomies[groupSelectValue].single
        : appMessages.entities.taxonomies[groupSelectValue].plural
      )),
    })
    : null;

    return (
      <ContainerWithSidebar innerRef={(node) => { this.ScrollContainer = node; }} >
        <Container innerRef={(node) => { this.ScrollReference = node; }}>
          <Content>
            <ContentHeader
              type={CONTENT_LIST}
              icon={header.icon}
              supTitle={header.supTitle}
              title={headerTitle}
              subTitle={subtitle}
              sortAttributes={config.sorting}
              buttons={dataReady && isManager
                ? header.actions
                : null
              }
            />
            { (!dataReady || !this.props.scrollContainer) &&
              <Loading />
            }
            { dataReady && this.props.scrollContainer &&
              <ListEntities>
                <EntityListSearch>
                  <TagSearch
                    filters={currentFilters(
                      {
                        config,
                        entities,
                        taxonomies,
                        connections,
                        connectedTaxonomies,
                        locationQuery,
                        onTagClick,
                        errors,
                      },
                      this.context.intl.formatMessage(messages.filterFormWithoutPrefix),
                      this.context.intl.formatMessage(messages.filterFormError),
                    )}
                    searchQuery={locationQuery.get('search') || ''}
                    onSearch={onSearch}
                    onClear={() => onResetFilters(currentFilterArgs(config, locationQuery))}
                  />
                </EntityListSearch>
                <EntityListOptions
                  groupOptions={getGroupOptions(taxonomies, null, this.context.intl)}
                  subgroupOptions={getGroupOptions(taxonomies, null, this.context.intl)}
                  groupSelectValue={groupSelectValue}
                  subgroupSelectValue={subgroupSelectValue}
                  onGroupSelect={onGroupSelect}
                  onSubgroupSelect={onSubgroupSelect}
                  onExpand={() => onExpand(expandNo < config.expandableColumns.length ? config.expandableColumns.length : 0)}
                  expanded={config.expandableColumns && expandNo === config.expandableColumns.length}
                  expandable={config.expandableColumns && config.expandableColumns.length > 0}
                />
                <ListWrapper innerRef={(node) => { this.ScrollTarget = node; }}>
                  <EntityListGroups
                    entities={entities}
                    errors={errors}
                    onDismissError={this.props.onDismissError}
                    entityGroups={entityGroups}
                    taxonomies={taxonomies}
                    connections={connections}
                    entityIdsSelected={this.props.entityIdsSelected}
                    locationQuery={this.props.locationQuery}
                    groupSelectValue={groupSelectValue}
                    subgroupSelectValue={subgroupSelectValue}
                    onEntityClick={this.props.onEntityClick}
                    entityTitle={entityTitle}
                    config={config}
                    entityIcon={entityIcon}
                    isManager={isManager}
                    isContributor={isContributor}
                    onExpand={onExpand}
                    expandNo={expandNo}
                    onPageItemsSelect={(no) => {
                      this.scrollToTop();
                      this.props.onPageItemsSelect(no);
                    }}
                    onPageSelect={(page) => {
                      this.scrollToTop();
                      this.props.onPageSelect(page);
                    }}
                    onEntitySelect={this.props.onEntitySelect}
                    onEntitySelectAll={this.props.onEntitySelectAll}
                    scrollContainer={this.props.scrollContainer}
                    onSortBy={this.props.onSortBy}
                    onSortOrder={this.props.onSortOrder}
                  />
                </ListWrapper>
              </ListEntities>
            }
          </Content>
        </Container>
      </ContainerWithSidebar>
    );
  }
}

EntityListMain.propTypes = {
  entities: PropTypes.instanceOf(List),
  taxonomies: PropTypes.instanceOf(Map),
  connections: PropTypes.instanceOf(Map),
  connectedTaxonomies: PropTypes.instanceOf(Map),
  entityIdsSelected: PropTypes.instanceOf(List),
  locationQuery: PropTypes.instanceOf(Map),
  errors: PropTypes.instanceOf(Map),
  // object/arrays
  config: PropTypes.object,
  header: PropTypes.object,
  entityTitle: PropTypes.object, // single/plural
  // primitive
  dataReady: PropTypes.bool,
  isManager: PropTypes.bool,
  isContributor: PropTypes.bool,
  entityIcon: PropTypes.func,
  // functions
  onEntityClick: PropTypes.func.isRequired,
  onEntitySelect: PropTypes.func.isRequired,
  onEntitySelectAll: PropTypes.func.isRequired,
  onTagClick: PropTypes.func.isRequired,
  onExpand: PropTypes.func.isRequired,
  onGroupSelect: PropTypes.func.isRequired,
  onSubgroupSelect: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired,
  onPageSelect: PropTypes.func.isRequired,
  onPageItemsSelect: PropTypes.func.isRequired,
  onSortOrder: PropTypes.func.isRequired,
  onSortBy: PropTypes.func.isRequired,
  onDismissError: PropTypes.func.isRequired,
  scrollContainer: PropTypes.object,
  listUpdating: PropTypes.bool,
};

EntityListMain.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default ScrollContainer(EntityListMain);
// export default EntityListMain;
