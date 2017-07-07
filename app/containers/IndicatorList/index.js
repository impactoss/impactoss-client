/*
 *
 * IndicatorList
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { forEach } from 'lodash/collection';
import { Map, List } from 'immutable';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';
import { isReady } from 'containers/App/selectors';
import appMessages from 'containers/App/messages';

import EntityList from 'containers/EntityList';
import { FILTERS, EDITS } from './constants';
import { selectConnections, selectIndicators, selectConnectedTaxonomies } from './selectors';

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
  getReportCount = (measureOrIndicator) => {
    let count = 0;
    // test measure:  return sum of reports for all indicators
    if (measureOrIndicator.indicators) {
      count = Object.values(measureOrIndicator.indicators).reduce((counter, indicatorAssociation) =>
        counter + (indicatorAssociation.indicator && indicatorAssociation.indicator.reports
          ? Object.keys(indicatorAssociation.indicator.reports).length
          : 0
        )
      , 0);
    }
    // test indicator: return number of reports for each indicator
    if (measureOrIndicator.reports) {
      count = Object.keys(measureOrIndicator.reports).length;
    }
    return count;
  }
  getReportInfo = (measureOrIndicator) => {
    const info = [];
    let due = 0;
    let overdue = 0;
    // test measure:  return sum of reports for all indicators
    if (measureOrIndicator.indicators) {
      forEach(measureOrIndicator.indicators, (indicatorAssociation) => {
        if (indicatorAssociation.indicator && indicatorAssociation.indicator.dates) {
          forEach(indicatorAssociation.indicator.dates, (date) => {
            due += date.attributes.due ? 1 : 0;
            overdue += date.attributes.overdue ? 1 : 0;
          });
        }
      });
    }
    // test indicator: return number of reports for each indicator
    if (measureOrIndicator.dates) {
      forEach(measureOrIndicator.dates, (date) => {
        due += date.attributes.due ? 1 : 0;
        overdue += date.attributes.overdue ? 1 : 0;
      });
    }
    if (due) info.push(`${due} due`);
    if (overdue) info.push(`${overdue} overdue`);
    return info;
  }
  render() {
    const { dataReady } = this.props;
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

    // specify the filter and query  options

    const headerOptions = {
      supTitle: this.context.intl.formatMessage(messages.pageTitle),
      icon: 'indicators',
      actions: [{
        type: 'text',
        title: 'Import',
        onClick: () => this.props.handleImport(),
      }, {
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
          entities={this.props.entities}
          connections={this.props.connections}
          connectedTaxonomies={this.props.connectedTaxonomies}
          path="indicators"
          filters={FILTERS}
          edits={EDITS}
          header={headerOptions}
          dataReady={dataReady}
          entityTitle={{
            single: this.context.intl.formatMessage(appMessages.entities.indicators.single),
            plural: this.context.intl.formatMessage(appMessages.entities.indicators.plural),
          }}
          entityLinkTo="/indicators/"
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
  handleImport: PropTypes.func,
  dataReady: PropTypes.bool,
  entities: PropTypes.instanceOf(List).isRequired,
  connections: PropTypes.instanceOf(Map),
  connectedTaxonomies: PropTypes.instanceOf(Map),
};

IndicatorList.contextTypes = {
  intl: PropTypes.object.isRequired,
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
    'sdgtargets',
    'sdgtarget_indicators',
    'sdgtarget_categories',
    'user_roles',
    'due_dates',
    'progress_reports',
  ] }),
  entities: selectIndicators(state),
  connections: selectConnections(state),
  connectedTaxonomies: selectConnectedTaxonomies(state),
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
      dispatch(loadEntitiesIfNeeded('sdgtargets'));
      dispatch(loadEntitiesIfNeeded('sdgtarget_indicators'));
      dispatch(loadEntitiesIfNeeded('sdgtarget_categories'));
      dispatch(loadEntitiesIfNeeded('user_roles'));
      dispatch(loadEntitiesIfNeeded('progress_reports'));
      dispatch(loadEntitiesIfNeeded('due_dates'));
    },
    handleNew: () => {
      dispatch(updatePath('/indicators/new/'));
    },
    handleImport: () => {
      dispatch(updatePath('/indicators/import/'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorList);
