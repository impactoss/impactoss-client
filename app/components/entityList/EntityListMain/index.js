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

import { isEqual } from 'lodash/lang';

import { jumpToComponent } from 'utils/scroll-to-component';

import ContainerWithSidebar from 'components/styled/Container/ContainerWithSidebar';
import Container from 'components/styled/Container';
import Loading from 'components/Loading';
import ContentHeader from 'components/ContentHeader';
import { STATES as CHECKBOX_STATES } from 'components/forms/IndeterminateCheckbox';

import { CONTENT_LIST } from 'containers/App/constants';

import EntityListGroups from './EntityListGroups';
import EntityListSearch from './EntityListSearch';
import EntityListOptions from './EntityListOptions';
import EntityListHeader from './EntityListHeader';
import EntityListFooter from './EntityListFooter';
import { makeCurrentFilters } from './filtersFactory';
import { makeGroupOptions } from './group-options';
import { getHeaderColumns } from './header';

import messages from './messages';

const Content = styled.div`
  padding: 0 4em;
`;
const ListEntities = styled.div``;
const ListWrapper = styled.div``;

class EntityListMain extends React.Component { // eslint-disable-line react/prefer-stateless-function
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props.entitiesGrouped, nextProps.entitiesGrouped)
      || !isEqual(this.props.locationQuery, nextProps.locationQuery)
      || !isEqual(this.props.scrollContainer, nextProps.scrollContainer)
      || this.props.entityIdsSelected !== nextProps.entityIdsSelected
      || this.props.dataReady !== nextProps.dataReady;
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
      dataReady,
      entitiesTotal,
      entitiesSelectedTotal,
      pageItemsTotal,
      entityTitle,
      isManager,
      filters,
      locationQuery,
      pager,
      formatLabel,
      header,
      onTagClick,
      onGroupSelect,
      onSubgroupSelect,
      isExpandable,
      expandNo,
      onExpand,
      expandableColumns,
      onEntitySelectAll,
      onEntitySelect,
      onPageSelect,
      onSearch,
    } = this.props;
    // console.log('EntityListMain.render')
    const taxonomies = this.props.taxonomies && this.props.taxonomies.toJS();
    const connections = this.props.connections && this.props.connections.toJS();
    const connectedTaxonomies = this.props.connectedTaxonomies && this.props.connectedTaxonomies.toJS();

    // convert to JS if present
    let allChecked = CHECKBOX_STATES.INDETERMINATE;
    if (dataReady) {
      if (entitiesSelectedTotal === 0) {
        allChecked = CHECKBOX_STATES.UNCHECKED;
      } else if (pageItemsTotal > 0 && entitiesSelectedTotal === pageItemsTotal) {
        allChecked = CHECKBOX_STATES.CHECKED;
      }
    }
    let listHeaderLabel = entityTitle.plural;
    if (dataReady) {
      if (entitiesSelectedTotal === 1) {
        listHeaderLabel = `${entitiesSelectedTotal} ${entityTitle.single} selected`;
      } else if (entitiesSelectedTotal > 1) {
        listHeaderLabel = `${entitiesSelectedTotal} ${entityTitle.plural} selected`;
      }
    }

    return (
      <ContainerWithSidebar innerRef={(node) => { this.ScrollContainer = node; }} >
        <Container innerRef={(node) => { this.ScrollReference = node; }}>
          <Content>
            <ContentHeader
              type={CONTENT_LIST}
              icon={header.icon}
              supTitle={header.supTitle}
              title={dataReady
                ? `${entitiesTotal} ${entitiesTotal === 1 ? entityTitle.single : entityTitle.plural}`
                : entityTitle.plural
              }
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
                    onSelect={(checked) => onEntitySelectAll(checked)}
                  />
                  <EntityListGroups
                    scrollContainer={this.props.scrollContainer}
                    entitiesGrouped={this.props.entitiesGrouped}
                    entityIdsSelected={this.props.entityIdsSelected}
                    taxonomies={this.props.taxonomies}
                    entityLinkTo={this.props.entityLinkTo}
                    filters={filters}
                    locationQuery={locationQuery}
                    header={header}
                    isManager={isManager}
                    onTagClick={onTagClick}
                    onEntitySelect={onEntitySelect}
                    expandNo={expandNo}
                    isExpandable={isExpandable}
                    expandableColumns={expandableColumns}
                    onExpand={onExpand}
                  />
                  <EntityListFooter
                    pager={pager}
                    onPageSelect={(page) => {
                      this.scrollToTop();
                      onPageSelect(page);
                    }}
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
  taxonomies: PropTypes.instanceOf(Map),
  connections: PropTypes.instanceOf(Map),
  connectedTaxonomies: PropTypes.instanceOf(Map),
  entityIdsSelected: PropTypes.instanceOf(List),
  // object/arrays
  pager: PropTypes.object,
  filters: PropTypes.object,
  header: PropTypes.object,
  locationQuery: PropTypes.object,
  entityTitle: PropTypes.object, // single/plural
  expandableColumns: PropTypes.array,
  entitiesGrouped: PropTypes.array,
  // primitive
  dataReady: PropTypes.bool,
  entityLinkTo: PropTypes.string,
  isExpandable: PropTypes.bool,
  expandNo: PropTypes.number,
  isManager: PropTypes.bool,
  entitiesTotal: PropTypes.number,
  entitiesSelectedTotal: PropTypes.number,
  pageItemsTotal: PropTypes.number,
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
