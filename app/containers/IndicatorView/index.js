/*
 *
 * IndicatorView
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { find } from 'lodash/collection';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';

import { PUBLISH_STATUSES } from 'containers/App/constants';

import Page from 'components/Page';
import EntityView from 'components/views/EntityView';

import {
  getEntity,
  getEntities,
  isReady,
  isUserContributor,
} from 'containers/App/selectors';

import messages from './messages';

export class IndicatorView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }
  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }

  mapActions = (actions) =>
    Object.values(actions).map((action) => ({
      label: action.attributes.title,
      linkTo: `/actions/${action.id}`,
    }))
  mapReports = (reports) =>
    Object.values(reports).map((report) => ({
      label: report.attributes.title,
      linkTo: `/reports/${report.id}`,
    }))
  mapDates = (dates) =>
    Object.values(dates).map((date) => ({
      label: date.attributes.due_date,
    }))

  render() {
    const { indicator, dataReady, isContributor } = this.props;
    const reference = this.props.params.id;
    const status = indicator && find(PUBLISH_STATUSES, { value: indicator.attributes.draft });

    let asideFields = indicator && [{
      id: 'number',
      heading: 'Number',
      value: reference,
    }];
    if (indicator && isContributor) {
      asideFields = asideFields.concat([
        {
          id: 'status',
          heading: 'Status',
          value: status && status.label,
        },
        {
          id: 'updated',
          heading: 'Updated At',
          value: indicator.attributes.updated_at,
        },
        {
          id: 'updated_by',
          heading: 'Updated By',
          value: indicator.user && indicator.user.attributes.name,
        },
      ]);
    }
    const pageActions = isContributor
    ? [
      {
        type: 'simple',
        title: 'Add progress report',
        onClick: this.props.handleNewReport,
      },
      {
        type: 'simple',
        title: 'Edit',
        onClick: this.props.handleEdit,
      },
      {
        type: 'primary',
        title: 'Close',
        onClick: this.props.handleClose,
      },
    ]
    : [{
      type: 'primary',
      title: 'Close',
      onClick: this.props.handleClose,
    }];

    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.pageTitle)}: ${reference}`}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <Page
          title={this.context.intl.formatMessage(messages.pageTitle)}
          actions={pageActions}
        >
          { !indicator && !dataReady &&
            <div>
              <FormattedMessage {...messages.loading} />
            </div>
          }
          { !indicator && dataReady &&
            <div>
              <FormattedMessage {...messages.notFound} />
            </div>
          }
          { indicator &&
            <EntityView
              fields={{
                header: {
                  main: [
                    {
                      id: 'title',
                      value: indicator.attributes.title,
                    },
                  ],
                  aside: asideFields,
                },
                body: {
                  main: [
                    {
                      id: 'description',
                      heading: 'Description',
                      value: indicator.attributes.description,
                    },
                    {
                      id: 'actions',
                      heading: 'Actions',
                      type: 'list',
                      values: this.mapActions(this.props.actions),
                    },
                    {
                      id: 'reports',
                      heading: 'Progress reports',
                      type: 'list',
                      values: this.mapReports(this.props.reports),
                    },
                  ],
                  aside: isContributor
                    ? [
                      {
                        id: 'manager',
                        heading: 'Assigned user',
                        value: indicator.manager && indicator.manager.attributes.name,
                      },
                      {
                        id: 'start',
                        heading: 'Reporting due date',
                        value: indicator.attributes.start_date,
                      },
                      {
                        id: 'repeat',
                        heading: 'Repeat?',
                        value: indicator.attributes.repeat.toString(),
                      },
                      indicator.attributes.repeat ? {
                        id: 'frequency',
                        heading: 'Reporting frequency in months',
                        value: indicator.attributes.frequency_months,
                      } : null,
                      indicator.attributes.repeat ? {
                        id: 'end',
                        heading: 'Reporting end date',
                        value: indicator.attributes.end_date,
                      } : null,
                      {
                        id: 'dates',
                        heading: 'Scheduled report dates',
                        type: 'list',
                        values: this.mapDates(this.props.dates),
                      },
                    ]
                    : [],
                },
              }}
            />
          }
        </Page>
      </div>
    );
  }
}

IndicatorView.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleEdit: PropTypes.func,
  handleClose: PropTypes.func,
  handleNewReport: PropTypes.func,
  indicator: PropTypes.object,
  dataReady: PropTypes.bool,
  isContributor: PropTypes.bool,
  actions: PropTypes.object,
  reports: PropTypes.object,
  dates: PropTypes.object,
  params: PropTypes.object,
};

IndicatorView.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};


const mapStateToProps = (state, props) => ({
  isContributor: isUserContributor(state),
  dataReady: isReady(state, { path: [
    'measures',
    'users',
    'indicators',
    'measure_indicators',
    'progress_reports',
    'due_dates',
  ] }),
  indicator: getEntity(
    state,
    {
      id: props.params.id,
      path: 'indicators',
      out: 'js',
      extend: [
        {
          type: 'single',
          path: 'users',
          key: 'last_modified_user_id',
          as: 'user',
        },
        {
          type: 'single',
          path: 'users',
          key: 'manager_id',
          as: 'manager',
        },
      ],
    },
  ),

  // all connected actions
  actions: getEntities(
    state, {
      path: 'measures',
      out: 'js',
      connected: {
        path: 'measure_indicators',
        key: 'measure_id',
        where: {
          indicator_id: props.params.id,
        },
      },
    },
  ),
  // all connected reports
  reports: getEntities(
    state, {
      path: 'progress_reports',
      out: 'js',
      where: {
        indicator_id: props.params.id,
      },
    },
  ),
  // all connected due_dates
  dates: getEntities(
    state, {
      path: 'due_dates',
      out: 'js',
      where: {
        indicator_id: props.params.id,
      },
      without: {
        path: 'progress_reports',
        key: 'due_date_id',
      },
    },
  ),
});

function mapDispatchToProps(dispatch, props) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('measures'));
      dispatch(loadEntitiesIfNeeded('users'));
      dispatch(loadEntitiesIfNeeded('indicators'));
      dispatch(loadEntitiesIfNeeded('measure_indicators'));
      dispatch(loadEntitiesIfNeeded('progress_reports'));
      dispatch(loadEntitiesIfNeeded('user_roles'));
      dispatch(loadEntitiesIfNeeded('due_dates'));
    },
    handleEdit: () => {
      dispatch(updatePath(`/indicators/edit/${props.params.id}`));
    },
    handleNewReport: () => {
      dispatch(updatePath(`/reports/new/${props.params.id}`));
    },
    handleClose: () => {
      dispatch(updatePath('/indicators'));
      // TODO should be "go back" if history present or to indicators list when not
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorView);
