/*
 *
 * ActionList
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Link } from 'react-router';

import EntityList from 'containers/EntityList';
import Page from 'components/Page';
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
        options: {
          path: 'taxonomies',
          where: {
            tags_measures: true,
          },
          each: {
            path: 'categories',
            key: 'taxonomy_id',
            without: true,
            join: {
              path: 'measure_categories',
              key: 'category_id',
              ownKey: 'measure_id',
            },
          },
        },
        query: {
          arg: 'cat',
          path: 'measure_categories',
          key: 'category_id',
          ownKey: 'measure_id',
        },
      },
      connections: [ // filter by associated entity
        {
          path: 'indicators', // filter by recommendation connection
          query: 'indicators',
          join: {
            path: 'measure_indicators',
            key: 'indicator_id',
            ownKey: 'measure_id',
          },
        },
        {
          path: 'recommendations', // filter by recommendation connection
          query: 'recommendations',
          join: {
            path: 'recommendation_measures',
            key: 'recommendation_id',
            ownKey: 'measure_id',
          },
        },
      ],
    };

    return (
      <div>
        <Helmet
          title="SADATA - List Actions"
          meta={[
            { name: 'description', content: 'Description of ActionList' },
          ]}
        />
        <Page
          title={this.context.intl.formatMessage(messages.header)}
          actions={[]}
        >
          <Link to="actions/new">Add Action</Link>
          <EntityList
            location={this.props.location}
            mapToEntityList={this.mapToEntityList}
            path="measures"
            filters={filters}
          />
        </Page>
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
      dispatch(loadEntitiesIfNeeded('indicators'));
      dispatch(loadEntitiesIfNeeded('measure_indicators'));
    },
  };
}

export default connect(null, mapDispatchToProps)(ActionList);
