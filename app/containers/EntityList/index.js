/*
 *
 * EntityList
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-redux-form/immutable';

import { orderBy, find, map, forEach, reduce } from 'lodash/collection';
import { pick } from 'lodash/object';
import { Map, List, fromJS } from 'immutable';
import styled from 'styled-components';

import { getEntitySortIteratee } from 'utils/sort';

import Loading from 'components/Loading';
import EntityListSidebar from 'components/EntityListSidebar';
import EntityListFilters from 'components/EntityListFilters';
import EntityListEdit from 'components/EntityListEdit';
import PageHeader from 'components/PageHeader';
import EntityListItem from 'components/EntityListItem';
import ContainerWithSidebar from 'components/basic/Container/ContainerWithSidebar';
import Container from 'components/basic/Container';

import { getEntities, isUserManager } from 'containers/App/selectors';

import { makeFilterGroups } from './filterGroupsFactory';
import { makeEditGroups } from './editGroupsFactory';
import { makeActiveFilterOptions } from './filterOptionsFactory';
import { makeActiveEditOptions } from './editOptionsFactory';

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

import messages from './messages';

const Styled = styled.div`
  padding:0 20px;
`;

export class EntityList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const {
      sortBy,
      sortOrder,
      activeFilterOption,
      activeEditOption,
      activePanel,
      dataReady,
      isManager,
    } = this.props;
    // sorted entities
    const entities = this.props.entities && orderBy(
      this.props.entities,
      getEntitySortIteratee(sortBy),
      sortOrder
    );

    // map entities to entity list item data
    const entitiesList = Object.values(entities).map(this.props.mapToEntityList);
    const entitiesSelected = Object.values(pick(this.props.entities, this.props.entityIdsSelected));

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

    return (
      <div>
        <EntityListSidebar
          options={panelSwitchOptions}
        >
          { dataReady && activePanel === FILTERS_PANEL &&
            <EntityListFilters
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
                  entities,
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
          { dataReady && isManager && activePanel === EDIT_PANEL &&
            <EntityListEdit
              editGroups={
                entitiesSelected.length
                ? fromJS(makeEditGroups(
                  this.props,
                  {
                    attributes: this.context.intl.formatMessage(messages.editGroupLabel.attributes),
                    taxonomies: this.context.intl.formatMessage(messages.editGroupLabel.taxonomies),
                    connections: this.context.intl.formatMessage(messages.editGroupLabel.connections),
                  }
                )) : null
              }
              formOptions={
                activeEditOption && entitiesSelected.length
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
                <Form model={LISTINGS_FORM_MODEL}>
                  {entitiesList.map((entity, i) =>
                    <EntityListItem
                      key={i}
                      model={`.entities.${entity.id}`}
                      select={isManager}
                      {...entity}
                    />
                  )}
                </Form>
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
  // selects: PropTypes.object, // only used in mapStateToProps
  dataReady: PropTypes.bool,
  isManager: PropTypes.bool,
  mapToEntityList: PropTypes.func.isRequired,
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
  handleEditSubmit: PropTypes.func.isRequired,
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntityList);
