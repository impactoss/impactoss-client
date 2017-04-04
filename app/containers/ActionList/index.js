/*
 *
 * ActionList
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { browserHistory } from 'react-router';

import EntityList from 'containers/EntityList';
import { PUBLISH_STATUSES } from 'containers/App/constants';

import { loadEntitiesIfNeeded } from 'containers/App/actions';
import { isReady } from 'containers/App/selectors';

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

  mapToEntityList = ({ id, attributes }) => ({
    id,
    title: attributes.title,
    linkTo: `/actions/${id}`,
    reference: id,
    status: attributes.draft ? 'draft' : null,
  })

  render() {
    const { dataReady } = this.props;

    // specify the associations to query with entities
    const extensions = [
      {
        path: 'measure_categories',
        key: 'measure_id',
        reverse: true,
        as: 'taxonomies',
      },
      {
        path: 'recommendation_measures',
        key: 'measure_id',
        reverse: true,
        as: 'recommendations',
      },
      {
        path: 'measure_indicators',
        key: 'measure_id',
        reverse: true,
        as: 'indicators',
      },
    ];

    // define selects for getEntities
    const selects = {
      connections: {
        options: ['indicators', 'recommendations'],
      },
      taxonomies: { // filter by each category
        out: 'js',
        path: 'taxonomies',
        where: {
          tags_measures: true,
        },
        extend: {
          path: 'categories',
          key: 'taxonomy_id',
          reverse: true,
        },
      },
      connectedTaxonomies: { // filter by each category
        options: [
          {
            out: 'js',
            path: 'taxonomies',
            where: {
              tags_recommendations: true,
            },
            extend: {
              path: 'categories',
              key: 'taxonomy_id',
              reverse: true,
              extend: {
                path: 'recommendation_categories',
                key: 'category_id',
                reverse: true,
                as: 'recommendations',
              },
            },
          },
        ],
      },
    };

    // specify the filter and query options
    const filters = {
      attributes: {  // filter by attribute value
        label: 'By attribute',
        options: [
          {
            search: false,
            label: 'Status',
            attribute: 'draft',
            options: PUBLISH_STATUSES,
          },
        ],
      },
      taxonomies: { // filter by each category
        label: 'By category',
        query: 'cat',
        search: true,
        connected: {
          path: 'measure_categories',
          key: 'measure_id',
          whereKey: 'category_id',
        },
      },
      connections: { // filter by associated entity
        label: 'By connection',
        options: [
          {
            label: 'Indicators',
            path: 'indicators', // filter by recommendation connection
            query: 'indicators',
            key: 'indicator_id',
            search: true,
            connected: {
              path: 'measure_indicators',
              key: 'measure_id',
              whereKey: 'indicator_id',
            },
          },
          {
            label: 'Recommendations',
            path: 'recommendations', // filter by recommendation connection
            query: 'recommendations',
            key: 'recommendation_id',
            search: true,
            searchAttributes: ['number'],
            connected: {
              path: 'recommendation_measures',
              key: 'measure_id',
              whereKey: 'recommendation_id',
            },
          },
        ],
      },
      connectedTaxonomies: { // filter by each category
        label: 'By associated categories',
        query: 'catx',
        search: true,
        connections: [{
          path: 'recommendations', // filter by recommendation connection
          title: 'Recommendations',
          key: 'recommendation_id',
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
        }],
      },
    };

    const edits = {
      taxonomies: { // edit category
        label: 'Update categories',
        connectPath: 'measure_categories',
      },
      connections: { // filter by associated entity
        label: 'Update conections',
        options: [
          {
            label: 'Indicators',
            path: 'indicators',
            connectPath: 'measure_indicators',
            key: 'indicator_id',
            // search: true,

          },
          {
            label: 'Recommendations',
            path: 'recommendations',
            connectPath: 'recommendation_measures',
            key: 'recommendation_id',
            // search: true,
            // searchAttributes: ['number'],
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
        { !dataReady &&
          <div>
            <FormattedMessage {...messages.loading} />
          </div>
        }
        { dataReady &&
          <EntityList
            location={this.props.location}
            mapToEntityList={this.mapToEntityList}
            path="measures"
            selects={selects}
            filters={filters}
            edits={edits}
            extensions={extensions}
            header={headerOptions}
          />
        }
      </div>
    );
  }
}

ActionList.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  location: PropTypes.object.isRequired,
  dataReady: PropTypes.bool,
};

ActionList.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  dataReady: isReady(state, { path: [
    'measures',
    'measure_categories',
    'users',
    'taxonomies',
    'categories',
    'recommendations',
    'recommendation_measures',
    'recommendation_categories',
    'indicators',
    'measure_indicators',
  ] }),
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
      dispatch(loadEntitiesIfNeeded('indicators'));
      dispatch(loadEntitiesIfNeeded('measure_indicators'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionList);
