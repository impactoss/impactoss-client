/*
 *
 * IndicatorNew
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import { Map, List } from 'immutable';

import {
  renderActionControl,
  renderSdgTargetControl,
  renderUserControl,
  validateRequired,
  validateDateFormat,
} from 'utils/forms';

import { getCheckedValuesFromOptions } from 'components/forms/MultiSelectControl';

import { PUBLISH_STATUSES, USER_ROLES, REPORT_FREQUENCIES, CONTENT_SINGLE } from 'containers/App/constants';
import appMessages from 'containers/App/messages';

import {
  loadEntitiesIfNeeded,
  redirectIfNotPermitted,
  updatePath,
  updateEntityForm,
} from 'containers/App/actions';

import { getEntities, isReady } from 'containers/App/selectors';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'components/forms/EntityForm';

import viewDomainSelect from './selectors';
import messages from './messages';
import { save } from './actions';


export class IndicatorNew extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    if (nextProps.dataReady && !this.props.dataReady) {
      this.props.redirectIfNotPermitted();
    }
  }

  getHeaderMainFields = () => ([ // fieldGroups
    { // fieldGroup
      fields: [
        {
          id: 'reference',
          controlType: 'short',
          model: '.attributes.reference',
          label: this.context.intl.formatMessage(appMessages.attributes.referenceDefault),
          placeholder: this.context.intl.formatMessage(appMessages.placeholders.reference),
        },
        {
          id: 'title',
          controlType: 'titleText',
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

  getBodyMainFields = (actions, sdgtargets) => ([
    {
      fields: [
        {
          id: 'description',
          controlType: 'markdown',
          model: '.attributes.description',
          label: this.context.intl.formatMessage(appMessages.attributes.description),
          placeholder: this.context.intl.formatMessage(appMessages.placeholders.description),
        },
      ],
    },
    {
      label: this.context.intl.formatMessage(appMessages.entities.connections.plural),
      icon: 'connections',
      fields: [
        renderActionControl(actions),
        renderSdgTargetControl(sdgtargets),
      ],
    },
  ]);

  getBodyAsideFields = (users) => ([ // fieldGroups
    { // fieldGroup
      label: this.context.intl.formatMessage(appMessages.entities.due_dates.schedule),
      icon: 'reminder',
      fields: [
        {
          id: 'start_date',
          controlType: 'date',
          model: '.attributes.start_date',
          label: this.context.intl.formatMessage(appMessages.attributes.start_date),
          placeholder: 'YYYY-MM-DD',
          validators: {
            date: validateDateFormat,
          },
          errorMessages: {
            date: this.context.intl.formatMessage(appMessages.forms.dateFormatError),
          },
        },
        {
          id: 'repeat',
          controlType: 'checkbox',
          model: '.attributes.repeat',
          label: this.context.intl.formatMessage(appMessages.attributes.repeat),
        },
        {
          id: 'frequency',
          controlType: 'select',
          label: this.context.intl.formatMessage(appMessages.attributes.frequency_months),
          model: '.attributes.frequency_months',
          options: REPORT_FREQUENCIES,
          value: 1,
        },
        {
          id: 'end_date',
          controlType: 'date',
          model: '.attributes.end_date',
          label: this.context.intl.formatMessage(appMessages.attributes.end_date),
          placeholder: 'YYYY-MM-DD',
          validators: {
            date: validateDateFormat,
          },
          errorMessages: {
            date: this.context.intl.formatMessage(appMessages.forms.dateFormatError),
          },
        },
        renderUserControl(
          users,
          this.context.intl.formatMessage(appMessages.attributes.manager_id.indicators),
        ),
      ],
    },
  ]);

  getFields = (actions, users, sdgtargets) => ({ // isManager, taxonomies,
    header: {
      main: this.getHeaderMainFields(),
      aside: this.getHeaderAsideFields(),
    },
    body: {
      main: this.getBodyMainFields(actions, sdgtargets),
      aside: this.getBodyAsideFields(users),
    },
  })

  render() {
    const { dataReady, viewDomain, actions, users, sdgtargets } = this.props;
    const { saveSending, saveError } = viewDomain.page;

    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.pageTitle)}`}
          meta={[
            {
              name: 'description',
              content: this.context.intl.formatMessage(messages.metaDescription),
            },
          ]}
        />
        <Content>
          <ContentHeader
            title={this.context.intl.formatMessage(messages.pageTitle)}
            type={CONTENT_SINGLE}
            icon="indicators"
            buttons={
              dataReady ? [{
                type: 'cancel',
                onClick: this.props.handleCancel,
              },
              {
                type: 'save',
                onClick: () => this.props.handleSubmit(
                  viewDomain.form.data,
                ),
              }] : null
            }
          />
          { !dataReady &&
            <Loading />
          }
          {saveSending &&
            <p>Saving Action</p>
          }
          {saveError &&
            <p>{saveError}</p>
          }
          {dataReady &&
            <EntityForm
              model="indicatorNew.form.data"
              formData={viewDomain.form.data}
              handleSubmit={(formData) => this.props.handleSubmit(formData)}
              handleCancel={this.props.handleCancel}
              handleUpdate={this.props.handleUpdate}
              fields={this.getFields(actions, users, sdgtargets)}
            />
          }
        </Content>
      </div>
    );
  }
}

IndicatorNew.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  redirectIfNotPermitted: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
  dataReady: PropTypes.bool,
  actions: PropTypes.object,
  sdgtargets: PropTypes.object,
  users: PropTypes.object,
};

IndicatorNew.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  viewDomain: viewDomainSelect(state),
  // all categories for all taggable taxonomies
  dataReady: isReady(state, { path: [
    'measures',
    'users',
    'user_roles',
    'sdgtargets',
  ] }),

  // all actions,
  actions: getEntities(
    state, {
      path: 'measures',
    },
  ),

  // all sdgtargets,
  sdgtargets: getEntities(
    state, {
      path: 'sdgtargets',
    },
  ),

  // all users, listing connection if any
  users: getEntities(
    state,
    {
      path: 'users',
      connected: {
        path: 'user_roles',
        key: 'user_id',
        where: {
          role_id: USER_ROLES.CONTRIBUTOR, // contributors only TODO: from constants
        },
      },
    },
  ),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('measures'));
      dispatch(loadEntitiesIfNeeded('users'));
      dispatch(loadEntitiesIfNeeded('user_roles'));
      dispatch(loadEntitiesIfNeeded('sdgtargets'));
    },
    redirectIfNotPermitted: () => {
      dispatch(redirectIfNotPermitted(USER_ROLES.MANAGER));
    },
    handleSubmit: (formData) => {
      let saveData = formData;
      // actions
      if (formData.get('associatedActions')) {
        saveData = saveData.set('measureIndicators', Map({
          delete: List(),
          create: getCheckedValuesFromOptions(formData.get('associatedActions'))
          .map((id) => Map({
            measure_id: id,
          })),
        }));
      }
      if (formData.get('associatedSdgTargets')) {
        saveData = saveData.set('sdgtargetIndicators', Map({
          delete: List(),
          create: getCheckedValuesFromOptions(formData.get('associatedSdgTargets'))
          .map((id) => Map({
            sdgtarget_id: id,
          })),
        }));
      }
      // TODO: remove once have singleselect instead of multiselect
      const formUserIds = getCheckedValuesFromOptions(formData.get('associatedUser'));
      if (List.isList(formUserIds) && formUserIds.size) {
        saveData = saveData.setIn(['attributes', 'manager_id'], formUserIds.first());
      } else {
        saveData = saveData.setIn(['attributes', 'manager_id'], null);
      }

      // cleanup
      // default to database id
      const formRef = formData.getIn(['attributes', 'reference']) || '';
      if (formRef.trim() === '') {
        saveData = saveData.setIn(['attributes', 'reference'], formData.get('id'));
      }
      if (!saveData.getIn(['attributes', 'repeat'])) {
        saveData = saveData
          .setIn(['attributes', 'frequency_months'], null)
          .setIn(['attributes', 'end_date'], null);
      }

      dispatch(save(saveData.toJS()));
    },
    handleCancel: () => {
      dispatch(updatePath('/indicators'));
    },
    handleUpdate: (formData) => {
      dispatch(updateEntityForm(formData));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorNew);
