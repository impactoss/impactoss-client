/*
 *
 * SdgTargetList
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

export class SdgTargetList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

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
  getIndicators = (sdgtarget) => sdgtarget.indicators
    ? Object.values(sdgtarget.indicators).reduce((memo, indicatorAssociation) =>
      indicatorAssociation.indicator
        ? memo.concat([indicatorAssociation.indicator])
        : memo
    , [])
    : [];

  getReportCount = (sdgtargetOrIndicator) => {
    let count = 0;
    // test sdgtarget:  return sum of reports for all indicators
    if (sdgtargetOrIndicator.indicators) {
      count = Object.values(sdgtargetOrIndicator.indicators).reduce((counter, indicatorAssociation) =>
        counter + (indicatorAssociation.indicator && indicatorAssociation.indicator.reports
          ? Object.keys(indicatorAssociation.indicator.reports).length
          : 0
        )
      , 0);
    }
    // test indicator: return number of reports for each indicator
    if (sdgtargetOrIndicator.reports) {
      count = Object.keys(sdgtargetOrIndicator.reports).length;
    }
    return count;
  }
  getReportInfo = (sdgtargetOrIndicator) => {
    const info = [];
    let due = 0;
    let overdue = 0;
    // test sdgtarget:  return sum of reports for all indicators
    if (sdgtargetOrIndicator.indicators) {
      forEach(sdgtargetOrIndicator.indicators, (indicatorAssociation) => {
        if (indicatorAssociation.indicator && indicatorAssociation.indicator.dates) {
          forEach(indicatorAssociation.indicator.dates, (date) => {
            due += date.attributes.due ? 1 : 0;
            overdue += date.attributes.overdue ? 1 : 0;
          });
        }
      });
    }
    // test indicator: return number of reports for each indicator
    if (sdgtargetOrIndicator.dates) {
      forEach(sdgtargetOrIndicator.dates, (date) => {
        due += date.attributes.due ? 1 : 0;
        overdue += date.attributes.overdue ? 1 : 0;
      });
    }
    if (due) info.push(`${due} due`);
    if (overdue) info.push(`${overdue} overdue`);
    return info;
  }
  getIndicatorCount = (sdgtarget) => sdgtarget.indicators
    ? Object.keys(sdgtarget.indicators).length
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
        path: 'sdgtargets',
        extensions: [
          {
            path: 'sdgtarget_categories',
            key: 'sdgtarget_id',
            reverse: true,
            as: 'taxonomies',
          },
          {
            path: 'sdgtarget_indicators',
            key: 'sdgtarget_id',
            reverse: true,
            as: 'indicators',
            connected: {
              path: 'indicators',
              key: 'indicator_id',
              forward: true,
            },
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
                  path: 'sdgtarget_indicators',
                  key: 'indicator_id',
                  reverse: true,
                  as: 'sdgtargets',
                  extend: {
                    path: 'sdgtargets',
                    key: 'sdgtarget_id',
                    as: 'sdgtarget',
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
        options: ['indicators'],
      },
      taxonomies: { // filter by each category
        out: 'js',
        path: 'taxonomies',
        where: {
          tags_sdgtargets: true,
        },
        extend: {
          path: 'categories',
          key: 'taxonomy_id',
          reverse: true,
        },
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
          path: 'sdgtarget_categories',
          key: 'sdgtarget_id',
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
              path: 'sdgtarget_indicators',
              key: 'sdgtarget_id',
              whereKey: 'indicator_id',
            },
          },
        ],
      },
    };

    const edits = {
      taxonomies: { // edit category
        connectPath: 'sdgtarget_categories',
        key: 'category_id',
        ownKey: 'sdgtarget_id',
        filter: true,
      },
      connections: { // filter by associated entity
        options: [
          {
            filter: true,
            label: this.context.intl.formatMessage(appMessages.entities.indicators.plural),
            path: 'indicators',
            connectPath: 'sdgtarget_indicators',
            key: 'indicator_id',
            ownKey: 'sdgtarget_id',
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
      icon: 'sdgtargets',
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
            single: this.context.intl.formatMessage(appMessages.entities.sdgtargets.single),
            plural: this.context.intl.formatMessage(appMessages.entities.sdgtargets.plural),
          }}
          entityLinkTo="/sdgtargets/"
          expandNo={expandNo ? parseInt(expandNo, 10) : 0}
          isExpandable
          expandableColumns={expandableColumns}
        />
      </div>
    );
  }
}

SdgTargetList.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleNew: PropTypes.func,
  location: PropTypes.object.isRequired,
  dataReady: PropTypes.bool,
};

SdgTargetList.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  dataReady: isReady(state, { path: [
    'sdgtargets',
    'sdgtarget_categories',
    'users',
    'taxonomies',
    'categories',
    'indicators',
    'sdgtarget_indicators',
    'user_roles',
    'due_dates',
    'progress_reports',
  ] }),
});
function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('sdgtargets'));
      dispatch(loadEntitiesIfNeeded('sdgtarget_categories'));
      dispatch(loadEntitiesIfNeeded('users'));
      dispatch(loadEntitiesIfNeeded('taxonomies'));
      dispatch(loadEntitiesIfNeeded('categories'));
      dispatch(loadEntitiesIfNeeded('indicators'));
      dispatch(loadEntitiesIfNeeded('sdgtarget_indicators'));
      dispatch(loadEntitiesIfNeeded('user_roles'));
      dispatch(loadEntitiesIfNeeded('progress_reports'));
      dispatch(loadEntitiesIfNeeded('due_dates'));
    },
    handleNew: () => {
      dispatch(updatePath('/sdgtargets/new/'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SdgTargetList);
