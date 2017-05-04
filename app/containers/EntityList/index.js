/*
 *
 * EntityList
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { orderBy, find, map, forEach, reduce } from 'lodash/collection';
import { pick } from 'lodash/object';
import { cloneDeep } from 'lodash/lang';

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

import { makeFilterGroups } from './filterGroupsFactory';
import { makeEditGroups } from './editGroupsFactory';
import { makeActiveFilterOptions } from './filterOptionsFactory';
import { makeActiveEditOptions } from './editOptionsFactory';
import { makeCurrentFilters } from './filtersFactory';

import {
  FILTER_FORM_MODEL,
  EDIT_FORM_MODEL,
  FILTERS_PANEL,
  EDIT_PANEL,
} from './constants';

import {
  activeFilterOptionSelector,
  activeEditOptionSelector,
  activePanelSelector,
  entitiesSelectedSelector,
} from './selectors';

import {
  showEditForm,
  hideEditForm,
  showFilterForm,
  hideFilterForm,
  showPanel,
  saveEdits,
  selectEntity,
  selectEntities,
  updateQuery,
} from './actions';

import messages from './messages';


const Styled = styled.div`
  padding:0 20px;
`;
const ListEntities = styled.div`
`;
const ListEntitiesTopFilters = styled.div`
`;
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
const ListEntitiesHeaderOptions = styled.div`
`;
const ListEntitiesHeader = styled.div`
  clear: both;
  background: #ccc
  padding: 2px 5px ;
`;
const ListEntitiesSelectAll = styled.div`
`;
const ListEntitiesMain = styled.div`
`;
const ListEntitiesEmpty = styled.div`
`;
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
const ListEntitiesHeaderOptionGroup = styled.span`
`;

export class EntityList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  getSidebarGroups = ({ activePanel, dataReady, isManager }, hasSelected) => {
    if (dataReady && activePanel === FILTERS_PANEL) {
      return makeFilterGroups(this.props, {
        attributes: this.context.intl.formatMessage(messages.filterGroupLabel.attributes),
        taxonomies: this.context.intl.formatMessage(messages.filterGroupLabel.taxonomies),
        connections: this.context.intl.formatMessage(messages.filterGroupLabel.connections),
        connectedTaxonomies: this.context.intl.formatMessage(messages.filterGroupLabel.connectedTaxonomies),
      });
    } else if (dataReady && activePanel === EDIT_PANEL && isManager && hasSelected) {
      return makeEditGroups(this.props, {
        attributes: this.context.intl.formatMessage(messages.editGroupLabel.attributes),
        taxonomies: this.context.intl.formatMessage(messages.editGroupLabel.taxonomies),
        connections: this.context.intl.formatMessage(messages.editGroupLabel.connections),
      });
    }
    return null;
  }
  getSidebarFormOptions = (props, entitiesSorted, entitiesSelected) => {
    if (props.activePanel === FILTERS_PANEL && props.activeFilterOption) {
      return makeActiveFilterOptions(entitiesSorted, props, {
        titlePrefix: this.context.intl.formatMessage(messages.filterFormTitlePrefix),
        without: this.context.intl.formatMessage(messages.filterFormWithoutPrefix),
      });
    } else if (props.isManager && props.activePanel === EDIT_PANEL && props.activeEditOption && entitiesSelected.length > 0) {
      return makeActiveEditOptions(entitiesSelected, this.props, {
        title: `${this.context.intl.formatMessage(messages.editFormTitlePrefix)} ${entitiesSelected.length} ${this.context.intl.formatMessage(messages.editFormTitlePostfix)}`,
      });
    }
    return null;
  }
  renderGroupingOptions = () => 'TODO list group options';

  render() {
    const {
      sortBy,
      sortOrder,
      activeEditOption,
      activePanel,
      dataReady,
      isManager,
      entityIdsSelected,
      onPanelSelect,
    } = this.props;
    // sorted entities
    const entitiesSorted = this.props.entities && orderBy(
      this.props.entities,
      getEntitySortIteratee(sortBy),
      sortOrder
    );
    const entitiesSelected = Object.values(pick(this.props.entities, entityIdsSelected));

    let allChecked = CHECKBOX_STATES.INDETERMINATE;
    if (entitiesSelected.length === 0) {
      allChecked = CHECKBOX_STATES.UNCHECKED;
    } else if (entitiesSorted.length > 0 && entitiesSelected.length === entitiesSorted.length) {
      allChecked = CHECKBOX_STATES.CHECKED;
    }
    let listHeaderLabel = this.props.entityTitle.plural;
    if (entitiesSelected.length === 1) {
      listHeaderLabel = `${entitiesSelected.length} ${this.props.entityTitle.single} selected`;
    } else if (entitiesSelected.length > 1) {
      listHeaderLabel = `${entitiesSelected.length} ${this.props.entityTitle.plural} selected`;
    }

    return (
      <div>
        { dataReady &&
          <EntityListSidebar
            onPanelSelect={onPanelSelect}
            canEdit={isManager}
            filtersPanel={FILTERS_PANEL}
            editPanel={EDIT_PANEL}
            activePanel={activePanel}
            panelGroups={this.getSidebarGroups(this.props, entitiesSelected.length > 0)}
            formOptions={this.getSidebarFormOptions(this.props, entitiesSorted, entitiesSelected)}
            formModel={activePanel === FILTERS_PANEL ? FILTER_FORM_MODEL : EDIT_FORM_MODEL}
            onShowForm={activePanel === FILTERS_PANEL ? this.props.onShowFilterForm : this.props.onShowEditForm}
            onHideForm={activePanel === FILTERS_PANEL ? this.props.onHideFilterForm : this.props.onHideEditForm}
            onAssign={(associations) => this.props.handleEditSubmit(associations, entitiesSelected, activeEditOption)}
            hasSelected={entitiesSelected && entitiesSelected.length > 0}
            hasEntities={entitiesSorted && entitiesSorted.length > 0}
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
                      { this.renderGroupingOptions() }
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
                    { entitiesSorted.length === 0 && this.props.location.query &&
                      <ListEntitiesEmpty>
                        No results matched your search
                      </ListEntitiesEmpty>
                    }
                    { entitiesSorted.length === 0 && !this.props.location.query &&
                      <ListEntitiesEmpty>
                        No entities yet
                      </ListEntitiesEmpty>
                    }
                    { entitiesSorted.length > 0 &&
                      <EntityListItems
                        entities={entitiesSorted}
                        entitiesSelected={entitiesSelected}
                        isSelect={isManager}
                        showDate={isManager}
                        onEntitySelect={this.props.onEntitySelect}
                        taxonomies={this.props.taxonomies}
                        entityLinkTo={this.props.entityLinkTo}
                        filters={this.props.filters}
                        onTagClick={this.props.onTagClick}
                        onExpand={this.props.onExpand}
                        expand={this.props.expand}
                        expandable={this.props.expandable}
                        expandableColumns={this.props.expandableColumns}
                      />
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
  entities: PropTypes.object.isRequired,
  filters: PropTypes.object,
  taxonomies: PropTypes.object,
  dataReady: PropTypes.bool,
  isManager: PropTypes.bool,
  header: PropTypes.object,
  sortBy: PropTypes.string,
  sortOrder: PropTypes.string,
  activeEditOption: PropTypes.object,
  onShowFilterForm: PropTypes.func.isRequired,
  onHideFilterForm: PropTypes.func.isRequired,
  onShowEditForm: PropTypes.func.isRequired,
  onHideEditForm: PropTypes.func.isRequired,
  onTagClick: PropTypes.func.isRequired,
  onExpand: PropTypes.func.isRequired,
  activePanel: PropTypes.string,
  entityIdsSelected: PropTypes.array,
  handleEditSubmit: PropTypes.func.isRequired,
  onEntitySelect: PropTypes.func.isRequired,
  onEntitySelectAll: PropTypes.func.isRequired,
  onPanelSelect: PropTypes.func.isRequired,
  location: PropTypes.object,
  entityTitle: PropTypes.object, // single/plural
  entityLinkTo: PropTypes.string,
  expandable: PropTypes.bool,
  expandableColumns: PropTypes.array,
  expand: PropTypes.number,
};

EntityList.defaultProps = {
  sortBy: 'id',
  sortOrder: 'desc',
};

EntityList.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

// attribute conditions
// query:"where=att1:value+att2:value"
const getAttributeQuery = (props) =>
  asArray(props.location.query.where).reduce((result, item) => {
    const r = result;
    const keyValue = item.split(':');
    r[keyValue[0]] = keyValue[1];
    return r;
  }, {});

const asArray = (v) => Array.isArray(v) ? v : [v];

// associative conditions
const getConnectedQuery = (props) => {
  const connected = [];
  forEach(props.location.query, (value, queryKey) => {
    // filter by associated category
    // "cat=1+2+3" catids regardless of taxonomy
    if (props.filters.taxonomies && queryKey === props.filters.taxonomies.query) {
      const condition = props.filters.taxonomies.connected;
      condition.where = asArray(value).map((catId) => ({
        [condition.whereKey]: catId,
      })); // eg { category_id: 3 }
      connected.push(condition);
    // filter by associated entity
    // "recommendations=1+2" recommendationids
    } else if (props.filters.connections && map(props.filters.connections.options, 'query').indexOf(queryKey) > -1) {
      const connectedEntity = find(
        props.filters.connections.options,
        { query: queryKey }
      );
      if (connectedEntity) {
        const condition = connectedEntity.connected;
        condition.where = asArray(value).map((connectionId) => ({
          [condition.whereKey]: connectionId,
        })); // eg { recommendation_id: 3 }
        connected.push(condition);
      }
    // filter by associated category of associated entity
    // query:"catx=recommendations:1" entitypath:catids regardless of taxonomy
    } else if (props.filters.connectedTaxonomies && queryKey === props.filters.connectedTaxonomies.query) {
      asArray(value).forEach((val) => {
        const pathValue = val.split(':');
        const connectedTaxonomy = find(
          props.filters.connectedTaxonomies.connections,
          (connection) => connection.path === pathValue[0]
        );
        if (connectedTaxonomy) {
          const condition = cloneDeep(connectedTaxonomy.connected);
          condition.connected.where = {
            [condition.connected.whereKey]: pathValue[1],
          };
          connected.push(condition);
        }
      });
    }
  });
  return connected;
};

// absent taxonomy conditions
// query:"without=1+2+3+actions" either tax-id (numeric) or table path
const getWithoutQuery = (props) =>
  asArray(props.location.query.without).map((pathOrTax) => {
    // check numeric ? taxonomy filter : related entity filter
    if (!isNaN(parseFloat(pathOrTax)) && isFinite(pathOrTax)) {
      return {
        taxonomyId: pathOrTax,
        path: props.filters.taxonomies.connected.path,
        key: props.filters.taxonomies.connected.key,
      };
    }
    if (props.filters.connections.options) {
      // related entity filter
      const connection = find(props.filters.connections.options, { query: pathOrTax });
      return connection ? connection.connected : {};
    }
    return {};
  });

const mapStateToProps = (state, props) => ({
  isManager: isUserManager(state),
  activeFilterOption: activeFilterOptionSelector(state),
  activeEditOption: activeEditOptionSelector(state),
  activePanel: activePanelSelector(state),
  entityIdsSelected: entitiesSelectedSelector(state),
  entities: getEntities(state, {
    out: 'js',
    path: props.selects.entities.path,
    where: props.location.query && props.location.query.where ? getAttributeQuery(props) : null,
    connected: props.filters && props.location.query ? getConnectedQuery(props) : null,
    without: props.location.query && props.location.query.without ? getWithoutQuery(props) : null,
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
    onShowFilterForm: (option) => {
      dispatch(hideFilterForm());
      dispatch(showFilterForm(option));
    },
    onHideFilterForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(hideFilterForm());
    },
    onShowEditForm: (option) => {
      dispatch(showEditForm(option));
    },
    onHideEditForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(hideEditForm());
    },
    onPanelSelect: (activePanel) => {
      dispatch(showPanel(activePanel));
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntityList);
