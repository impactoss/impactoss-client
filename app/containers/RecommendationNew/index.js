/*
*
* RecommendationNew
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { actions as formActions } from 'react-redux-form/immutable';

import { Map, List } from 'immutable';

import {
  renderMeasureControl,
  renderTaxonomyControl,
  getTitleFormField,
  getReferenceFormField,
  getAcceptedField,
  getStatusField,
  getMarkdownField,
  renderIndicatorControl,
  getFrameworkFormField,
} from 'utils/forms';

import { attributesEqual } from 'utils/entities';
import { scrollToTop } from 'utils/scroll-to-component';
import { hasNewError } from 'utils/entity-form';

import { getCheckedValuesFromOptions } from 'components/forms/MultiSelectControl';

import { PATHS, CONTENT_SINGLE } from 'containers/App/constants';
import { USER_ROLES, DEFAULT_FRAMEWORK } from 'themes/config';
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
  selectReady,
  selectReadyForAuthCheck,
  selectMeasuresCategorised,
  selectRecommendationTaxonomies,
  selectEntities,
  selectFrameworkQuery,
  selectFrameworksForQuery,
} from 'containers/App/selectors';

import Messages from 'components/Messages';
import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'containers/EntityForm';

import {
  selectDomain,
  selectConnectedTaxonomies,
} from './selectors';

import messages from './messages';
import { save } from './actions';
import { DEPENDENCIES, FORM_INITIAL } from './constants';


export class RecommendationNew extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      scrollContainer: null,
    };
  }

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
    this.props.initialiseForm('recommendationNew.form.data', FORM_INITIAL);
  }

  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    if (nextProps.authReady && !this.props.authReady) {
      this.props.redirectIfNotPermitted();
    }
    if (hasNewError(nextProps, this.props) && this.state.scrollContainer) {
      scrollToTop(this.state.scrollContainer);
    }
  }

  getHeaderMainFields = (frameworks) => ([ // fieldGroups
    { // fieldGroup
      fields: [
        frameworks && getFrameworkFormField(this.context.intl.formatMessage, frameworks), // required
        getReferenceFormField(this.context.intl.formatMessage, true), // required
        getTitleFormField(this.context.intl.formatMessage, 'titleText'),
      ],
    },
  ]);

  getHeaderAsideFields = () => ([{
    fields: [getStatusField(this.context.intl.formatMessage)],
  }]);

  getBodyMainFields = (connectedTaxonomies, measures, indicators, onCreateOption, hasResponse) => ([
    {
      fields: [
        getMarkdownField(this.context.intl.formatMessage, 'description', 'fullRecommendation', 'fullRecommendation', 'fullRecommendation'),
        hasResponse && getAcceptedField(this.context.intl.formatMessage),
        hasResponse && getMarkdownField(this.context.intl.formatMessage, 'response'),
      ],
    },
    {
      label: this.context.intl.formatMessage(appMessages.entities.connections.plural),
      icon: 'connections',
      fields: [
        measures && renderMeasureControl(measures, connectedTaxonomies, onCreateOption, this.context.intl),
        indicators && renderIndicatorControl(indicators, onCreateOption),
      ],
    },
  ]);

  getBodyAsideFields = (taxonomies, onCreateOption) => ([ // fieldGroups
    { // fieldGroup
      label: this.context.intl.formatMessage(appMessages.entities.taxonomies.plural),
      icon: 'categories',
      fields: renderTaxonomyControl(taxonomies, onCreateOption, this.context.intl),
    },
  ]);

  render() {
    const {
      dataReady,
      viewDomain,
      connectedTaxonomies,
      taxonomies,
      measures,
      onCreateOption,
      indicators,
      frameworkId,
      frameworks,
    } = this.props;
    const { saveSending, saveError, submitValid } = viewDomain.page;
    const fwSpecified = (frameworkId && frameworkId !== 'all');

    const type = this.context.intl.formatMessage(
      appMessages.entities[fwSpecified ? `recommendations_${frameworkId}` : 'recommendations'].single
    );

    const currentFrameworkId = fwSpecified
      ? frameworkId
      : viewDomain.form.data.getIn(['attributes', 'framework_id']) || DEFAULT_FRAMEWORK;
    const currentFramework = dataReady && frameworks.find((fw) => attributesEqual(fw.get('id'), currentFrameworkId));
    const hasResponse = dataReady && currentFramework.getIn(['attributes', 'has_response']);
    const hasMeasures = dataReady && currentFramework.getIn(['attributes', 'has_measures']);
    const hasIndicators = dataReady && currentFramework.getIn(['attributes', 'has_indicators']);

    const fwTaxonomies = taxonomies && taxonomies.filter((tax) =>
      tax.get('frameworkIds').find((id) => attributesEqual(id, currentFrameworkId)) ||
      attributesEqual(currentFrameworkId, tax.getIn(['attributes', 'framework_id']))
    );
    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.pageTitle, { type })}`}
          meta={[
            {
              name: 'description',
              content: this.context.intl.formatMessage(messages.metaDescription),
            },
          ]}
        />
        <Content
          innerRef={(node) => {
            if (!this.state.scrollContainer) {
              this.setState({ scrollContainer: node });
            }
          }}
        >
          <ContentHeader
            title={this.context.intl.formatMessage(messages.pageTitle, { type })}
            type={CONTENT_SINGLE}
            icon={fwSpecified ? `recommendations_${frameworkId}` : 'recommendations'}
            buttons={
              dataReady ? [{
                type: 'cancel',
                onClick: this.props.handleCancel,
              },
              {
                type: 'save',
                disabled: saveSending,
                onClick: () => this.props.handleSubmitRemote('recommendationNew.form.data'),
              }] : null
            }
          />
          {!submitValid &&
            <Messages
              type="error"
              messageKey="submitInvalid"
              onDismiss={this.props.onErrorDismiss}
            />
          }
          {saveError &&
            <Messages
              type="error"
              messages={saveError.messages}
              onDismiss={this.props.onServerErrorDismiss}
            />
          }
          {(saveSending || !dataReady) &&
            <Loading />
          }
          {dataReady &&
            <EntityForm
              model="recommendationNew.form.data"
              formData={viewDomain.form.data}
              saving={saveSending}
              handleSubmit={(formData) => this.props.handleSubmit(
                formData,
                currentFramework,
                fwTaxonomies,
              )}
              handleSubmitFail={this.props.handleSubmitFail}
              handleCancel={this.props.handleCancel}
              handleUpdate={this.props.handleUpdate}
              fields={{ // isManager, taxonomies,
                header: {
                  main: this.getHeaderMainFields(
                    frameworkId === 'all' ? frameworks : null
                  ),
                  aside: this.getHeaderAsideFields(),
                },
                body: {
                  main: this.getBodyMainFields(
                    connectedTaxonomies,
                    hasMeasures && measures,
                    hasIndicators && indicators,
                    onCreateOption,
                    hasResponse,
                  ),
                  aside: this.getBodyAsideFields(fwTaxonomies, onCreateOption),
                },
              }}
              scrollContainer={this.state.scrollContainer}
            />
          }
          { saveSending &&
            <Loading />
          }
        </Content>
      </div>
    );
  }
}

RecommendationNew.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  redirectIfNotPermitted: PropTypes.func,
  handleSubmitRemote: PropTypes.func.isRequired,
  handleSubmitFail: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
  dataReady: PropTypes.bool,
  authReady: PropTypes.bool,
  taxonomies: PropTypes.object,
  measures: PropTypes.object,
  indicators: PropTypes.object,
  onCreateOption: PropTypes.func,
  initialiseForm: PropTypes.func,
  connectedTaxonomies: PropTypes.object,
  onErrorDismiss: PropTypes.func.isRequired,
  onServerErrorDismiss: PropTypes.func.isRequired,
  frameworkId: PropTypes.string,
  frameworks: PropTypes.object,
};

RecommendationNew.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  viewDomain: selectDomain(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  authReady: selectReadyForAuthCheck(state),
  taxonomies: selectRecommendationTaxonomies(state, { includeParents: false }),
  measures: selectMeasuresCategorised(state),
  indicators: selectEntities(state, 'indicators'),
  connectedTaxonomies: selectConnectedTaxonomies(state),
  frameworkId: selectFrameworkQuery(state),
  frameworks: selectFrameworksForQuery(state),
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
      dispatch(redirectIfNotPermitted(USER_ROLES.MANAGER.value));
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
    // handleSubmit: (formData, currentFramework) => {
    handleSubmit: (formData, currentFramework, fwTaxonomies) => {
      let saveData = formData;

      // recommendationCategories=
      if (formData.get('associatedTaxonomies')) {
        // get List of valid categories (for framework)
        const validCategories = fwTaxonomies && fwTaxonomies
          .map((fwt) => fwt.get('categories').keySeq())
          .valueSeq()
          .flatten();
        // get list of selected categories by taxonomy,
        // filter by valid categories
        const selectedCategories = formData
          .get('associatedTaxonomies')
          .map(getCheckedValuesFromOptions)
          .valueSeq()
          .flatten()
          .filter((id) => !validCategories || validCategories.includes(id));
        // const categoryIds =
        saveData = saveData.set(
          'recommendationCategories',
          Map({
            delete: List(),
            create: selectedCategories.map((id) => Map({ category_id: id })) }),
        );
      }

      // measures if allowed by framework
      if (
        formData.get('associatedMeasures') &&
        currentFramework.getIn(['attributes', 'has_measures'])
      ) {
        saveData = saveData.set('recommendationMeasures', Map({
          delete: List(),
          create: getCheckedValuesFromOptions(formData.get('associatedMeasures'))
          .map((id) => Map({
            measure_id: id,
          })),
        }));
      }

      // indicators if allowed by framework
      if (
        formData.get('associatedIndicators') &&
        currentFramework.getIn(['attributes', 'has_indicators'])
      ) {
        saveData = saveData.set('recommendationIndicators', Map({
          delete: List(),
          create: getCheckedValuesFromOptions(formData.get('associatedIndicators'))
          .map((id) => Map({
            indicator_id: id,
          })),
        }));
      }
      // cleanup attributes for framework
      if (!currentFramework.getIn(['attributes', 'has_response'])) {
        saveData = saveData
          .setIn(['attributes', 'accepted'], null)
          .setIn(['attributes', 'response'], null);
      }
      if (!currentFramework.getIn(['attributes', 'framework_id'])) {
        saveData = saveData.setIn(['attributes', 'framework_id'], DEFAULT_FRAMEWORK);
      }
      dispatch(save(saveData.toJS()));
    },
    handleCancel: () => {
      dispatch(updatePath(PATHS.RECOMMENDATIONS, { replace: true }));
    },
    handleUpdate: (formData) => {
      dispatch(updateEntityForm(formData));
    },
    onCreateOption: (args) => {
      dispatch(openNewEntityModal(args));
    },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(RecommendationNew);
