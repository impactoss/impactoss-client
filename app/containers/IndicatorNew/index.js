/*
 *
 * IndicatorNew
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { browserHistory } from 'react-router';

import { Map, List } from 'immutable';

import { PUBLISH_STATUSES } from 'containers/App/constants';
import { loadEntitiesIfNeeded } from 'containers/App/actions';
import { getEntities, isReady } from 'containers/App/selectors';

import Page from 'components/Page';
import EntityForm from 'components/forms/EntityForm';

import indicatorNewSelector from './selectors';
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
  }

  mapActionOptions = (entities) => entities.toList().map((entity) => Map({
    value: entity.get('id'),
    label: entity.getIn(['attributes', 'title']),
  }));

  mapUserOptions = (entities) => entities.toList().map((entity) => Map({
    value: entity.get('id'),
    label: entity.getIn(['attributes', 'name']),
  }));

  // TODO this should be shared functionality
  renderActionControl = (actions) => ({
    id: 'actions',
    model: '.associatedActions',
    label: 'Actions',
    controlType: 'multiselect',
    options: this.mapActionOptions(actions),
  });
  renderUserControl = (users) => ({
    id: 'users',
    model: '.associatedUser',
    label: 'Indicator manager',
    controlType: 'multiselect',
    options: this.mapUserOptions(users),
  });

  render() {
    const { dataReady } = this.props;
    const { saveSending, saveError } = this.props.indicatorNew.page;
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
                    this.props.indicatorNew.form.data,
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
              handleSubmit={(formData) => this.props.handleSubmit(formData)}
              handleCancel={this.props.handleCancel}
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
                    this.props.actions ? this.renderActionControl(this.props.actions) : null,
                  ],
                  aside: [
                    this.props.users ? this.renderUserControl(this.props.users) : null,
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
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  indicatorNew: PropTypes.object,
  dataReady: PropTypes.bool,
  actions: PropTypes.object,
  users: PropTypes.object,
};

IndicatorNew.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  indicatorNew: indicatorNewSelector(state),
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
          role_id: 2, // contributors only
        },
      },
    },
  ),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      // dispatch(loadEntitiesIfNeeded('indicators'));
      dispatch(loadEntitiesIfNeeded('measures'));
      dispatch(loadEntitiesIfNeeded('users'));
      dispatch(loadEntitiesIfNeeded('user_roles'));
      // dispatch(loadEntitiesIfNeeded('recommendation_measures'));
      // dispatch(loadEntitiesIfNeeded('measure_categories'));
    },
    handleSubmit: (formData) => {
      let saveData = formData;
      // actions
      if (formData.get('associatedActions')) {
        saveData = saveData.set('measureIndicators', Map({
          delete: List(),
          create: formData.get('associatedActions').map((id) => Map({
            measure_id: id,
          })),
        }));
      }
      // TODO: remove once have singleselect instead of multiselect
      if (List.isList(saveData.get('associatedUser'))) {
        saveData = saveData.setIn(['attributes', 'manager_id'], saveData.get('associatedUser').first());
      }
      dispatch(save(saveData.toJS()));
    },
    handleCancel: () => {
      // not really a dispatch function here, could be a member function instead
      // however
      // - this could in the future be moved to a saga or reducer
      // - also its nice to be next to handleSubmit
      browserHistory.push('/indicators');
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorNew);
