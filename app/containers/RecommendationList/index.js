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

import Page from 'components/Page';

import messages from './messages';

export class RecommendationList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  mapToEntityList = ({ id, attributes }) => ({
    id,
    title: attributes.title,
    linkTo: `/recommendations/${id}`,
    reference: id,
    status: attributes.draft ? 'draft' : null,
  })

  render() {
    const filters = {
      keyword: {
        attributes: [
          'no',
          'title',
        ],
      },
      attributes: [ // filter by attribute value
        {
          label: 'Status',
          attribute: 'draft',
          type: 'boolean',
          options: PUBLISH_STATUSES,
        },
      ],
      taxonomies: { // filter by each category
        // options: {
        //   path: 'taxonomies',
        //   where: {
        //     tags_recommendations: true,
        //   },
        //   each: {
        //     path: 'categories',
        //     key: 'taxonomy_id',
        //     without: true,
        //     join: {
        //       path: 'reommendation_categories',
        //       key: 'category_id',
        //       ownKey: 'reommendation_id',
        //     },
        //   },
        // },
        query: 'cat',
        connected: {
          path: 'recommendation_categories',
          key: 'recommendation_id',
          whereKey: 'category_id',
        },
      },
      connections: [ // filter by associated entity
        {
          path: 'measures', // filter by recommendation connection
          query: 'actions',
          connected: {
            path: 'recommendation_measures',
            key: 'recommendation_id',
            whereKey: 'measure_id',
          },
        },
      ],
    };

    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.pageTitle)}`}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <Page
          title={this.context.intl.formatMessage(messages.header)}
          actions={[{
            type: 'primary',
            title: 'New recommendation',
            onClick: () => browserHistory.push('/recommendations/new/'),
          }]}
        >
          <EntityList
            location={this.props.location}
            mapToEntityList={this.mapToEntityList}
            path="recommendations"
            filters={filters}
          />
        </Page>
      </div>
    );
  }
}

RecommendationList.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  location: PropTypes.object.isRequired,
};

RecommendationList.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('recommendations'));
      dispatch(loadEntitiesIfNeeded('recommendation_categories'));
      dispatch(loadEntitiesIfNeeded('recommendation_measures'));
      dispatch(loadEntitiesIfNeeded('taxonomies'));
      dispatch(loadEntitiesIfNeeded('categories'));
      dispatch(loadEntitiesIfNeeded('measures'));
    },
  };
}

export default connect(null, mapDispatchToProps)(RecommendationList);
