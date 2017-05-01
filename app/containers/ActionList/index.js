/*
 *
 * ActionList
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

const expand = (props) => props.location.query.expand;

export class ActionList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded(this.props);
  }

  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded(nextProps);
    }
  }

  render() {
    const { dataReady } = this.props;

    // define selects for getEntities
    const selects = {
      entities: {
        path: 'measures',
        extensions: [
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
            extend: expand(this.props) ? {
              path: 'indicators',
              key: 'indicator_id',
              as: 'child',
              type: 'single',
              extend: [
                {
                  path: 'progress_reports',
                  key: 'indicator_id',
                  reverse: true,
                  as: 'reports',
                },
                {
                  path: 'due_dates',
                  key: 'indicator_id',
                  reverse: true,
                  as: 'dates',
                  without: {
                    path: 'progress_reports',
                    key: 'due_date_id',
                  },
                },
                {
                  path: 'measure_indicators',
                  key: 'indicator_id',
                  reverse: true,
                  as: 'measureCount',
                  type: 'count',
                },
              ],
            } : null,
          },
        ],
      },
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
          path: 'measure_categories',
          key: 'measure_id',
          whereKey: 'category_id',
        },
      },
      connections: { // filter by associated entity
        options: [
          {
            label: this.context.intl.formatMessage(appMessages.entities.indicators.plural),
            path: 'indicators', // filter by recommendation connection
            query: 'indicators',
            key: 'indicator_id',
            filter: true,
            connected: {
              path: 'measure_indicators',
              key: 'measure_id',
              whereKey: 'indicator_id',
            },
          },
          {
            label: this.context.intl.formatMessage(appMessages.entities.recommendations.plural),
            path: 'recommendations', // filter by recommendation connection
            query: 'recommendations',
            key: 'recommendation_id',
            filter: true,
            connected: {
              path: 'recommendation_measures',
              key: 'measure_id',
              whereKey: 'recommendation_id',
            },
          },
        ],
      },
      connectedTaxonomies: { // filter by each category
        query: 'catx',
        filter: true,
        connections: [{
          path: 'recommendations', // filter by recommendation connection
          title: this.context.intl.formatMessage(appMessages.entities.recommendations.plural),
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
        connectPath: 'measure_categories',
        key: 'category_id',
        ownKey: 'measure_id',
        filter: true,
      },
      connections: { // filter by associated entity
        options: [
          {
            filter: true,
            label: this.context.intl.formatMessage(appMessages.entities.indicators.plural),
            path: 'indicators',
            connectPath: 'measure_indicators',
            key: 'indicator_id',
            ownKey: 'measure_id',
          },
          {
            filter: true,
            label: this.context.intl.formatMessage(appMessages.entities.recommendations.plural),
            path: 'recommendations',
            connectPath: 'recommendation_measures',
            key: 'recommendation_id',
            ownKey: 'measure_id',
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
      title: this.context.intl.formatMessage(messages.header),
      actions: [{
        type: 'primary',
        title: 'New action',
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
          location={this.props.location}
          selects={selects}
          filters={filters}
          edits={edits}
          header={headerOptions}
          dataReady={dataReady}
          entityTitle={{
            single: this.context.intl.formatMessage(appMessages.entities.measures.single),
            plural: this.context.intl.formatMessage(appMessages.entities.measures.plural),
          }}
          entityLinkTo="/actions/"
          childList="indicators"
          expand={expand(this.props)}
        />
      </div>
    );
  }
}

ActionList.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleNew: PropTypes.func,
  location: PropTypes.object.isRequired,
  dataReady: PropTypes.bool,
};

ActionList.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  dataReady: isReady(state, {
    path: expand(props)
      ? [
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
        'due_dates',
        'progress_reports',
      ]
      : [
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
      ],
  }),
});
function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: (props) => {
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
      dispatch(loadEntitiesIfNeeded('user_roles'));
      if (expand(props)) {
        dispatch(loadEntitiesIfNeeded('due_dates'));
        dispatch(loadEntitiesIfNeeded('progress_reports'));
      }
    },
    handleNew: () => {
      dispatch(updatePath('/actions/new/'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionList);
