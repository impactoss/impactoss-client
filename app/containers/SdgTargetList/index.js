/*
 *
 * SdgTargetList
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import Helmet from 'react-helmet';
// import { forEach } from 'lodash/collection';
import { Map, List } from 'immutable';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';
import { isReady } from 'containers/App/selectors';
import appMessages from 'containers/App/messages';

import EntityList from 'containers/EntityList';
import { FILTERS, EDITS } from './constants';
import { selectConnections, selectSdgTargets, selectTaxonomies, selectConnectedTaxonomies } from './selectors';


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
  //
  // getReportCount = (sdgtargetOrIndicator) => {
  //   let count = 0;
  //   // test sdgtarget:  return sum of reports for all indicators
  //   if (sdgtargetOrIndicator.indicators) {
  //     count = Object.values(sdgtargetOrIndicator.indicators).reduce((counter, indicatorAssociation) =>
  //       counter + (indicatorAssociation.indicator && indicatorAssociation.indicator.reports
  //         ? Object.keys(indicatorAssociation.indicator.reports).length
  //         : 0
  //       )
  //     , 0);
  //   }
  //   // test indicator: return number of reports for each indicator
  //   if (sdgtargetOrIndicator.reports) {
  //     count = Object.keys(sdgtargetOrIndicator.reports).length;
  //   }
  //   return count;
  // }
  // getReportInfo = (sdgtargetOrIndicator) => {
  //   const info = [];
  //   let due = 0;
  //   let overdue = 0;
  //   // test sdgtarget:  return sum of reports for all indicators
  //   if (sdgtargetOrIndicator.indicators) {
  //     forEach(sdgtargetOrIndicator.indicators, (indicatorAssociation) => {
  //       if (indicatorAssociation.indicator && indicatorAssociation.indicator.dates) {
  //         forEach(indicatorAssociation.indicator.dates, (date) => {
  //           due += date.attributes.due ? 1 : 0;
  //           overdue += date.attributes.overdue ? 1 : 0;
  //         });
  //       }
  //     });
  //   }
  //   // test indicator: return number of reports for each indicator
  //   if (sdgtargetOrIndicator.dates) {
  //     forEach(sdgtargetOrIndicator.dates, (date) => {
  //       due += date.attributes.due ? 1 : 0;
  //       overdue += date.attributes.overdue ? 1 : 0;
  //     });
  //   }
  //   if (due) info.push(`${due} due`);
  //   if (overdue) info.push(`${overdue} overdue`);
  //   return info;
  // }
  // getIndicatorCount = (sdgtarget) => sdgtarget.indicators
  //   ? Object.keys(sdgtarget.indicators).length
  //   : 0;

  render() {
    const { dataReady } = this.props;
    // const expandableColumns = [
    //   {
    //     label: 'Indicators',
    //     type: 'indicators',
    //     entityLinkTo: '/indicators/',
    //     icon: 'indicators',
    //   },
    //   {
    //     label: 'Progress reports',
    //     type: 'reports',
    //     getCount: this.getReportCount,
    //     getInfo: this.getReportInfo,
    //     entityLinkTo: '/reports/',
    //     icon: 'reminder',
    //   },
    // ];

    const headerOptions = {
      supTitle: this.context.intl.formatMessage(messages.pageTitle),
      icon: 'sdgtargets',
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
          taxonomies={this.props.taxonomies}
          connections={this.props.connections}
          connectedTaxonomies={this.props.connectedTaxonomies}
          path="sdgtargets"
          filters={FILTERS}
          edits={EDITS}
          header={headerOptions}
          dataReady={dataReady}
          entityTitle={{
            single: this.context.intl.formatMessage(appMessages.entities.sdgtargets.single),
            plural: this.context.intl.formatMessage(appMessages.entities.sdgtargets.plural),
          }}
          entityLinkTo="/sdgtargets/"
        />
      </div>
    );
  }
}

SdgTargetList.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleNew: PropTypes.func,
  handleImport: PropTypes.func,
  dataReady: PropTypes.bool,
  entities: PropTypes.instanceOf(List).isRequired,
  taxonomies: PropTypes.instanceOf(Map),
  connections: PropTypes.instanceOf(Map),
  connectedTaxonomies: PropTypes.instanceOf(Map),
};

SdgTargetList.contextTypes = {
  intl: PropTypes.object.isRequired,
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
    'measures',
    'sdgtarget_measures',
    'measure_categories',
    'user_roles',
    'due_dates',
    'progress_reports',
  ] }),
  entities: selectSdgTargets(state),
  taxonomies: selectTaxonomies(state),
  connections: selectConnections(state),
  connectedTaxonomies: selectConnectedTaxonomies(state),
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
      dispatch(loadEntitiesIfNeeded('measures'));
      dispatch(loadEntitiesIfNeeded('sdgtarget_measures'));
      dispatch(loadEntitiesIfNeeded('measure_categories'));
      dispatch(loadEntitiesIfNeeded('user_roles'));
      dispatch(loadEntitiesIfNeeded('progress_reports'));
      dispatch(loadEntitiesIfNeeded('due_dates'));
    },
    handleNew: () => {
      dispatch(updatePath('/sdgtargets/new/'));
    },
    handleImport: () => {
      dispatch(updatePath('/sdgtargets/import/'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SdgTargetList);
