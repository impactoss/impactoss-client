/*
 *
 * IndicatorNew
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import { Map, List } from 'immutable';

import { getCheckedValuesFromOptions } from 'components/forms/MultiSelectControl';

import { PUBLISH_STATUSES, USER_ROLES } from 'containers/App/constants';

import {
  loadEntitiesIfNeeded,
  redirectIfNotPermitted,
  updatePath,
  updateEntityForm,
} from 'containers/App/actions';

import Page from 'components/Page';
import EntityForm from 'components/forms/EntityForm';

import { getEntities, isReady } from 'containers/App/selectors';

import {
  renderActionControl,
  renderUserControl,
} from 'utils/forms';

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

  render() {
    const { dataReady, viewDomain } = this.props;
    const { saveSending, saveError } = viewDomain.page;
    const required = (val) => val && val.length;

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
        { !dataReady &&
          <div>
            <FormattedMessage {...messages.loading} />
          </div>
        }
        {dataReady &&
          <Page
            title={this.context.intl.formatMessage(messages.pageTitle)}
            actions={
              [
                {
                  type: 'simple',
                  title: 'Cancel',
                  onClick: this.props.handleCancel,
                },
                {
                  type: 'primary',
                  title: 'Save',
                  onClick: () => this.props.handleSubmit(
                    viewDomain.form.data,
                  ),
                },
              ]
            }
          >
            {saveSending &&
              <p>Saving Indicator</p>
            }
            {saveError &&
              <p>{saveError}</p>
            }
            <EntityForm
              model="indicatorNew.form.data"
              formData={viewDomain.form.data}
              handleSubmit={(formData) => this.props.handleSubmit(formData)}
              handleCancel={this.props.handleCancel}
              handleUpdate={this.props.handleUpdate}
              fields={{
                header: {
                  main: [
                    {
                      id: 'title',
                      controlType: 'input',
                      model: '.attributes.title',
                      placeholder: this.context.intl.formatMessage(messages.fields.title.placeholder),
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
                      id: 'status',
                      controlType: 'select',
                      model: '.attributes.draft',
                      options: PUBLISH_STATUSES,
                    },
                  ],
                },
                body: {
                  main: [
                    {
                      id: 'description',
                      controlType: 'textarea',
                      model: '.attributes.description',
                    },
                    renderActionControl(this.props.actions),
                  ],
                  aside: [
                    renderUserControl(this.props.users, 'Assigned user'),
                    {
                      id: 'start',
                      controlType: 'input',
                      label: 'Reporting due date',
                      model: '.attributes.start_date',
                      placeholder: 'YYYY-MM-DD',
                    },
                    {
                      id: 'repeat',
                      controlType: 'checkbox',
                      label: 'Repeat?',
                      model: '.attributes.repeat',
                    },
                    {
                      id: 'frequency',
                      controlType: 'input',
                      label: 'Reporting frequency in months',
                      model: '.attributes.frequency_months',
                    },
                    {
                      id: 'end',
                      controlType: 'input',
                      label: 'Reporting end date',
                      model: '.attributes.end_date',
                      placeholder: 'YYYY-MM-DD',
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

IndicatorNew.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  redirectIfNotPermitted: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
  dataReady: PropTypes.bool,
  actions: PropTypes.object,
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
  ] }),

  // all actions,
  actions: getEntities(
    state, {
      path: 'measures',
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
      // TODO: remove once have singleselect instead of multiselect
      const formUserIds = getCheckedValuesFromOptions(formData.get('associatedUser'));
      if (List.isList(formUserIds) && formUserIds.size) {
        saveData = saveData.setIn(['attributes', 'manager_id'], formUserIds.first());
      } else {
        saveData = saveData.setIn(['attributes', 'manager_id'], null);
      }

      // cleanup
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
