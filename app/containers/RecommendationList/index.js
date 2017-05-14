/*
 *
 * RecommendationList
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import EntityList from 'containers/EntityList';
import { PUBLISH_STATUSES } from 'containers/App/constants';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';
import { isReady } from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
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
  }

  render() {
    const { dataReady } = this.props;

    // define selects for getEntities
    const selects = {
      entities: {
        path: 'recommendations',
        extensions: [
          {
            path: 'recommendation_categories',
            key: 'recommendation_id',
            reverse: true,
            as: 'taxonomies',
          },
          {
            path: 'recommendation_measures',
            key: 'recommendation_id',
            reverse: true,
            as: 'measures',
          },
        ],
      },
      connections: {
        options: ['measures'],
      },
      taxonomies: { // filter by each category
        out: 'js',
        path: 'taxonomies',
        where: {
          tags_recommendations: true,
        },
        extend: {
          path: 'categories',
          key: 'taxonomy_id',
          reverse: true,
        },
      },
    };

    const filters = {
      search: ['number', 'title'],
      attributes: {  // filter by attribute value
        label: 'By attribute',
        options: [
          {
            filter: false,
            label: this.context.intl.formatMessage(appMessages.attributes.draft),
            attribute: 'draft',
            options: PUBLISH_STATUSES,
          },
        ],
      },
      taxonomies: { // filter by each category
        query: 'cat',
        filter: true,
        connected: {
          path: 'recommendation_categories',
          key: 'recommendation_id',
          whereKey: 'category_id',
        },
      },
      connections: { // filter by associated entity
        options: [
          {
            filter: true,
            label: this.context.intl.formatMessage(appMessages.entities.measures.plural),
            path: 'measures', // filter by recommendation connection
            query: 'actions',
            key: 'measure_id',
            connected: {
              path: 'recommendation_measures',
              key: 'recommendation_id',
              whereKey: 'measure_id',
            },
          },
        ],
      },
    };
    const edits = {
      taxonomies: { // edit category
        connectPath: 'recommendation_categories',
        key: 'category_id',
        ownKey: 'recommendation_id',
        filter: true,
      },
      connections: { // filter by associated entity
        options: [
          {
            label: this.context.intl.formatMessage(appMessages.entities.measures.plural),
            path: 'measures',
            connectPath: 'recommendation_measures', // filter by recommendation connection
            key: 'measure_id',
            ownKey: 'recommendation_id',
            filter: true,

          },
        ],
      },
      attributes: {  // edit attribute value
        options: [
          {
            label: this.context.intl.formatMessage(appMessages.attributes.draft),
            attribute: 'draft',
            options: PUBLISH_STATUSES,
            filter: false,
          },
        ],
      },
    };

    const headerOptions = {
      supTitle: this.context.intl.formatMessage(messages.pageTitle),
      icon: 'recommendations',
      actions: [{
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
          location={this.props.location}
          selects={selects}
          filters={filters}
          edits={edits}
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
  location: PropTypes.object.isRequired,
  dataReady: PropTypes.bool,
};

RecommendationList.contextTypes = {
  intl: React.PropTypes.object.isRequired,
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RecommendationList);
