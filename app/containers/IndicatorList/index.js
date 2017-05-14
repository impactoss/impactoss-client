/*
 *
 * IndicatorList
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

export class IndicatorList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

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
  render() {
    const { dataReady, location } = this.props;
    const expandNo = location.query.expand;
    const expandableColumns = [
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
        path: 'indicators',
        extensions: [
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
          {
            single: true,
            path: 'users',
            key: 'manager_id',
            as: 'manager',
          },
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
      connections: {
        options: ['measures'],
      },
      connectedTaxonomies: { // filter by each category
        options: [
          {
            out: 'js',
            path: 'taxonomies',
            where: {
              tags_measures: true,
            },
            extend: {
              path: 'categories',
              key: 'taxonomy_id',
              reverse: true,
              extend: {
                path: 'measure_categories',
                key: 'category_id',
                reverse: true,
                as: 'measures',
              },
            },
          },
        ],
      },
    };

    // specify the filter and query  options
    const filters = {
      search: ['title'],
      keyword: {
        attributes: [
          'id',
          'title',
          'description',
        ],
      },
      attributes: {  // filter by attribute value
        options: [
          {
            filter: false,
            label: this.context.intl.formatMessage(appMessages.attributes.draft),
            attribute: 'draft',
            options: PUBLISH_STATUSES,
          },
          {
            filter: true,
            label: this.context.intl.formatMessage(appMessages.attributes.manager_id.indicators),
            attribute: 'manager_id',
            extension: {
              key: 'manager',
              label: 'name',
              without: true,
            },
          },
        ],
      },
      connections: { // filter by associated entity
        label: 'By connection',
        options: [
          {
            label: this.context.intl.formatMessage(appMessages.entities.measures.plural),
            path: 'measures', // filter by indicator connection
            query: 'actions',
            key: 'measure_id',
            connected: {
              path: 'measure_indicators',
              key: 'indicator_id',
              whereKey: 'measure_id',
            },
          },
        ],
      },
      connectedTaxonomies: { // filter by each category
        query: 'catx',
        filter: true,
        connections: [{
          path: 'measures', // filter by recommendation connection
          title: this.context.intl.formatMessage(appMessages.entities.measures.plural),
          key: 'measure_id',
          connected: {
            path: 'measure_indicators',
            key: 'indicator_id',
            connected: {
              path: 'measure_categories',
              key: 'measure_id',
              attribute: 'measure_id',
              whereKey: 'category_id',
            },
          },
        }],
      },
    };
    const edits = {
      connections: { // filter by associated entity
        options: [
          {
            label: this.context.intl.formatMessage(appMessages.entities.measures.plural),
            path: 'measures', // filter by recommendation connection
            connectPath: 'measure_indicators',
            key: 'measure_id',
            ownKey: 'indicator_id',
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
      icon: 'indicators',
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
            single: this.context.intl.formatMessage(appMessages.entities.indicators.single),
            plural: this.context.intl.formatMessage(appMessages.entities.indicators.plural),
          }}
          entityLinkTo="/indicators/"
          expandNo={expandNo ? parseInt(expandNo, 10) : 0}
          isExpandable
          expandableColumns={expandableColumns}
        />
      </div>
    );
  }
}

IndicatorList.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleNew: PropTypes.func,
  location: PropTypes.object.isRequired,
  dataReady: PropTypes.bool,
};

IndicatorList.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  dataReady: isReady(state, { path: [
    'indicators',
    'users',
    'taxonomies',
    'categories',
    'measures',
    'measure_indicators',
    'measure_categories',
    'user_roles',
    'due_dates',
    'progress_reports',
  ] }),
});
function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('indicators'));
      dispatch(loadEntitiesIfNeeded('users'));
      dispatch(loadEntitiesIfNeeded('taxonomies'));
      dispatch(loadEntitiesIfNeeded('categories'));
      dispatch(loadEntitiesIfNeeded('measures'));
      dispatch(loadEntitiesIfNeeded('measure_indicators'));
      dispatch(loadEntitiesIfNeeded('measure_categories'));
      dispatch(loadEntitiesIfNeeded('user_roles'));
      dispatch(loadEntitiesIfNeeded('progress_reports'));
      dispatch(loadEntitiesIfNeeded('due_dates'));
    },
    handleNew: () => {
      dispatch(updatePath('/indicators/new/'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorList);
