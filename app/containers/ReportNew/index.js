/*
 *
 * ReportNew
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import {
  getTitleFormField,
} from 'utils/forms';

import { DOC_PUBLISH_STATUSES, PUBLISH_STATUSES, CONTENT_SINGLE } from 'containers/App/constants';
import appMessages from 'containers/App/messages';

import {
  loadEntitiesIfNeeded,
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
  selectIndicator,
} from './selectors';

import messages from './messages';
import { save } from './actions';
import { DEPENDENCIES } from './constants';

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
        getTitleFormField(this.context.intl.formatMessage, appMessages),
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
    const NO_OF_REPORT_OPTIONS = 1;
    let excludeCount = 0;
    return dates && dates.reduce((memo, date, i) => {
      const optionNoNotExceeded = i - excludeCount < NO_OF_REPORT_OPTIONS;
      const withoutReport = !date.getIn(['attributes', 'has_progress_report']);
      // only allow upcoming and those that are not associated
      if (optionNoNotExceeded && withoutReport) {
        // exclude overdue and already assigned date from max no of date options
        if (date.getIn(['attributes', 'overdue'])) {
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
            checked: false,
          },
        ]);
      }
      return memo;
    }, dateOptions);
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
          options: this.getDateOptions(indicator.get('dates')),
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
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  viewDomain: selectDomain(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  indicator: selectIndicator(state, props.params.id),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
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
