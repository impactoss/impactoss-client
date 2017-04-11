/*
 *
 * IndicatorView
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { browserHistory } from 'react-router';
import { find } from 'lodash/collection';

import { loadEntitiesIfNeeded } from 'containers/App/actions';

import { PUBLISH_STATUSES } from 'containers/App/constants';

import Page from 'components/Page';
import EntityView from 'components/views/EntityView';

import {
  getEntity,
  getEntities,
  isReady,
  isUserManager,
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
  handleEdit = () => {
    browserHistory.push(`/indicators/edit/${this.props.params.id}`);
  }
  handleNewReport = () => {
    browserHistory.push(`/reports/new/${this.props.params.id}`);
  }

  handleClose = () => {
    browserHistory.push('/indicators');
    // TODO should be "go back" if history present or to indicators list when not
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

  render() {
    const { indicator, dataReady, isManager } = this.props;
    const reference = this.props.params.id;
    const status = indicator && find(PUBLISH_STATUSES, { value: indicator.attributes.draft });

    let asideFields = indicator && [{
      id: 'number',
      heading: 'Number',
      value: reference,
    }];
    if (indicator && isManager) {
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
    const pageActions = isManager
    ? [
      {
        type: 'simple',
        title: 'Add progress report',
        onClick: this.handleNewReport,
      },
      {
        type: 'simple',
        title: 'Edit',
        onClick: this.handleEdit,
      },
      {
        type: 'primary',
        title: 'Close',
        onClick: this.handleClose,
      },
    ]
    : [{
      type: 'primary',
      title: 'Close',
      onClick: this.handleClose,
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
                  aside: isManager
                    ? [
                      {
                        id: 'manager',
                        heading: 'Indicator manager',
                        value: indicator.manager && indicator.manager.attributes.name,
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
  indicator: PropTypes.object,
  dataReady: PropTypes.bool,
  isManager: PropTypes.bool,
  actions: PropTypes.object,
  reports: PropTypes.object,
  params: PropTypes.object,
};

IndicatorView.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};


const mapStateToProps = (state, props) => ({
  isManager: isUserManager(state),
  dataReady: isReady(state, { path: [
    'measures',
    'users',
    'indicators',
    'measure_indicators',
    'progress_reports',
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
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('measures'));
      dispatch(loadEntitiesIfNeeded('users'));
      dispatch(loadEntitiesIfNeeded('indicators'));
      dispatch(loadEntitiesIfNeeded('measure_indicators'));
      dispatch(loadEntitiesIfNeeded('progress_reports'));
      dispatch(loadEntitiesIfNeeded('user_roles'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorView);
