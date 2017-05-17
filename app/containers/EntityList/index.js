/*
 *
 * EntityList
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Map, List, fromJS } from 'immutable';
import { orderBy, reduce } from 'lodash/collection';
import { pick } from 'lodash/object';

import { getEntitySortIteratee } from 'utils/sort';

import ContainerWithSidebar from 'components/basic/Container/ContainerWithSidebar';
import Container from 'components/basic/Container';
import Sidebar from 'components/basic/Sidebar';
import Loading from 'components/Loading';
import ContentHeader from 'components/ContentHeader';
import EntityListSidebar from 'components/EntityListSidebar';
import EntityListItems from 'components/EntityListItems';
import EntityListSearch from 'components/EntityListSearch';
import EntityListOptions from 'components/EntityListOptions';
import EntityListHeader from 'components/EntityListHeader';
import { STATES as CHECKBOX_STATES } from 'components/forms/IndeterminateCheckbox';

import { getEntities, isUserManager } from 'containers/App/selectors';

import { CONTENT_LIST } from 'containers/App/constants';

import { makeCurrentFilters } from './filtersFactory';
import {
  makeEntityGroups,
  makeGroupOptions,
} from './groupFactory';

import {
  getAttributeQuery,
  getConnectedQuery,
  getWithoutQuery,
} from './entityQueries';

import {
  activePanelSelector,
  entitiesSelectedSelector,
} from './selectors';

import {
  showPanel,
  saveEdits,
  selectEntity,
  selectEntities,
  updateQuery,
  updateGroup,
} from './actions';

import messages from './messages';

const Content = styled.div`
  padding: 0 4em;
`;


const ListEntities = styled.div``;
const ListEntitiesMain = styled.div`
  padding-top: 0.5em;
`;
const ListEntitiesEmpty = styled.div``;
const ListEntitiesGroup = styled.div``;
const ListEntitiesGroupHeader = styled.h3``;

export class EntityList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  // TODO figure out why component updates when child component (sidebar option) internal state changes
  //    possibly due to form model changes
  //    consider moving form reducer to sidebar or use local form
  // shouldComponentUpdate(nextProps) {
  //   const s_p = JSON.stringify(this.props)
  //   const s_np = JSON.stringify(nextProps)
  //   return s_np !== s_p
  // }

  getHeaderColumns = (label, isSelect, isExpandable, expandNo, expandableColumns, handleExpandLink) => {
    // TODO figure out a betterway to determine column widths. this is terrible
    let width = 1;
    // if nested
    if (isExpandable && expandableColumns.length > 0) {
      width = expandNo > 0 ? 0.5 : 0.66;
    }
    const columns = [{
      label,
      isSelect,
      width,
    }];
    if (isExpandable) {
      const exColumns = expandableColumns.map((col, i, exCols) => {
        const isExpand = expandNo > i;
        width = 1;
        // if nested
        if (exCols.length > i + 1) {
          // if nested && nestedExpanded
          if (expandNo > i + 1) {
            width = 0.5;
          // else if nested && !nestedExpanded
          } else if (isExpand) {
            width = 0.66;
          } else {
            width = 0.5;
          }
        // else if !nested // isExpand
        } else if (isExpand) {
          if (exCols.length > 1) {
            width = 0.5;
          }
        } else if (exCols.length > 1) {
          if (expandNo === i) {
            width = 0.34;
          } else {
            width = 0.5;
          }
        }

        return {
          label: col.label,
          isExpandable: true,
          isExpand,
          onExpand: () => handleExpandLink(isExpand ? i : i + 1),
          width,
        };
      });
      return columns.concat(exColumns);
    }
    return columns;
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
      taxonomies,
      connections,
      connectedTaxonomies,
    } = this.props;

    // sorted entities
    const entitiesSorted = dataReady && this.props.entities
        ? orderBy(this.props.entities, getEntitySortIteratee(sortBy), sortOrder)
        : [];
    // grouped entities
    const entitiesGrouped = dataReady && this.props.entities
      ? makeEntityGroups(entitiesSorted, taxonomies, connectedTaxonomies, filters, location.query.group)
      : [];

    // selected entities
    const entitiesSelected = dataReady ? Object.values(pick(this.props.entities, entityIdsSelected)) : [];

    let allChecked = CHECKBOX_STATES.INDETERMINATE;
    let listHeaderLabel = this.props.entityTitle.plural;

    if (dataReady) {
      if (entitiesSelected.length === 0) {
        allChecked = CHECKBOX_STATES.UNCHECKED;
      } else if (entitiesSorted.length > 0 && entitiesSelected.length === entitiesSorted.length) {
        allChecked = CHECKBOX_STATES.CHECKED;
      }
      if (entitiesSelected.length === 1) {
        listHeaderLabel = `${entitiesSelected.length} ${this.props.entityTitle.single} selected`;
      } else if (entitiesSelected.length > 1) {
        listHeaderLabel = `${entitiesSelected.length} ${this.props.entityTitle.plural} selected`;
      }
    }
    let contentTitle = this.props.entityTitle.plural;
    if (dataReady) {
      contentTitle = `${entitiesSorted.length} ${entitiesSorted.length === 1 ? this.props.entityTitle.single : this.props.entityTitle.plural}`;
    }

    const buttons = dataReady && isManager
      ? this.props.header.actions
      : null;

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
              entitiesSelected={entitiesSelected}
              location={location}
              onPanelSelect={onPanelSelect}
              canEdit={isManager}
              activePanel={activePanel}
              onAssign={(associations, activeEditOption) =>
                this.props.handleEditSubmit(associations, entitiesSelected, activeEditOption)}
            />
          }
        </Sidebar>
        <ContainerWithSidebar>
          <Container>
            <Content>
              <ContentHeader
                type={CONTENT_LIST}
                icon={this.props.header.icon}
                supTitle={this.props.header.supTitle}
                title={contentTitle}
                buttons={buttons}
              />
              { !dataReady &&
                <Loading />
              }
              { dataReady &&
                <ListEntities>
                  <EntityListSearch
                    filters={makeCurrentFilters(this.props, this.context.intl.formatMessage(messages.filterFormWithoutPrefix))}
                    searchQuery={location.query.search || ''}
                    onSearch={this.props.onSearch}
                  />
                  <EntityListOptions
                    groupSelectValue={location.query.group}
                    groupOptions={makeGroupOptions(filters, taxonomies, connectedTaxonomies)}
                    onGroupSelect={this.props.onGroupSelect}
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
                  <EntityListHeader
                    columns={this.getHeaderColumns(
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
                      this.props.onEntitySelectAll(checked ? Object.keys(this.props.entities) : []);
                    }}
                  />
                  <ListEntitiesMain>
                    { entitiesSorted.length === 0 && location.query &&
                      <ListEntitiesEmpty>
                        <FormattedMessage {...messages.listEmptyAfterQuery} />
                      </ListEntitiesEmpty>
                    }
                    { entitiesSorted.length === 0 && !location.query &&
                      <ListEntitiesEmpty>
                        <FormattedMessage {...messages.listEmpty} />
                      </ListEntitiesEmpty>
                    }
                    { entitiesSorted.length > 0 &&
                      entitiesGrouped.map((entityGroup, i) => (
                        <ListEntitiesGroup key={i}>
                          { location.query.group && entityGroup.label &&
                            <ListEntitiesGroupHeader>
                              {entityGroup.label}
                            </ListEntitiesGroupHeader>
                          }
                          <EntityListItems
                            taxonomies={taxonomies}
                            associations={filters}
                            entities={entityGroup.entities}
                            entitiesSelected={entitiesSelected}
                            entityIcon={this.props.header.icon}
                            entityLinkTo={this.props.entityLinkTo}
                            isSelect={isManager}
                            onTagClick={this.props.onTagClick}
                            onEntitySelect={this.props.onEntitySelect}
                            expandNo={this.props.expandNo}
                            isExpandable={this.props.isExpandable}
                            expandableColumns={this.props.expandableColumns}
                            onExpand={this.props.handleExpandLink}
                          />
                        </ListEntitiesGroup>
                      ))
                    }
                  </ListEntitiesMain>
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
  onSearch: PropTypes.func.isRequired,
};

EntityList.defaultProps = {
  sortBy: 'id',
  sortOrder: 'desc',
  expandNo: 0,
};

EntityList.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  isManager: isUserManager(state),
  activePanel: activePanelSelector(state),
  entityIdsSelected: entitiesSelectedSelector(state),
  entities: getEntities(state, {
    out: 'js',
    path: props.selects.entities.path,
    where: props.location.query && props.location.query.where
      ? getAttributeQuery(props.location.query.where)
      : null,
    connected: props.filters && props.location.query
      ? getConnectedQuery(props.location.query, props.filters)
      : null,
    without: props.location.query && props.location.query.without
      ? getWithoutQuery(props.location.query.without, props.filters)
      : null,
    search: props.location.query && props.location.query.search
      ? {
        query: props.location.query.search,
        fields: props.filters.search,
      }
      : null,
    extend: props.selects.entities.extensions,
  }),
  taxonomies: props.selects && props.selects.taxonomies
    ? getEntities(state, props.selects.taxonomies)
    : null,
  connections: props.selects && props.selects.connections
    ? reduce(props.selects.connections.options, (result, option) => {
      const path = typeof option === 'string' ? option : option.path;
      return {
        ...result,
        [path]: getEntities(state, {
          out: 'js',
          path,
        }),
      };
    }, {})
    : null,
  connectedTaxonomies: props.selects && props.selects.connectedTaxonomies
  ? reduce(props.selects.connectedTaxonomies.options, (result, select) => ({
    ...result,
    [select.path]: getEntities(state, select),
  }), {})
  : null,
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
            .set('path', props.selects.entities.path)
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
