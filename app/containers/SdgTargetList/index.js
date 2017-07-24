/*
 *
 * SdgTargetList
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Map, List, fromJS } from 'immutable';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';

import {
  selectReady,
  selectSdgTargetTaxonomies,
} from 'containers/App/selectors';

import appMessages from 'containers/App/messages';

import EntityList from 'containers/EntityList';
import { CONFIG, DEPENDENCIES } from './constants';
import { selectConnections, selectSdgTargets, selectConnectedTaxonomies } from './selectors';

import messages from './messages';

export class SdgTargetList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

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

    const headerOptions = {
      supTitle: this.context.intl.formatMessage(messages.pageTitle),
      icon: 'sdgtargets',
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
          taxonomies={this.props.taxonomies}
          connections={this.props.connections}
          connectedTaxonomies={this.props.connectedTaxonomies}
          config={CONFIG}
          header={headerOptions}
          dataReady={dataReady}
          entityTitle={{
            single: this.context.intl.formatMessage(appMessages.entities.sdgtargets.single),
            plural: this.context.intl.formatMessage(appMessages.entities.sdgtargets.plural),
          }}
          locationQuery={fromJS(this.props.location.query)}
        />
      </div>
    );
  }
}

SdgTargetList.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleNew: PropTypes.func,
  handleImport: PropTypes.func,
  dataReady: PropTypes.bool,
  entities: PropTypes.instanceOf(List).isRequired,
  taxonomies: PropTypes.instanceOf(Map),
  connections: PropTypes.instanceOf(Map),
  connectedTaxonomies: PropTypes.instanceOf(Map),
  location: PropTypes.object,
};

SdgTargetList.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  entities: selectSdgTargets(state, fromJS(props.location.query)),
  taxonomies: selectSdgTargetTaxonomies(state),
  connections: selectConnections(state),
  connectedTaxonomies: selectConnectedTaxonomies(state),
});
function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    handleNew: () => {
      dispatch(updatePath('/sdgtargets/new/'));
    },
    handleImport: () => {
      dispatch(updatePath('/sdgtargets/import/'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SdgTargetList);
