/*
 *
 * CategoryNew
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HelmetCanonical from 'components/HelmetCanonical';
import { injectIntl } from 'react-intl';

import { List, Map, fromJS } from 'immutable';

import {
  userOptions,
  entityOptions,
  parentCategoryOptions,
  renderUserControl,
  renderMeasureControl,
  renderRecommendationsByFwControl,
  renderParentCategoryControl,
  getTitleFormField,
  getReferenceFormField,
  getShortTitleFormField,
  getMarkdownFormField,
  getFormField,
  getConnectionUpdatesFromFormData,
  getCheckboxField,
  getStatusField,
  getDateField,
} from 'utils/forms';

import { scrollToTop } from 'utils/scroll-to-component';
import { hasNewError } from 'utils/entity-form';

import { getCheckedValuesFromOptions } from 'components/forms/MultiSelectControl';

import { ROUTES, CONTENT_SINGLE } from 'containers/App/constants';
import { CATEGORY_ADMIN_MIN_ROLE } from 'themes/config';

import appMessages from 'containers/App/messages';

import {
  loadEntitiesIfNeeded,
  redirectIfNotPermitted,
  updatePath,
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

  getInitialFormData = ({ users, measures, recommendationsByFw, parentOptions,
  }) => FORM_INITIAL
    .set('associatedMeasures', measures && entityOptions(measures, true))
    .set('associatedCategory', parentOptions && parentCategoryOptions(parentOptions, null))
    .set('associatedRecommendationsByFw', recommendationsByFw
      ? recommendationsByFw.map((recs) => entityOptions(recs, true))
      : Map())
    .set('associatedUser', users && userOptions(users, null));


  getHeaderMainFields = (parentOptions, parentTaxonomy, intl) => {
    const groups = [];
    groups.push({ // fieldGroup
      fields: [
        getReferenceFormField({ formatMessage: intl.formatMessage }),
        getTitleFormField(intl.formatMessage),
        getShortTitleFormField(intl.formatMessage),
      ],
    });
    if (parentOptions && parentTaxonomy) {
      groups.push({
        label: intl.formatMessage(appMessages.entities.taxonomies.parent),
        icon: 'categories',
        fields: [renderParentCategoryControl(
          parentOptions,
          getEntityTitle(parentTaxonomy),
        )],
      });
    }
    return groups;
  };

  getHeaderAsideFields = (taxonomy, intl) => {
    const fields = []; // fieldGroups
    fields.push({
      fields: [
        getStatusField(intl.formatMessage),
      ],
    });
    if (taxonomy.getIn(['attributes', 'tags_users'])) {
      fields.push({
        fields: [
          getCheckboxField(
            intl.formatMessage,
            'user_only',
          ),
        ],
      });
    }
    return fields;
  };

  getBodyMainFields = (
    taxonomy,
    connectedTaxonomies,
    recommendationsByFw,
    measures,
    onCreateOption,
    userOnly,
    intl,
  ) => {
    const groups = [];
    groups.push({
      fields: [getMarkdownFormField({ formatMessage: intl.formatMessage })],
    });
    if (!userOnly) {
      if (taxonomy.getIn(['attributes', 'tags_measures']) && measures) {
        groups.push({
          label: intl.formatMessage(appMessages.nav.measuresSuper),
          icon: 'measures',
          fields: [
            renderMeasureControl(measures, connectedTaxonomies, onCreateOption, intl),
          ],
        });
      }
      if (
        taxonomy.getIn(['attributes', 'tags_recommendations'])
        && recommendationsByFw
      ) {
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
    }
    return groups;
  };

  getBodyAsideFields = (users, isAdmin, taxonomy, intl) => {
    const fields = []; // fieldGroups
    fields.push({
      fields: [
        taxonomy.getIn(['attributes', 'has_date'])
          && getDateField(
            intl.formatMessage,
            'date',
          ),
        getFormField({
          formatMessage: intl.formatMessage,
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
            intl.formatMessage(appMessages.attributes.manager_id.categories)
          ),
        ],
      });
    }
    return fields;
  };

  /* eslint-disable react/destructuring-assignment */
  getTaxTitle = (id) => this.props.intl.formatMessage(appMessages.entities.taxonomies[id].single);
  /* eslint-enable react/destructuring-assignment */

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
      intl,
    } = this.props;
    const { saveSending, saveError, submitValid } = viewDomain.get('page').toJS();
    const taxonomyReference = this.props.params.id;

    let pageTitle = intl.formatMessage(messages.pageTitle);
    if (taxonomy && taxonomy.get('attributes')) {
      pageTitle = intl.formatMessage(messages.pageTitleTaxonomy, {
        taxonomy: this.getTaxTitle(taxonomy.get('id')),
      });
    }

    return (
      <div>
        <HelmetCanonical
          title={intl.formatMessage(messages.pageTitle)}
          meta={[
            {
              name: 'description',
              content: intl.formatMessage(messages.metaDescription),
            },
          ]}
        />
        <Content ref={this.scrollContainer}>
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
                  measures,
                  recommendationsByFw,
                  taxonomy
                )}
                handleSubmitFail={this.props.handleSubmitFail}
                handleCancel={() => this.props.handleCancel(taxonomyReference)}
                fields={{ // isManager, taxonomies,
                  header: {
                    main: this.getHeaderMainFields(parentOptions, parentTaxonomy, intl),
                    aside: this.getHeaderAsideFields(taxonomy, intl),
                  },
                  body: {
                    main: this.getBodyMainFields(
                      taxonomy,
                      connectedTaxonomies,
                      recommendationsByFw,
                      measures,
                      onCreateOption,
                      FORM_INITIAL.getIn(['attributes', 'user_only']),
                      intl
                    ),
                    aside: this.getBodyAsideFields(users, isAdmin, taxonomy, intl),
                  },
                }}
                scrollContainer={this.scrollContainer.current}
              />
            )
          }
        </Content>
      </div>
    );
  }
}

CategoryNew.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  redirectIfNotPermitted: PropTypes.func,
  handleSubmitFail: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
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
  onErrorDismiss: PropTypes.func.isRequired,
  onServerErrorDismiss: PropTypes.func.isRequired,
  onCreateOption: PropTypes.func,
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
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    redirectIfNotPermitted: () => {
      dispatch(redirectIfNotPermitted(CATEGORY_ADMIN_MIN_ROLE));
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
    handleSubmit: (formValues, measures, recommendationsByFw, taxonomy) => {
      const formData = fromJS(formValues);
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
        if (recommendationsByFw && taxonomy.getIn(['attributes', 'tags_recommendations'])) {
          saveData = saveData.set(
            'recommendationCategories',
            recommendationsByFw
              .map((recs, fwid) => getConnectionUpdatesFromFormData({
                formData: !formData.getIn(['attributes', 'user_only']) ? formData : null,
                connections: recs,
                connectionAttribute: ['associatedRecommendationsByFw', fwid.toString()],
                createConnectionKey: 'recommendation_id',
                createKey: 'category_id',
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
      dispatch(updatePath(`${ROUTES.TAXONOMIES}/${taxonomyReference}`, { replace: true }));
    },
    onCreateOption: (args) => {
      dispatch(openNewEntityModal(args));
    },
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(CategoryNew));
