/*
 *
 * EntityList
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Map, List, fromJS } from 'immutable';
import { orderBy, reduce, filter, map } from 'lodash/collection';
import { flatten } from 'lodash/array';

import { jumpToComponent } from 'utils/scroll-to-component';
import { getEntitySortIteratee } from 'utils/sort';

import ContainerWithSidebar from 'components/basic/Container/ContainerWithSidebar';
import Container from 'components/basic/Container';
import Sidebar from 'components/basic/Sidebar';
import Loading from 'components/Loading';
import ContentHeader from 'components/ContentHeader';
import EntityListSidebar from 'components/EntityListSidebar';
import EntityListGroups from 'components/EntityListGroups';
import EntityListSearch from 'components/EntityListSearch';
import EntityListOptions from 'components/EntityListOptions';
import EntityListHeader from 'components/EntityListHeader';
import EntityListFooter from 'components/EntityListFooter';
import { STATES as CHECKBOX_STATES } from 'components/forms/IndeterminateCheckbox';

import { isUserManager } from 'containers/App/selectors';

import { CONTENT_LIST } from 'containers/App/constants';

import appMessages from 'containers/App/messages';

import { makeCurrentFilters } from './filtersFactory';
import {
  makeGroupOptions,
  groupEntities,
  getGroupedEntitiesForPage,
} from './groupFactory';

import {
  activePanelSelector,
  entitiesSelectedSelector,
} from './selectors';

import { getPager } from './pagination';
import { getHeaderColumns } from './header';

import {
  showPanel,
  saveEdits,
  selectEntity,
  selectEntities,
  updateQuery,
  updateGroup,
  updatePage,
} from './actions';

import messages from './messages';

const Content = styled.div`
  padding: 0 4em;
`;
const ListEntities = styled.div``;
const ListWrapper = styled.div``;

export class EntityList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  // TODO figure out why component updates when child component (sidebar option) internal state changes
  //    possibly due to form model changes
  //    consider moving form reducer to sidebar or use local form
  // shouldComponentUpdate(nextProps) {
  //   const s_p = JSON.stringify(this.props)
  //   const s_np = JSON.stringify(nextProps)
  //   return s_np !== s_p
  // }
  // shouldComponentUpdate(nextProps) {
  //   console.log('-------------------------')
  //   console.log('componentWillReceiveProps')
  //   console.log(nextProps.entities === this.props.entities, 'immutable map equal')
  //   const update = JSON.stringify(this.props) !== JSON.stringify(nextProps);
  //   console.log(!update, 'stringified objects equal')
  //   return update
  // }
  // componentWillReceiveProps(nextProps) {
  //   console.log('-------------------------')
  //   console.log('componentWillReceiveProps')
  //   console.log(nextProps.entities === this.props.entities, 'immutable map equal')
  //   console.log(JSON.stringify(nextProps.entities) === JSON.stringify(this.props.entities), 'stringified objects equal')
  // }
  scrollToTop = () => {
    jumpToComponent(
      this.ScrollTarget,
      this.ScrollReference,
      this.ScrollContainer
    );
  }

  formatLabel = (path) => {
    const message = path.split('.').reduce((m, key) => m[key] || m, appMessages);
    return this.context.intl.formatMessage(message);
  }

  render() {
    const {
      sortBy,
      sortOrder,
      activePanel,
      dataReady,
      isManager,
      entityIdsSelected,
      onPanelSelect,
      filters,
      edits,
      location,
    } = this.props;
    // console.log('entityList:render')
    // convert to JS if present
    const entities = this.props.entities && this.props.entities.toJS();
    const taxonomies = this.props.taxonomies && this.props.taxonomies.toJS();
    const connections = this.props.connections &&
      reduce(this.props.connections, (memo, connection, path) => Object.assign(memo, { [path]: connection.toJS() }), {});
    let connectedTaxonomies = this.props.connectedTaxonomies && this.props.connectedTaxonomies.toJS();

    // do not list 'own' taxonomies in connected taxonomies
    connectedTaxonomies = dataReady && connectedTaxonomies && taxonomies
      && reduce(connectedTaxonomies, (filteredTaxonomies, tax, key) =>
          Object.keys(taxonomies).indexOf(key) < 0
            ? Object.assign(filteredTaxonomies, { [key]: tax })
            : filteredTaxonomies
        , {});

    // sorted entities
    const entitiesSorted = dataReady && entities
      ? orderBy(entities, getEntitySortIteratee(sortBy), sortOrder)
      : [];

    // grouping and paging
    const entitiesGrouped = entitiesSorted.length > 0
      ? groupEntities(entitiesSorted, taxonomies, connectedTaxonomies, filters, location.query)
      : [];
    const entitiesGroupedFlattened = flatten(entitiesGrouped.map((group, gIndex) => group.entitiesGrouped
      ? flatten(group.entitiesGrouped.map((subgroup, sgIndex) =>
        subgroup.entities.map((entity) => ({ group: gIndex, subgroup: sgIndex, entity }))
      ))
      : group.entities.map((entity) => ({ group: gIndex, entity }))
    ));
    // get new pager object for specified page
    const pager = getPager(entitiesGroupedFlattened.length, location.query.page && parseInt(location.query.page, 10));
    // get new page of items from items array
    const pageItems = entitiesGroupedFlattened.slice(pager.startIndex, pager.endIndex + 1);
    const entitiesGroupedPaged = getGroupedEntitiesForPage(pageItems, entitiesGrouped);
    // console.log('entitiesGrouped', entitiesGrouped)
    // console.log('entitiesGroupedPaged', entitiesGroupedPaged)

    // selected entities
    const entitiesSelected = dataReady ? map(filter(Object.values(pageItems), (item) => entityIdsSelected.indexOf(item.entity.id) >= 0), 'entity') : [];
    let allChecked = CHECKBOX_STATES.INDETERMINATE;
    let listHeaderLabel = this.props.entityTitle.plural;
    if (dataReady) {
      if (entitiesSelected.length === 0) {
        allChecked = CHECKBOX_STATES.UNCHECKED;
      } else if (pageItems.length > 0 && entitiesSelected.length === pageItems.length) {
        allChecked = CHECKBOX_STATES.CHECKED;
      }
      if (entitiesSelected.length === 1) {
        listHeaderLabel = `${entitiesSelected.length} ${this.props.entityTitle.single} selected`;
      } else if (entitiesSelected.length > 1) {
        listHeaderLabel = `${entitiesSelected.length} ${this.props.entityTitle.plural} selected`;
      }
    }

    return (
      <div>
        <Sidebar>
          { dataReady &&
            <EntityListSidebar
              filters={filters}
              edits={edits}
              taxonomies={taxonomies}
              connections={connections}
              connectedTaxonomies={connectedTaxonomies}
              entitiesSorted={entitiesSorted}
              entityIdsSelected={entityIdsSelected}
              location={location}
              onPanelSelect={onPanelSelect}
              canEdit={isManager}
              activePanel={activePanel}
              formatLabel={this.formatLabel}
              onAssign={(associations, activeEditOption) =>
                this.props.handleEditSubmit(associations, entitiesSelected, activeEditOption)}
            />
          }
        </Sidebar>
        <ContainerWithSidebar innerRef={(node) => { this.ScrollContainer = node; }}>
          <Container innerRef={(node) => { this.ScrollReference = node; }}>
            <Content>
              <ContentHeader
                type={CONTENT_LIST}
                icon={this.props.header.icon}
                supTitle={this.props.header.supTitle}
                title={dataReady
                  ? `${entitiesSorted.length} ${entitiesSorted.length === 1 ? this.props.entityTitle.single : this.props.entityTitle.plural}`
                  : this.props.entityTitle.plural
                }
                buttons={dataReady && isManager
                  ? this.props.header.actions
                  : null
                }
              />
              { !dataReady &&
                <Loading />
              }
              { dataReady &&
                <ListEntities>
                  <EntityListSearch
                    filters={makeCurrentFilters(
                      {
                        filters,
                        taxonomies,
                        connections,
                        connectedTaxonomies,
                        location,
                        onTagClick: this.props.onTagClick,
                      },
                      this.context.intl.formatMessage(messages.filterFormWithoutPrefix),
                      this.formatLabel
                    )}
                    searchQuery={location.query.search || ''}
                    onSearch={this.props.onSearch}
                  />
                  <EntityListOptions
                    groupOptions={makeGroupOptions(taxonomies, connectedTaxonomies)}
                    subgroupOptions={makeGroupOptions(taxonomies)}
                    groupSelectValue={location.query.group}
                    subgroupSelectValue={location.query.subgroup}
                    onGroupSelect={this.props.onGroupSelect}
                    onSubgroupSelect={this.props.onSubgroupSelect}
                    expandLink={this.props.isExpandable
                      ? {
                        expanded: this.props.expandNo === this.props.expandableColumns.length,
                        collapsed: this.props.expandNo === 0,
                        onClick: () => this.props.handleExpandLink(
                          this.props.expandNo < this.props.expandableColumns.length
                          ? this.props.expandableColumns.length
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
                        this.props.isExpandable,
                        this.props.expandNo,
                        this.props.expandableColumns,
                        this.props.handleExpandLink
                      )}
                      isSelect={isManager}
                      isSelected={allChecked}
                      onSelect={(checked) => {
                        this.props.onEntitySelectAll(checked ? map(pageItems, (item) => item.entity.id) : []);
                      }}
                    />
                    <EntityListGroups
                      entitiesGrouped={entitiesGroupedPaged}
                      entitiesSorted={entitiesSorted}
                      entityIdsSelected={entityIdsSelected}
                      taxonomies={taxonomies}
                      connectedTaxonomies={connectedTaxonomies}
                      filters={filters}
                      locationQuery={location.query}
                      header={this.props.header}
                      entityLinkTo={this.props.entityLinkTo}
                      isManager={this.props.isManager}
                      onTagClick={this.props.onTagClick}
                      onEntitySelect={this.props.onEntitySelect}
                      expandNo={this.props.expandNo}
                      isExpandable={this.props.isExpandable}
                      expandableColumns={this.props.expandableColumns}
                      handleExpandLink={this.props.handleExpandLink}
                    />
                    <EntityListFooter
                      pager={pager}
                      onPageSelect={(page) => {
                        this.scrollToTop();
                        this.props.onPageSelect(page);
                      }}
                    />
                  </ListWrapper>
                </ListEntities>
              }
            </Content>
          </Container>
        </ContainerWithSidebar>
      </div>
    );
  }
}

EntityList.propTypes = {
  filters: PropTypes.object,
  edits: PropTypes.object,
  dataReady: PropTypes.bool,
  header: PropTypes.object,
  sortBy: PropTypes.string,
  sortOrder: PropTypes.string,
  location: PropTypes.object,
  entityTitle: PropTypes.object, // single/plural
  entityLinkTo: PropTypes.string,
  isExpandable: PropTypes.bool,
  expandableColumns: PropTypes.array,
  expandNo: PropTypes.number,
  // select props
  activePanel: PropTypes.string,
  isManager: PropTypes.bool,
  entities: PropTypes.object.isRequired,
  entityIdsSelected: PropTypes.array,
  taxonomies: PropTypes.object,
  connections: PropTypes.object,
  connectedTaxonomies: PropTypes.object,
  // dispatch props
  onPanelSelect: PropTypes.func.isRequired,
  handleEditSubmit: PropTypes.func.isRequired,
  onEntitySelect: PropTypes.func.isRequired,
  onEntitySelectAll: PropTypes.func.isRequired,
  onTagClick: PropTypes.func.isRequired,
  handleExpandLink: PropTypes.func.isRequired,
  onGroupSelect: PropTypes.func.isRequired,
  onSubgroupSelect: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onPageSelect: PropTypes.func.isRequired,
};

EntityList.defaultProps = {
  sortBy: 'id',
  sortOrder: 'desc',
  expandNo: 0,
};

EntityList.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  isManager: isUserManager(state),
  activePanel: activePanelSelector(state),
  entityIdsSelected: entitiesSelectedSelector(state),
});

function mapDispatchToProps(dispatch, props) {
  return {
    onPanelSelect: (activePanel) => {
      dispatch(showPanel(activePanel));
    },
    onEntitySelect: (id, checked) => {
      dispatch(selectEntity({ id, checked }));
    },
    onEntitySelectAll: (ids) => {
      dispatch(selectEntities(ids));
    },
    onTagClick: (value) => {
      dispatch(updateQuery(fromJS([value])));
    },
    handleExpandLink: (expandNoNew) => {
      // default expand by 1
      const value = typeof expandNoNew !== 'undefined' ? expandNoNew : props.expandNo + 1;
      dispatch(updateQuery(fromJS([{
        query: 'expand',
        value,
        replace: true,
        checked: value > 0,
      }])));
    },
    onSearch: (value) => {
      dispatch(updateQuery(fromJS([
        {
          query: 'search',
          value,
          replace: true,
          checked: value !== '',
        },
      ])));
    },
    onGroupSelect: (value) => {
      dispatch(updateGroup(fromJS([
        {
          query: 'group',
          value,
        },
      ])));
      if (value === '') {
        dispatch(updateGroup(fromJS([
          {
            query: 'subgroup',
            value,
          },
        ])));
      }
    },
    onSubgroupSelect: (value) => {
      dispatch(updateGroup(fromJS([
        {
          query: 'subgroup',
          value,
        },
      ])));
    },
    onPageSelect: (page) => {
      dispatch(updatePage(page));
    },
    handleEditSubmit: (formData, selectedEntities, activeEditOption) => {
      const entities = fromJS(selectedEntities);
      let saveData = Map();
      const changes = formData.get('values').filter((option) => option.get('hasChanged'));
      const creates = changes
        .filter((option) => option.get('checked') === true)
        .map((option) => option.get('value'));
      const deletes = changes
        .filter((option) => option.get('checked') === false)
        .map((option) => option.get('value'));

      if (activeEditOption.group === 'attributes') {
        if (creates.size > 0) {
          const newValue = creates.first(); // take the first TODO multiselect should be run in single value mode and only return 1 value
          saveData = saveData
            .set('attributes', true)
            .set('path', props.path)
            .set('entities', entities.reduce((updatedEntities, entity) =>
              entity.getIn(['attributes', activeEditOption.optionId]) !== newValue
                ? updatedEntities.push(entity.setIn(['attributes', activeEditOption.optionId], newValue))
                : updatedEntities
            , List()));
        }
      } else {
        // associations
        saveData = saveData
          .set('attributes', false)
          .set('path', activeEditOption.path)
          .set('updates', Map({
            create: List(),
            delete: List(),
          }));

        if (creates.size > 0) {
          saveData = saveData.setIn(['updates', 'create'], entities.reduce((createList, entity) => {
            let changeSet = List();
            let existingAssignments;
            switch (activeEditOption.group) {
              case ('taxonomies'):
                existingAssignments = entity.get(activeEditOption.group);
                break;
              case ('connections'):
                existingAssignments = entity.get(activeEditOption.optionId);
                break;
              default:
                existingAssignments = List();
                break;
            }

            if (!!existingAssignments && existingAssignments.size > 0) {
              const existingAssignmentIds = existingAssignments.map((assigned) =>
                assigned.getIn(['attributes', activeEditOption.key]).toString()
              ).toList();
              // exclude existing relations from the changeSet
              changeSet = creates.filterNot((id) => existingAssignmentIds.includes(id.toString()));
            } else {
              changeSet = creates; // add for all creates
            }

            return createList.concat(changeSet.map((change) => ({
              [activeEditOption.ownKey]: entity.get('id'),
              [activeEditOption.key]: change,
            })));
          }, List()));
        }
        if (deletes.size > 0) {
          saveData = saveData.setIn(['updates', 'delete'], entities.reduce((deleteList, entity) => {
            let changeSet = List();
            let existingAssignments;
            switch (activeEditOption.group) {
              case ('taxonomies'):
                existingAssignments = entity.get(activeEditOption.group);
                break;
              case ('connections'):
                existingAssignments = entity.get(activeEditOption.optionId);
                break;
              default:
                existingAssignments = List();
                break;
            }

            if (!!existingAssignments && existingAssignments.size > 0) {
              changeSet = existingAssignments
                .filter((assigned) =>
                  deletes.includes(assigned.getIn(['attributes', activeEditOption.key]).toString()))
                .map((assigned) => assigned.get('id'));
            }

            return deleteList.concat(changeSet);
          }, List()));
        }
      }

      dispatch(saveEdits(saveData.toJS()));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntityList);
