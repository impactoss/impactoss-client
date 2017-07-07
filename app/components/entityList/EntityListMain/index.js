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

import { CONTENT_LIST } from 'containers/App/constants';

import EntityListGroups from './EntityListGroups';
import EntityListSearch from './EntityListSearch';
import EntityListOptions from './EntityListOptions';
import { makeCurrentFilters } from './filtersFactory';
import { makeGroupOptions } from './group-options';


import messages from './messages';

const Content = styled.div`
  padding: 0 4em;
`;
const ListEntities = styled.div``;
const ListWrapper = styled.div``;

class EntityListMain extends React.Component { // eslint-disable-line react/prefer-stateless-function
  shouldComponentUpdate(nextProps) {
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
      filters,
      header,
      entityTitle,
      expandableColumns,
      dataReady,
      isExpandable,
      isManager,
      formatLabel,
      onGroupSelect,
      onSubgroupSelect,
      onExpand,
      onSearch,
      onTagClick,
    } = this.props;

    const locationQuery = this.props.locationQuery && this.props.locationQuery.toJS();
    const taxonomies = this.props.taxonomies && this.props.taxonomies.toJS();
    const connections = this.props.connections && this.props.connections.toJS();
    const connectedTaxonomies = this.props.connectedTaxonomies && this.props.connectedTaxonomies.toJS();

    const expandNo = parseInt(locationQuery.expand, 10);

    const headerTitle = this.props.entities && dataReady
      ? `${this.props.entities.size} ${this.props.entities.size === 1 ? entityTitle.single : entityTitle.plural}`
      : entityTitle.plural;
// <ContainerWithSidebar>
// <Container>
    return (
      <ContainerWithSidebar innerRef={(node) => { this.ScrollContainer = node; }} >
        <Container innerRef={(node) => { this.ScrollReference = node; }}>
          <Content>
            <ContentHeader
              type={CONTENT_LIST}
              icon={header.icon}
              supTitle={header.supTitle}
              title={headerTitle}
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
                  filters={makeCurrentFilters(
                    {
                      filters,
                      taxonomies,
                      connections,
                      connectedTaxonomies,
                      locationQuery,
                      onTagClick,
                    },
                    this.context.intl.formatMessage(messages.filterFormWithoutPrefix),
                    formatLabel
                  )}
                  searchQuery={locationQuery.search || ''}
                  onSearch={onSearch}
                />
                <EntityListOptions
                  groupOptions={makeGroupOptions(taxonomies, connectedTaxonomies)}
                  subgroupOptions={makeGroupOptions(taxonomies)}
                  groupSelectValue={locationQuery.group}
                  subgroupSelectValue={locationQuery.subgroup}
                  onGroupSelect={onGroupSelect}
                  onSubgroupSelect={onSubgroupSelect}
                  expandLink={isExpandable
                    ? {
                      expanded: expandNo === expandableColumns.length,
                      collapsed: expandNo === 0,
                      onClick: () => onExpand(
                        expandNo < expandableColumns.length
                        ? expandableColumns.length
                        : 0
                      ),
                    }
                    : null
                  }
                />
                <ListWrapper innerRef={(node) => { this.ScrollTarget = node; }}>
                  <EntityListGroups
                    entities={this.props.entities}
                    taxonomies={this.props.taxonomies}
                    connectedTaxonomies={this.props.connectedTaxonomies}
                    entityIdsSelected={this.props.entityIdsSelected}
                    locationQuery={this.props.locationQuery}
                    entityLinkTo={this.props.entityLinkTo}
                    entityTitle={entityTitle}
                    filters={filters}
                    header={header}
                    isManager={isManager}
                    isExpandable={isExpandable}
                    expandableColumns={expandableColumns}
                    onExpand={onExpand}
                    onTagClick={onTagClick}
                    onPageSelect={(page) => {
                      this.scrollToTop();
                      this.props.onPageSelect(page);
                    }}
                    onEntitySelect={this.props.onEntitySelect}
                    onEntitySelectAll={this.props.onEntitySelectAll}
                    scrollContainer={this.props.scrollContainer}
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
  filters: PropTypes.object,
  header: PropTypes.object,
  entityTitle: PropTypes.object, // single/plural
  expandableColumns: PropTypes.array,
  // primitive
  dataReady: PropTypes.bool,
  entityLinkTo: PropTypes.string,
  isExpandable: PropTypes.bool,
  isManager: PropTypes.bool,
  // functions
  formatLabel: PropTypes.func.isRequired,
  onEntitySelect: PropTypes.func.isRequired,
  onEntitySelectAll: PropTypes.func.isRequired,
  onTagClick: PropTypes.func.isRequired,
  onExpand: PropTypes.func.isRequired,
  onGroupSelect: PropTypes.func.isRequired,
  onSubgroupSelect: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onPageSelect: PropTypes.func.isRequired,
  scrollContainer: PropTypes.object,
};

EntityListMain.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default ScrollContainer(EntityListMain);
// export default EntityListMain;
