/*
 *
 * ActionList
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { forEach } from 'lodash/collection';

import EntityList from 'containers/EntityList';
import { PUBLISH_STATUSES } from 'containers/App/constants';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';
import { isReady } from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
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

  getReports = (indicator) => indicator.reports
    ? Object.values(indicator.reports)
    : [];
  getDates = (indicator) => indicator.dates
    ? Object.values(indicator.dates)
    : [];
  getIndicators = (action) => action.indicators
    ? Object.values(action.indicators).reduce((memo, indicatorAssociation) =>
      indicatorAssociation.indicator
        ? memo.concat([indicatorAssociation.indicator])
        : memo
    , [])
    : [];

  getReportCount = (actionOrIndicator) => {
    let count = 0;
    // test action:  return sum of reports for all indicators
    if (actionOrIndicator.indicators) {
      count = Object.values(actionOrIndicator.indicators).reduce((counter, indicatorAssociation) =>
        counter + (indicatorAssociation.indicator && indicatorAssociation.indicator.reports
          ? Object.keys(indicatorAssociation.indicator.reports).length
          : 0
        )
      , 0);
    }
    // test indicator: return number of reports for each indicator
    if (actionOrIndicator.reports) {
      count = Object.keys(actionOrIndicator.reports).length;
    }
    return count;
  }
  getReportInfo = (actionOrIndicator) => {
    const info = [];
    let due = 0;
    let overdue = 0;
    // test action:  return sum of reports for all indicators
    if (actionOrIndicator.indicators) {
      forEach(actionOrIndicator.indicators, (indicatorAssociation) => {
        if (indicatorAssociation.indicator && indicatorAssociation.indicator.dates) {
          forEach(indicatorAssociation.indicator.dates, (date) => {
            due += date.attributes.due ? 1 : 0;
            overdue += date.attributes.overdue ? 1 : 0;
          });
        }
      });
    }
    // test indicator: return number of reports for each indicator
    if (actionOrIndicator.dates) {
      forEach(actionOrIndicator.dates, (date) => {
        due += date.attributes.due ? 1 : 0;
        overdue += date.attributes.overdue ? 1 : 0;
      });
    }
    if (due) info.push(`${due} due`);
    if (overdue) info.push(`${overdue} overdue`);
    return info;
  }
  getIndicatorCount = (action) => action.indicators
    ? Object.keys(action.indicators).length
    : 0;

  render() {
    const { dataReady, location } = this.props;
    const expandNo = location.query.expand;
    const expandableColumns = [
      {
        label: 'Indicators',
        type: 'indicators',
        getCount: this.getIndicatorCount,
        getEntities: this.getIndicators,
        entityLinkTo: '/indicators/',
        icon: 'indicators',
      },
      {
        label: 'Progress reports',
        type: 'reports',
        getCount: this.getReportCount,
        getInfo: this.getReportInfo,
        getReports: this.getReports,
        getDates: this.getDates,
        entityLinkTo: '/reports/',
        icon: 'reminder',
      },
    ];

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
            extend: {
              path: 'recommendations',
              key: 'recommendation_id',
              as: 'recommendation',
              type: 'single',
            },
          },
          {
            path: 'measure_indicators',
            key: 'measure_id',
            reverse: true,
            as: 'indicators',
            extend: {
              path: 'indicators',
              key: 'indicator_id',
              as: 'indicator',
              type: 'single',
              extend: expandNo ? [
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
                  as: 'measures',
                  extend: {
                    path: 'measures',
                    key: 'measure_id',
                    as: 'measure',
                    type: 'single',
                  },
                },
              ] : [
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
              ],
            },
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
      search: ['title'],
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
            expandable: true,
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
      supTitle: this.context.intl.formatMessage(messages.pageTitle),
      icon: 'actions',
      actions: [{
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
          expandNo={expandNo ? parseInt(expandNo, 10) : 0}
          isExpandable
          expandableColumns={expandableColumns}
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
    'user_roles',
    'due_dates',
    'progress_reports',
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
      dispatch(loadEntitiesIfNeeded('user_roles'));
      dispatch(loadEntitiesIfNeeded('progress_reports'));
      dispatch(loadEntitiesIfNeeded('due_dates'));
    },
    handleNew: () => {
      dispatch(updatePath('/actions/new/'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionList);
