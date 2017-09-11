/*
 *
 * CategoryEdit
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { actions as formActions } from 'react-redux-form/immutable';

import { Map, List } from 'immutable';

import {
  userOptions,
  entityOptions,
  renderUserControl,
  renderMeasureControl,
  renderSdgTargetControl,
  renderRecommendationControl,
  getTitleFormField,
  getReferenceFormField,
  getShortTitleFormField,
  getMarkdownField,
  getFormField,
  getConnectionUpdatesFromFormData,
  getCheckboxField,
} from 'utils/forms';

import {
  getMetaField,
} from 'utils/fields';

import { scrollToTop } from 'utils/scroll-to-component';
import { hasNewError } from 'utils/entity-form';

import { getCheckedValuesFromOptions } from 'components/forms/MultiSelectControl';

import { USER_ROLES, CONTENT_SINGLE } from 'containers/App/constants';
import appMessages from 'containers/App/messages';

import {
  loadEntitiesIfNeeded,
  redirectIfNotPermitted,
  updatePath,
  updateEntityForm,
  deleteEntity,
  submitInvalid,
  saveErrorDismiss,
  openNewEntityModal,
} from 'containers/App/actions';

import {
  selectReady,
  selectIsUserAdmin,
} from 'containers/App/selectors';

import ErrorMessages from 'components/ErrorMessages';
import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'components/forms/EntityForm';

import {
  selectDomain,
  selectViewEntity,
  selectUsers,
  selectMeasures,
  selectSdgTargets,
  selectRecommendations,
  selectConnectedTaxonomies,
} from './selectors';

import messages from './messages';
import { save } from './actions';
import { DEPENDENCIES, FORM_INITIAL } from './constants';

export class CategoryEdit extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();

    if (this.props.dataReady && this.props.viewEntity) {
      this.props.initialiseForm('categoryEdit.form.data', this.getInitialFormData());
    }
  }

  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    if (nextProps.dataReady && !this.props.dataReady && nextProps.viewEntity) {
      this.props.redirectIfNotPermitted();
      this.props.initialiseForm('categoryEdit.form.data', this.getInitialFormData(nextProps));
    }
    if (hasNewError(nextProps, this.props) && this.ScrollContainer) {
      scrollToTop(this.ScrollContainer);
    }
  }

  getInitialFormData = (nextProps) => {
    const props = nextProps || this.props;
    const { viewEntity, users, measures, sdgtargets, recommendations } = props;
    return viewEntity
    ? Map({
      id: viewEntity.get('id'),
      attributes: viewEntity.get('attributes').mergeWith(
        (oldVal, newVal) => oldVal === null ? newVal : oldVal,
        FORM_INITIAL.get('attributes')
      ),
      associatedMeasures: entityOptions(measures, true),
      associatedSdgTargets: entityOptions(sdgtargets, true),
      associatedRecommendations: entityOptions(recommendations, true),
      associatedUser: userOptions(users, viewEntity.getIn(['attributes', 'manager_id'])),
      // TODO allow single value for singleSelect
    })
    : Map();
  }

  getHeaderMainFields = () => ([ // fieldGroups
    { // fieldGroup
      fields: [
        getReferenceFormField(this.context.intl.formatMessage, appMessages),
        getTitleFormField(this.context.intl.formatMessage, appMessages),
        getShortTitleFormField(this.context.intl.formatMessage, appMessages),
      ],
    },
  ]);


  getHeaderAsideFields = (entity) => {
    const fields = []; // fieldGroups
    if (entity.getIn(['taxonomy', 'attributes', 'tags_users'])) {
      fields.push({
        fields: [
          getCheckboxField(
            this.context.intl.formatMessage,
            appMessages,
            'user_only',
            null
          ),
        ],
      });
    }
    fields.push({
      fields: [getMetaField(entity, appMessages)],
    });
    return fields;
  }

  getBodyMainFields = (entity, connectedTaxonomies, recommendations, measures, sdgtargets, onCreateOption, userOnly) => {
    const fields = [];
    fields.push({
      fields: [getMarkdownField(this.context.intl.formatMessage, appMessages)],
    });
    if (!userOnly) {
      fields.push(
        {
          label: this.context.intl.formatMessage(appMessages.entities.connections.plural),
          icon: 'connections',
          fields: [
            entity.getIn(['taxonomy', 'attributes', 'tags_measures']) && measures &&
              renderMeasureControl(measures, connectedTaxonomies, onCreateOption),
            entity.getIn(['taxonomy', 'attributes', 'tags_sdgtargets']) && sdgtargets &&
              renderSdgTargetControl(sdgtargets, connectedTaxonomies, onCreateOption),
            entity.getIn(['taxonomy', 'attributes', 'tags_recommendations']) && recommendations &&
              renderRecommendationControl(recommendations, connectedTaxonomies, onCreateOption),
          ],
        },
      );
    }
    return fields;
  };
  getBodyAsideFields = (entity, users, isAdmin) => {
    const fields = []; // fieldGroups
    fields.push({
      fields: [getFormField({
        formatMessage: this.context.intl.formatMessage,
        appMessages,
        controlType: 'url',
        attribute: 'url',
      })],
    });
    if (isAdmin && !!entity.getIn(['taxonomy', 'attributes', 'has_manager'])) {
      fields.push({
        fields: [
          renderUserControl(
            users,
            this.context.intl.formatMessage(appMessages.attributes.manager_id.categories),
            entity.getIn(['attributes', 'manager_id'])
          ),
        ],
      });
    }
    return fields;
  }

  render() {
    const { viewEntity, dataReady, isAdmin, viewDomain, users, connectedTaxonomies, recommendations, measures, sdgtargets, onCreateOption } = this.props;
    const reference = this.props.params.id;
    const { saveSending, saveError, deleteSending, deleteError, submitValid } = viewDomain.page;

    let pageTitle = this.context.intl.formatMessage(messages.pageTitle);
    if (viewEntity && viewEntity.get('taxonomy')) {
      pageTitle = this.context.intl.formatMessage(messages.pageTitleTaxonomy, {
        taxonomy: viewEntity.getIn(['taxonomy', 'attributes', 'title']),
      });
    }

    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.pageTitle)}: ${reference}`}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <Content innerRef={(node) => { this.ScrollContainer = node; }} >
          <ContentHeader
            title={pageTitle}
            type={CONTENT_SINGLE}
            icon="categories"
            buttons={
              viewEntity && dataReady ? [{
                type: 'cancel',
                onClick: () => this.props.handleCancel(reference),
              },
              {
                type: 'save',
                disabled: saveSending,
                onClick: () => this.props.handleSubmitRemote('categoryEdit.form.data'),
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
          {deleteError &&
            <ErrorMessages error={deleteError} />
          }
          {(saveSending || deleteSending || !dataReady) &&
            <Loading />
          }
          {!viewEntity && dataReady && !saveError && !deleteSending &&
            <div>
              <FormattedMessage {...messages.notFound} />
            </div>
          }
          {viewEntity && dataReady && !deleteSending &&
            <EntityForm
              model="categoryEdit.form.data"
              formData={viewDomain.form.data}
              saving={saveSending}
              handleSubmit={(formData) => this.props.handleSubmit(
                formData,
                measures,
                recommendations,
                sdgtargets,
                viewEntity.get('taxonomy'),
              )}
              handleSubmitFail={this.props.handleSubmitFail}
              handleCancel={() => this.props.handleCancel(reference)}
              handleUpdate={this.props.handleUpdate}
              handleDelete={() => isAdmin
                ? this.props.handleDelete(viewEntity.getIn(['attributes', 'taxonomy_id']))
                : null
              }
              fields={{
                header: {
                  main: this.getHeaderMainFields(),
                  aside: this.getHeaderAsideFields(viewEntity),
                },
                body: {
                  main: this.getBodyMainFields(
                    viewEntity,
                    connectedTaxonomies,
                    recommendations,
                    measures,
                    sdgtargets,
                    onCreateOption,
                    viewDomain.form.data.getIn(['attributes', 'user_only'])
                  ),
                  aside: this.getBodyAsideFields(viewEntity, users, isAdmin),
                },
              }}
            />
          }
          {(saveSending || deleteSending) &&
            <Loading />
          }
        </Content>
      </div>
    );
  }
}

CategoryEdit.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  redirectIfNotPermitted: PropTypes.func,
  initialiseForm: PropTypes.func,
  handleSubmitRemote: PropTypes.func.isRequired,
  handleSubmitFail: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
  viewEntity: PropTypes.object,
  dataReady: PropTypes.bool,
  isAdmin: PropTypes.bool,
  params: PropTypes.object,
  measures: PropTypes.object,
  sdgtargets: PropTypes.object,
  recommendations: PropTypes.object,
  connectedTaxonomies: PropTypes.object,
  users: PropTypes.object,
  onErrorDismiss: PropTypes.func.isRequired,
  onServerErrorDismiss: PropTypes.func.isRequired,
  onCreateOption: PropTypes.func,
};

CategoryEdit.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  isAdmin: selectIsUserAdmin(state),
  viewDomain: selectDomain(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  viewEntity: selectViewEntity(state, props.params.id),
  users: selectUsers(state),
  sdgtargets: selectSdgTargets(state, props.params.id),
  measures: selectMeasures(state, props.params.id),
  recommendations: selectRecommendations(state, props.params.id),
  connectedTaxonomies: selectConnectedTaxonomies(state),
});

function mapDispatchToProps(dispatch, props) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    redirectIfNotPermitted: () => {
      dispatch(redirectIfNotPermitted(USER_ROLES.MANAGER));
    },
    initialiseForm: (model, formData) => {
      dispatch(formActions.reset(model));
      dispatch(formActions.change(model, formData, { silent: true }));
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
    handleSubmit: (formData, measures, recommendations, sdgtargets, taxonomy) => {
      let saveData = formData;
      if (taxonomy.getIn(['attributes', 'tags_measures'])) {
        saveData = saveData.set(
          'measureCategories',
          getConnectionUpdatesFromFormData({
            formData: !formData.getIn(['attributes', 'user_only']) ? formData : null,
            connections: measures,
            connectionAttribute: 'associatedMeasures',
            createConnectionKey: 'measure_id',
            createKey: 'category_id',
          })
        );
      }
      if (taxonomy.getIn(['attributes', 'tags_recommendations'])) {
        saveData = saveData.set(
          'recommendationCategories',
          getConnectionUpdatesFromFormData({
            formData: !formData.getIn(['attributes', 'user_only']) ? formData : null,
            connections: recommendations,
            connectionAttribute: 'associatedRecommendations',
            createConnectionKey: 'recommendation_id',
            createKey: 'category_id',
          })
        );
      }
      if (taxonomy.getIn(['attributes', 'tags_sdgtargets'])) {
        saveData = saveData.set(
          'sdgtargetCategories',
          getConnectionUpdatesFromFormData({
            formData: !formData.getIn(['attributes', 'user_only']) ? formData : null,
            connections: sdgtargets,
            connectionAttribute: 'associatedSdgTargets',
            createConnectionKey: 'sdgtarget_id',
            createKey: 'category_id',
          })
        );
      }

      // TODO: remove once have singleselect instead of multiselect
      const formUserIds = getCheckedValuesFromOptions(formData.get('associatedUser'));
      if (List.isList(formUserIds) && formUserIds.size) {
        saveData = saveData.setIn(['attributes', 'manager_id'], formUserIds.first());
      } else {
        saveData = saveData.setIn(['attributes', 'manager_id'], null);
      }
      dispatch(save(saveData.toJS()));
    },
    handleCancel: (reference) => {
      dispatch(updatePath(`/category/${reference}`));
    },
    handleUpdate: (formData) => {
      dispatch(updateEntityForm(formData));
    },
    handleDelete: (taxonomyId) => {
      dispatch(deleteEntity({
        path: 'categories',
        id: props.params.id,
        redirect: `categories/${taxonomyId}`,
      }));
    },
    onCreateOption: (args) => {
      dispatch(openNewEntityModal(args));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryEdit);
