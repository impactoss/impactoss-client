/*
 *
 * EntityList
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import { Map, List, fromJS } from 'immutable';

// import { getEntityReference } from 'utils/entities';
import Messages from 'components/Messages';
import Loading from 'components/Loading';

import EntityListSidebar from 'components/EntityListSidebar';
import EntityListSidebarLoading from 'components/EntityListSidebarLoading';
import EntityListPrintKey from 'components/EntityListPrintKey';
import EntityListMain from 'components/EntityListMain';
import PrintOnly from 'components/styled/PrintOnly';

import {
  selectHasUserRole,
  selectCurrentPathname,
  selectAllTaxonomiesWithCategories,
} from 'containers/App/selectors';

import {
  updatePath,
  openNewEntityModal,
} from 'containers/App/actions';

// import appMessages from 'containers/App/messages';
import { PARAMS } from 'containers/App/constants';
import { USER_ROLES } from 'themes/config';

import {
  selectDomain,
  selectProgress,
  selectActivePanel,
  selectSelectedEntities,
  selectProgressTypes,
} from './selectors';

import messages from './messages';

import {
  resetProgress,
  showPanel,
  saveMultiple,
  newMultipleConnections,
  deleteMultipleConnections,
  selectEntity,
  selectMultipleEntities,
  updateQuery,
  updateGroup,
  updatePage,
  updateExpand,
  updatePageItems,
  updateSortBy,
  updateSortOrder,
  setClientPath,
  dismissError,
  dismissAllErrors,
  resetSearchQuery,
} from './actions';

const Progress = styled.div`
  position: absolute;
  width: 100%;
  display: block;
  background: white;
  bottom: 0;
  box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.2);
  background-color: ${palette('primary', 4)};
  padding: ${(props) => props.error ? 0 : 40}px;
  z-index: 200;
`;

const ProgressText = styled.div`
  font-weight: bold;
  font-size: 1em;
  color: ${palette('primary', 2)};
  margin-bottom: 0.25em;
  margin-top: -0.5em;
  overflow: hidden;
  @media print {
    font-size: ${(props) => props.theme.sizes.print.default};
  }
`;

export class EntityList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  UNSAFE_componentWillMount() {
    this.props.updateClientPath();
  }

  getMessageForType = (type) => {
    switch (type) {
      case 'new':
        return messages.createSuccess;
      case 'delete':
        return messages.deleteSuccess;
      default:
        return messages.updatesSuccess;
    }
  }

  mapError = (error, key) => fromJS({
    type: error.data.type,
    error: error.error,
    key,
  });

  mapErrors = (errors) => errors.reduce((errorMap, error, key) => {
    const entityId = error.data.saveRef;
    return errorMap.has(entityId) // check if error already present for entity
      ? errorMap.set(entityId, errorMap.get(entityId).push(this.mapError(error, key)))
      : errorMap.set(entityId, List().push(this.mapError(error, key)));
  }, Map());

  filterByError = (entities, errors) => entities.filter((entity) => errors.has(entity.get('id')));

  render() {
    const { intl } = this.context;
    // make sure selected entities are still actually on page
    const {
      entityIdsSelected,
      progress, viewDomain,
      canEdit,
      progressTypes,
      onDismissAllErrors,
      allTaxonomies,
    } = this.props;

    const sending = viewDomain.get('sending');
    const success = viewDomain.get('success');
    const errors = viewDomain.get('errors').size > 0 ? this.mapErrors(viewDomain.get('errors')) : Map();

    const entities = (errors.size > 0)
      ? this.filterByError(this.props.entities, errors)
      : this.props.entities;

    const entityIdsSelectedFiltered = entityIdsSelected.size > 0 && entities
      ? entityIdsSelected.filter((id) => entities.map((entity) => entity.get('id')).includes(id))
      : entityIdsSelected;

    // detect print to avoid expensive rendering
    const printing = !!(
      typeof window !== 'undefined'
      && window.matchMedia
      && window.matchMedia('print').matches
    );

    return (
      <div>
        {!this.props.dataReady && <EntityListSidebarLoading />}
        {this.props.dataReady && this.props.showSidebar && !printing && (
          <EntityListSidebar
            listUpdating={progress !== null && progress >= 0 && progress < 100}
            entities={entities}
            taxonomies={this.props.taxonomies}
            frameworks={this.props.frameworks}
            connections={this.props.connections}
            connectedTaxonomies={this.props.connectedTaxonomies}
            entityIdsSelected={
              entityIdsSelected.size === entityIdsSelectedFiltered.size
                ? entityIdsSelected
                : entityIdsSelectedFiltered
            }
            config={this.props.config}
            locationQuery={this.props.locationQuery}
            canEdit={canEdit && this.props.hasUserRole[USER_ROLES.MANAGER.value]}
            hasUserRole={this.props.hasUserRole}
            activePanel={this.props.activePanel}
            onPanelSelect={this.props.onPanelSelect}
            onCreateOption={this.props.onCreateOption}
            onUpdate={
              (associations, activeEditOption) => this.props.handleEditSubmit(
                associations,
                activeEditOption,
                this.props.entityIdsSelected,
                viewDomain.get('errors'),
              )}
          />
        )}
        <EntityListMain
          listUpdating={progress !== null && progress >= 0 && progress < 100}
          entities={entities}
          errors={errors}
          taxonomies={this.props.taxonomies}
          allTaxonomies={allTaxonomies}
          frameworks={this.props.frameworks}
          connections={this.props.connections}
          connectedTaxonomies={this.props.connectedTaxonomies}
          entityIdsSelected={
            entityIdsSelected.size === entityIdsSelectedFiltered.size
              ? entityIdsSelected
              : entityIdsSelectedFiltered
          }
          locationQuery={this.props.locationQuery}

          config={this.props.config}
          header={this.props.header}
          entityTitle={this.props.entityTitle}

          dataReady={this.props.dataReady}
          isManager={canEdit && this.props.hasUserRole[USER_ROLES.MANAGER.value]}
          isContributor={this.props.hasUserRole[USER_ROLES.CONTRIBUTOR.value]}

          entityIcon={this.props.entityIcon}
          onEntitySelect={this.props.onEntitySelect}
          onEntitySelectAll={this.props.onEntitySelectAll}
          onTagClick={this.props.onTagClick}
          onExpand={this.props.onExpand}
          onGroupSelect={this.props.onGroupSelect}
          onSubgroupSelect={this.props.onSubgroupSelect}
          onSearch={this.props.onSearch}
          onResetFilters={this.props.onResetFilters}
          onPageSelect={this.props.onPageSelect}
          onPageItemsSelect={this.props.onPageItemsSelect}
          onEntityClick={(id, path) => this.props.onEntityClick(
            id, path, viewDomain.get('errors')
          )}
          onSortBy={this.props.onSortBy}
          onSortOrder={this.props.onSortOrder}
          onDismissError={this.props.onDismissError}
          onDismissAllErrors={onDismissAllErrors}
        />
        {this.props.dataReady && this.props.config.taxonomies && (
          <PrintOnly>
            <EntityListPrintKey
              entities={entities}
              taxonomies={this.props.taxonomies}
              config={this.props.config}
              locationQuery={this.props.locationQuery}
            />
          </PrintOnly>
        )}
        { (progress !== null && progress < 100)
          && (
            <Progress>
              <ProgressText>
                <FormattedMessage
                  {...messages.processingUpdates}
                  values={{
                    processNo: Math.min(success.size + errors.size + 1, sending.size),
                    totalNo: sending.size,
                    types:
                    intl.formatMessage(messages[
                      `type_${progressTypes.size === 1 ? progressTypes.first() : 'save'}`
                    ]),
                  }}
                />
              </ProgressText>
              <Loading
                progress={progress}
              />
            </Progress>
          )
        }
        {(viewDomain.get('errors').size > 0 && progress >= 100)
          && (
            <Progress error>
              <Messages
                type="error"
                message={
                  intl.formatMessage(
                    messages.updatesFailed,
                    {
                      errorNo: viewDomain.get('errors').size,
                      types:
                      intl.formatMessage(messages[
                        `type_${progressTypes.size === 1 ? progressTypes.first() : 'save'}`
                      ]),
                    },
                  )
                }
                onDismiss={this.props.resetProgress}
                preMessage={false}
              />
            </Progress>
          )
        }
        {(viewDomain.get('errors').size === 0 && progress >= 100)
          && (
            <Progress error>
              <Messages
                type="success"
                message={
                  intl.formatMessage(
                    this.getMessageForType(
                      progressTypes.size === 1 ? progressTypes.first() : 'save',
                      viewDomain.get('success').size,
                    ),
                    {
                      successNo: viewDomain.get('success').size,
                    },
                  )
                }
                onDismiss={this.props.resetProgress}
                autoDismiss={2000}
              />
            </Progress>
          )
        }
      </div>
    );
  }
}

EntityList.defaultProps = {
  showSidebar: true,
  canEdit: true,
};

EntityList.propTypes = {
  // wrapper props
  entities: PropTypes.instanceOf(List).isRequired,
  taxonomies: PropTypes.instanceOf(Map),
  allTaxonomies: PropTypes.instanceOf(Map),
  frameworks: PropTypes.instanceOf(Map),
  connections: PropTypes.instanceOf(Map),
  connectedTaxonomies: PropTypes.instanceOf(Map),
  config: PropTypes.object,
  dataReady: PropTypes.bool,
  header: PropTypes.object,
  locationQuery: PropTypes.instanceOf(Map),
  entityTitle: PropTypes.object, // single/plural
  entityIcon: PropTypes.func,
  // selector props
  activePanel: PropTypes.string,
  hasUserRole: PropTypes.object, // { 1: isAdmin, 2: isManager, 3: isContributor}
  entityIdsSelected: PropTypes.object,
  viewDomain: PropTypes.object,
  progress: PropTypes.number,
  progressTypes: PropTypes.instanceOf(List),
  // dispatch props
  onPanelSelect: PropTypes.func.isRequired,
  handleEditSubmit: PropTypes.func.isRequired,
  onEntitySelect: PropTypes.func.isRequired,
  onEntitySelectAll: PropTypes.func.isRequired,
  onTagClick: PropTypes.func.isRequired,
  onExpand: PropTypes.func.isRequired,
  onGroupSelect: PropTypes.func.isRequired,
  onSubgroupSelect: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired,
  onPageSelect: PropTypes.func.isRequired,
  onPageItemsSelect: PropTypes.func.isRequired,
  onEntityClick: PropTypes.func.isRequired,
  resetProgress: PropTypes.func.isRequired,
  updateClientPath: PropTypes.func.isRequired,
  onSortBy: PropTypes.func.isRequired,
  onSortOrder: PropTypes.func.isRequired,
  onCreateOption: PropTypes.func.isRequired,
  onDismissError: PropTypes.func.isRequired,
  onDismissAllErrors: PropTypes.func.isRequired,
  canEdit: PropTypes.bool,
  showSidebar: PropTypes.bool,
};

EntityList.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  hasUserRole: selectHasUserRole(state),
  activePanel: selectActivePanel(state),
  entityIdsSelected: selectSelectedEntities(state),
  viewDomain: selectDomain(state),
  progress: selectProgress(state),
  progressTypes: selectProgressTypes(state),
  currentPath: selectCurrentPathname(state),
  allTaxonomies: selectAllTaxonomiesWithCategories(state),
});

function mapDispatchToProps(dispatch, props) {
  return {
    onDismissError: (key) => {
      dispatch(resetProgress());
      dispatch(dismissError(key));
    },
    onDismissAllErrors: () => {
      dispatch(resetProgress());
      dispatch(dismissAllErrors());
    },
    resetProgress: () => {
      dispatch(resetProgress());
    },
    updateClientPath: () => {
      dispatch(setClientPath(props.config.clientPath));
    },
    onPanelSelect: (activePanel) => {
      dispatch(showPanel(activePanel));
    },
    onEntitySelect: (id, checked) => {
      dispatch(selectEntity({ id, checked }));
    },
    onEntityClick: (id, path, errors) => {
      if (errors && errors.size) {
        dispatch(resetProgress());
        errors.forEach((error, key) => {
          if (error.data.saveRef === id) {
            dispatch(dismissError(key));
          }
        });
      }
      dispatch(updatePath(`/${path || props.config.clientPath}/${id}`));
    },
    onEntitySelectAll: (ids) => {
      dispatch(selectMultipleEntities(ids));
    },
    onTagClick: (value) => {
      dispatch(updateQuery(fromJS([value])));
    },
    onExpand: (expandNoNew) => {
      // default expand by 1
      dispatch(updateExpand(typeof expandNoNew !== 'undefined'
        ? expandNoNew
        : props.expandNo + 1));
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
    onResetFilters: (values) => {
      dispatch(resetSearchQuery(values));
    },
    onGroupSelect: (value) => {
      dispatch(updateGroup(fromJS([
        {
          query: 'group',
          value,
        },
      ])));
      if (value === PARAMS.GROUP_RESET) {
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
    onPageItemsSelect: (no) => {
      dispatch(updatePageItems(no));
    },
    onSortOrder: (order) => {
      dispatch(updateSortOrder(order));
    },
    onSortBy: (sort) => {
      dispatch(updateSortBy(sort));
    },
    onCreateOption: (args) => {
      dispatch(openNewEntityModal(args));
    },
    handleEditSubmit: (formData, activeEditOption, entityIdsSelected, errors) => {
      dispatch(resetProgress());

      const entities = props.entities.filter(
        (entity) => entityIdsSelected.includes(entity.get('id'))
      );

      // figure out changes
      const changes = formData.get('values').filter((option) => option.get('hasChanged'));
      // figure out updates (either new attribute values or new connections)
      const creates = changes
        .filter((option) => option.get('checked') === true)
        .map((option) => option.get('value'));

      // attributes
      if (activeEditOption.group === 'attributes') {
        if (creates.size > 0) {
          // take the first
          // TODO multiselect should be run in single value mode and only return 1 value
          const newValue = creates.first();
          entities.forEach((entity) => {
            // not exactly sure what is happening here?
            if (errors && errors.size) {
              errors.forEach((error, key) => {
                if (error.data.saveRef === entity.get('id')) {
                  dispatch(dismissError(key));
                }
              });
            }
          });
          dispatch(saveMultiple(
            props.config.serverPath,
            entities.filter(
              (entity) => entity.getIn(['attributes', activeEditOption.optionId]) !== newValue
            ).map(
              (entity) => Map()
                .set('path', props.config.serverPath)
                .set('entity', entity.setIn(['attributes', activeEditOption.optionId], newValue))
                .set('saveRef', entity.get('id'))
            ).toJS()
          ));
        }
      // connections
      } else {
        // figure out connection deletions (not necessary for attributes as deletions will be overridden)
        const deletes = changes
          .filter((option) => option.get('checked') === false)
          .map((option) => option.get('value'));

        entities.forEach(
          (entity) => {
            if (errors && errors.size) {
              errors.forEach((error, key) => {
                if (error.data.saveRef === entity.get('id')) {
                  dispatch(dismissError(key));
                }
              });
            }
          }
        );
        const updates = entities.reduce(
          (memo, entity) => {
            let entityCreates = List();
            let entityDeletes = List();
            let existingAssignments;
            switch (activeEditOption.group) {
              case ('taxonomies'):
                existingAssignments = entity.get('categories');
                break;
              case ('connections'):
                existingAssignments = entity.get(activeEditOption.connection);
                break;
              default:
                existingAssignments = List();
                break;
            }
            // create connections
            if (creates.size > 0) {
              // exclude existing relations from the changeSet
              entityCreates = !!existingAssignments && existingAssignments.size > 0
                ? creates.filter(
                  (id) => !existingAssignments.includes(parseInt(id, 10))
                )
                : creates;
              entityCreates = entityCreates.map(
                (id) => fromJS({
                  path: activeEditOption.path,
                  entity: {
                    attributes: {
                      [activeEditOption.ownKey]: entity.get('id'),
                      [activeEditOption.key]: id,
                    },
                  },
                  saveRef: entity.get('id'),
                })
              );
            }
            // delete connections
            if (
              deletes.size > 0
              && !!existingAssignments
              && existingAssignments.size > 0
            ) {
              entityDeletes = existingAssignments.filter(
                (assigned) => deletes.includes(assigned.toString())
              ).map(
                (assigned, id) => fromJS({
                  path: activeEditOption.path,
                  id,
                  saveRef: entity.get('id'),
                })
              ).toList();
            }
            return memo
              .set('creates', memo.get('creates').concat(entityCreates))
              .set('deletes', memo.get('deletes').concat(entityDeletes));
          },
          Map().set('creates', List()).set('deletes', List()),
        ); // reduce entities
        // associations
        if (updates.get('creates') && updates.get('creates').size > 0) {
          dispatch(newMultipleConnections(
            activeEditOption.path,
            updates.get('creates').toJS(),
          ));
        }
        if (updates.get('deletes') && updates.get('deletes').size > 0) {
          dispatch(deleteMultipleConnections(
            activeEditOption.path,
            updates.get('deletes').toJS(),
          ));
        }
        // entityCreates.forEach((id) => dispatch(newConnection({
        //   path: activeEditOption.path,
        //   entity: {
        //     attributes: {
        //       [activeEditOption.ownKey]: entity.get('id'),
        //       [activeEditOption.key]: id,
        //     },
        //   },
        //   saveRef: entity.get('id'),
        // })));
        // existingAssignments
        //   .forEach((assigned, id) => dispatch(deleteConnection({
        //     path: activeEditOption.path,
        //     id,
        //     saveRef: entity.get('id'),
        //   })));
      }
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntityList);
