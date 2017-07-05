/*
 *
 * ActionList
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { forEach } from 'lodash/collection';
import { Map } from 'immutable';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';
import { isReady } from 'containers/App/selectors';
import appMessages from 'containers/App/messages';

import EntityList from 'containers/EntityList';
import { FILTERS, EDITS } from './constants';
import { selectConnections, selectMeasures, selectTaxonomies, selectConnectedTaxonomies } from './selectors';

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
  getIndicators = (measure) => measure.indicators
    ? Object.values(measure.indicators).reduce((memo, indicatorAssociation) =>
      indicatorAssociation.indicator
        ? memo.concat([indicatorAssociation.indicator])
        : memo
    , [])
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
  getIndicatorCount = (measure) => measure.indicators
    ? Object.keys(measure.indicators).length
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

    const headerOptions = {
      supTitle: this.context.intl.formatMessage(messages.pageTitle),
      icon: 'measures',
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
          location={this.props.location}
          entities={this.props.entities}
          taxonomies={this.props.taxonomies}
          connections={this.props.connections}
          connectedTaxonomies={this.props.connectedTaxonomies}
          path="measures"
          filters={FILTERS}
          edits={EDITS}
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
  handleImport: PropTypes.func,
  location: PropTypes.object.isRequired,
  dataReady: PropTypes.bool,
  entities: PropTypes.instanceOf(Map).isRequired,
  taxonomies: PropTypes.instanceOf(Map),
  connections: PropTypes.instanceOf(Map),
  connectedTaxonomies: PropTypes.instanceOf(Map),
};

ActionList.contextTypes = {
  intl: PropTypes.object.isRequired,
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
    'sdgtargets',
    'sdgtarget_measures',
    'sdgtarget_categories',
    'indicators',
    'measure_indicators',
    'user_roles',
    'due_dates',
    'progress_reports',
  ] }),
  entities: selectMeasures(state),
  taxonomies: selectTaxonomies(state),
  connections: selectConnections(state),
  connectedTaxonomies: selectConnectedTaxonomies(state),
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
      dispatch(loadEntitiesIfNeeded('sdgtargets'));
      dispatch(loadEntitiesIfNeeded('sdgtarget_measures'));
      dispatch(loadEntitiesIfNeeded('sdgtarget_categories'));
      dispatch(loadEntitiesIfNeeded('indicators'));
      dispatch(loadEntitiesIfNeeded('measure_indicators'));
      dispatch(loadEntitiesIfNeeded('user_roles'));
      dispatch(loadEntitiesIfNeeded('progress_reports'));
      dispatch(loadEntitiesIfNeeded('due_dates'));
    },
    handleNew: () => {
      dispatch(updatePath('/actions/new/'));
    },
    handleImport: () => {
      dispatch(updatePath('/actions/import/'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionList);
