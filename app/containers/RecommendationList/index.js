/*
 *
 * RecommendationList
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
// import { isEqual } from 'lodash/lang';
import { Map } from 'immutable';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';
import { isReady } from 'containers/App/selectors';
import appMessages from 'containers/App/messages';

import EntityList from 'containers/EntityList';

import { FILTERS, EDITS } from './constants';
import { selectConnections, selectRecommendations, selectTaxonomies } from './selectors';
import messages from './messages';

export class RecommendationList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }
  componentWillReceiveProps(nextProps) {
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
    const { dataReady } = this.props;
    // console.log('RecList:render')

    const headerOptions = {
      supTitle: this.context.intl.formatMessage(messages.pageTitle),
      icon: 'recommendations',
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
          title={`${this.context.intl.formatMessage(messages.pageTitle)}`}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <EntityList
          entities={this.props.entities}
          taxonomies={this.props.taxonomies}
          connections={this.props.connections}
          path="recommendations"
          filters={FILTERS}
          edits={EDITS}
          header={headerOptions}
          dataReady={dataReady}
          entityTitle={{
            single: this.context.intl.formatMessage(appMessages.entities.recommendations.single),
            plural: this.context.intl.formatMessage(appMessages.entities.recommendations.plural),
          }}
          entityLinkTo="/recommendations/"
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
  entities: PropTypes.instanceOf(Map).isRequired,
  taxonomies: PropTypes.instanceOf(Map),
  connections: PropTypes.instanceOf(Map),
};

RecommendationList.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  dataReady: isReady(state, { path: [
    'measures',
    'users',
    'taxonomies',
    'categories',
    'recommendations',
    'recommendation_measures',
    'recommendation_categories',
  ] }),
  entities: selectRecommendations(state),
  taxonomies: selectTaxonomies(state),
  connections: selectConnections(state),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('recommendations'));
      dispatch(loadEntitiesIfNeeded('recommendation_categories'));
      dispatch(loadEntitiesIfNeeded('recommendation_measures'));
      dispatch(loadEntitiesIfNeeded('users'));
      dispatch(loadEntitiesIfNeeded('taxonomies'));
      dispatch(loadEntitiesIfNeeded('categories'));
      dispatch(loadEntitiesIfNeeded('measures'));
      dispatch(loadEntitiesIfNeeded('user_roles'));
    },
    handleNew: () => {
      dispatch(updatePath('/recommendations/new/'));
    },
    handleImport: () => {
      dispatch(updatePath('/recommendations/import/'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RecommendationList);
