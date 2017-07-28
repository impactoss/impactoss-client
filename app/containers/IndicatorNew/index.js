/*
 *
 * IndicatorNew
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import { Map, List } from 'immutable';

import {
  renderMeasureControl,
  renderSdgTargetControl,
  renderUserControl,
  getTitleFormField,
  getReferenceFormField,
  getStatusField,
  getMarkdownField,
  getDateField,
  getFrequencyField,
  getCheckboxField,
} from 'utils/forms';

import { getCheckedValuesFromOptions } from 'components/forms/MultiSelectControl';

import { USER_ROLES, CONTENT_SINGLE } from 'containers/App/constants';
import appMessages from 'containers/App/messages';

import {
  loadEntitiesIfNeeded,
  redirectIfNotPermitted,
  updatePath,
  updateEntityForm,
} from 'containers/App/actions';

import { selectEntities, selectReady } from 'containers/App/selectors';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'components/forms/EntityForm';

import {
  selectDomain,
  selectUsers,
} from './selectors';

import messages from './messages';
import { save } from './actions';
import { DEPENDENCIES } from './constants';

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
        getReferenceFormField(this.context.intl.formatMessage, appMessages, false, true),
        getTitleFormField(this.context.intl.formatMessage, appMessages, 'titleText'),
      ],
    },
  ]);

  getHeaderAsideFields = () => ([
    {
      fields: [
        getStatusField(this.context.intl.formatMessage, appMessages),
      ],
    },
  ]);

  getBodyMainFields = (measures, sdgtargets) => ([
    {
      fields: [getMarkdownField(this.context.intl.formatMessage, appMessages)],
    },
    {
      label: this.context.intl.formatMessage(appMessages.entities.connections.plural),
      icon: 'connections',
      fields: [
        renderMeasureControl(measures),
        renderSdgTargetControl(sdgtargets),
      ],
    },
  ]);

  getBodyAsideFields = (users) => ([ // fieldGroups
    { // fieldGroup
      label: this.context.intl.formatMessage(appMessages.entities.due_dates.schedule),
      icon: 'reminder',
      fields: [
        getDateField(this.context.intl.formatMessage, appMessages, 'start_date'),
        getCheckboxField(this.context.intl.formatMessage, appMessages, 'repeat'),
        getFrequencyField(this.context.intl.formatMessage, appMessages),
        getDateField(this.context.intl.formatMessage, appMessages, 'end_date'),
        renderUserControl(
          users,
          this.context.intl.formatMessage(appMessages.attributes.manager_id.indicators),
        ),
      ],
    },
  ]);

  render() {
    const { dataReady, viewDomain, measures, users, sdgtargets } = this.props;
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
            <Loading />
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
              fields={{
                header: {
                  main: this.getHeaderMainFields(),
                  aside: this.getHeaderAsideFields(),
                },
                body: {
                  main: this.getBodyMainFields(measures, sdgtargets),
                  aside: this.getBodyAsideFields(users),
                },
              }}
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
  measures: PropTypes.object,
  sdgtargets: PropTypes.object,
  users: PropTypes.object,
};

IndicatorNew.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  viewDomain: selectDomain(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  // all measures,
  measures: selectEntities(state, 'measures'),
  // all sdgtargets,
  sdgtargets: selectEntities(state, 'sdgtargets'),
  // all users, listing connection if any
  users: selectUsers(state),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    redirectIfNotPermitted: () => {
      dispatch(redirectIfNotPermitted(USER_ROLES.MANAGER));
    },
    handleSubmit: (formData) => {
      let saveData = formData;
      // measures
      if (formData.get('associatedMeasures')) {
        saveData = saveData.set('measureIndicators', Map({
          delete: List(),
          create: getCheckedValuesFromOptions(formData.get('associatedMeasures'))
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
