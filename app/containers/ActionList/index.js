/*
 *
 * ActionList
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HelmetCanonical from 'components/HelmetCanonical';
import { List, Map, fromJS } from 'immutable';
import { injectIntl } from 'react-intl';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';
import {
  selectReady,
  selectMeasureTaxonomies,
  selectActiveFrameworks,
  selectIsUserManager,
  selectIsSignedIn,
} from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
import { ROUTES } from 'containers/App/constants';

import EntityList from 'containers/EntityList';
import { CONFIG, DEPENDENCIES } from './constants';
import { selectConnections, selectMeasures, selectConnectedTaxonomies } from './selectors';

import messages from './messages';

export class ActionList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  UNSAFE_componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }

  render() {
    const {
      dataReady,
      entities,
      taxonomies,
      frameworks,
      connections,
      connectedTaxonomies,
      location,
      isManager,
      isUserSignedIn,
      intl,
    } = this.props;
    const headerOptions = {
      supTitle: intl.formatMessage(messages.pageTitle),
      icon: 'measures',
      actions: [],
      actionsAdmin: [],
    };
    if (isUserSignedIn) {
      headerOptions.actions.push({
        type: 'bookmarker',
        title: intl.formatMessage(appMessages.entities.measures.plural),
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
        buttonTitle: intl.formatMessage(appMessages.buttons.importTitle, { type: intl.formatMessage(appMessages.entities.measures.plural) }),
        onClick: () => this.props.handleImport(),
      });
      headerOptions.actionsAdmin.push({
        type: 'add',
        title: [
          intl.formatMessage(appMessages.buttons.add),
          {
            title: intl.formatMessage(appMessages.entities.measures.single),
            hiddenSmall: true,
          },
        ],
        onClick: () => this.props.handleNew(),
      });
    }
    return (
      <div>
        <HelmetCanonical
          title={intl.formatMessage(messages.pageTitle)}
          meta={[
            { name: 'description', content: intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <EntityList
          entities={entities}
          taxonomies={taxonomies}
          frameworks={frameworks}
          connections={connections}
          connectedTaxonomies={connectedTaxonomies}
          config={CONFIG}
          header={headerOptions}
          dataReady={dataReady}
          entityTitle={{
            single: intl.formatMessage(appMessages.entities.measures.single),
            plural: intl.formatMessage(appMessages.entities.measures.plural),
          }}
          locationQuery={fromJS(location.query)}
        />
      </div>
    );
  }
}

ActionList.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleNew: PropTypes.func,
  handleImport: PropTypes.func,
  dataReady: PropTypes.bool,
  isManager: PropTypes.bool,
  location: PropTypes.object,
  entities: PropTypes.instanceOf(List).isRequired,
  taxonomies: PropTypes.instanceOf(Map),
  frameworks: PropTypes.instanceOf(Map),
  connections: PropTypes.instanceOf(Map),
  connectedTaxonomies: PropTypes.instanceOf(Map),
  isUserSignedIn: PropTypes.bool,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  entities: selectMeasures(state, fromJS(props.location.query)),
  taxonomies: selectMeasureTaxonomies(state),
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
      dispatch(updatePath(`${ROUTES.MEASURES}${ROUTES.NEW}`, { replace: true }));
    },
    handleImport: () => {
      dispatch(updatePath(`${ROUTES.MEASURES}${ROUTES.IMPORT}`));
    },
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ActionList));
