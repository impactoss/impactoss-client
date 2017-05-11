/*
 *
 * ReportView
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
import DocumentView from 'components/DocumentView';

import {
  getEntity,
  isReady,
} from 'containers/App/selectors';

import messages from './messages';

export class ReportView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  render() {
    const { report, dataReady } = this.props;
    const reference = this.props.params.id;
    const status = report && find(PUBLISH_STATUSES, { value: report.attributes.draft });

    let pageTitle = this.context.intl.formatMessage(messages.pageTitle);

    if (report) {
      pageTitle = `${pageTitle} (Indicator: ${report.attributes.indicator_id})`;
    }

    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.pageTitle)}: ${reference}`}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        { !report && !dataReady &&
          <div>
            <FormattedMessage {...messages.loading} />
          </div>
        }
        { !report && dataReady &&
          <div>
            <FormattedMessage {...messages.notFound} />
          </div>
        }
        { report && dataReady &&
          <Page
            title={pageTitle}
            actions={[
              {
                type: 'simple',
                title: 'Edit',
                onClick: this.props.handleEdit,
              },
              {
                type: 'primary',
                title: 'Close',
                onClick: () => this.props.handleClose(this.props.report.indicator.id),
              },
            ]}
          >
            <EntityView
              fields={{
                header: {
                  main: [
                    {
                      id: 'title',
                      value: report.attributes.title,
                    },
                  ],
                  aside: [
                    {
                      id: 'number',
                      heading: 'Number',
                      value: reference,
                    },
                    {
                      id: 'status',
                      heading: 'Status',
                      value: status && status.label,
                    },
                    {
                      id: 'updated',
                      heading: 'Updated At',
                      value: report.attributes.updated_at,
                    },
                    {
                      id: 'updated_by',
                      heading: 'Updated By',
                      value: report.user && report.user.attributes.name,
                    },
                  ],
                },
                body: {
                  main: [
                    report.date ? {
                      id: 'date',
                      heading: 'Scheduled Date',
                      value: report.date.attributes.due_date,
                    } : null,
                    {
                      id: 'description',
                      heading: 'Description',
                      value: report.attributes.description,
                    },
                    {
                      id: 'document_url',
                      heading: 'Document URL',
                      value: <DocumentView url={report.attributes.document_url} status={report.attributes.document_public} />,
                    },
                  ],
                },
              }}
            />
          </Page>
        }
      </div>
    );
  }
}

ReportView.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleClose: PropTypes.func,
  handleEdit: PropTypes.func,
  report: PropTypes.object,
  dataReady: PropTypes.bool,
  params: PropTypes.object,
};

ReportView.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  dataReady: isReady(state, { path: [
    'progress_reports',
    'users',
    'indicators',
    'due_dates',
  ] }),
  report: getEntity(
    state,
    {
      id: props.params.id,
      path: 'progress_reports',
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
          path: 'indicators',
          key: 'indicator_id',
          as: 'indicator',
        },
        {
          type: 'single',
          path: 'due_dates',
          key: 'due_date_id',
          as: 'date',
        },
      ],
    },
  ),
});

function mapDispatchToProps(dispatch, props) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('indicators'));
      dispatch(loadEntitiesIfNeeded('progress_reports'));
      dispatch(loadEntitiesIfNeeded('users'));
      dispatch(loadEntitiesIfNeeded('due_dates'));
    },
    handleEdit: () => {
      dispatch(updatePath(`/reports/edit/${props.params.id}`));
    },
    handleClose: (indicatorId) => {
      dispatch(updatePath(`/indicators/${indicatorId}`));
      // TODO should be "go back" if history present or to reports list when not
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportView);
