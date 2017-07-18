/*
 *
 * ReportEdit
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { actions as formActions } from 'react-redux-form/immutable';

import { Map } from 'immutable';

import {
  validateRequired,
} from 'utils/forms';

import {
  getMetaField,
} from 'utils/fields';

import { DOC_PUBLISH_STATUSES, PUBLISH_STATUSES, USER_ROLES, CONTENT_SINGLE } from 'containers/App/constants';
import appMessages from 'containers/App/messages';

import {
  loadEntitiesIfNeeded,
  redirectIfNotPermitted,
  updatePath,
  updateEntityForm,
} from 'containers/App/actions';

import { selectReady } from 'containers/App/selectors';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'components/forms/EntityForm';

import {
  selectDomain,
  selectViewEntity,
} from './selectors';

import messages from './messages';
import { save } from './actions';
import { DEPENDENCIES } from './constants';

export class ReportEdit extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();

    if (this.props.dataReady && this.props.viewEntity) {
      this.props.populateForm('reportEdit.form.data', this.getInitialFormData());
    }
  }

  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }

    if (nextProps.dataReady && !this.props.dataReady && nextProps.viewEntity) {
      this.props.redirectIfNotPermitted();
      this.props.populateForm('reportEdit.form.data', this.getInitialFormData(nextProps));
    }
  }

  getInitialFormData = (nextProps) => {
    const props = nextProps || this.props;
    const { viewEntity } = props;
    let attributes = viewEntity.get('attributes');
    if (!attributes.get('due_date_id')) {
      attributes = attributes.set('due_date_id', 0);
    }

    return viewEntity
    ? Map({
      id: viewEntity.get('id'),
      attributes,
    })
    : Map();
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
          id: 'status',
          controlType: 'select',
          model: '.attributes.draft',
          label: this.context.intl.formatMessage(appMessages.attributes.draft),
          value: entity.getIn(['attributes', 'draft']),
          options: PUBLISH_STATUSES,
        },
        getMetaField(entity, appMessages),
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
          value: entity.getIn(['attributes', 'document_public']),
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
    const NO_OF_REPORT_OPTIONS = 1;
    let excludeCount = 0;
    return dates && dates.reduce((memo, date, i) => {
      const isOwnDate = activeDateId ? activeDateId.toString() === date.get('id') : false;
      const optionNoNotExceeded = i - excludeCount < NO_OF_REPORT_OPTIONS;
      const withoutReport = !date.getIn(['attributes', 'has_progress_report']) || isOwnDate;
      // only allow upcoming and those that are not associated
      if (optionNoNotExceeded && withoutReport) {
        // exclude overdue and already assigned date from max no of date options
        if (date.getIn(['attributes', 'overdue']) || isOwnDate) {
          excludeCount += 1;
        }
        const label =
          `${this.context.intl.formatDate(new Date(date.getIn(['attributes', 'due_date'])))} ${
            date.getIn(['attributes', 'overdue']) ? this.context.intl.formatMessage(appMessages.entities.due_dates.overdue) : ''} ${
            date.getIn(['attributes', 'due']) ? this.context.intl.formatMessage(appMessages.entities.due_dates.due) : ''}`;
        return memo.concat([
          {
            value: parseInt(date.get('id'), 10),
            label,
            highlight: date.getIn(['attributes', 'overdue']),
            checked: activeDateId ? date.get('id') === activeDateId : false,
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
      fields: entity.get('indicator') && entity.getIn(['indicator', 'dates'])
        ? [{
          id: 'due_date_id',
          controlType: 'radio',
          model: '.attributes.due_date_id',
          options: this.getDateOptions(entity.getIn(['indicator', 'dates']), entity.getIn(['attributes', 'due_date_id'])),
          value: entity.getIn(['attributes', 'due_date_id']) || 0,
          hints: {
            1: this.context.intl.formatMessage(appMessages.entities.due_dates.empty),
          },
        }]
        : [],
    },
  ]);

  getFields = (entity) => ({ // isManager, taxonomies
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
    const { viewEntity, dataReady, viewDomain } = this.props;
    const reference = this.props.params.id;
    const { saveSending, saveError } = viewDomain.page;

    let pageTitle = this.context.intl.formatMessage(messages.pageTitle);
    if (viewEntity && dataReady) {
      pageTitle = `${pageTitle} for indicator ${viewEntity.getIn(['attributes', 'indicator_id'])}`;
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
              viewEntity && dataReady ? [{
                type: 'cancel',
                onClick: () => this.props.handleCancel(reference),
              },
              {
                type: 'save',
                onClick: () => this.props.handleSubmit(viewDomain.form.data, viewEntity.getIn(['attributes', 'due_date_id'])),
              }] : null
            }
          />
          {saveSending &&
            <p>Saving Action</p>
          }
          {saveError &&
            <p>{saveError}</p>
          }
          { !viewEntity && !dataReady &&
            <Loading />
          }
          { !viewEntity && dataReady && !saveError &&
            <div>
              <FormattedMessage {...messages.notFound} />
            </div>
          }
          {dataReady &&
            <EntityForm
              model="reportEdit.form.data"
              formData={viewDomain.form.data}
              handleSubmit={(formData) => this.props.handleSubmit(formData, viewEntity.getIn(['attributes', 'due_date_id']))}
              handleCancel={() => this.props.handleCancel(reference)}
              handleUpdate={this.props.handleUpdate}
              fields={this.getFields(viewEntity)}
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
  viewEntity: PropTypes.object,
  dataReady: PropTypes.bool,
  params: PropTypes.object,
};

ReportEdit.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  viewDomain: selectDomain(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  viewEntity: selectViewEntity(state, props.params.id),
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
      dispatch(formActions.load(model, formData));
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
