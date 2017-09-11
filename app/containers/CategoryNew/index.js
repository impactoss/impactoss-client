/*
 *
 * CategoryNew
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { actions as formActions } from 'react-redux-form/immutable';

import { List } from 'immutable';

import {
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
  submitInvalid,
  saveErrorDismiss,
  openNewEntityModal,
} from 'containers/App/actions';

import {
  selectReady,
  selectIsUserAdmin,
  selectEntity,
  selectMeasuresCategorised,
  selectSdgTargetsCategorised,
  selectRecommendationsCategorised,
} from 'containers/App/selectors';

import ErrorMessages from 'components/ErrorMessages';
import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'components/forms/EntityForm';

import {
  selectDomain,
  selectUsers,
  selectConnectedTaxonomies,
} from './selectors';

import messages from './messages';
import { save } from './actions';
import { DEPENDENCIES, FORM_INITIAL } from './constants';


export class CategoryNew extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
    this.props.initialiseForm('categoryNew.form.data', FORM_INITIAL);
  }

  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    if (nextProps.dataReady && !this.props.dataReady) {
      this.props.redirectIfNotPermitted();
    }
    if (hasNewError(nextProps, this.props) && this.ScrollContainer) {
      scrollToTop(this.ScrollContainer);
    }
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

  getHeaderAsideFields = (taxonomy) => {
    const fields = []; // fieldGroups
    if (taxonomy.getIn(['attributes', 'tags_users'])) {
      fields.push({
        fields: [
          getCheckboxField(
            this.context.intl.formatMessage,
            appMessages,
            'user_only',
          ),
        ],
      });
    }
    return fields;
  }

  getBodyMainFields = (taxonomy, connectedTaxonomies, recommendations, measures, sdgtargets, onCreateOption, userOnly) => {
    const fields = [];
    fields.push({
      fields: [getMarkdownField(this.context.intl.formatMessage, appMessages)],
    });
    if (!userOnly) {
      fields.push({
        label: this.context.intl.formatMessage(appMessages.entities.connections.plural),
        icon: 'connections',
        fields: [
          taxonomy.getIn(['attributes', 'tags_measures']) && measures &&
            renderMeasureControl(measures, connectedTaxonomies, onCreateOption),
          taxonomy.getIn(['attributes', 'tags_sdgtargets']) && sdgtargets &&
            renderSdgTargetControl(sdgtargets, connectedTaxonomies, onCreateOption),
          taxonomy.getIn(['attributes', 'tags_recommendations']) && recommendations &&
            renderRecommendationControl(recommendations, connectedTaxonomies, onCreateOption),
        ],
      });
    }
    return fields;
  };

  getBodyAsideFields = (users, isAdmin, taxonomy) => {
    const fields = []; // fieldGroups
    fields.push({
      fields: [getFormField({
        formatMessage: this.context.intl.formatMessage,
        appMessages,
        controlType: 'url',
        attribute: 'url',
      })],
    });
    if (isAdmin && !!taxonomy.getIn(['attributes', 'has_manager'])) {
      fields.push({
        fields: [
          renderUserControl(
            users,
            this.context.intl.formatMessage(appMessages.attributes.manager_id.categories)
          ),
        ],
      });
    }
    return fields;
  }

  render() {
    const { taxonomy, dataReady, isAdmin, viewDomain, users, connectedTaxonomies, recommendations, measures, sdgtargets, onCreateOption } = this.props;
    const { saveSending, saveError, submitValid } = viewDomain.page;
    const taxonomyReference = this.props.params.id;

    let pageTitle = this.context.intl.formatMessage(messages.pageTitle);
    if (taxonomy && taxonomy.get('attributes')) {
      pageTitle = this.context.intl.formatMessage(messages.pageTitleTaxonomy, {
        taxonomy: taxonomy.getIn(['attributes', 'title']),
      });
    }

    return (
      <div>
        <Helmet
          title={this.context.intl.formatMessage(messages.pageTitle)}
          meta={[
            {
              name: 'description',
              content: this.context.intl.formatMessage(messages.metaDescription),
            },
          ]}
        />
        <Content innerRef={(node) => { this.ScrollContainer = node; }} >
          <ContentHeader
            title={pageTitle}
            type={CONTENT_SINGLE}
            icon="categories"
            buttons={
              dataReady ? [{
                type: 'cancel',
                onClick: () => this.props.handleCancel(taxonomyReference),
              },
              {
                type: 'save',
                onClick: () => this.props.handleSubmitRemote('categoryNew.form.data'),
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
              model="categoryNew.form.data"
              formData={viewDomain.form.data}
              handleSubmit={(formData) => this.props.handleSubmit(
                formData,
                measures,
                recommendations,
                sdgtargets,
                taxonomy
              )}
              handleSubmitFail={this.props.handleSubmitFail}
              handleCancel={() => this.props.handleCancel(taxonomyReference)}
              handleUpdate={this.props.handleUpdate}
              fields={{ // isManager, taxonomies,
                header: {
                  main: this.getHeaderMainFields(),
                  aside: this.getHeaderAsideFields(taxonomy),
                },
                body: {
                  main: this.getBodyMainFields(
                    taxonomy,
                    connectedTaxonomies,
                    recommendations,
                    measures,
                    sdgtargets,
                    onCreateOption,
                    viewDomain.form.data.getIn(['attributes', 'user_only'])
                  ),
                  aside: this.getBodyAsideFields(users, isAdmin, taxonomy),
                },
              }}
            />
          }
        </Content>
      </div>
    );
  }
}

CategoryNew.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  redirectIfNotPermitted: PropTypes.func,
  handleSubmitRemote: PropTypes.func.isRequired,
  handleSubmitFail: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  dataReady: PropTypes.bool,
  isAdmin: PropTypes.bool,
  viewDomain: PropTypes.object,
  taxonomy: PropTypes.object,
  params: PropTypes.object,
  users: PropTypes.object,
  measures: PropTypes.object,
  sdgtargets: PropTypes.object,
  recommendations: PropTypes.object,
  connectedTaxonomies: PropTypes.object,
  initialiseForm: PropTypes.func,
  onErrorDismiss: PropTypes.func.isRequired,
  onServerErrorDismiss: PropTypes.func.isRequired,
  onCreateOption: PropTypes.func,
};

CategoryNew.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  isAdmin: selectIsUserAdmin(state),
  viewDomain: selectDomain(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  taxonomy: selectEntity(state, { path: 'taxonomies', id: props.params.id }),
  users: selectUsers(state),
  measures: selectMeasuresCategorised(state),
  sdgtargets: selectSdgTargetsCategorised(state),
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
    handleSubmit: (formData, measures, recommendations, sdgtargets, taxonomy) => {
      let saveData = formData.setIn(['attributes', 'taxonomy_id'], taxonomy.get('id'));
      if (!formData.getIn(['attributes', 'user_only'])) {
        if (taxonomy.getIn(['attributes', 'tags_measures'])) {
          saveData = saveData.set(
            'measureCategories',
            getConnectionUpdatesFromFormData({
              formData,
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
              formData,
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
              formData,
              connections: sdgtargets,
              connectionAttribute: 'associatedSdgTargets',
              createConnectionKey: 'sdgtarget_id',
              createKey: 'category_id',
            })
          );
        }
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
    handleCancel: (taxonomyReference) => {
      dispatch(updatePath(`/categories/${taxonomyReference}`));
    },
    handleUpdate: (formData) => {
      dispatch(updateEntityForm(formData));
    },
    onCreateOption: (args) => {
      dispatch(openNewEntityModal(args));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryNew);
