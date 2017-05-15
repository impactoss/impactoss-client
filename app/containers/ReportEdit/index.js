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

import { fromJS, List, Map } from 'immutable';

import {
  getCheckedValuesFromOptions,
  getUncheckedValuesFromOptions,
} from 'components/forms/MultiSelectControl';

import { DOC_PUBLISH_STATUSES, PUBLISH_STATUSES, USER_ROLES } from 'containers/App/constants';

import {
  loadEntitiesIfNeeded,
  redirectIfNotPermitted,
  updatePath,
  updateEntityForm,
} from 'containers/App/actions';

import Page from 'components/Page';
import EntityForm from 'components/forms/EntityForm';

import {
  getEntity,
  isReady,
} from 'containers/App/selectors';

import {
  dateOptions,
  renderDateControl,
} from 'utils/forms';

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
    return Map({
      id: report.id,
      attributes: fromJS(report.attributes),
      associatedDate: report && report.indicator && report.indicator.dates
      ? dateOptions(fromJS(report.indicator.dates), report.attributes.due_date_id)
      : List(),
      // TODO allow single value for singleSelect
    });
  }

  render() {
    const { report, dataReady, viewDomain } = this.props;
    const reference = this.props.params.id;
    const { saveSending, saveError } = viewDomain.page;
    const required = (val) => val && val.length;

    const dateControlOptions = report && report.indicator && report.indicator.dates
      ? renderDateControl(fromJS(report.indicator.dates), report.attributes.due_date_id)
      : null;

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
        { !report && dataReady && !saveError &&
          <div>
            <FormattedMessage {...messages.notFound} />
          </div>
        }
        {report && dataReady &&
          <Page
            title={pageTitle}
            actions={[
              {
                type: 'simple',
                title: 'Cancel',
                onClick: () => this.props.handleCancel(reference),
              },
              {
                type: 'primary',
                title: 'Save',
                onClick: () => this.props.handleSubmit(viewDomain.form.data),
              },
            ]}
          >
            {saveSending &&
              <p>Saving</p>
            }
            {saveError &&
              <p>{saveError}</p>
            }
            <EntityForm
              model="reportEdit.form.data"
              formData={viewDomain.form.data}
              handleSubmit={(formData) => this.props.handleSubmit(formData)}
              handleCancel={() => this.props.handleCancel(reference)}
              handleUpdate={this.props.handleUpdate}
              fields={{
                header: {
                  main: [
                    {
                      id: 'title',
                      controlType: 'input',
                      model: '.attributes.title',
                      validators: {
                        required,
                      },
                      errorMessages: {
                        required: this.context.intl.formatMessage(messages.fieldRequired),
                      },
                    },
                  ],
                  aside: [
                    {
                      id: 'no',
                      controlType: 'info',
                      displayValue: reference,
                    },
                    {
                      id: 'status',
                      controlType: 'select',
                      model: '.attributes.draft',
                      value: report.draft,
                      options: PUBLISH_STATUSES,
                    },
                    {
                      id: 'updated',
                      controlType: 'info',
                      displayValue: report.attributes.updated_at,
                    },
                    {
                      id: 'updated_by',
                      controlType: 'info',
                      displayValue: report.user && report.user.attributes.name,
                    },
                  ],
                },
                body: {
                  main: [
                    dateControlOptions,
                    {
                      id: 'description',
                      controlType: 'textarea',
                      model: '.attributes.description',
                    },
                    {
                      id: 'document_url',
                      controlType: 'uploader',
                      model: '.attributes.document_url',
                    },
                    {
                      id: 'document_public',
                      controlType: 'select',
                      model: '.attributes.document_public',
                      options: DOC_PUBLISH_STATUSES,
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
    handleSubmit: (formData) => {
      let saveData = formData;
      let dueDateIdUnchecked = null;

      // TODO: remove once have singleselect instead of multiselect
      const formDateIds = getCheckedValuesFromOptions(formData.get('associatedDate'));
      if (List.isList(formDateIds) && formDateIds.size) {
        saveData = saveData.setIn(['attributes', 'due_date_id'], formDateIds.first());
      } else {
        saveData = saveData.setIn(['attributes', 'due_date_id'], null);
      }
      const uncheckedFormDateIds = getUncheckedValuesFromOptions(formData.get('associatedDate'));
      if (List.isList(uncheckedFormDateIds) && uncheckedFormDateIds.size) {
        dueDateIdUnchecked = uncheckedFormDateIds.first();
      }

      dispatch(save(saveData.toJS(), dueDateIdUnchecked));
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
