/*
 *
 * ActionList
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { browserHistory } from 'react-router';

import EntityList from 'containers/EntityList';
import { PUBLISH_STATUSES } from 'containers/App/constants';

import {
  loadEntitiesIfNeeded,
} from 'containers/App/actions';

import messages from './messages';

export class ActionList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  mapToEntityList = ({ id, attributes }) => ({
    id,
    title: attributes.title,
    linkTo: `/actions/${id}`,
    reference: id,
    status: attributes.draft ? 'draft' : null,
  })

  render() {
    const filters = {
      keyword: {
        attributes: [
          'id',
          'title',
          'description',
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
        //     tags_measures: true,
        //   },
        //   each: {
        //     path: 'categories',
        //     key: 'taxonomy_id',
        //     without: true,
        //     connected: {
        //       path: 'measure_categories',
        //       whereKey: 'category_id',
        //       key: 'measure_id',
        //     },
        //   },
        // },
        query: 'cat',
        connected: {
          path: 'measure_categories',
          key: 'measure_id',
          whereKey: 'category_id',
        },
      },
      connections: [ // filter by associated entity
        {
          path: 'indicators', // filter by recommendation connection
          query: 'indicators',
          connected: {
            path: 'measure_indicators',
            key: 'measure_id',
            whereKey: 'indicator_id',
          },
        },
        {
          path: 'recommendations', // filter by recommendation connection
          query: 'recommendations',
          connected: {
            path: 'recommendation_measures',
            key: 'measure_id',
            whereKey: 'recommendation_id',
          },
        },
      ],
      connectedTaxonomies: { // filter by each category
        query: 'catx',
        connections: [
          {
            path: 'recommendations', // filter by recommendation connection
            connected: {
              path: 'recommendation_measures',
              key: 'measure_id',
              connected: {
                path: 'recommendation_categories',
                key: 'recommendation_id',
                attribute: 'recommendation_id',
                whereKey: 'category_id',
              },
            },
            // options: {
            //   path: 'taxonomies',
            //   where: {
            //     tags_recommendations: true,
            //   },
            //   each: {
            //     path: 'categories',
            //     key: 'taxonomy_id',
            //     without: true,
            //     connected: {
            //       path: 'recommendation_categories',
            //       key: 'category_id',
            //       ownKey: 'recommendation_id',
            //     },
            //   },
            // }
          },
        ],
      },

    };
    const headerOptions = {
      title: this.context.intl.formatMessage(messages.header),
      actions: [{
        type: 'primary',
        title: 'New action',
        onClick: () => browserHistory.push('/actions/new/'),
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
          location={this.props.location}
          mapToEntityList={this.mapToEntityList}
          path="measures"
          filters={filters}
          header={headerOptions}
        />
      </div>
    );
  }
}

ActionList.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  location: PropTypes.object.isRequired,
};

ActionList.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('measures'));
      dispatch(loadEntitiesIfNeeded('measure_categories'));
      dispatch(loadEntitiesIfNeeded('taxonomies'));
      dispatch(loadEntitiesIfNeeded('categories'));
      dispatch(loadEntitiesIfNeeded('recommendations'));
      dispatch(loadEntitiesIfNeeded('recommendation_measures'));
      dispatch(loadEntitiesIfNeeded('recommendation_categories'));
      dispatch(loadEntitiesIfNeeded('indicators'));
      dispatch(loadEntitiesIfNeeded('measure_indicators'));
    },
  };
}

export default connect(null, mapDispatchToProps)(ActionList);
