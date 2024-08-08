/*
*
* RecommendationNew
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HelmetCanonical from 'components/HelmetCanonical';
import { injectIntl } from 'react-intl';

import { Map, List, fromJS } from 'immutable';

import {
  renderMeasureControl,
  renderTaxonomyControl,
  getTitleFormField,
  getReferenceFormField,
  getAcceptedField,
  getStatusField,
  getMarkdownFormField,
  renderIndicatorControl,
  getFrameworkFormField,
} from 'utils/formik';

import { qe } from 'utils/quasi-equals';
import { scrollToTop } from 'utils/scroll-to-component';
import { hasNewError } from 'utils/entity-form';

import { getCheckedValuesFromOptions } from 'components/forms/MultiSelectControl';

import { ROUTES, CONTENT_SINGLE } from 'containers/App/constants';
import { USER_ROLES, DEFAULT_FRAMEWORK } from 'themes/config';
import appMessages from 'containers/App/messages';

import {
  loadEntitiesIfNeeded,
  redirectIfNotPermitted,
  updatePath,
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
  selectCurrentFrameworkId,
  selectActiveFrameworks,
  selectRecommendationReferences,
  selectCanUserAdministerCategories,
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
    this.scrollContainer = React.createRef();
    this.remoteSubmitForm = null;
  }

  UNSAFE_componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    if (nextProps.authReady && !this.props.authReady) {
      this.props.redirectIfNotPermitted();
    }
    if (hasNewError(nextProps, this.props) && this.scrollContainer) {
      scrollToTop(this.scrollContainer.current);
    }
  }

  bindHandleSubmit = (submitForm) => {
    this.remoteSubmitForm = submitForm;
  };

  getInitialFormData = ({ frameworkId }) =>
    Map(FORM_INITIAL.setIn(
      ['attributes', 'framework_id'],
      (frameworkId && frameworkId !== 'all')
        ? frameworkId
        : DEFAULT_FRAMEWORK
    ));

  getHeaderMainFields = (frameworkId, frameworks, existingReferences) => {
    const { intl } = this.props;
    const hasFWOptions = frameworks && frameworks.size > 1 && frameworkId === 'all';
    return ([ // fieldGroups
      { // fieldGroup
        fields: [
          hasFWOptions && getFrameworkFormField(intl.formatMessage, frameworks), // required
          getReferenceFormField({
            formatMessage: intl.formatMessage,
            required: true,
            prohibitedValues: existingReferences,
          }),
          getTitleFormField(intl.formatMessage, 'titleText'),
        ],
      },
    ]);
  };

  getHeaderAsideFields = () => {
    const { intl } = this.props;
    return ([{
      fields: [getStatusField(intl.formatMessage)],
    }]);
  };

  getBodyMainFields = (
    connectedTaxonomies,
    measures,
    indicators,
    onCreateOption,
    hasResponse,
  ) => {
    const { intl } = this.props;
    const groups = [];
    groups.push({
      fields: [
        getMarkdownFormField({
          formatMessage: intl.formatMessage,
          attribute: 'description',
          label: 'fullRecommendation',
          placeholder: 'fullRecommendation',
          hint: 'fullRecommendation',
        }),
        hasResponse && getAcceptedField(intl.formatMessage),
        hasResponse && getMarkdownFormField({
          formatMessage: intl.formatMessage,
          attribute: 'response',
        }),
      ],
    });
    if (measures) {
      groups.push({
        label: intl.formatMessage(appMessages.nav.measuresSuper),
        icon: 'measures',
        fields: [
          renderMeasureControl(measures, connectedTaxonomies, onCreateOption, intl),
        ],
      });
    }
    if (indicators) {
      groups.push({
        label: intl.formatMessage(appMessages.nav.indicatorsSuper),
        icon: 'indicators',
        fields: [
          renderIndicatorControl(indicators, onCreateOption, intl),
        ],
      });
    }
    return groups;
  };

  getBodyAsideFields = (taxonomies, onCreateOption, canCreateCategories) => {
    const { intl } = this.props;
    return ([ // fieldGroup
      { // fieldGroup
        label: intl.formatMessage(appMessages.entities.taxonomies.plural),
        icon: 'categories',
        fields: renderTaxonomyControl({
          taxonomies,
          onCreateOption: canCreateCategories ? onCreateOption : null,
          contextIntl: intl,
        }),
      },
    ]);
  };

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
      existingReferences,
      canUserAdministerCategories,
      intl,
    } = this.props;
    const { saveSending, saveError, submitValid } = viewDomain.get('page').toJS();
    const fwSpecified = (frameworkId && frameworkId !== 'all');

    const type = intl.formatMessage(
      appMessages.entities[fwSpecified ? `recommendations_${frameworkId}` : 'recommendations'].single
    );

    const currentFrameworkId = fwSpecified
      ? frameworkId
      : viewDomain.getIn(['form', 'data', 'attributes', 'framework_id']) || DEFAULT_FRAMEWORK;
    const currentFramework = dataReady && frameworks.find((fw) => qe(fw.get('id'), currentFrameworkId));
    const hasResponse = dataReady && currentFramework.getIn(['attributes', 'has_response']);
    const hasMeasures = dataReady && currentFramework.getIn(['attributes', 'has_measures']);
    const hasIndicators = dataReady && currentFramework.getIn(['attributes', 'has_indicators']);

    const fwTaxonomies = taxonomies && taxonomies.filter((tax) => tax.get('frameworkIds').find((id) => qe(id, currentFrameworkId))
      || qe(currentFrameworkId, tax.getIn(['attributes', 'framework_id'])));
    return (
      <div>
        <HelmetCanonical
          title={`${intl.formatMessage(messages.pageTitle, { type })}`}
          meta={[
            {
              name: 'description',
              content: intl.formatMessage(messages.metaDescription),
            },
          ]}
        />
        <Content ref={this.scrollContainer}>
          <ContentHeader
            title={intl.formatMessage(messages.pageTitle, { type })}
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
                onClick: (e) => {
                  if (this.remoteSubmitForm) {
                    this.remoteSubmitForm(e);
                  }
                },
              }] : null
            }
          />
          {!submitValid
            && (
              <Messages
                type="error"
                messageKey="submitInvalid"
                onDismiss={this.props.onErrorDismiss}
              />
            )
          }
          {saveError
            && (
              <Messages
                type="error"
                messages={saveError.messages}
                onDismiss={this.props.onServerErrorDismiss}
              />
            )
          }
          {(saveSending || !dataReady)
            && <Loading />
          }
          {dataReady
            && (
              <EntityForm
                formData={this.getInitialFormData(this.props).toJS()}
                saving={saveSending}
                bindHandleSubmit={this.bindHandleSubmit}
                handleSubmit={(formData) => this.props.handleSubmit(
                  formData,
                  currentFramework,
                  fwTaxonomies,
                )}
                handleSubmitFail={this.props.handleSubmitFail}
                handleCancel={this.props.handleCancel}
                fields={{ // isManager, taxonomies,
                  header: {
                    main: this.getHeaderMainFields(frameworkId, frameworks, existingReferences),
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
                    aside: this.getBodyAsideFields(
                      fwTaxonomies,
                      onCreateOption,
                      canUserAdministerCategories,
                    ),
                  },
                }}
                scrollContainer={this.scrollContainer.current}
              />
            )
          }
          { saveSending
            && <Loading />
          }
        </Content>
      </div>
    );
  }
}

RecommendationNew.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  redirectIfNotPermitted: PropTypes.func,
  handleSubmitFail: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
  dataReady: PropTypes.bool,
  authReady: PropTypes.bool,
  taxonomies: PropTypes.object,
  measures: PropTypes.object,
  indicators: PropTypes.object,
  onCreateOption: PropTypes.func,
  connectedTaxonomies: PropTypes.object,
  onErrorDismiss: PropTypes.func.isRequired,
  onServerErrorDismiss: PropTypes.func.isRequired,
  frameworkId: PropTypes.string,
  frameworks: PropTypes.object,
  existingReferences: PropTypes.array,
  canUserAdministerCategories: PropTypes.bool,
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
  frameworkId: selectCurrentFrameworkId(state),
  frameworks: selectActiveFrameworks(state),
  existingReferences: selectRecommendationReferences(state),
  canUserAdministerCategories: selectCanUserAdministerCategories(state),
});

function mapDispatchToProps(dispatch) {
  return {
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
    handleSubmit: (formValues, currentFramework, fwTaxonomies) => {
      const formData = fromJS(formValues);
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
            create: selectedCategories.map((id) => Map({ category_id: id })),
          }),
        );
      }

      // measures if allowed by framework
      if (
        formData.get('associatedMeasures')
        && currentFramework.getIn(['attributes', 'has_measures'])
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
        formData.get('associatedIndicators')
        && currentFramework.getIn(['attributes', 'has_indicators'])
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
      if (saveData.getIn(['attributes', 'accepted']) === 'null') {
        saveData = saveData.setIn(['attributes', 'accepted'], null);
      }
      if (!currentFramework.get('id')) {
        saveData = saveData.setIn(['attributes', 'framework_id'], DEFAULT_FRAMEWORK);
      }
      dispatch(save(saveData.toJS()));
    },
    handleCancel: () => {
      dispatch(updatePath(ROUTES.RECOMMENDATIONS, { replace: true }));
    },
    onCreateOption: (args) => {
      dispatch(openNewEntityModal(args));
    },
  };
}


export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(RecommendationNew));
