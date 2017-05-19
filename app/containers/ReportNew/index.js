/*
 *
 * ReportNew
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import {
  validateRequired,
} from 'utils/forms';

import { DOC_PUBLISH_STATUSES, PUBLISH_STATUSES, CONTENT_SINGLE } from 'containers/App/constants';
import appMessages from 'containers/App/messages';

import {
  loadEntitiesIfNeeded,
  updatePath,
  updateEntityForm,
} from 'containers/App/actions';

import { getEntity, isReady } from 'containers/App/selectors';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'components/forms/EntityForm';

import viewDomainSelect from './selectors';
import messages from './messages';
import { save } from './actions';


export class ReportNew extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }
  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }

  getHeaderMainFields = () => ([ // fieldGroups
    { // fieldGroup
      fields: [
        {
          id: 'title',
          controlType: 'title',
          model: '.attributes.title',
          label: this.context.intl.formatMessage(appMessages.attributes.title),
          placeholder: this.context.intl.formatMessage(appMessages.placeholders.title),
          validators: {
            required: validateRequired,
          },
          errorMessages: {
            required: this.context.intl.formatMessage(appMessages.forms.fieldRequired),
          },
        },
      ],
    },
  ]);

  getHeaderAsideFields = () => ([
    {
      fields: [
        {
          id: 'status',
          controlType: 'select',
          model: '.attributes.draft',
          label: this.context.intl.formatMessage(appMessages.attributes.draft),
          value: true,
          options: PUBLISH_STATUSES,
        },
      ],
    },
  ]);

  getBodyMainFields = () => ([
    {
      fields: [
        {
          id: 'description',
          controlType: 'markdown',
          model: '.attributes.description',
          placeholder: this.context.intl.formatMessage(appMessages.placeholders.description),
          label: this.context.intl.formatMessage(appMessages.attributes.description),
        },
        {
          id: 'document_url',
          controlType: 'uploader',
          model: '.attributes.document_url',
          label: this.context.intl.formatMessage(appMessages.attributes.document_url),
        },
        {
          id: 'document_public',
          controlType: 'select',
          model: '.attributes.document_public',
          options: DOC_PUBLISH_STATUSES,
          value: true,
          label: this.context.intl.formatMessage(appMessages.attributes.document_public),
        },
      ],
    },
  ]);
  getDateOptions = (dates) => {
    const dateOptions = [
      {
        value: 0,
        label: this.context.intl.formatMessage(appMessages.entities.progress_reports.unscheduled_short),
        checked: true,
      },
    ];
    return dates
      ? Object.values(dates).reduce((memo, date) => {
        // only allow active and those that are not associated
        if (typeof date.reportCount !== 'undefined' && date.reportCount === 0) {
          const label =
            `${this.context.intl.formatDate(new Date(date.attributes.due_date))} ${
              date.attributes.overdue ? this.context.intl.formatMessage(appMessages.entities.due_dates.overdue) : ''} ${
              date.attributes.due ? this.context.intl.formatMessage(appMessages.entities.due_dates.due) : ''}`;
          return memo.concat([
            {
              value: parseInt(date.id, 10),
              label,
              highlight: date.attributes.overdue,
              checked: false,
            },
          ]);
        }
        return memo;
      }, dateOptions)
    : dateOptions;
  }
  getBodyAsideFields = (indicator) => ([ // fieldGroups
    { // fieldGroup
      label: this.context.intl.formatMessage(appMessages.entities.due_dates.single),
      icon: 'calendar',
      fields: indicator
        ? [{
          id: 'due_date_id',
          controlType: 'radio',
          model: '.attributes.due_date_id',
          options: this.getDateOptions(indicator.dates),
          value: 0,
          hints: {
            1: this.context.intl.formatMessage(appMessages.entities.due_dates.empty),
          },
        }]
        : [],
    },
  ]);

  getFields = (indicator) => ({ // isManager, taxonomies,
    header: {
      main: this.getHeaderMainFields(),
      aside: this.getHeaderAsideFields(),
    },
    body: {
      main: this.getBodyMainFields(),
      aside: this.getBodyAsideFields(indicator),
    },
  })
  render() {
    const { dataReady, indicator, viewDomain } = this.props;
    const { saveSending, saveError } = viewDomain.page;
    const indicatorReference = this.props.params.id;

    let pageTitle = this.context.intl.formatMessage(messages.pageTitle);
    pageTitle = `${pageTitle} for indicator ${indicatorReference}`;

    return (
      <div>
        <Helmet
          title={this.context.intl.formatMessage(messages.pageTitle)}
          meta={[
            {
              name: 'description',
              content: this.context.intl.formatMessage(messages.metaDescription),
            },
          ]}
        />
        <Content>
          <ContentHeader
            title={pageTitle}
            type={CONTENT_SINGLE}
            icon="reports"
            buttons={
              dataReady ? [{
                type: 'cancel',
                onClick: () => this.props.handleCancel(indicatorReference),
              },
              {
                type: 'save',
                onClick: () => this.props.handleSubmit(viewDomain.form.data, indicatorReference),
              }] : null
            }
          />
          {saveSending &&
            <p>Saving Action</p>
          }
          {saveError &&
            <p>{saveError}</p>
          }
          { !dataReady &&
            <Loading />
          }
          {dataReady &&
            <EntityForm
              model="reportNew.form.data"
              formData={viewDomain.form.data}
              handleSubmit={(formData) => this.props.handleSubmit(
                formData,
                indicatorReference
              )}
              handleCancel={() => this.props.handleCancel(indicatorReference)}
              handleUpdate={this.props.handleUpdate}
              fields={this.getFields(indicator)}
            />
          }
        </Content>
      </div>
    );
  }
}

ReportNew.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
  dataReady: PropTypes.bool,
  indicator: PropTypes.object,
  params: PropTypes.object,
};

ReportNew.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  viewDomain: viewDomainSelect(state),
  dataReady: isReady(state, { path: [
    'indicators',
    'due_dates',
    'progress_reports',
  ] }),
  indicator: getEntity(
    state,
    {
      id: props.params.id,
      path: 'indicators',
      extend: {
        path: 'due_dates',
        key: 'indicator_id',
        reverse: true,
        as: 'dates',
        without: {
          path: 'progress_reports',
          key: 'due_date_id',
        },
        extend: {
          type: 'count',
          path: 'progress_reports',
          key: 'due_date_id',
          reverse: true,
          as: 'reportCount',
        },
      },
    },
  ),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('progress_reports'));
      dispatch(loadEntitiesIfNeeded('due_dates'));
      dispatch(loadEntitiesIfNeeded('indicators'));
    },
    handleSubmit: (formData, indicatorReference) => {
      let saveData = formData;

      saveData = saveData.setIn(['attributes', 'indicator_id'], indicatorReference);

      const dateAssigned = formData.getIn(['attributes', 'due_date_id']);
      if (dateAssigned === 0) {
        saveData = saveData.setIn(['attributes', 'due_date_id'], null);
      }

      dispatch(save(saveData.toJS()));
    },
    handleCancel: (indicatorReference) => {
      dispatch(updatePath(`/indicators/${indicatorReference}`));
    },
    handleUpdate: (formData) => {
      dispatch(updateEntityForm(formData));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportNew);
