/*
 *
 * RecommendationList
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HelmetCanonical from 'components/HelmetCanonical';
import { Map, List, fromJS } from 'immutable';
import { injectIntl } from 'react-intl';

import { getSupportLevel } from 'utils/entities';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';
import {
  selectReady,
  selectRecommendationTaxonomies,
  selectActiveFrameworks,
  selectIsUserManager,
  selectIsSignedIn,
} from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
import { ROUTES } from 'containers/App/constants';

import EntityList from 'containers/EntityList';

import { CONFIG, DEPENDENCIES } from './constants';
import { selectRecommendations, selectConnectedTaxonomies, selectConnections } from './selectors';
import messages from './messages';

export class RecommendationList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  UNSAFE_componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    // console.log('test props')
    // console.log('test location', isEqual(this.props.location, nextProps.location));
    // console.log('test dataReady', isEqual(this.props.dataReady, nextProps.dataReady));
    // console.log('test entities', isEqual(this.props.entities, nextProps.entities));
    // console.log('test entities', this.props.entities === nextProps.entities);
    // console.log('test taxonomies', isEqual(this.props.taxonomies, nextProps.taxonomies));
    // console.log('test taxonomies', this.props.taxonomies === nextProps.taxonomies);
    // console.log('test connections', isEqual(this.props.connections, nextProps.connections));
    // console.log('test connections', this.props.connections === nextProps.connections);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   // console.log('EntityListSidebar.shouldComponentUpdate')
  //   // console.log('props isEqual', isEqual(this.props, nextProps))
  //   return !isEqual(this.props.location, nextProps.location)
  //     || !isEqual(this.props.dataReady, nextProps.dataReady)
  //     || !isEqual(this.props.taxonomies, nextProps.taxonomies)
  //     || !isEqual(this.props.connections, nextProps.connections)
  //     || !isEqual(this.props.entities, nextProps.entities)
  //     || !isEqual(this.state, nextState);
  // }
  render() {
    const {
      dataReady,
      frameworks,
      isManager,
      isUserSignedIn,
      intl,
    } = this.props;
    // console.log('RecList:render')
    const currentFramework = frameworks && frameworks.size === 1 && frameworks.first();
    const type = currentFramework
      ? `recommendations_${currentFramework.get('id')}`
      : 'recommendations';
    const headerOptions = {
      supTitle: intl.formatMessage(messages.pageTitle),
      icon: type,
      actions: [],
      actionsAdmin: [],
    };
    if (isUserSignedIn) {
      headerOptions.actions.push({
        type: 'bookmarker',
        title: intl.formatMessage(appMessages.entities[type].plural),
        entityType: type,
      });
    }
    if (window.print) {
      headerOptions.actions.push({
        type: 'icon',
        onClick: () => window.print(),
        title: intl.formatMessage(appMessages.buttons.printTitle),
        icon: 'print',
      });
    }
    if (CONFIG.downloadCSV) {
      headerOptions.actions.push({
        type: 'download',
      });
    }
    if (isManager) {
      headerOptions.actionsAdmin.push({
        type: 'text',
        title: intl.formatMessage(appMessages.buttons.import),
        onClick: () => this.props.handleImport(),
      });
      headerOptions.actionsAdmin.push({
        type: 'add',
        title: [
          intl.formatMessage(appMessages.buttons.add),
          {
            title: intl.formatMessage(appMessages.entities[type].single),
            hiddenSmall: true,
          },
        ],
        onClick: () => this.props.handleNew(),
      });
    }
    if (dataReady) {
      console.log(this.props.entities.toJS())
      // console.log(this.props.connections.toJS())
      // console.log(this.props.taxonomies.toJS())
      // console.log(this.props.frameworks.toJS())
      // console.log(this.props.connectedTaxonomies.toJS())
    }
    return (
      <div>
        <HelmetCanonical
          title={`${intl.formatMessage(messages.pageTitle)}`}
          meta={[
            { name: 'description', content: intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <EntityList
          entities={this.props.entities}
          taxonomies={this.props.taxonomies}
          connections={this.props.connections}
          frameworks={frameworks}
          connectedTaxonomies={this.props.connectedTaxonomies}
          config={CONFIG}
          header={headerOptions}
          dataReady={dataReady}
          entityTitle={{
            single: intl.formatMessage(appMessages.entities[type].single),
            plural: intl.formatMessage(appMessages.entities[type].plural),
          }}
          entityIcon={(entity) => {
            const status = getSupportLevel(entity);
            return status ? status.icon : null;
          }}
          locationQuery={fromJS(this.props.location.query)}
        />
      </div>
    );
  }
}

RecommendationList.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleNew: PropTypes.func,
  handleImport: PropTypes.func,
  dataReady: PropTypes.bool,
  isManager: PropTypes.bool,
  entities: PropTypes.instanceOf(List).isRequired,
  taxonomies: PropTypes.instanceOf(Map),
  frameworks: PropTypes.instanceOf(Map),
  connectedTaxonomies: PropTypes.instanceOf(Map),
  connections: PropTypes.instanceOf(Map),
  location: PropTypes.object,
  isUserSignedIn: PropTypes.bool,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  entities: selectRecommendations(state, fromJS(props.location.query)),
  taxonomies: selectRecommendationTaxonomies(state),
  connections: selectConnections(state),
  connectedTaxonomies: selectConnectedTaxonomies(state),
  frameworks: selectActiveFrameworks(state),
  isManager: selectIsUserManager(state),
  isUserSignedIn: selectIsSignedIn(state),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    handleNew: () => {
      dispatch(updatePath(`${ROUTES.RECOMMENDATIONS}${ROUTES.NEW}`, { replace: true }));
    },
    handleImport: () => {
      dispatch(updatePath(`${ROUTES.RECOMMENDATIONS}${ROUTES.IMPORT}`));
    },
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(RecommendationList));
