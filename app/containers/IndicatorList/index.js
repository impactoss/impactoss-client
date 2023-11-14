/*
 *
 * IndicatorList
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { List, Map, fromJS } from 'immutable';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';
import {
  selectReady,
  selectActiveFrameworks,
  selectIsUserManager,
  selectIsSignedIn,
} from 'containers/App/selectors';
import appMessages from 'containers/App/messages';
import { PATHS } from 'containers/App/constants';

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
    const { intl } = this.context;
    const { dataReady, isManager, isUserSignedIn } = this.props;

    // specify the filter and query  options
    const headerOptions = {
      supTitle: intl.formatMessage(messages.pageTitle),
      icon: 'indicators',
      actions: [],
    };
    if (isUserSignedIn) {
      headerOptions.actions.push({
        type: 'bookmarker',
        title: intl.formatMessage(messages.pageTitle),
      });
    }
    if (window.print) {
      headerOptions.actions.push({
        type: 'icon',
        onClick: () => window.print(),
        title: 'Print',
        icon: 'print',
      });
    }
    if (isManager) {
      headerOptions.actions.push({
        type: 'text',
        title: intl.formatMessage(appMessages.buttons.import),
        onClick: () => this.props.handleImport(),
      });
      headerOptions.actions.push({
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
        <Helmet
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
};

IndicatorList.contextTypes = {
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
      dispatch(updatePath(`${PATHS.INDICATORS}${PATHS.NEW}`, { replace: true }));
    },
    handleImport: () => {
      dispatch(updatePath(`${PATHS.INDICATORS}${PATHS.IMPORT}`));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorList);
