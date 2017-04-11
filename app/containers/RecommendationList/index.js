/*
 *
 * RecommendationList
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { browserHistory } from 'react-router';

import EntityList from 'containers/EntityList';
import { PUBLISH_STATUSES } from 'containers/App/constants';

import { loadEntitiesIfNeeded } from 'containers/App/actions';
import { isReady } from 'containers/App/selectors';

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

  mapToEntityList = ({ id, attributes }) => ({
    id,
    title: attributes.title,
    linkTo: `/recommendations/${id}`,
    reference: id,
    status: attributes.draft ? 'draft' : null,
  })

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
      keyword: {
        attributes: [
          'no',
          'title',
        ],
      },
      attributes: {  // filter by attribute value
        label: 'By attribute',
        options: [
          {
            label: 'Status',
            attribute: 'draft',
            options: PUBLISH_STATUSES,
          },
        ],
      },
      taxonomies: { // filter by each category
        label: 'By category',
        query: 'cat',
        connected: {
          path: 'recommendation_categories',
          key: 'recommendation_id',
          whereKey: 'category_id',
        },
      },
      connections: { // filter by associated entity
        label: 'By connection',
        options: [
          {
            label: 'Actions',
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
        label: 'Update categories',
      },
      connections: { // filter by associated entity
        label: 'Update conections',
        options: [
          {
            label: 'Actions',
            path: 'measures', // filter by recommendation connection
            // key: 'indicator_id',
            // search: true,

          },
        ],
      },
      attributes: {  // edit attribute value
        label: 'Update attribute',
        options: [
          {
            label: 'Status',
            attribute: 'draft',
            options: PUBLISH_STATUSES,
          },
        ],
      },
    };
    const headerOptions = {
      title: this.context.intl.formatMessage(messages.header),
      actions: [{
        type: 'primary',
        title: 'New recommendation',
        onClick: () => browserHistory.push('/recommendations/new/'),
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
          mapToEntityList={this.mapToEntityList}
          selects={selects}
          filters={filters}
          edits={edits}
          header={headerOptions}
          dataReady={dataReady}
        />
      </div>
    );
  }
}

RecommendationList.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
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
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RecommendationList);
