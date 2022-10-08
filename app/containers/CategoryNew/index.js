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

import { List, fromJS } from 'immutable';

import {
  renderUserControl,
  renderMeasureControl,
  renderRecommendationsByFwControl,
  renderParentCategoryControl,
  getTitleFormField,
  getReferenceFormField,
  getShortTitleFormField,
  getMarkdownField,
  getFormField,
  getConnectionUpdatesFromFormData,
  getCheckboxField,
  getStatusField,
  getDateField,
} from 'utils/forms';

import { scrollToTop } from 'utils/scroll-to-component';
import { hasNewError } from 'utils/entity-form';

import { getCheckedValuesFromOptions } from 'components/forms/MultiSelectControl';

import { PATHS, CONTENT_SINGLE } from 'containers/App/constants';
import { USER_ROLES } from 'themes/config';

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
  selectReadyForAuthCheck,
  selectIsUserAdmin,
  selectTaxonomy,
} from 'containers/App/selectors';

import Messages from 'components/Messages';
import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'containers/EntityForm';

import { getEntityTitle } from 'utils/entities';

import {
  selectDomain,
  selectUsers,
  selectConnectedTaxonomies,
  selectParentOptions,
  selectParentTaxonomy,
  selectRecommendationsByFw,
  selectMeasures,
} from './selectors';

import messages from './messages';
import { save } from './actions';
import { DEPENDENCIES, FORM_INITIAL } from './constants';


