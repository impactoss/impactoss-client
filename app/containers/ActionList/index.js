/*
 *
 * ActionList
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
  selectMeasureTaxonomies,
  selectActiveFrameworks,
  selectIsUserManager,
} from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
import { PATHS } from 'containers/App/constants';

import EntityList from 'containers/EntityList';
import { CONFIG, DEPENDENCIES } from './constants';
import { selectConnections, selectMeasures, selectConnectedTaxonomies } from './selectors';

import messages from './messages';

export class ActionList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  componentWillReceiveProps(nextProps) {
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
    } = this.props;

    const headerOptions = {
      supTitle: this.context.intl.formatMessage(messages.pageTitle),
      icon: 'measures',
      actions: [],
    };
    if (isManager) {
      headerOptions.actions.push({
        type: 'text',
        title: this.context.intl.formatMessage(appMessages.buttons.import),
        onClick: () => this.props.handleImport(),
      });
      headerOptions.actions.push({
        type: 'add',
        title: [
          this.context.intl.formatMessage(appMessages.buttons.add),
          {
            title: this.context.intl.formatMessage(appMessages.entities.measures.single),
            hiddenSmall: true,
          },
        ],
        onClick: () => this.props.handleNew(),
      });
    }
    headerOptions.actions.push({
      type: 'bookmarker',
      title: this.context.intl.formatMessage(messages.pageTitle),
    });
    return (
      <div>
        <Helmet
          title={this.context.intl.formatMessage(messages.pageTitle)}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
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
            single: this.context.intl.formatMessage(appMessages.entities.measures.single),
            plural: this.context.intl.formatMessage(appMessages.entities.measures.plural),
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
};

ActionList.contextTypes = {
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
});
function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    handleNew: () => {
      dispatch(updatePath(`${PATHS.MEASURES}${PATHS.NEW}`, { replace: true }));
    },
    handleImport: () => {
      dispatch(updatePath(`${PATHS.MEASURES}${PATHS.IMPORT}`));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionList);
