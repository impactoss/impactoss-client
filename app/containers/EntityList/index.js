/*
 *
 * EntityList
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { orderBy, reduce } from 'lodash/collection';
import { pick } from 'lodash/object';

import { Map, List, fromJS } from 'immutable';
import styled from 'styled-components';

import { getEntitySortIteratee } from 'utils/sort';

import Loading from 'components/Loading';
import PageHeader from 'components/PageHeader';
import EntityListSidebar from 'components/EntityListSidebar';
import EntityListItems from 'components/EntityListItems';
import ContainerWithSidebar from 'components/basic/Container/ContainerWithSidebar';
import Container from 'components/basic/Container';
import IndeterminateCheckbox, { STATES as CHECKBOX_STATES } from 'components/forms/IndeterminateCheckbox';

import { getEntities, isUserManager } from 'containers/App/selectors';

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

import {
  UNGROUP,
} from './constants';

import messages from './messages';

const Styled = styled.div`
  padding:0 20px;
`;
const ListEntities = styled.div``;
const ListEntitiesTopFilters = styled.div``;
const ListEntitiesHeaderOptionLinks = styled.div`
  float:right;
`;
const ListEntitiesHeaderOptionLink = styled.button`
  font-weight: bold;
  color: #EB6E51;
  font-size: 0.9;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;
const ListEntitiesHeaderOptions = styled.div``;
const ListEntitiesHeader = styled.div`
  clear: both;
  background: #ccc
  padding: 2px 5px ;
`;
const ListEntitiesSelectAll = styled.div``;
const ListEntitiesMain = styled.div``;
const ListEntitiesEmpty = styled.div``;
const Tag = styled.button`
  display: inline-block;
  background: #ccc;
  padding: 1px 6px;
  margin: 0 3px;
  border-radius: 3px;
  font-size: 0.8em;
  &:hover {
    opacity: 0.8;
  }
`;
const Button = styled(Tag)`
  cursor: pointer;
`;
const ListEntitiesHeaderOptionGroup = styled.span``;

export class EntityList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  // TODO figure out why component updates when child component (sidebar option) internal state changes
  //    possibly due to form model changes
  //    consider moving form reducer to sidebar or use local form
  // shouldComponentUpdate(nextProps) {
  //   const s_p = JSON.stringify(this.props)
  //   const s_np = JSON.stringify(nextProps)
  //   return s_np !== s_p
  // }
  renderGroupingOptions = (
    onGroupSelect,
    locationQueryGroup,
    filters,
    taxonomies,
    connectedTaxonomies,
  ) => {
    const group = locationQueryGroup || UNGROUP;

    const options = makeGroupOptions(filters, taxonomies, connectedTaxonomies, group, locationQueryGroup ? 'X Reset' : 'Group by category');

    return options.length > 1
    ? (
      <select onChange={(event) => onGroupSelect(event.target.value)} value={group} >
        { options.map((option, i) => (
          <option
            key={i}
            value={option.value}
            default={option.default}
            disabled={option.disabled}
          >
            {option.label}
          </option>)
        )}
      </select>
    )
    : null;
  };

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

    return (
      <div>
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
        <ContainerWithSidebar>
          <Container>
            <Styled>
              <PageHeader
                title={this.props.header.title}
                actions={
                  isManager
                  ? this.props.header.actions
                  : []
                }
              />
              { !dataReady &&
                <div>
                  <Loading />
                </div>
              }
              { dataReady &&
                <ListEntities>
                  <ListEntitiesTopFilters>
                    { makeCurrentFilters(this.props, this.context.intl.formatMessage(messages.filterFormWithoutPrefix)).map((filter, i) =>
                      (<Button key={i} onClick={filter.onClick}>{filter.label}</Button>)
                    )}
                  </ListEntitiesTopFilters>
                  <ListEntitiesHeaderOptions>
                    <ListEntitiesHeaderOptionGroup>
                      {
                        this.renderGroupingOptions(
                          this.props.onGroupSelect,
                          location.query.group,
                          filters,
                          taxonomies,
                          connectedTaxonomies
                        )
                      }
                    </ListEntitiesHeaderOptionGroup>
                    <ListEntitiesHeaderOptionLinks>
                      { this.props.expandable &&
                        <ListEntitiesHeaderOptionLink
                          onClick={() => this.props.onExpand(
                            this.props.expand < this.props.expandableColumns.length,
                            this.props.expandableColumns.length
                          )}
                        >
                          {`${(!this.props.expand) || this.props.expand < this.props.expandableColumns.length ? 'Implementation Plan View' : 'List View'}`}
                        </ListEntitiesHeaderOptionLink>
                      }
                    </ListEntitiesHeaderOptionLinks>
                  </ListEntitiesHeaderOptions>
                  <ListEntitiesHeader>
                    <ListEntitiesSelectAll>
                      { isManager &&
                        <span>
                          <IndeterminateCheckbox
                            id="select-all"
                            checked={allChecked}
                            onChange={(checked) => {
                              this.props.onEntitySelectAll(checked ? Object.keys(this.props.entities) : []);
                            }}
                          />
                          <label htmlFor="select-all">
                            {listHeaderLabel}
                          </label>
                        </span>
                      }
                      { !isManager &&
                        <span>{listHeaderLabel}</span>
                      }
                    </ListEntitiesSelectAll>
                  </ListEntitiesHeader>
                  <ListEntitiesMain>
                    { entitiesSorted.length === 0 && location.query &&
                      <ListEntitiesEmpty>
                        No results matched your search
                      </ListEntitiesEmpty>
                    }
                    { entitiesSorted.length === 0 && !location.query &&
                      <ListEntitiesEmpty>
                        No entities yet
                      </ListEntitiesEmpty>
                    }
                    { entitiesSorted.length > 0 &&
                      <div>
                        { entitiesGrouped.map((entityGroup, i) => (
                          <div key={i}>
                            { entityGroup.label &&
                              <h1>{entityGroup.label}</h1>
                            }
                            <EntityListItems
                              entities={entityGroup.entities}
                              entitiesSelected={entitiesSelected}
                              isSelect={isManager}
                              showDate={isManager}
                              onEntitySelect={this.props.onEntitySelect}
                              taxonomies={taxonomies}
                              entityLinkTo={this.props.entityLinkTo}
                              filters={filters}
                              onTagClick={this.props.onTagClick}
                              onExpand={this.props.onExpand}
                              expand={this.props.expand}
                              expandable={this.props.expandable}
                              expandableColumns={this.props.expandableColumns}
                            />
                          </div>
                        ))}
                      </div>
                    }
                  </ListEntitiesMain>
                </ListEntities>
              }
            </Styled>
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
  expandable: PropTypes.bool,
  expandableColumns: PropTypes.array,
  expand: PropTypes.number,
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
  onExpand: PropTypes.func.isRequired,
  onGroupSelect: PropTypes.func.isRequired,
};

EntityList.defaultProps = {
  sortBy: 'id',
  sortOrder: 'desc',
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
    onExpand: (bool, value) => {
      dispatch(updateQuery(fromJS([
        {
          query: 'expand',
          value,
          replace: bool,
          checked: bool,
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
