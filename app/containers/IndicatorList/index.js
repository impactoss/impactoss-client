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
import { selectReady } from 'containers/App/selectors';
import appMessages from 'containers/App/messages';

import EntityList from 'containers/EntityList';
import { CONFIG, DEPENDENCIES } from './constants';
import { selectConnections, selectIndicators, selectConnectedTaxonomies } from './selectors';

import messages from './messages';

export class IndicatorList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

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
    const { dataReady } = this.props;

    // specify the filter and query  options
    const headerOptions = {
      supTitle: this.context.intl.formatMessage(messages.pageTitle),
      icon: 'indicators',
      actions: [{
        type: 'text',
        title: 'Import',
        onClick: () => this.props.handleImport(),
      }, {
        type: 'add',
        title: this.context.intl.formatMessage(messages.add),
        onClick: () => this.props.handleNew(),
      }],
    };

    return (
      <div>
        <Helmet
          title={this.context.intl.formatMessage(messages.pageTitle)}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <EntityList
          entities={this.props.entities}
          connections={this.props.connections}
          connectedTaxonomies={this.props.connectedTaxonomies}
          config={CONFIG}
          header={headerOptions}
          dataReady={dataReady}
          entityTitle={{
            single: this.context.intl.formatMessage(appMessages.entities.indicators.single),
            plural: this.context.intl.formatMessage(appMessages.entities.indicators.plural),
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
  location: PropTypes.object,
};

IndicatorList.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  entities: selectIndicators(state, fromJS(props.location.query)),
  connections: selectConnections(state),
  connectedTaxonomies: selectConnectedTaxonomies(state),
});
function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    handleNew: () => {
      dispatch(updatePath('/indicators/new/'));
    },
    handleImport: () => {
      dispatch(updatePath('/indicators/import/'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorList);
