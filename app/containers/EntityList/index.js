/*
 *
 * EntityList
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { orderBy, find, map, forEach, reduce } from 'lodash/collection';
import { pick } from 'lodash/object';
import { upperFirst } from 'lodash/string';
import { cloneDeep } from 'lodash/lang';

import { Map, List, fromJS } from 'immutable';
import styled from 'styled-components';

import { getEntitySortIteratee } from 'utils/sort';
import { lowerCase } from 'utils/string';

import Loading from 'components/Loading';
import PageHeader from 'components/PageHeader';
import EntityListSidebar from 'components/EntityListSidebar';
import EntityListSidebarFilters from 'components/EntityListSidebarFilters';
import EntityListSidebarEdit from 'components/EntityListSidebarEdit';
import EntityListItems from 'components/EntityListItems';
import ContainerWithSidebar from 'components/basic/Container/ContainerWithSidebar';
import Container from 'components/basic/Container';
import IndeterminateCheckbox, { STATES as CHECKBOX_STATES } from 'components/forms/IndeterminateCheckbox';

import { getEntities, isUserManager } from 'containers/App/selectors';

import { makeFilterGroups } from './filterGroupsFactory';
import { makeEditGroups } from './editGroupsFactory';
import { makeActiveFilterOptions } from './filterOptionsFactory';
import { makeActiveEditOptions } from './editOptionsFactory';

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
const ListEntitiesHeader = styled.div`
`;
const ListEntitiesHeaderOptions = styled.div`
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
export class EntityList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  renderCurrentTaxonomyFilters = (taxonomyFilters, taxonomies, locationQuery, onClick, messagesRendered) => {
    const tags = [];
    if (locationQuery[taxonomyFilters.query]) {
      const locationQueryValue = locationQuery[taxonomyFilters.query];
      forEach(taxonomies, (taxonomy) => {
        forEach(Array.isArray(locationQueryValue) ? locationQueryValue : [locationQueryValue], (queryValue) => {
          const value = parseInt(queryValue, 10);
          if (taxonomy.categories[value]) {
            const category = taxonomy.categories[value];
            let label = (category.attributes.short_title && category.attributes.short_title.trim().length > 0
              ? category.attributes.short_title
              : category.attributes.title || category.attributes.name);
            label = label.length > 10 ? `${label.substring(0, 10)}...` : label;
            tags.push({
              label: `${label} X`,
              onClick: () => onClick({
                value,
                query: taxonomyFilters.query,
                checked: false,
              }),
            });
          }
        });
      });
    }
    if (locationQuery.without) {
      const locationQueryValue = locationQuery.without;
      forEach(taxonomies, (taxonomy) => {
        forEach(Array.isArray(locationQueryValue) ? locationQueryValue : [locationQueryValue], (queryValue) => {
          // numeric means taxonomy
          if (!isNaN(parseFloat(queryValue)) && isFinite(queryValue) && taxonomy.id === queryValue) {
            const value = parseInt(queryValue, 10);
            tags.push({
              label: `${messagesRendered.without} ${lowerCase(taxonomy.attributes.title)} X`,
              onClick: () => onClick({
                value,
                query: 'without',
                checked: false,
              }),
            });
          }
        });
      });
    }
    return (
      <span>
        {
          tags.map((tag, i) => (<Button key={i} onClick={tag.onClick}>{tag.label}</Button>))
        }
      </span>
    );
  };
  renderCurrentConnectedTaxonomyFilters = (taxonomyFilters, connectedTaxonomies, locationQuery, onClick) => {
    const tags = [];
    if (locationQuery[taxonomyFilters.query]) {
      const locationQueryValue = locationQuery[taxonomyFilters.query];
      forEach(connectedTaxonomies, (taxonomy) => {
        forEach(Array.isArray(locationQueryValue) ? locationQueryValue : [locationQueryValue], (queryValue) => {
          const valueSplit = queryValue.split(':');
          if (valueSplit.length > 0) {
            const value = parseInt(valueSplit[1], 10);
            if (taxonomy.categories[value]) {
              const category = taxonomy.categories[value];
              let label = (category.attributes.short_title && category.attributes.short_title.trim().length > 0
                ? category.attributes.short_title
                : category.attributes.title || category.attributes.name);
              label = label.length > 10 ? `${label.substring(0, 10)}...` : label;
              tags.push({
                label: `${label} X`,
                onClick: () => onClick({
                  value: queryValue,
                  query: taxonomyFilters.query,
                  checked: false,
                }),
              });
            }
          }
        });
      });
    }
    return (
      <span>
        {
          tags.map((tag, i) => (<Button key={i} onClick={tag.onClick}>{tag.label}</Button>))
        }
      </span>
    );
  };
  renderCurrentConnectionFilters = (connectionFiltersOptions, connections, locationQuery, onClick, messagesRendered) => {
    const tags = [];
    forEach(connectionFiltersOptions, (option) => {
      if (locationQuery[option.query] && connections[option.path]) {
        const locationQueryValue = locationQuery[option.query];
        forEach(Array.isArray(locationQueryValue) ? locationQueryValue : [locationQueryValue], (queryValue) => {
          const value = parseInt(queryValue, 10);
          const connection = connections[option.path][value];
          let label = connection
              ? connection.attributes.title || connection.attributes.friendly_name || connection.attributes.name
              : upperFirst(value);
          label = label.length > 20 ? `${label.substring(0, 20)}...` : label;
          tags.push({
            label: `${label} X`,
            onClick: () => onClick({
              value,
              query: option.query,
              checked: false,
            }),
          });
        });
      }
    });

    if (locationQuery.without) {
      const locationQueryValue = locationQuery.without;
      forEach(connectionFiltersOptions, (option) => {
        forEach(Array.isArray(locationQueryValue) ? locationQueryValue : [locationQueryValue], (queryValue) => {
          // numeric means taxonomy
          if (option.query === queryValue) {
            tags.push({
              label: `${messagesRendered.without} ${lowerCase(option.label)} X`,
              onClick: () => onClick({
                value: queryValue,
                query: 'without',
                checked: false,
              }),
            });
          }
        });
      });
    }
    return (
      <span>
        {
          tags.map((tag, i) => (<Button key={i} onClick={tag.onClick}>{tag.label}</Button>))
        }
      </span>
    );
  };
  renderCurrentAttributeFilters = (attributeFiltersOptions, locationQuery, onClick) => {
    const tags = [];
    if (locationQuery.where) {
      const locationQueryValue = locationQuery.where;
      forEach(attributeFiltersOptions, (option) => {
        if (locationQueryValue) {
          forEach(Array.isArray(locationQueryValue) ? locationQueryValue : [locationQueryValue], (queryValue) => {
            const valueSplit = queryValue.split(':');
            if (valueSplit[0] === option.attribute && valueSplit.length > 0) {
              const value = valueSplit[1];
              if (option.extension) {
                tags.push({
                  label: `${option.label}:${value} X`,
                  onClick: () => onClick({
                    value: queryValue,
                    query: 'where',
                    checked: false,
                  }),
                });
              } else if (option.options) {
                const attribute = find(option.options, (o) => o.value.toString() === value);
                let label = attribute ? attribute.label : upperFirst(value);
                label = label.length > 10 ? `${label.substring(0, 10)}...` : label;
                tags.push({
                  label: `${label} X`,
                  onClick: () => onClick({
                    value: queryValue,
                    query: 'where',
                    checked: false,
                  }),
                });
              }
            }
          });
        }
      });
    }
    return (
      <span>
        {
          tags.map((tag, i) => (<Button key={i} onClick={tag.onClick}>{tag.label}</Button>))
        }
      </span>
    );
  };

  renderCurrentFilters = ({
    filters,
    taxonomies,
    connections,
    connectedTaxonomies,
    location,
    onTagClick,
  },
  messagesRendered
  ) => {
    const locationQuery = location.query;

    return (
      <div>
        { filters.taxonomies && taxonomies &&
          this.renderCurrentTaxonomyFilters(filters.taxonomies, taxonomies, locationQuery, onTagClick, messagesRendered)
        }
        { filters.connectedTaxonomies && connectedTaxonomies.taxonomies &&
          this.renderCurrentConnectedTaxonomyFilters(filters.connectedTaxonomies, connectedTaxonomies.taxonomies, locationQuery, onTagClick)
        }
        { filters.connections && connections &&
          this.renderCurrentConnectionFilters(filters.connections.options, connections, locationQuery, onTagClick, messagesRendered)
        }
        { filters.attributes &&
          this.renderCurrentAttributeFilters(filters.attributes.options, locationQuery, onTagClick)
        }
      </div>
    );
  }

  render() {
    const {
      sortBy,
      sortOrder,
      activeFilterOption,
      activeEditOption,
      activePanel,
      dataReady,
      isManager,
      entityIdsSelected,
    } = this.props;
    // sorted entities
    const entitiesSorted = this.props.entities && orderBy(
      this.props.entities,
      getEntitySortIteratee(sortBy),
      sortOrder
    );
    const entitiesSelected = Object.values(pick(this.props.entities, entityIdsSelected));

    const filterListOption = {
      label: 'Filter list',
      active: activePanel === FILTERS_PANEL,
      onClick: () => {
        this.props.onPanelSelect(FILTERS_PANEL);
      },
    };
    const panelSwitchOptions = isManager
    ? [
      filterListOption,
      {
        label: 'Edit list',
        active: activePanel === EDIT_PANEL,
        onClick: () => {
          this.props.onPanelSelect(EDIT_PANEL);
        },
      },
    ]
    : [
      filterListOption,
    ];

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
        <EntityListSidebar
          options={panelSwitchOptions}
        >
          { dataReady && activePanel === FILTERS_PANEL &&
            <EntityListSidebarFilters
              filterGroups={
                fromJS(makeFilterGroups(
                  this.props,
                  {
                    attributes: this.context.intl.formatMessage(messages.filterGroupLabel.attributes),
                    taxonomies: this.context.intl.formatMessage(messages.filterGroupLabel.taxonomies),
                    connections: this.context.intl.formatMessage(messages.filterGroupLabel.connections),
                    connectedTaxonomies: this.context.intl.formatMessage(messages.filterGroupLabel.connectedTaxonomies),
                  }
                ))
              }
              formOptions={
                activeFilterOption
                ? fromJS(makeActiveFilterOptions(
                  entitiesSorted,
                  this.props,
                  {
                    titlePrefix: this.context.intl.formatMessage(messages.filterFormTitlePrefix),
                    without: this.context.intl.formatMessage(messages.filterFormWithoutPrefix),
                  }
                ))
                : null
              }
              formModel={FILTER_FORM_MODEL}
              onShowFilterForm={this.props.onShowFilterForm}
              onHideFilterForm={this.props.onHideFilterForm}
            />
          }
          { dataReady && isManager && activePanel === EDIT_PANEL && entitiesSelected.length > 0 &&
            <EntityListSidebarEdit
              editGroups={
                fromJS(makeEditGroups(
                  this.props,
                  {
                    attributes: this.context.intl.formatMessage(messages.editGroupLabel.attributes),
                    taxonomies: this.context.intl.formatMessage(messages.editGroupLabel.taxonomies),
                    connections: this.context.intl.formatMessage(messages.editGroupLabel.connections),
                  }
                ))
              }
              formOptions={
                activeEditOption
                ? fromJS(makeActiveEditOptions(
                  entitiesSelected,
                  this.props,
                  { title: `${this.context.intl.formatMessage(messages.editFormTitlePrefix)} ${entitiesSelected.length} ${this.context.intl.formatMessage(messages.editFormTitlePostfix)}` }
                ))
                : null
              }
              formModel={EDIT_FORM_MODEL}
              onShowEditForm={this.props.onShowEditForm}
              onHideEditForm={this.props.onHideEditForm}
              onAssign={(associations) => this.props.handleEditSubmit(associations, entitiesSelected, activeEditOption)}
            />
          }
          { dataReady && isManager && activePanel === EDIT_PANEL && entitiesSorted.length === 0 &&
            <ListEntitiesEmpty>
               No entities found
            </ListEntitiesEmpty>
          }
          { dataReady && isManager && activePanel === EDIT_PANEL && entitiesSelected.length === 0 && entitiesSorted.length > 0 &&
            <ListEntitiesEmpty>
              Please select one or more entities for edit options
            </ListEntitiesEmpty>
          }
        </EntityListSidebar>
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
                    {this.renderCurrentFilters(
                      this.props,
                      {
                        without: this.context.intl.formatMessage(messages.filterFormWithoutPrefix),
                      }
                    )}
                  </ListEntitiesTopFilters>
                  <ListEntitiesHeaderOptions />
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
                        childList={this.props.childList}
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
  activeFilterOption: PropTypes.object,
  activeEditOption: PropTypes.object,
  onShowFilterForm: PropTypes.func.isRequired,
  onHideFilterForm: PropTypes.func.isRequired,
  onShowEditForm: PropTypes.func.isRequired,
  onHideEditForm: PropTypes.func.isRequired,
  onPanelSelect: PropTypes.func.isRequired,
  onTagClick: PropTypes.func.isRequired,
  activePanel: PropTypes.string,
  entityIdsSelected: PropTypes.array,
  handleEditSubmit: PropTypes.func.isRequired,
  onEntitySelect: PropTypes.func.isRequired,
  onEntitySelectAll: PropTypes.func.isRequired,
  location: PropTypes.object,
  entityTitle: PropTypes.object, // single/plural
  entityLinkTo: PropTypes.string,
  childList: PropTypes.string,
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
      const extend = typeof option === 'string' ? [] : option.extend;
      return {
        ...result,
        [path]: getEntities(state, {
          out: 'js',
          path,
          extend,
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntityList);
