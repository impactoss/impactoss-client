/*
 *
 * ReportEdit
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { actions as formActions } from 'react-redux-form/immutable';

import { fromJS, Map } from 'immutable';

import {
  validateRequired,
} from 'utils/forms';

import { DOC_PUBLISH_STATUSES, PUBLISH_STATUSES, USER_ROLES, CONTENT_SINGLE } from 'containers/App/constants';
import appMessages from 'containers/App/messages';

import {
  loadEntitiesIfNeeded,
  redirectIfNotPermitted,
  updatePath,
  updateEntityForm,
} from 'containers/App/actions';

import {
  getEntity,
  isReady,
} from 'containers/App/selectors';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'components/forms/EntityForm';

import viewDomainSelect from './selectors';
import messages from './messages';
import { save } from './actions';

export class ReportEdit extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();

    if (this.props.dataReady && this.props.report) {
      this.props.populateForm('reportEdit.form.data', this.getInitialFormData());
    }
  }

  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }

    if (nextProps.dataReady && !this.props.dataReady && nextProps.report) {
      this.props.redirectIfNotPermitted();
      this.props.populateForm('reportEdit.form.data', this.getInitialFormData(nextProps));
    }
  }

  getInitialFormData = (nextProps) => {
    const props = nextProps || this.props;
    const { report } = props;
    if (!report.attributes.due_date_id) {
      report.attributes.due_date_id = 0;
    }
    return Map({
      id: report.id,
      attributes: fromJS(report.attributes),
    });
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

  getHeaderAsideFields = (entity) => ([
    {
      fields: [
        {
          controlType: 'combo',
          fields: [
            {
              controlType: 'info',
              type: 'reference',
              value: entity.id,
            },
            {
              id: 'status',
              controlType: 'select',
              model: '.attributes.draft',
              label: this.context.intl.formatMessage(appMessages.attributes.draft),
              value: entity.attributes.draft,
              options: PUBLISH_STATUSES,
            },
          ],
        },
        {
          controlType: 'info',
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
  ]);

  getBodyMainFields = (entity) => ([
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
          value: entity.attributes.document_public,
          label: this.context.intl.formatMessage(appMessages.attributes.document_public),
        },
      ],
    },
  ]);
  getDateOptions = (dates, activeDateId) => {
    const dateOptions = [
      {
        value: 0,
        label: this.context.intl.formatMessage(appMessages.entities.progress_reports.unscheduled_short),
        checked: activeDateId === null || activeDateId === 0 || activeDateId === '',
      },
    ];
    return Object.values(dates).reduce((memo, date) => {
      // only allow active and those that are not associated
      if ((typeof date.reportCount !== 'undefined' && date.reportCount === 0)
      || (activeDateId ? activeDateId.toString() === date.id : false)) {
        const label =
          `${this.context.intl.formatDate(new Date(date.attributes.due_date))} ${
            date.attributes.overdue ? this.context.intl.formatMessage(appMessages.entities.due_dates.overdue) : ''} ${
            date.attributes.due ? this.context.intl.formatMessage(appMessages.entities.due_dates.due) : ''}`;
        return memo.concat([
          {
            value: parseInt(date.id, 10),
            label,
            highlight: date.attributes.overdue,
            checked: activeDateId ? date.id === activeDateId : false,
          },
        ]);
      }
      return memo;
    }, dateOptions);
  }
  getBodyAsideFields = (entity) => ([ // fieldGroups
    { // fieldGroup
      label: this.context.intl.formatMessage(appMessages.entities.due_dates.single),
      icon: 'calendar',
      fields: entity.indicator && entity.indicator.dates
        ? [{
          id: 'due_date_id',
          controlType: 'radio',
          model: '.attributes.due_date_id',
          options: this.getDateOptions(entity.indicator.dates, entity.attributes.due_date_id),
          value: entity.attributes.due_date_id || 0,
          hints: {
            1: this.context.intl.formatMessage(appMessages.entities.due_dates.empty),
          },
        }]
        : [],
    },
  ]);

  getFields = (entity) => ({ // isManager, taxonomies,
    header: {
      main: this.getHeaderMainFields(),
      aside: this.getHeaderAsideFields(entity),
    },
    body: {
      main: this.getBodyMainFields(entity),
      aside: this.getBodyAsideFields(entity),
    },
  })
  render() {
    const { report, dataReady, viewDomain } = this.props;
    const reference = this.props.params.id;
    const { saveSending, saveError } = viewDomain.page;

    let pageTitle = this.context.intl.formatMessage(messages.pageTitle);
    if (report && dataReady) {
      pageTitle = `${pageTitle} for indicator ${report.attributes.indicator_id}`;
    }
    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.pageTitle)}: ${reference}`}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <Content>
          <ContentHeader
            title={pageTitle}
            type={CONTENT_SINGLE}
            icon="reports"
            buttons={
              report && dataReady ? [{
                type: 'cancel',
                onClick: () => this.props.handleCancel(reference),
              },
              {
                type: 'save',
                onClick: () => this.props.handleSubmit(viewDomain.form.data, report.attributes.due_date_id),
              }] : null
            }
          />
          {saveSending &&
            <p>Saving Action</p>
          }
          {saveError &&
            <p>{saveError}</p>
          }
          { !report && !dataReady &&
            <Loading />
          }
          { !report && dataReady && !saveError &&
            <div>
              <FormattedMessage {...messages.notFound} />
            </div>
          }
          {dataReady &&
            <EntityForm
              model="reportEdit.form.data"
              formData={viewDomain.form.data}
              handleSubmit={(formData) => this.props.handleSubmit(formData, report.attributes.due_date_id)}
              handleCancel={() => this.props.handleCancel(reference)}
              handleUpdate={this.props.handleUpdate}
              fields={this.getFields(report)}
            />
          }
        </Content>
      </div>
    );
  }
}

ReportEdit.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  redirectIfNotPermitted: PropTypes.func,
  populateForm: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
  report: PropTypes.object,
  dataReady: PropTypes.bool,
  params: PropTypes.object,
};

ReportEdit.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  viewDomain: viewDomainSelect(state),
  dataReady: isReady(state, { path: [
    'progress_reports',
    'users',
    'due_dates',
    'indicators',
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
          extend: {
            path: 'due_dates',
            key: 'indicator_id',
            reverse: true,
            as: 'dates',
            extend: {
              type: 'count',
              path: 'progress_reports',
              key: 'due_date_id',
              reverse: true,
              as: 'reportCount',
            },
          },
        },
      ],
    },
  ),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('users'));
      dispatch(loadEntitiesIfNeeded('progress_reports'));
      dispatch(loadEntitiesIfNeeded('due_dates'));
      dispatch(loadEntitiesIfNeeded('indicators'));
    },
    redirectIfNotPermitted: () => {
      dispatch(redirectIfNotPermitted(USER_ROLES.CONTRIBUTOR));
    },
    populateForm: (model, formData) => {
      dispatch(formActions.load(model, fromJS(formData)));
    },
    handleSubmit: (formData, previousDateAssigned) => {
      let saveData = formData;

      const dateAssigned = formData.getIn(['attributes', 'due_date_id']);
      if (dateAssigned === 0) {
        saveData = saveData.setIn(['attributes', 'due_date_id'], null);
      }
      dispatch(save(
        saveData.toJS(),
        previousDateAssigned && previousDateAssigned !== dateAssigned
          ? previousDateAssigned
          : null
      ));
    },
    handleCancel: (reference) => {
      dispatch(updatePath(`/reports/${reference}`));
    },
    handleUpdate: (formData) => {
      dispatch(updateEntityForm(formData));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportEdit);
