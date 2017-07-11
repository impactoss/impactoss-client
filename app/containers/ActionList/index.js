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
import { isReady } from 'containers/App/selectors';
import appMessages from 'containers/App/messages';

import EntityList from 'containers/EntityList';
import { FILTERS, EDITS } from './constants';
import { selectConnections, selectMeasures, selectTaxonomies, selectConnectedTaxonomies } from './selectors';

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
    const { dataReady } = this.props;

    const headerOptions = {
      supTitle: this.context.intl.formatMessage(messages.pageTitle),
      icon: 'measures',
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
    const expandableColumns = [
      {
        label: 'Indicators',
        type: 'indicators',
        clientPath: 'indicators',
        icon: 'indicators',
      },
      {
        label: 'Progress reports',
        type: 'reporting',
        clientPath: 'reports',
        icon: 'reminder',
      },
    ];
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
          serverPath="measures"
          clientPath="actions"
          filters={FILTERS}
          edits={EDITS}
          header={headerOptions}
          dataReady={dataReady}
          entityTitle={{
            single: this.context.intl.formatMessage(appMessages.entities.measures.single),
            plural: this.context.intl.formatMessage(appMessages.entities.measures.plural),
          }}
          expandableColumns={expandableColumns}
          locationQuery={fromJS(this.props.location.query)}
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
  location: PropTypes.object,
  entities: PropTypes.instanceOf(List).isRequired,
  taxonomies: PropTypes.instanceOf(Map),
  connections: PropTypes.instanceOf(Map),
  connectedTaxonomies: PropTypes.instanceOf(Map),
};

ActionList.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  dataReady: isReady(state, { path: [
    'measures',
    'measure_categories',
    'users',
    'taxonomies',
    'categories',
    'recommendations',
    'recommendation_measures',
    'recommendation_categories',
    'sdgtargets',
    'sdgtarget_measures',
    'sdgtarget_categories',
    'indicators',
    'measure_indicators',
    'user_roles',
    'due_dates',
    'progress_reports',
  ] }),
  entities: selectMeasures(state, fromJS(props.location.query)),
  taxonomies: selectTaxonomies(state),
  connections: selectConnections(state),
  connectedTaxonomies: selectConnectedTaxonomies(state),
});
function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('measures'));
      dispatch(loadEntitiesIfNeeded('measure_categories'));
      dispatch(loadEntitiesIfNeeded('users'));
      dispatch(loadEntitiesIfNeeded('taxonomies'));
      dispatch(loadEntitiesIfNeeded('categories'));
      dispatch(loadEntitiesIfNeeded('recommendations'));
      dispatch(loadEntitiesIfNeeded('recommendation_measures'));
      dispatch(loadEntitiesIfNeeded('recommendation_categories'));
      dispatch(loadEntitiesIfNeeded('sdgtargets'));
      dispatch(loadEntitiesIfNeeded('sdgtarget_measures'));
      dispatch(loadEntitiesIfNeeded('sdgtarget_categories'));
      dispatch(loadEntitiesIfNeeded('indicators'));
      dispatch(loadEntitiesIfNeeded('measure_indicators'));
      dispatch(loadEntitiesIfNeeded('user_roles'));
      dispatch(loadEntitiesIfNeeded('progress_reports'));
      dispatch(loadEntitiesIfNeeded('due_dates'));
    },
    handleNew: () => {
      dispatch(updatePath('/actions/new/'));
    },
    handleImport: () => {
      dispatch(updatePath('/actions/import/'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionList);
