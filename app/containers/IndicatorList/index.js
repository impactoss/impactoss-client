/*
 *
 * IndicatorList
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
  selectActiveFrameworks,
  selectIsUserManager,
  selectIsSignedIn,
} from 'containers/App/selectors';
import appMessages from 'containers/App/messages';
import { ROUTES } from 'containers/App/constants';

import EntityList from 'containers/EntityList';
import { CONFIG, DEPENDENCIES } from './constants';
import { selectConnections, selectIndicators, selectConnectedTaxonomies } from './selectors';

import messages from './messages';

export class IndicatorList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
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
      dataReady, isManager, isUserSignedIn, intl,
    } = this.props;

    // specify the filter and query  options
    const headerOptions = {
      supTitle: intl.formatMessage(messages.pageTitle),
      icon: 'indicators',
      actions: [],
      actionsAdmin: [],
    };
    if (isUserSignedIn) {
      headerOptions.actions.push({
        type: 'bookmarker',
        title: intl.formatMessage(appMessages.entities.indicators.plural),
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
            title: intl.formatMessage(appMessages.entities.indicators.single),
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
          entities={this.props.entities}
          connections={this.props.connections}
          frameworks={this.props.frameworks}
          connectedTaxonomies={this.props.connectedTaxonomies}
          config={CONFIG}
          header={headerOptions}
          dataReady={dataReady}
          entityTitle={{
            single: intl.formatMessage(appMessages.entities.indicators.single),
            plural: intl.formatMessage(appMessages.entities.indicators.plural),
          }}
          locationQuery={fromJS(this.props.location.query)}
        />
      </div>
    );
  }
}

IndicatorList.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleNew: PropTypes.func,
  handleImport: PropTypes.func,
  dataReady: PropTypes.bool,
  entities: PropTypes.instanceOf(List).isRequired,
  connections: PropTypes.instanceOf(Map),
  connectedTaxonomies: PropTypes.instanceOf(Map),
  frameworks: PropTypes.instanceOf(Map),
  location: PropTypes.object,
  isManager: PropTypes.bool,
  isUserSignedIn: PropTypes.bool,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  entities: selectIndicators(state, fromJS(props.location.query)),
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
      dispatch(updatePath(`${ROUTES.INDICATORS}${ROUTES.NEW}`, { replace: true }));
    },
    handleImport: () => {
      dispatch(updatePath(`${ROUTES.INDICATORS}${ROUTES.IMPORT}`));
    },
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(IndicatorList));
