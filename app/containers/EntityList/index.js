/*
 *
 * EntityList
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import { Map, List, fromJS } from 'immutable';

import { getEntityReference } from 'utils/entities';
import ErrorMessages from 'components/ErrorMessages';
import Loading from 'components/Loading';
import Sidebar from 'components/styled/Sidebar';

import EntityListSidebar from 'components/entityList/EntityListSidebar';
import EntityListMain from 'components/entityList/EntityListMain';

import { selectIsUserManager } from 'containers/App/selectors';

import {
  updatePath,
  openNewEntityModal,
} from 'containers/App/actions';

import appMessages from 'containers/App/messages';
import { PARAMS, RECORD_OUTDATED } from 'containers/App/constants';

import {
  selectDomain,
  selectProgress,
  selectActivePanel,
  selectSelectedEntities,
} from './selectors';

import {
  resetState,
  resetProgress,
  showPanel,
  save,
  newConnection,
  deleteConnection,
  selectEntity,
  selectEntities,
  updateQuery,
  updateGroup,
  updatePage,
  updateExpand,
  updatePageItems,
  updateSortBy,
  updateSortOrder,
} from './actions';

const Progress = styled.div`
  position: absolute;
  width: 100%;
  display: block;
  background: white;
  bottom: 0;
  -webkit-box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.2);
  -moz-box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.2);
  box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.2);
  background-color: ${palette('primary', 4)};
  padding: ${(props) => props.error ? 0 : 40}px;
  z-index: 200;
`;

export class EntityList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.resetStateOnMount();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.viewDomain.get('sending').size > 0
      && nextProps.viewDomain.get('errors').size === 0
      && nextProps.progress > 99.9
    ) {
      this.props.resetProgress();
    }
  }

  formatLabel = (path) => {
    const message = path.split('.').reduce((m, key) => m[key] || m, appMessages);
    return this.context.intl.formatMessage(message);
  }

  render() {
    // make sure selected entities are still actually on page
    const { entityIdsSelected, entities, progress } = this.props;
    const errors = this.props.viewDomain.get('errors');
    const sending = this.props.viewDomain.get('sending');

    const entityIdsSelectedFiltered = entityIdsSelected.size > 0 && entities
      ? entityIdsSelected.filter((id) => entities.map((entity) => entity.get('id')).includes(id))
      : entityIdsSelected;

    return (
      <div>
        <Sidebar>
          { this.props.dataReady &&
            <EntityListSidebar
              listUpdating={progress !== null && progress >= 0 && progress < 100}
              entities={this.props.entities}
              taxonomies={this.props.taxonomies}
              connections={this.props.connections}
              connectedTaxonomies={this.props.connectedTaxonomies}
              entityIdsSelected={
                entityIdsSelected.size === entityIdsSelectedFiltered.size
                ? entityIdsSelected
                : entityIdsSelectedFiltered
              }
              config={this.props.config}
              locationQuery={this.props.locationQuery}
              canEdit={this.props.isManager}
              activePanel={this.props.activePanel}
              formatLabel={this.formatLabel}
              onPanelSelect={this.props.onPanelSelect}
              onCreateOption={this.props.onCreateOption}
              onAssign={(associations, activeEditOption) =>
                this.props.handleEditSubmit(associations, activeEditOption, this.props.entityIdsSelected)}
            />
          }
        </Sidebar>
        { (progress !== null && progress < 100) &&
          <Progress>
            <Loading
              progress={progress}
            />
          </Progress>
        }
        {(errors.size > 0) &&
          <Progress error>
            <ErrorMessages
              error={{
                messages: errors.reduce((memo, error, timestamp) =>
                  error.messages
                  ? memo.concat(error.messages.map((message) => {
                    const recordReference = sending.get(timestamp) && sending.get(timestamp).entity
                      ? getEntityReference(fromJS(sending.get(timestamp).entity))
                      : 'unknown';
                    if (message === RECORD_OUTDATED) {
                      return this.context.intl.formatMessage(appMessages.forms.outdatedErrorList, { recordReference });
                    }
                    return `${this.context.intl.formatMessage(appMessages.forms.otherErrorList, { recordReference })}${message}`;
                  }))
                  : memo
                , []),
              }}
              onDismiss={this.props.resetProgress}
            />
          </Progress>
        }
        <EntityListMain
          listUpdating={progress !== null && progress >= 0 && progress < 100}
          entities={this.props.entities}
          taxonomies={this.props.taxonomies}
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
          isManager={this.props.isManager}

          entityIcon={this.props.entityIcon}
          formatLabel={this.formatLabel}
          onEntitySelect={this.props.onEntitySelect}
          onEntitySelectAll={this.props.onEntitySelectAll}
          onTagClick={this.props.onTagClick}
          onExpand={this.props.onExpand}
          onGroupSelect={this.props.onGroupSelect}
          onSubgroupSelect={this.props.onSubgroupSelect}
          onSearch={this.props.onSearch}
          onPageSelect={this.props.onPageSelect}
          onPageItemsSelect={this.props.onPageItemsSelect}
          onEntityClick={this.props.onEntityClick}
          onSortBy={this.props.onSortBy}
          onSortOrder={this.props.onSortOrder}
        />
      </div>
    );
  }
}

EntityList.propTypes = {
  // wrapper props
  entities: PropTypes.instanceOf(List).isRequired,
  taxonomies: PropTypes.instanceOf(Map),
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
  isManager: PropTypes.bool,
  entityIdsSelected: PropTypes.object,
  viewDomain: PropTypes.object,
  progress: PropTypes.number,
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
  onPageSelect: PropTypes.func.isRequired,
  onPageItemsSelect: PropTypes.func.isRequired,
  onEntityClick: PropTypes.func.isRequired,
  resetStateOnMount: PropTypes.func.isRequired,
  resetProgress: PropTypes.func.isRequired,
  onSortBy: PropTypes.func.isRequired,
  onSortOrder: PropTypes.func.isRequired,
  onCreateOption: PropTypes.func.isRequired,
};

EntityList.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  isManager: selectIsUserManager(state),
  activePanel: selectActivePanel(state),
  entityIdsSelected: selectSelectedEntities(state),
  viewDomain: selectDomain(state),
  progress: selectProgress(state),
});

function mapDispatchToProps(dispatch, props) {
  return {
    resetStateOnMount: () => {
      dispatch(resetState());
    },
    resetProgress: () => {
      dispatch(resetProgress());
    },
    onPanelSelect: (activePanel) => {
      dispatch(showPanel(activePanel));
    },
    onEntitySelect: (id, checked) => {
      dispatch(selectEntity({ id, checked }));
    },
    onEntityClick: (id, path) => {
      dispatch(updatePath(`/${path || props.config.clientPath}/${id}`));
    },
    onEntitySelectAll: (ids) => {
      dispatch(selectEntities(ids));
    },
    onTagClick: (value) => {
      dispatch(updateQuery(fromJS([value])));
    },
    onExpand: (expandNoNew) => {
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
    handleEditSubmit: (formData, activeEditOption, entityIdsSelected) => {
      const entities = props.entities.filter(
        (entity) => entityIdsSelected.includes(entity.get('id'))
      );

      // figure out changes
      const changes = formData.get('values').filter((option) => option.get('hasChanged'));
      // figure out updates (either new attribute values or new connections)
      let creates = changes
        .filter((option) => option.get('checked') === true)
        .map((option) => option.get('value'));

      // attributes
      if (activeEditOption.group === 'attributes') {
        if (creates.size > 0) {
          // take the first TODO multiselect should be run in single value mode and only return 1 value
          const newValue = creates.first();
          entities.forEach((entity) => {
            if (entity.getIn(['attributes', activeEditOption.optionId]) !== newValue) {
              dispatch(save(Map()
                .set('path', props.config.serverPath)
                .set('entity', entity.setIn(['attributes', activeEditOption.optionId], newValue))
                .toJS()
              ));
            }
          });
        }
      // connections
      } else {
        // figure out connection deletions (not necessary for attributes as deletions will be overridden)
        const deletes = changes
          .filter((option) => option.get('checked') === false)
          .map((option) => option.get('value'));

        entities.forEach((entity) => {
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
          // create connections
          if (creates.size > 0) {
            if (!!existingAssignments && existingAssignments.size > 0) {
              // exclude existing relations from the changeSet
              creates = creates.filter((id) => !existingAssignments.includes(parseInt(id, 10)));
            }
            // associations
            creates.forEach((id) => dispatch(newConnection({
              path: activeEditOption.path,
              entity: {
                attributes: {
                  [activeEditOption.ownKey]: entity.get('id'),
                  [activeEditOption.key]: id,
                },
              },
            })));
          }
          // delete connections
          if (deletes.size > 0) {
            if (!!existingAssignments && existingAssignments.size > 0) {
              existingAssignments
                .filter((assigned) => deletes.includes(assigned.toString()))
                .forEach((assigned, id) => dispatch(deleteConnection({
                  path: activeEditOption.path,
                  id,
                })));
            }
          }
        }); // each entity
      }
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntityList);