export class CategoryNew extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      scrollContainer: null,
    };
  }

  UNSAFE_componentWillMount() {
    this.props.loadEntitiesIfNeeded();
    this.props.initialiseForm('categoryNew.form.data', FORM_INITIAL);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
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

  getHeaderMainFields = (parentOptions, parentTaxonomy) => {
    const groups = [];
    groups.push({ // fieldGroup
      fields: [
        getReferenceFormField(this.context.intl.formatMessage),
        getTitleFormField(this.context.intl.formatMessage),
        getShortTitleFormField(this.context.intl.formatMessage),
      ],
    });
    if (parentOptions && parentTaxonomy) {
      groups.push({
        label: this.context.intl.formatMessage(appMessages.entities.taxonomies.parent),
        icon: 'categories',
        fields: [renderParentCategoryControl(
          parentOptions,
          getEntityTitle(parentTaxonomy),
        )],
      });
    }
    return groups;
  };

  getHeaderAsideFields = (taxonomy) => {
    const fields = []; // fieldGroups
    fields.push({
      fields: [
        getStatusField(this.context.intl.formatMessage),
      ],
    });
    if (taxonomy.getIn(['attributes', 'tags_users'])) {
      fields.push({
        fields: [
          getCheckboxField(
            this.context.intl.formatMessage,
            'user_only',
          ),
        ],
      });
    }
    return fields;
  }

  getBodyMainFields = (
    taxonomy,
    connectedTaxonomies,
    recommendationsByFw,
    measures,
    onCreateOption,
    userOnly,
  ) => {
    const groups = [];
    groups.push({
      fields: [getMarkdownField(this.context.intl.formatMessage)],
    });
    if (!userOnly) {
      if (taxonomy.getIn(['attributes', 'tags_measures']) && measures) {
        groups.push({
          label: this.context.intl.formatMessage(appMessages.nav.measuresSuper),
          icon: 'measures',
          fields: [
            renderMeasureControl(measures, connectedTaxonomies, onCreateOption, this.context.intl),
          ],
        });
      }
      if (
        taxonomy.getIn(['attributes', 'tags_recommendations']) &&
        recommendationsByFw
      ) {
        const recConnections = renderRecommendationsByFwControl(
          recommendationsByFw,
          connectedTaxonomies,
          onCreateOption,
          this.context.intl,
        );
        if (recConnections) {
          groups.push(
            {
              label: this.context.intl.formatMessage(appMessages.nav.recommendations),
              icon: 'recommendations',
              fields: recConnections,
            },
          );
        }
      }
    }
    return groups;
  };

  getBodyAsideFields = (users, isAdmin, taxonomy) => {
    const fields = []; // fieldGroups
    fields.push({
      fields: [
        taxonomy.getIn(['attributes', 'has_date']) &&
          getDateField(
            this.context.intl.formatMessage,
            'date',
          ),
        getFormField({
          formatMessage: this.context.intl.formatMessage,
          controlType: 'url',
          attribute: 'url',
        }),
      ],
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

  getTaxTitle = (id) => this.context.intl.formatMessage(appMessages.entities.taxonomies[id].single);

  render() {
    const {
      taxonomy,
      dataReady,
      isAdmin,
      viewDomain,
      users,
      connectedTaxonomies,
      recommendationsByFw,
      measures,
      onCreateOption,
      parentOptions,
      parentTaxonomy,
    } = this.props;
    const { saveSending, saveError, submitValid } = viewDomain.page;
    const taxonomyReference = this.props.params.id;

    let pageTitle = this.context.intl.formatMessage(messages.pageTitle);
    if (taxonomy && taxonomy.get('attributes')) {
      pageTitle = this.context.intl.formatMessage(messages.pageTitleTaxonomy, {
        taxonomy: this.getTaxTitle(taxonomy.get('id')),
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
        <Content
          innerRef={(node) => {
            if (!this.state.scrollContainer) {
              this.setState({ scrollContainer: node });
            }
          }}
        >
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
                disabled: saveSending,
                onClick: () => this.props.handleSubmitRemote('categoryNew.form.data'),
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
              model="categoryNew.form.data"
              formData={viewDomain.form.data}
              saving={saveSending}
              handleSubmit={(formData) => this.props.handleSubmit(
                formData,
                measures,
                recommendationsByFw,
                taxonomy
              )}
              handleSubmitFail={this.props.handleSubmitFail}
              handleCancel={() => this.props.handleCancel(taxonomyReference)}
              handleUpdate={this.props.handleUpdate}
              fields={{ // isManager, taxonomies,
                header: {
                  main: this.getHeaderMainFields(parentOptions, parentTaxonomy),
                  aside: this.getHeaderAsideFields(taxonomy),
                },
                body: {
                  main: this.getBodyMainFields(
                    taxonomy,
                    connectedTaxonomies,
                    recommendationsByFw,
                    measures,
                    onCreateOption,
                    viewDomain.form.data.getIn(['attributes', 'user_only'])
                  ),
                  aside: this.getBodyAsideFields(users, isAdmin, taxonomy),
                },
              }}
              scrollContainer={this.state.scrollContainer}
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
  authReady: PropTypes.bool,
  isAdmin: PropTypes.bool,
  viewDomain: PropTypes.object,
  taxonomy: PropTypes.object,
  params: PropTypes.object,
  parentOptions: PropTypes.object,
  parentTaxonomy: PropTypes.object,
  users: PropTypes.object,
  measures: PropTypes.object,
  recommendationsByFw: PropTypes.object,
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
  authReady: selectReadyForAuthCheck(state),
  taxonomy: selectTaxonomy(state, props.params.id),
  parentOptions: selectParentOptions(state, props.params.id),
  parentTaxonomy: selectParentTaxonomy(state, props.params.id),
  users: selectUsers(state),
  measures: selectMeasures(state),
  recommendationsByFw: selectRecommendationsByFw(state, props.params.id),
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
    handleSubmit: (formData, measures, recommendationsByFw, taxonomy) => {
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
            recommendationsByFw
              .map((recs, fwid) =>
                getConnectionUpdatesFromFormData({
                  formData: !formData.getIn(['attributes', 'user_only']) ? formData : null,
                  connections: recs,
                  connectionAttribute: ['associatedRecommendationsByFw', fwid.toString()],
                  createConnectionKey: 'recommendation_id',
                  createKey: 'category_id',
                })
              )
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
      }


      // TODO: remove once have singleselect instead of multiselect
      const formUserIds = getCheckedValuesFromOptions(formData.get('associatedUser'));
      if (List.isList(formUserIds) && formUserIds.size) {
        saveData = saveData.setIn(['attributes', 'manager_id'], formUserIds.first());
      } else {
        saveData = saveData.setIn(['attributes', 'manager_id'], null);
      }
      // TODO: remove once have singleselect instead of multiselect
      const formCategoryIds = getCheckedValuesFromOptions(formData.get('associatedCategory'));
      if (List.isList(formCategoryIds) && formCategoryIds.size) {
        saveData = saveData.setIn(['attributes', 'parent_id'], formCategoryIds.first());
      } else {
        saveData = saveData.setIn(['attributes', 'parent_id'], null);
      }
      dispatch(save(saveData.toJS()));
    },
    handleCancel: (taxonomyReference) => {
      dispatch(updatePath(`${PATHS.TAXONOMIES}/${taxonomyReference}`, { replace: true }));
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
