/*
 *
 * ActionNew
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HelmetCanonical from 'components/HelmetCanonical';
import { injectIntl } from 'react-intl';

import { Map, List, fromJS } from 'immutable';

import {
  taxonomyOptions,
  entityOptions,
  getConnectionUpdatesFromFormData,
  getTitleFormField,
  getStatusField,
  getMarkdownFormField,
  renderIndicatorControl,
  renderRecommendationsByFwControl,
  getDateField,
  getTextareaField,
  renderTaxonomyControl,
  getReferenceFormField,
} from 'utils/formik';

import { getCheckedValuesFromOptions } from 'components/formik/MultiSelectControl';

import { scrollToTop } from 'utils/scroll-to-component';
import { hasNewError } from 'utils/entity-form';

import { ROUTES, CONTENT_SINGLE } from 'containers/App/constants';
import { USER_ROLES } from 'themes/config';

import {
  loadEntitiesIfNeeded,
  redirectIfNotPermitted,
  updatePath,
  openNewEntityModal,
  submitInvalid,
  saveErrorDismiss,
} from 'containers/App/actions';

import {
  selectEntities,
  selectReady,
  selectReadyForAuthCheck,
  selectMeasureTaxonomies,
  selectMeasureReferences,
  selectCanUserAdministerCategories,
} from 'containers/App/selectors';

import Messages from 'components/Messages';
import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'containers/EntityForm';

import appMessages from 'containers/App/messages';

import {
  selectDomain,
  selectConnectedTaxonomies,
  selectRecommendationsByFw,
} from './selectors';

import messages from './messages';
import { DEPENDENCIES, FORM_INITIAL } from './constants';
import { save } from './actions';

export class ActionNew extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
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

  getInitialFormData = ({ taxonomies, recommendationsByFw, indicators }) =>
    FORM_INITIAL
      .set('associatedTaxonomies', taxonomyOptions(taxonomies))
      .set('associatedRecommendationsByFw', recommendationsByFw
        ? recommendationsByFw.map((recs) => entityOptions(recs, true))
        : Map())
      .set('associatedIndicators', entityOptions(indicators, true));

  getHeaderMainFields = (existingReferences, intl) =>
    ([ // fieldGroups
      { // fieldGroup
        fields: [
          getReferenceFormField({
            formatMessage: intl.formatMessage,
            required: true,
            prohibitedValues: existingReferences,
          }),
          getTitleFormField(intl.formatMessage),
        ],
      },
    ]);

  getHeaderAsideFields = (intl) =>
    ([
      {
        fields: [
          getStatusField(intl.formatMessage),
        ],
      },
    ]);

  getBodyMainFields = (
    connectedTaxonomies,
    indicators,
    recommendationsByFw,
    onCreateOption,
    intl,
  ) => {
    const groups = [];
    groups.push(
      {
        fields: [
          getMarkdownFormField({
            formatMessage: intl.formatMessage,
            attribute: 'description',
            label: 'fullMeasure',
          }),
          getMarkdownFormField({
            formatMessage: intl.formatMessage,
            attribute: 'outcome',
            label: 'comment',
          }),
        ],
      },
    );
    if (indicators) {
      groups.push(
        {
          label: intl.formatMessage(appMessages.nav.indicatorsSuper),
          icon: 'indicators',
          fields: [
            renderIndicatorControl(indicators, onCreateOption, intl),
          ],
        },
      );
    }
    if (recommendationsByFw) {
      const recConnections = renderRecommendationsByFwControl(
        recommendationsByFw,
        connectedTaxonomies,
        onCreateOption,
        intl,
      );
      if (recConnections) {
        groups.push(
          {
            label: intl.formatMessage(appMessages.nav.recommendationsSuper),
            icon: 'recommendations',
            fields: recConnections,
          },
        );
      }
    }
    return groups;
  };

  getBodyAsideFields = (taxonomies, onCreateOption, canCreateCategories, intl) => 
    ([ // fieldGroups
      { // fieldGroup
        fields: [
          getDateField({ formatMessage: intl.formatMessage, attribute: 'target_date' }),
          getTextareaField(intl.formatMessage, 'target_date_comment'),
        ],
      },
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

  render() {
    const {
      dataReady,
      viewDomain,
      connectedTaxonomies,
      recommendationsByFw,
      indicators,
      taxonomies,
      onCreateOption,
      existingReferences,
      canUserAdministerCategories,
      intl,
    } = this.props;

    const { saveSending, saveError, submitValid } = viewDomain.get('page').toJS();
    return (
      <div>
        <HelmetCanonical
          title={`${intl.formatMessage(messages.pageTitle)}`}
          meta={[
            {
              name: 'description',
              content: intl.formatMessage(messages.metaDescription),
            },
          ]}
        />
        <Content ref={this.scrollContainer}>
          <ContentHeader
            title={intl.formatMessage(messages.pageTitle)}
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
                handleSubmit={(formData) => this.props.handleSubmit(formData, recommendationsByFw)}
                handleSubmitFail={this.props.handleSubmitFail}
                handleCancel={this.props.handleCancel}
                fields={{
                  header: {
                    main: this.getHeaderMainFields(existingReferences, intl),
                    aside: this.getHeaderAsideFields(intl),
                  },
                  body: {
                    main: this.getBodyMainFields(
                      connectedTaxonomies,
                      indicators,
                      recommendationsByFw,
                      onCreateOption,
                      intl,
                    ),
                    aside: this.getBodyAsideFields(
                      taxonomies,
                      onCreateOption,
                      canUserAdministerCategories,
                      intl,
                    ),
                  },
                }}
                scrollContainer={this.scrollContainer.current}
              />
            )
          }
          {saveSending
            && <Loading />
          }
        </Content>
      </div>
    );
  }
}

ActionNew.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  redirectIfNotPermitted: PropTypes.func,
  handleSubmitFail: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
  dataReady: PropTypes.bool,
  authReady: PropTypes.bool,
  taxonomies: PropTypes.object,
  recommendationsByFw: PropTypes.object,
  indicators: PropTypes.object,
  onCreateOption: PropTypes.func,
  connectedTaxonomies: PropTypes.object,
  onErrorDismiss: PropTypes.func.isRequired,
  onServerErrorDismiss: PropTypes.func.isRequired,
  existingReferences: PropTypes.array,
  canUserAdministerCategories: PropTypes.bool,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  viewDomain: selectDomain(state),
  authReady: selectReadyForAuthCheck(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  taxonomies: selectMeasureTaxonomies(state),
  indicators: selectEntities(state, 'indicators'),
  recommendationsByFw: selectRecommendationsByFw(state),
  connectedTaxonomies: selectConnectedTaxonomies(state),
  existingReferences: selectMeasureReferences(state),
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
    handleSubmit: (formValues, recommendationsByFw) => {
      const formData = fromJS(formValues);
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
      if (formData.get('associatedRecommendationsByFw') && recommendationsByFw) {
        saveData = saveData.set(
          'recommendationMeasures',
          recommendationsByFw
            .map((recs, fwid) => getConnectionUpdatesFromFormData({
              formData,
              connections: recs,
              connectionAttribute: ['associatedRecommendationsByFw', fwid.toString()],
              createConnectionKey: 'recommendation_id',
              createKey: 'measure_id',
            }))
            .reduce(
              (memo, deleteCreateLists) => {
                const creates = memo.get('create').concat(deleteCreateLists.get('create'));
                return memo.set('create', creates);
              },
              fromJS({
                delete: [],
                create: [],
              }),
            )
        );
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
      dispatch(save(saveData.toJS()));
    },
    handleCancel: () => {
      dispatch(updatePath(ROUTES.MEASURES), { replace: true });
    },
    onCreateOption: (args) => {
      dispatch(openNewEntityModal(args));
    },
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ActionNew));
