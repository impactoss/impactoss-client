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

  mapActionOptions = (actions) => Object.values(actions).map((action) => ({
    value: action.id,
    label: action.attributes.title,
  }));

  // TODO this should be shared functionality
  renderActionControl = (actions) => actions ? ({
    id: 'actions',
    model: '.associatedActions',
    label: 'Actions',
    controlType: 'multiselect',
    options: this.mapActionOptions(actions),
  }) : [];

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
                    this.renderActionControl(this.props.actions),
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
};

IndicatorNew.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  indicatorNew: indicatorNewSelector(state),
  // all categories for all taggable taxonomies
  dataReady: isReady(state, { path: [
    'measures',
  ] }),

  // all actions,
  actions: getEntities(
    state, {
      path: 'measures',
      out: 'js',
    },
  ),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      // dispatch(loadEntitiesIfNeeded('indicators'));
      // dispatch(loadEntitiesIfNeeded('users'));
      dispatch(loadEntitiesIfNeeded('measures'));
      // dispatch(loadEntitiesIfNeeded('recommendation_measures'));
      // dispatch(loadEntitiesIfNeeded('measure_categories'));
    },
    handleSubmit: (formData) => {
      const saveData = formData.toJS();
      // actions
      if (saveData.associatedActions) {
        saveData.measureIndicators = {
          delete: [],
          create: saveData.associatedActions.map((actionId) => ({
            measure_id: actionId,
          })),
        };
      }

      dispatch(save(saveData));
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
