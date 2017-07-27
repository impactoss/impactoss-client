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

import ContainerWithSidebar from 'components/styled/Container/ContainerWithSidebar';
import Container from 'components/styled/Container';
import Loading from 'components/Loading';
import ContentHeader from 'components/ContentHeader';

import { CONTENT_LIST, PARAMS } from 'containers/App/constants';

import EntityListGroups from './EntityListGroups';
import EntityListSearch from './EntityListSearch';
import EntityListOptions from './EntityListOptions';
import { currentFilters } from './current-filters';
import { getGroupOptions, getGroupValue } from './group-options';

import messages from './messages';

const Content = styled.div`
  padding: 0 4em;
`;
const ListEntities = styled.div``;
const ListWrapper = styled.div``;

class EntityListMain extends React.Component { // eslint-disable-line react/prefer-stateless-function
  shouldComponentUpdate(nextProps) {
    // console.log('EntityListMain.shouldComponentUpdate')
    // console.log(this.props.entities !== nextProps.entities)
    // console.log(this.props.entityIdsSelected !== nextProps.entityIdsSelected)
    // console.log(this.props.dataReady !== nextProps.dataReady)
    // console.log(isEqual(this.props.locationQuery, nextProps.locationQuery))
    // console.log(this.props.locationQuery === nextProps.locationQuery)
    // console.log(typeof this.props.scrollContainer !== typeof nextProps.scrollContainer)
    return this.props.entities !== nextProps.entities
      || this.props.entityIdsSelected !== nextProps.entityIdsSelected
      || this.props.dataReady !== nextProps.dataReady
      || this.props.locationQuery !== nextProps.locationQuery
      || typeof this.props.scrollContainer !== typeof nextProps.scrollContainer;
  }
  componentDidUpdate() {
    // console.log('EntityListMain.componentDidUpdate')
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
    // console.log('EntityListMain.render')
    const {
      config,
      header,
      entityTitle,
      dataReady,
      isManager,
      formatLabel,
      onGroupSelect,
      onSubgroupSelect,
      onExpand,
      onSearch,
      onTagClick,
      taxonomies,
      connections,
      connectedTaxonomies,
      locationQuery,
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

    const headerTitle = this.props.entities && dataReady
      ? `${this.props.entities.size} ${this.props.entities.size === 1 ? entityTitle.single : entityTitle.plural}`
      : entityTitle.plural;

    return (
      <ContainerWithSidebar innerRef={(node) => { this.ScrollContainer = node; }} >
        <Container innerRef={(node) => { this.ScrollReference = node; }}>
          <Content>
            <ContentHeader
              type={CONTENT_LIST}
              icon={header.icon}
              supTitle={header.supTitle}
              title={headerTitle}
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
                <EntityListSearch
                  filters={currentFilters(
                    {
                      config,
                      taxonomies,
                      connections,
                      connectedTaxonomies,
                      locationQuery,
                      onTagClick,
                    },
                    this.context.intl.formatMessage(messages.filterFormWithoutPrefix),
                    formatLabel
                  )}
                  searchQuery={locationQuery.get('search') || ''}
                  onSearch={onSearch}
                />
                <EntityListOptions
                  groupOptions={getGroupOptions(taxonomies, connectedTaxonomies)}
                  subgroupOptions={getGroupOptions(taxonomies)}
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
                    entities={this.props.entities}
                    taxonomies={this.props.taxonomies}
                    connections={connections}
                    connectedTaxonomies={this.props.connectedTaxonomies}
                    entityIdsSelected={this.props.entityIdsSelected}
                    locationQuery={this.props.locationQuery}
                    groupSelectValue={groupSelectValue}
                    subgroupSelectValue={subgroupSelectValue}
                    onEntityClick={this.props.onEntityClick}
                    entityTitle={entityTitle}
                    config={config}
                    header={header}
                    isManager={isManager}
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
  // object/arrays
  config: PropTypes.object,
  header: PropTypes.object,
  entityTitle: PropTypes.object, // single/plural
  // primitive
  dataReady: PropTypes.bool,
  isManager: PropTypes.bool,
  // functions
  formatLabel: PropTypes.func.isRequired,
  onEntityClick: PropTypes.func.isRequired,
  onEntitySelect: PropTypes.func.isRequired,
  onEntitySelectAll: PropTypes.func.isRequired,
  onTagClick: PropTypes.func.isRequired,
  onExpand: PropTypes.func.isRequired,
  onGroupSelect: PropTypes.func.isRequired,
  onSubgroupSelect: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onPageSelect: PropTypes.func.isRequired,
  onPageItemsSelect: PropTypes.func.isRequired,
  onSortOrder: PropTypes.func.isRequired,
  onSortBy: PropTypes.func.isRequired,
  scrollContainer: PropTypes.object,
};

EntityListMain.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default ScrollContainer(EntityListMain);
// export default EntityListMain;
