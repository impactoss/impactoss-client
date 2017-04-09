/*
 *
 * EntityList
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { Form } from 'react-redux-form/immutable';
// import { updateQueryStringParams } from 'utils/history';
import { orderBy, find, map, forEach, reduce } from 'lodash/collection';
import { pick } from 'lodash/object';
import { getEntitySortIteratee } from 'utils/sort';
import { fromJS } from 'immutable';

import Grid from 'grid-styled';

import EntityListSidebar from 'components/EntityListSidebar';
import EntityListFilters from 'components/EntityListFilters';
import EntityListEdit from 'components/EntityListEdit';

import PageHeader from 'components/PageHeader';
import EntityListItem from 'components/EntityListItem';
import Row from 'components/basic/Row';
import Container from 'components/basic/Container';

import { getEntities } from 'containers/App/selectors';

import {
  FILTER_FORM_MODEL,
  EDIT_FORM_MODEL,
  LISTINGS_FORM_MODEL,
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
} from './actions';

export class EntityList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.URLParams = new URLSearchParams(browserHistory.getCurrentLocation().search);
  }

  getEntitiesSelected = () => Object.values(pick(this.props.entities, this.props.entityIdsSelected));

  getConnectedCategoryIds = (entity, connection, taxonomies) => {
    const connectionIds = map(map(Object.values(entity[connection.path]), 'attributes'), connection.key);
    return reduce(Object.values(taxonomies), (ids, taxonomy) => {
      const idsUpdated = ids;
      if (taxonomy.categories) {
        forEach(Object.values(taxonomy.categories), (category) => {
          if (category[connection.path]) {
            forEach(Object.values(category[connection.path]), (categoryAssociation) => {
              if (connectionIds.indexOf(categoryAssociation.attributes[connection.key]) > -1) {
                if (ids.indexOf(categoryAssociation.attributes.category_id) === -1) {
                  idsUpdated.push(categoryAssociation.attributes.category_id);
                }
              }
            });
          }
        });
      }
      return idsUpdated;
    }, []);
  }

  taxonomyFilterOptions = (entities) => {
    const { filters, taxonomies, activeFilterOption } = this.props;

    const filterOptions = {
      groupId: 'taxonomies',
      search: filters.taxonomies.search,
      options: {},
    };

    forEach(Object.values(entities), (entity) => {
      // if entity has taxonomies
      const taxonomyIds = []; // track taxonomies, so we can add without options for those not in here

      if (entity.taxonomies) {
        // add categories from entities if not present otherwise increase count
        const categoryIds = map(map(Object.values(entity.taxonomies), 'attributes'), 'category_id');
        forEach(categoryIds, (catId) => {
          // get taxonomy for each category
          const taxonomy = find(Object.values(taxonomies), (tax) =>
            tax.categories && Object.keys(tax.categories).indexOf(catId.toString()) > -1
          );
          if (taxonomy) {
            taxonomyIds.push(taxonomy.id); // tracking to identify missing taxonomies
            // if taxonomy active add filter option
            if (activeFilterOption.optionId === `taxonomies-${taxonomy.id}`) {
              filterOptions.title = filterOptions.title || taxonomy.attributes.title;
              // if category already added
              if (filterOptions.options[catId]) {
                filterOptions.options[catId].count += 1;
              } else {
                filterOptions.options[catId] = this.initURLOption({
                  label: taxonomy.categories[catId].attributes.title,
                  value: catId,
                  count: 1,
                  query: filters.taxonomies.query,
                });
              }
            }
          }
        });
      }
      // add without option for those taxonomies not associated with entity
      forEach(taxonomies, (taxonomy) => {
        if (activeFilterOption.optionId === `taxonomies-${taxonomy.id}` && taxonomyIds.indexOf(taxonomy.id) === -1) {
          if (filterOptions.options.without) {
            filterOptions.options.without.count += 1;
          } else {
            filterOptions.options.without = this.initURLOption({
              label: `Without ${taxonomy.attributes.title}`,
              value: taxonomy.id,
              count: 1,
              query: 'without',
            });
          }
        }
      });
    });
    return filterOptions;
  }
  connectedTaxonomyFilterOptions = (entities) => {
    const { filters, connectedTaxonomies, activeFilterOption } = this.props;

    const filterOptions = {
      groupId: 'connectedTaxonomies',
      search: filters.connectedTaxonomies.search,
      options: {},
    };
    forEach(Object.values(entities), (entity) => {
      forEach(filters.connectedTaxonomies.connections, (connection) => {
        // if entity has taxonomies
        if (entity[connection.path]) { // recommendations stores recommendation_measures
          // add categories from entities if not present otherwise increase count
          const categoryIds = this.getConnectedCategoryIds(
            entity,
            connection,
            connectedTaxonomies.taxonomies
          );

          forEach(categoryIds, (catId) => {
            // TODO: the taxonomy lookup can may be omitted as we already iterate over taxonomies above
            const taxonomy = find(Object.values(connectedTaxonomies.taxonomies), (tax) =>
              tax.categories && Object.keys(tax.categories).indexOf(catId.toString()) > -1
            );
            if (taxonomy && activeFilterOption.optionId === `connectedTaxonomies-${taxonomy.id}`) {
              filterOptions.title = filterOptions.title || taxonomy.attributes.title;
              // if category already added
              if (filterOptions.options[catId]) {
                filterOptions.options[catId].count += 1;
              } else {
                filterOptions.options[catId] = this.initURLOption({
                  label: taxonomy.categories[catId].attributes.title,
                  value: `${connection.path}:${catId}`,
                  count: 1,
                  query: filters.connectedTaxonomies.query,
                });
              }
            }
          });
        }
      });
    });
    return filterOptions;
  }

  connectionFilterOptions = (entities) => {
    const { filters, connections, activeFilterOption } = this.props;

    const filterOptions = {
      groupId: 'connections',
      options: {},
    };

    forEach(Object.values(entities), (entity) => {
      forEach(filters.connections.options, (option) => {
        // if option active
        if (activeFilterOption.optionId === `connections-${option.path}`) {
          filterOptions.title = filterOptions.title || option.label;
          filterOptions.search = filterOptions.search || option.search;
          // if entity has connected entities
          if (entity[option.path]) {
            // add connected entities if not present otherwise increase count
            const connectedIds = {
              [option.path]: map(map(Object.values(entity[option.path]), 'attributes'), option.key),
            };
            forEach(connectedIds[option.path], (connectedId) => {
              const connection = connections[option.path][connectedId];
              // if not taxonomy already considered
              if (connection) {
                // if category already added
                if (filterOptions.options[connectedId]) {
                  filterOptions.options[connectedId].count += 1;
                } else {
                  filterOptions.options[connectedId] = this.initURLOption({
                    label: connection.attributes.title,
                    value: connectedId,
                    search: option.searchAttributes && option.searchAttributes.map((attribute) => connection.attributes[attribute]).join(),
                    count: 1,
                    query: option.query,
                  });
                }
              }
            });
          } else if (filterOptions.options.without) {
            // no connection present
            // add without option
            filterOptions.options.without.count += 1;
          } else {
            filterOptions.options.without = this.initURLOption({
              label: `Without ${option.label}`,
              value: option.query,
              count: 1,
              query: 'without',
            });
          }
        } // if (filterOptions.options.connections.options[option.path].show) {
      });
    });
    return filterOptions;
  }

  attributeFilterOptions = (entities) => {
    const { filters, activeFilterOption } = this.props;

    const filterOptions = {
      groupId: 'attributes',
      options: {},
    };

    forEach(Object.values(entities), (entity) => {
      forEach(filters.attributes.options, (option) => {
        if (activeFilterOption.optionId === `attributes-${option.attribute}`) {
          filterOptions.title = filterOptions.title || option.label;
          filterOptions.search = filterOptions.search || option.search;

          if (typeof entity.attributes[option.attribute] !== 'undefined') {
            // add connected entities if not present otherwise increase count
            const value = entity.attributes[option.attribute].toString();
            if (filterOptions.options[value]) {
              filterOptions.options[value].count += 1;
            } else {
              const attribute = find(option.options, (o) => o.value.toString() === value);
              filterOptions.options[value] = this.initURLOption({
                label: attribute ? attribute.label : value,
                value: `${option.attribute}:${value}`,
                count: 1,
                query: 'where',
              });
            }
          }
        }
      });
    });

    return filterOptions;
  }
  makeActiveFilterOptions = (entities) => {
    const { activeFilterOption } = this.props;
    // create filterOptions
    // if taxonomy options
    switch (activeFilterOption.group) {
      case 'taxonomies':
        return this.taxonomyFilterOptions(entities);
      case 'connectedTaxonomies':
        return this.connectedTaxonomyFilterOptions(entities);
      case 'connections':
        return this.connectionFilterOptions(entities);
      case 'attributes':
        return this.attributeFilterOptions(entities);
      default:
        return null;
    }
  }

  // figure out filter groups for filter panel
  makeFilterGroups = () => {
    const {
      filters,
      taxonomies,
      connections,
      connectedTaxonomies,
      activeFilterOption,
    } = this.props;

    const filterGroups = {};

    // taxonomy option group
    if (filters.taxonomies && taxonomies) {
      // first prepare taxonomy options
      filterGroups.taxonomies = {
        id: 'taxonomies', // filterGroupId
        label: filters.taxonomies.label,
        show: true,
        options: reduce(Object.values(taxonomies), (taxOptions, taxonomy) => ({
          ...taxOptions,
          [taxonomy.id]: {
            id: `taxonomies-${taxonomy.id}`, // filterOptionId
            label: taxonomy.attributes.title,
            active: !!activeFilterOption && activeFilterOption.optionId === `taxonomies-${taxonomy.id}`,
          },
        }), {}),
      };
    }

    // connectedTaxonomies option group
    if (filters.connectedTaxonomies && connectedTaxonomies.taxonomies) {
      // first prepare taxonomy options
      filterGroups.connectedTaxonomies = {
        id: 'connectedTaxonomies', // filterGroupId
        label: filters.connectedTaxonomies.label,
        show: true,
        options: reduce(Object.values(connectedTaxonomies.taxonomies), (taxOptions, taxonomy) => ({
          ...taxOptions,
          [taxonomy.id]: {
            id: `connectedTaxonomies-${taxonomy.id}`, // filterOptionId
            label: taxonomy.attributes.title,
            active: !!activeFilterOption && activeFilterOption.optionId === `connectedTaxonomies-${taxonomy.id}`,
          },
        }), {}),
      };
    }

    // connections option group
    if (filters.connections && connections) {
      // first prepare taxonomy options
      filterGroups.connections = {
        id: 'connections', // filterGroupId
        label: filters.connections.label,
        show: true,
        options: reduce(filters.connections.options, (options, option) => ({
          ...options,
          [option.path]: {
            id: `connections-${option.path}`, // filterOptionId
            label: option.label,
            active: !!activeFilterOption && activeFilterOption.optionId === `connections-${option.path}`,
          },
        }), {}),
      };
    }

    // attributes
    if (filters.attributes) {
      // first prepare taxonomy options
      filterGroups.attributes = {
        id: 'attributes', // filterGroupId
        label: filters.attributes.label,
        show: true,
        options: reduce(filters.attributes.options, (options, option) => ({
          ...options,
          [option.attribute]: {
            id: `attributes-${option.attribute}`, // filterOptionId
            label: option.label,
            active: !!activeFilterOption && activeFilterOption.optionId === `attributes-${option.attribute}`,
          },
        }), {}),
      };
    }

    return filterGroups;
  }

  makeEditGroups = () => {
    const {
      edits,
      taxonomies,
      connections,
      activeEditOption,
    } = this.props;

    const editGroups = {};

    // taxonomy option group
    if (edits.taxonomies && taxonomies) {
      // first prepare taxonomy options
      editGroups.taxonomies = {
        id: 'taxonomies', // filterGroupId
        label: edits.taxonomies.label,
        show: true,
        options: reduce(Object.values(taxonomies), (taxOptions, taxonomy) => ({
          ...taxOptions,
          [taxonomy.id]: {
            id: `taxonomies-${taxonomy.id}`, // filterOptionId
            label: taxonomy.attributes.title,
            active: !!activeEditOption && activeEditOption.optionId === `taxonomies-${taxonomy.id}`,
          },
        }), {}),
      };
    }

    // connections option group
    if (edits.connections && connections) {
      // first prepare taxonomy options
      editGroups.connections = {
        id: 'connections', // filterGroupId
        label: edits.connections.label,
        show: true,
        options: reduce(edits.connections.options, (options, option) => ({
          ...options,
          [option.path]: {
            id: `connections-${option.path}`, // filterOptionId
            label: option.label,
            active: !!activeEditOption && activeEditOption.optionId === `connections-${option.path}`,
          },
        }), {}),
      };
    }

    // attributes
    if (edits.attributes) {
      // first prepare taxonomy options
      editGroups.attributes = {
        id: 'attributes', // filterGroupId
        label: edits.attributes.label,
        show: true,
        options: reduce(edits.attributes.options, (options, option) => ({
          ...options,
          [option.attribute]: {
            id: `attributes-${option.attribute}`, // filterOptionId
            label: option.label,
            active: !!activeEditOption && activeEditOption.optionId === `attributes-${option.attribute}`,
          },
        }), {}),
      };
    }

    return editGroups;
  }

  taxonomyEditOptions = (entitiesSelected) => {
    const { edits, taxonomies, activeEditOption } = this.props;

    const editOptions = {
      groupId: 'taxonomies',
      search: true,
      options: {},
      selectedCount: entitiesSelected.length,
      path: edits.taxonomies.connectPath,
    };
    forEach(taxonomies, (taxonomy) => {
      // if taxonomy active add filter option
      if (activeEditOption.optionId === `taxonomies-${taxonomy.id}`) {
        editOptions.title = taxonomy.attributes.title;
        forEach(taxonomy.categories, (category) => {
          const count = reduce(entitiesSelected, (counter, entity) => {
            const categoryIds = entity.taxonomies
              ? map(map(Object.values(entity.taxonomies), 'attributes'), (attribute) => attribute.category_id.toString())
              : [];
            return categoryIds && categoryIds.indexOf(category.id) > -1 ? counter + 1 : counter;
          }, 0);
          editOptions.options[category.id] = {
            label: category.attributes.title,
            value: category.id,
            all: count === entitiesSelected.length,
            none: count === 0,
            some: count > 0 && count < entitiesSelected.length,
            count,
          };
        });
      }
    });
    return editOptions;
  }
  connectionEditOptions = (entitiesSelected) => {
    const { edits, connections, activeEditOption } = this.props;

    const editOptions = {
      groupId: 'connections',
      search: true,
      options: {},
      selectedCount: entitiesSelected.length,
    };
    // forEach(connections, (connection) => {
    forEach(edits.connections.options, (option) => {
      if (activeEditOption.optionId === `connections-${option.path}`) {
        editOptions.title = option.label;
        editOptions.path = option.connectPath;
        forEach(connections[option.path], (connection) => {
          const count = reduce(entitiesSelected, (counter, entity) => {
            const connectedIds = entity[option.path]
              ? map(map(Object.values(entity[option.path]), 'attributes'), (attribute) => attribute[option.key].toString())
              : null;
            return connectedIds && connectedIds.indexOf(connection.id) > -1 ? counter + 1 : counter;
          }, 0);
          editOptions.options[connection.id] = {
            label: connection.attributes.title,
            value: connection.id,
            all: count === entitiesSelected.length,
            none: count === 0,
            some: count > 0 && count < entitiesSelected.length,
            count,
          };
        });
      }
    });
    return editOptions;
  }
  attributeEditOptions = (entitiesSelected) => {
    const { edits, activeEditOption } = this.props;

    const editOptions = {
      groupId: 'attributes',
      search: true,
      options: {},
      selectedCount: entitiesSelected.length,
    };
    // forEach(connections, (connection) => {
    forEach(edits.attributes.options, (option) => {
      if (activeEditOption.optionId === `attributes-${option.attribute}`) {
        editOptions.title = option.label;
        forEach(option.options, (attributeOption) => {
          const count = reduce(entitiesSelected, (counter, entity) =>
            typeof entity.attributes[option.attribute] !== 'undefined'
              && entity.attributes[option.attribute].toString() === attributeOption.value.toString()
              ? counter + 1
              : counter
          , 0);
          editOptions.options[attributeOption.value] = {
            label: attributeOption.label,
            value: attributeOption.value,
            attribute: option.attribute,
            all: count === entitiesSelected.length,
            none: count === 0,
            some: count > 0 && count < entitiesSelected.length,
            count,
          };
        });
      }
    });
    return editOptions;
  }

  makeActiveEditOptions = (entitiesSelected) => {
    const { activeEditOption } = this.props;
    // iterate through entities and create filterOptions
    // if taxonomy options
    switch (activeEditOption.group) {
      case 'taxonomies':
        return this.taxonomyEditOptions(entitiesSelected);
      case 'connections':
        return this.connectionEditOptions(entitiesSelected);
      case 'attributes':
        return this.attributeEditOptions(entitiesSelected);
      default:
        return null;
    }
  }


  initURLOption = (option) => ({
    ...option,
    checked: this.URLParams.has(option.query) && this.URLParams.getAll(option.query).indexOf(option.value.toString()) >= 0,
  })

  render() {
    const {
      sortBy,
      sortOrder,
      activeFilterOption,
      activeEditOption,
      activePanel,
    } = this.props;
    // sorted entities
    const entities = this.props.entities && orderBy(
      this.props.entities,
      getEntitySortIteratee(sortBy),
      sortOrder
    );

    // const entitiesSelected = [];
    // TODO filter for entities selected in list
    const entitiesSelected = this.getEntitiesSelected(); // uncomment this for testing and temporarily assume all are selected
    // console.log(entitiesSelected);

    // map entities to entity list item data
    const entitiesList = Object.values(entities).map(this.props.mapToEntityList);

    const panelSwitchOptions = [
      {
        label: 'Filter list',
        active: activePanel === FILTERS_PANEL,
        onClick: () => {
          this.props.onPanelSelect(FILTERS_PANEL);
        },
      },
      {
        label: 'Edit list',
        active: activePanel === EDIT_PANEL,
        onClick: () => {
          this.props.onPanelSelect(EDIT_PANEL);
        },
      },
    ];
    return (
      <Container>
        <Row>
          <Grid sm={1 / 4}>
            <EntityListSidebar
              options={panelSwitchOptions}
            >
              { activePanel === FILTERS_PANEL &&
                <EntityListFilters
                  filterGroups={fromJS(this.makeFilterGroups())}
                  formOptions={activeFilterOption ? fromJS(this.makeActiveFilterOptions(entities)) : null}
                  formModel={FILTER_FORM_MODEL}
                  onShowFilterForm={this.props.onShowFilterForm}
                  onHideFilterForm={this.props.onHideFilterForm}
                />
              }
              { activePanel === EDIT_PANEL &&
                <EntityListEdit
                  editGroups={entitiesSelected.length ? fromJS(this.makeEditGroups()) : null}
                  formOptions={activeEditOption && entitiesSelected.length ? fromJS(this.makeActiveEditOptions(entitiesSelected)) : null}
                  formModel={EDIT_FORM_MODEL}
                  onShowEditForm={this.props.onShowEditForm}
                  onHideEditForm={this.props.onHideEditForm}
                />
              }
            </EntityListSidebar>
          </Grid>
          <Grid sm={3 / 4}>
            <PageHeader title={this.props.header.title} actions={this.props.header.actions} />
            <Form model={LISTINGS_FORM_MODEL}>
              {entitiesList.map((entity, i) =>
                <EntityListItem key={i} model={`.entities.${entity.id}`} {...entity} />
              )}
            </Form>
          </Grid>
        </Row>
      </Container>
    );
  }
}

EntityList.propTypes = {
  entities: PropTypes.object.isRequired,
  // selects: PropTypes.object, // only used in mapStateToProps
  filters: PropTypes.object,
  edits: PropTypes.object,
  taxonomies: PropTypes.object,
  connections: PropTypes.object,
  connectedTaxonomies: PropTypes.object,
  mapToEntityList: PropTypes.func.isRequired,
  //  location: PropTypes.object.isRequired, only needed in mapStateToProps
  // TODO: do not pass location directly but specific props, to allow multiple lists on same page
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
  activePanel: PropTypes.string,
  entityIdsSelected: PropTypes.array,
  // handleEditSubmit: PropTypes.func.isRequired,
};

EntityList.defaultProps = {
  sortBy: 'id',
  sortOrder: 'desc',
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
        // console.log(connection)
        if (connectedTaxonomy) {
          const condition = connectedTaxonomy.connected;
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
    ? reduce(props.selects.connections.options, (result, path) => ({
      ...result,
      [path]: getEntities(state, {
        out: 'js',
        path,
      }),
    }), {})
    : null,
  connectedTaxonomies: props.selects && props.selects.connectedTaxonomies
  ? reduce(props.selects.connectedTaxonomies.options, (result, select) => ({
    ...result,
    [select.path]: getEntities(state, select),
  }), {})
  : null,
});

function mapDispatchToProps(dispatch) {
  return {
    onShowFilterForm: (option) => {
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
    handleEditSubmit: (editFormData) => {
    // handleEditSubmit: (editFormData, selectedEntities) => {
      const saveData = {
        path: 'path_of_associative_table', // TODO figure out from edits, eg props.edits[activeGroup].connectPath
        updates: editFormData, // TODO figure out the create id pairs and delete association id
        // create: [{entity_id:X, other_entity_id:Y}, ...] // for all connections added, figure out entity id from affected selectedEntity and other id from form option value
        // delete: [{id:Z}, ...] // for all connections deleted, figure out the association id from affected selectedEntity
      };

      dispatch(saveEdits(saveData.toJS()));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntityList);
