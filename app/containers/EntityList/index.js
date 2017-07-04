/*
 *
 * EntityList
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Map, List, fromJS } from 'immutable';
import { orderBy, reduce, filter, map } from 'lodash/collection';
import { flatten } from 'lodash/array';

import { getEntitySortIteratee } from 'utils/sort';

import Sidebar from 'components/basic/Sidebar';

import EntityListSidebar from 'components/EntityListSidebar';
import EntityListMain from 'components/EntityListMain';

import { isUserManager } from 'containers/App/selectors';

import appMessages from 'containers/App/messages';

import {
  groupEntities,
  getGroupedEntitiesForPage,
} from './groupFactory';

import {
  activePanelSelector,
  entitiesSelectedSelector,
} from './selectors';

import { getPager } from './pagination';

import {
  showPanel,
  saveEdits,
  selectEntity,
  selectEntities,
  updateQuery,
  updateGroup,
  updatePage,
  updateExpand,
} from './actions';

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
      onPanelSelect,
      filters,
      edits,
      location,
    } = this.props;
    // convert to JS if present
    const entities = this.props.entities && this.props.entities.toJS();
    const taxonomies = this.props.taxonomies && this.props.taxonomies.toJS();
    const connectedTaxonomies = this.props.connectedTaxonomies && this.props.connectedTaxonomies.toJS();
    const entityIdsSelected = this.props.entityIdsSelected && this.props.entityIdsSelected.toJS();
    const connections = this.props.connections &&
      reduce(this.props.connections, (memo, connection, path) => Object.assign(memo, { [path]: connection.toJS() }), {});

    // sorted entities: TODO consider moving to selector for caching?
    const entitiesSorted = dataReady && entities
      ? orderBy(entities, getEntitySortIteratee(sortBy), sortOrder)
      : [];

    // grouping and paging
    // TODO consider moving to selector for caching
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
    const pager = getPager(
      entitiesGroupedFlattened.length,
      location.query.page && parseInt(location.query.page, 10),
      location.query.items && parseInt(location.query.items, 10)
    );
    // get new page of items from items array
    const pageItems = entitiesGroupedFlattened.slice(pager.startIndex, pager.endIndex + 1);
    const entitiesGroupedForPage = getGroupedEntitiesForPage(pageItems, entitiesGrouped);

    // selected entities
    const entitiesSelected = dataReady ? map(filter(Object.values(pageItems), (item) => entityIdsSelected.indexOf(item.entity.id) >= 0), 'entity') : [];

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
              entityIdsSelected={this.props.entityIdsSelected}
              locationQuery={location.query}
              onPanelSelect={onPanelSelect}
              canEdit={isManager}
              activePanel={activePanel}
              formatLabel={this.formatLabel}
              onAssign={(associations, activeEditOption) =>
                this.props.handleEditSubmit(associations, entitiesSelected, activeEditOption)}
            />
          }
        </Sidebar>
        <EntityListMain
          dataReady={dataReady}
          entitiesTotal={entitiesSorted.length}
          entitiesGrouped={entitiesGroupedForPage}
          entityIdsSelected={this.props.entityIdsSelected}
          entitiesSelectedTotal={entitiesSelected.length}
          entityTitle={this.props.entityTitle}
          isManager={isManager}
          filters={filters}
          location={location}
          pager={pager}
          pageItems={pageItems}
          formatLabel={this.formatLabel}
          header={this.props.header}
          taxonomies={this.props.taxonomies}
          connections={connections}
          connectedTaxonomies={this.props.connectedTaxonomies}
          onTagClick={this.props.onTagClick}
          onGroupSelect={this.props.onGroupSelect}
          onSubgroupSelect={this.props.onSubgroupSelect}
          isExpandable={this.props.isExpandable}
          expandNo={this.props.expandNo}
          handleExpandLink={this.props.handleExpandLink}
          expandableColumns={this.props.expandableColumns}
          onEntitySelectAll={this.props.onEntitySelectAll}
          onEntitySelect={this.props.onEntitySelect}
          entityLinkTo={this.props.entityLinkTo}
          onPageSelect={this.props.onPageSelect}
          onSearch={this.props.onSearch}
        />
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
  entityIdsSelected: PropTypes.object,
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
      dispatch(updateExpand(typeof expandNoNew !== 'undefined'
        ? expandNoNew
        : props.expandNo + 1
      ));
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
                existingAssignments = entity.get('categories');
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
                existingAssignments = entity.get('categories');
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
