/*
 *
 * EntityListMain
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { ScrollContainer } from 'scrollmonitor-react';
// import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { map } from 'lodash/collection';
import { isEqual } from 'lodash/lang';

import { jumpToComponent } from 'utils/scroll-to-component';

import ContainerWithSidebar from 'components/basic/Container/ContainerWithSidebar';
import Container from 'components/basic/Container';
import Loading from 'components/Loading';
import ContentHeader from 'components/ContentHeader';
import EntityListGroups from 'components/EntityListGroups';
import EntityListSearch from 'components/EntityListSearch';
import EntityListOptions from 'components/EntityListOptions';
import EntityListHeader from 'components/EntityListHeader';
import EntityListFooter from 'components/EntityListFooter';
import { STATES as CHECKBOX_STATES } from 'components/forms/IndeterminateCheckbox';

import { CONTENT_LIST } from 'containers/App/constants';

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
      || !isEqual(this.props.location, nextProps.location)
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
      connections,
      entitiesTotal,
      entitiesSelectedTotal,
      pageItems,
      entityTitle,
      isManager,
      filters,
      location,
      pager,
      formatLabel,
      header,
      onTagClick,
      onGroupSelect,
      onSubgroupSelect,
      isExpandable,
      expandNo,
      handleExpandLink,
      expandableColumns,
      onEntitySelectAll,
      onEntitySelect,
      onPageSelect,
      onSearch,
    } = this.props;
    // console.log('EntityListMain.render')
    const taxonomies = this.props.taxonomies && this.props.taxonomies.toJS();
    const connectedTaxonomies = this.props.connectedTaxonomies && this.props.connectedTaxonomies.toJS();

    // convert to JS if present
    let listHeaderLabel = entityTitle.plural;
    let allChecked = CHECKBOX_STATES.INDETERMINATE;
    if (dataReady) {
      if (entitiesSelectedTotal === 0) {
        allChecked = CHECKBOX_STATES.UNCHECKED;
      } else if (pageItems.length > 0 && entitiesSelectedTotal === pageItems.length) {
        allChecked = CHECKBOX_STATES.CHECKED;
      }
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
                      location,
                      onTagClick,
                    },
                    this.context.intl.formatMessage(messages.filterFormWithoutPrefix),
                    formatLabel
                  )}
                  searchQuery={location.query.search || ''}
                  onSearch={onSearch}
                />
                <EntityListOptions
                  groupOptions={makeGroupOptions(taxonomies, connectedTaxonomies)}
                  subgroupOptions={makeGroupOptions(taxonomies)}
                  groupSelectValue={location.query.group}
                  subgroupSelectValue={location.query.subgroup}
                  onGroupSelect={onGroupSelect}
                  onSubgroupSelect={onSubgroupSelect}
                  expandLink={isExpandable
                    ? {
                      expanded: expandNo === expandableColumns.length,
                      collapsed: expandNo === 0,
                      onClick: () => handleExpandLink(
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
                      handleExpandLink
                    )}
                    isSelect={isManager}
                    isSelected={allChecked}
                    onSelect={(checked) => {
                      onEntitySelectAll(checked ? map(pageItems, (item) => item.entity.id) : []);
                    }}
                  />
                  <EntityListGroups
                    scrollContainer={this.props.scrollContainer}
                    entitiesGrouped={this.props.entitiesGrouped}
                    entityIdsSelected={this.props.entityIdsSelected}
                    taxonomies={this.props.taxonomies}
                    filters={filters}
                    locationQuery={location.query}
                    header={header}
                    entityLinkTo={this.props.entityLinkTo}
                    isManager={isManager}
                    onTagClick={onTagClick}
                    onEntitySelect={onEntitySelect}
                    expandNo={expandNo}
                    isExpandable={isExpandable}
                    expandableColumns={expandableColumns}
                    handleExpandLink={handleExpandLink}
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
  dataReady: PropTypes.bool,
  pager: PropTypes.object,
  filters: PropTypes.object,
  header: PropTypes.object,
  location: PropTypes.object,
  entityTitle: PropTypes.object, // single/plural
  entityLinkTo: PropTypes.string,
  isExpandable: PropTypes.bool,
  expandableColumns: PropTypes.array,
  expandNo: PropTypes.number,
  // select props
  isManager: PropTypes.bool,
  entitiesTotal: PropTypes.number,
  entitiesSelectedTotal: PropTypes.number,
  pageItems: PropTypes.array,
  entitiesGrouped: PropTypes.array,
  entityIdsSelected: PropTypes.object,
  taxonomies: PropTypes.object,
  connections: PropTypes.object,
  connectedTaxonomies: PropTypes.object,
  // functions
  formatLabel: PropTypes.func.isRequired,
  onEntitySelect: PropTypes.func.isRequired,
  onEntitySelectAll: PropTypes.func.isRequired,
  onTagClick: PropTypes.func.isRequired,
  handleExpandLink: PropTypes.func.isRequired,
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
