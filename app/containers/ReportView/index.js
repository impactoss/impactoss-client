/*
 *
 * ReportView
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';

import { CONTENT_SINGLE } from 'containers/App/constants';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityView from 'components/EntityView';

import {
  getEntity,
  isReady,
  isUserContributor,
} from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
import messages from './messages';

export class ReportView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }
  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }
  getHeaderMainFields = (entity, isManager) => ([ // fieldGroups
    { // fieldGroup
      fields: [
        {
          type: 'title',
          value: entity.attributes.title,
          isManager,
        },
      ],
    },
  ]);

  getHeaderAsideFields = (entity, isContributor) => {
    if (!isContributor) {
      return [
        {
          fields: [
            {
              type: 'referenceStatus',
              fields: [
                {
                  type: 'reference',
                  value: entity.id,
                  large: true,
                },
              ],
            },
          ],
        },
      ];
    }
    return [
      {
        fields: [
          {
            type: 'referenceStatus',
            fields: [
              {
                type: 'reference',
                value: entity.id,
              },
              {
                type: 'status',
                value: entity.attributes.draft,
              },
            ],
          },
          {
            type: 'meta',
            fields: [
              {
                label: this.context.intl.formatMessage(appMessages.attributes.meta.updated_at),
                value: this.context.intl.formatDate(new Date(entity.attributes.updated_at)),
              },
              {
                label: this.context.intl.formatMessage(appMessages.attributes.meta.updated_by),
                value: entity.user && entity.user.attributes.name,
              },
            ],
          },
        ],
      },
    ];
  }
  getBodyMainFields = (entity, isContributor) => ([
    {
      fields: [
        {
          type: 'description',
          value: entity.attributes.description,
        },
        {
          type: 'download',
          value: entity.attributes.document_url,
          isManager: isContributor,
          public: entity.attributes.document_public,
          showEmpty: this.context.intl.formatMessage(appMessages.attributes.documentEmpty),
        },
      ],
    },
  ]);
  getBodyAsideFields = (entity) => ([ // fieldGroups
    {
      type: 'dark',
      fields: [
        {
          type: 'date',
          value: entity.date && entity.date.attributes.due_date && this.context.intl.formatDate(new Date(entity.date.attributes.due_date)),
          label: this.context.intl.formatMessage(appMessages.entities.due_dates.single),
          showEmpty: this.context.intl.formatMessage(appMessages.entities.progress_reports.unscheduled),
        },
      ],
    },
  ]);
  getFields = (entity, isContributor) => ({
    header: {
      main: this.getHeaderMainFields(entity, isContributor),
      aside: this.getHeaderAsideFields(entity, isContributor),
    },
    body: {
      main: this.getBodyMainFields(entity, isContributor),
      aside: isContributor ? this.getBodyAsideFields(entity) : null,
    },
  });

  render() {
    const { report, dataReady, isContributor } = this.props;

    let pageTitle = this.context.intl.formatMessage(messages.pageTitle);
    if (report && dataReady) {
      pageTitle = `${pageTitle} for indicator: ${report.attributes.indicator_id}`;
    }

    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.pageTitle)}: ${this.props.params.id}`}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <Content>
          <ContentHeader
            title={pageTitle}
            type={CONTENT_SINGLE}
            icon="report"
            buttons={isContributor
              ? [
                {
                  type: 'edit',
                  onClick: this.props.handleEdit,
                },
                {
                  type: 'close',
                  onClick: () => this.props.handleClose(this.props.report.indicator.id),
                },
              ]
              : [
                {
                  type: 'close',
                  onClick: () => this.props.handleClose(this.props.report.indicator.id),
                },
              ]
             }
          />
          { !report && !dataReady &&
            <Loading />
          }
          { !report && dataReady &&
            <div>
              <FormattedMessage {...messages.notFound} />
            </div>
          }
          { report && dataReady &&
            <EntityView
              fields={this.getFields(report, isContributor)}
            />
          }
        </Content>
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
  isContributor: PropTypes.bool,
  params: PropTypes.object,
};

ReportView.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  isContributor: isUserContributor(state),
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
