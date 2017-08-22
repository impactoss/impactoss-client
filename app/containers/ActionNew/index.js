/*
 *
 * ActionNew
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { actions as formActions } from 'react-redux-form/immutable';

import { Map, List } from 'immutable';

import {
  renderRecommendationControl,
  renderSdgTargetControl,
  renderIndicatorControl,
  renderTaxonomyControl,
  getTitleFormField,
  getStatusField,
  getMarkdownField,
  getDateField,
  getFormField,
} from 'utils/forms';

import { getCheckedValuesFromOptions } from 'components/forms/MultiSelectControl';

import { USER_ROLES, CONTENT_SINGLE } from 'containers/App/constants';
import appMessages from 'containers/App/messages';

import {
  loadEntitiesIfNeeded,
  redirectIfNotPermitted,
  updatePath,
  updateEntityForm,
  openNewEntityModal,
  submitInvalid,
  saveErrorDismiss,
} from 'containers/App/actions';

import {
  selectEntities,
  selectReady,
  selectSdgTargetsCategorised,
  selectRecommendationsCategorised,
  selectMeasureTaxonomies,
} from 'containers/App/selectors';

import ErrorMessages from 'components/ErrorMessages';
import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'components/forms/EntityForm';

import {
  selectDomain,
  selectConnectedTaxonomies,
} from './selectors';

import messages from './messages';
import { DEPENDENCIES, FORM_INITIAL } from './constants';
import { save } from './actions';

export class ActionNew extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
    this.props.initialiseForm('measureNew.form.data', FORM_INITIAL);
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
        getTitleFormField(this.context.intl.formatMessage, appMessages),
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

  getBodyMainFields = (connectedTaxonomies, recommendations, indicators, sdgtargets, onCreateOption) => ([
    {
      fields: [
        getMarkdownField(this.context.intl.formatMessage, appMessages),
        getMarkdownField(this.context.intl.formatMessage, appMessages, 'outcome'),
        getMarkdownField(this.context.intl.formatMessage, appMessages, 'indicator_summary'),
      ],
    },
    {
      label: this.context.intl.formatMessage(appMessages.entities.connections.plural),
      icon: 'connections',
      fields: [
        renderRecommendationControl(recommendations, connectedTaxonomies, onCreateOption),
        renderSdgTargetControl(sdgtargets, connectedTaxonomies, onCreateOption),
        renderIndicatorControl(indicators, onCreateOption),
      ],
    },
  ]);

  getBodyAsideFields = (taxonomies, onCreateOption) => ([ // fieldGroups
    { // fieldGroup
      fields: [
        getDateField(this.context.intl.formatMessage, appMessages, 'target_date'),
        getFormField(this.context.intl.formatMessage, appMessages, 'textarea', 'target_date_comment'),
      ],
    },
    { // fieldGroup
      label: this.context.intl.formatMessage(appMessages.entities.taxonomies.plural),
      icon: 'categories',
      fields: renderTaxonomyControl(taxonomies, onCreateOption),
    },
  ]);

  render() {
    const { dataReady, viewDomain, connectedTaxonomies, recommendations, indicators, taxonomies, sdgtargets, onCreateOption } = this.props;
    const { saveSending, saveError, submitValid } = viewDomain.page;
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
            icon="measures"
            buttons={
              dataReady ? [{
                type: 'cancel',
                onClick: this.props.handleCancel,
              },
              {
                type: 'save',
                disabled: saveSending,
                onClick: () => this.props.handleSubmitRemote('measureNew.form.data'),
              }] : null
            }
          />
          {!submitValid &&
            <ErrorMessages
              error={{ messages: [this.context.intl.formatMessage(appMessages.forms.multipleErrors)] }}
              onDismiss={this.props.onErrorDismiss}
            />
          }
          {saveError &&
            <ErrorMessages
              error={saveError}
              onDismiss={this.props.onServerErrorDismiss}
            />
          }
          {(saveSending || !dataReady) &&
            <Loading />
          }
          {dataReady &&
            <EntityForm
              model="measureNew.form.data"
              formData={viewDomain.form.data}
              saving={saveSending}
              handleSubmit={(formData) => this.props.handleSubmit(formData)}
              handleSubmitFail={this.props.handleSubmitFail}
              handleCancel={this.props.handleCancel}
              handleUpdate={this.props.handleUpdate}
              fields={{
                header: {
                  main: this.getHeaderMainFields(),
                  aside: this.getHeaderAsideFields(),
                },
                body: {
                  main: this.getBodyMainFields(connectedTaxonomies, recommendations, indicators, sdgtargets, onCreateOption),
                  aside: this.getBodyAsideFields(taxonomies, onCreateOption),
                },
              }}
            />
          }
          {saveSending &&
            <Loading />
          }
        </Content>
      </div>
    );
  }
}

ActionNew.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  redirectIfNotPermitted: PropTypes.func,
  handleSubmitRemote: PropTypes.func.isRequired,
  handleSubmitFail: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
  dataReady: PropTypes.bool,
  taxonomies: PropTypes.object,
  recommendations: PropTypes.object,
  indicators: PropTypes.object,
  sdgtargets: PropTypes.object,
  onCreateOption: PropTypes.func,
  initialiseForm: PropTypes.func,
  connectedTaxonomies: PropTypes.object,
  onErrorDismiss: PropTypes.func.isRequired,
  onServerErrorDismiss: PropTypes.func.isRequired,
};

ActionNew.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  viewDomain: selectDomain(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  taxonomies: selectMeasureTaxonomies(state),
  sdgtargets: selectSdgTargetsCategorised(state),
  indicators: selectEntities(state, 'indicators'),
  recommendations: selectRecommendationsCategorised(state),
  connectedTaxonomies: selectConnectedTaxonomies(state),
});

function mapDispatchToProps(dispatch) {
  return {
    initialiseForm: (model, formData) => {
      dispatch(formActions.reset(model));
      dispatch(formActions.change(model, formData, { silent: true }));
    },
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    redirectIfNotPermitted: () => {
      dispatch(redirectIfNotPermitted(USER_ROLES.MANAGER));
    },
    onErrorDismiss: () => {
      dispatch(submitInvalid(true));
    },
    onServerErrorDismiss: () => {
      dispatch(saveErrorDismiss());
    },
    handleSubmitFail: () => {
      dispatch(submitInvalid(false));
    },
    handleSubmitRemote: (model) => {
      dispatch(formActions.submit(model));
    },
    handleSubmit: (formData) => {
      let saveData = formData;

      // measureCategories
      if (formData.get('associatedTaxonomies')) {
        saveData = saveData.set(
          'measureCategories',
          formData.get('associatedTaxonomies')
          .map(getCheckedValuesFromOptions)
          .reduce((updates, formCategoryIds) => Map({
            delete: List(),
            create: updates.get('create').concat(formCategoryIds.map((id) => Map({
              category_id: id,
            }))),
          }), Map({ delete: List(), create: List() }))
        );
      }

      // recommendations
      if (formData.get('associatedRecommendations')) {
        saveData = saveData.set('recommendationMeasures', Map({
          delete: List(),
          create: getCheckedValuesFromOptions(formData.get('associatedRecommendations'))
          .map((id) => Map({
            recommendation_id: id,
          })),
        }));
      }

      // indicators
      if (formData.get('associatedIndicators')) {
        saveData = saveData.set('measureIndicators', Map({
          delete: List(),
          create: getCheckedValuesFromOptions(formData.get('associatedIndicators'))
          .map((id) => Map({
            indicator_id: id,
          })),
        }));
      }

      // sdgtargets
      if (formData.get('associatedSdgTargets')) {
        saveData = saveData.set('sdgtargetMeasures', Map({
          delete: List(),
          create: getCheckedValuesFromOptions(formData.get('associatedSdgTargets'))
          .map((id) => Map({
            sdgtarget_id: id,
          })),
        }));
      }

      dispatch(save(saveData.toJS()));
    },
    handleCancel: () => {
      dispatch(updatePath('/actions'));
    },
    handleUpdate: (formData) => {
      dispatch(updateEntityForm(formData));
    },
    onCreateOption: (args) => {
      dispatch(openNewEntityModal(args));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionNew);
