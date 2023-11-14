/*
 *
 * CategoryView
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import {
  getReferenceField,
  getTitleField,
  getCategoryShortTitleField,
  getStatusField,
  getMetaField,
  getMarkdownField,
  getLinkField,
  getMeasureConnectionField,
  getMeasureConnectionGroupsField,
  getRecommendationConnectionField,
  getRecommendationConnectionGroupsField,
  getManagerField,
  getEntityLinkField,
  getTaxonomyFields,
  hasTaxonomyCategories,
  getDateField,
} from 'utils/fields';

import {
  getEntityTitle,
  getEntityTitleTruncated,
  getEntityReference,
} from 'utils/entities';
import { qe } from 'utils/quasi-equals';

import { loadEntitiesIfNeeded, updatePath, closeEntity } from 'containers/App/actions';

import { PATHS, CONTENT_SINGLE } from 'containers/App/constants';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityView from 'components/EntityView';

import {
  selectReady,
  selectIsUserManager,
  selectMeasureConnections,
  selectRecommendationConnections,
  selectActiveFrameworks,
} from 'containers/App/selectors';


import appMessages from 'containers/App/messages';
import messages from './messages';

import {
  selectViewEntity,
  selectRecommendations,
  selectMeasures,
  selectTaxonomiesWithCategories,
  selectParentTaxonomy,
  selectChildTaxonomies,
  selectChildRecommendations,
  selectChildMeasures,
} from './selectors';

import { DEPENDENCIES } from './constants';

export class CategoryView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  UNSAFE_componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }

  getHeaderMainFields = (entity, isManager, parentTaxonomy) => {
    const groups = [];
    groups.push(
      { // fieldGroup
        fields: [
          getReferenceField(entity, isManager),
          getTitleField(entity, isManager),
          getCategoryShortTitleField(entity, isManager),
        ],
      },
    );
    // include parent link
    if (entity.get('category') && parentTaxonomy) {
      groups.push({
        label: appMessages.entities.taxonomies.parent,
        icon: 'categories',
        fields: [getEntityLinkField(entity.get('category'), '/category', '', getEntityTitle(parentTaxonomy))],
      });
    }
    return groups;
  };

  getHeaderAsideFields = (entity, isManager) => {
    const { intl } = this.context;
    const fields = []; // fieldGroups
    if (isManager) {
      fields.push({
        fields: [
          getStatusField(entity),
          getMetaField(entity),
        ],
      });
    }
    if (
      entity.getIn(['taxonomy', 'attributes', 'tags_users'])
      && entity.getIn(['attributes', 'user_only'])
    ) {
      fields.push({
        type: 'dark',
        fields: [{
          type: 'text',
          value: intl.formatMessage(appMessages.textValues.user_only),
          label: appMessages.attributes.user_only,
        }],
      });
    }
    return fields.length > 0 ? fields : null;
  }

  getBodyMainFields = (
    entity,
    recommendationsByFw,
    childRecommendationsByFw,
    measures,
    childMeasures,
    taxonomies,
    onEntityClick,
    measureConnections,
    recommendationConnections,
    frameworks,
  ) => {
    const fields = [];
    // own attributes
    fields.push({
      fields: [getMarkdownField(entity, 'description', true)],
    });
    // connections
    if (!entity.getIn(['attributes', 'user_only'])) {
      // measures
      // child categories related measures
      const measuresConnections = [];
      if (childMeasures) {
        childMeasures.forEach((tax) => measuresConnections.push(
          getMeasureConnectionGroupsField(
            tax.get('categories'),
            appMessages.entities.taxonomies[tax.get('id')].single,
            taxonomies,
            measureConnections,
            onEntityClick,
          )
        ));
      } else if (entity.getIn(['taxonomy', 'attributes', 'tags_measures']) && measures) {
        // related actions
        measuresConnections.push(
          getMeasureConnectionField(
            measures,
            taxonomies,
            measureConnections,
            onEntityClick,
          ),
        );
      }
      fields.push({
        label: appMessages.nav.measuresSuper,
        icon: 'measures',
        fields: measuresConnections,
      });

      // child taxonomies tag recs
      // child categories related recommendations
      const recConnections = [];
      if (childRecommendationsByFw) {
        childRecommendationsByFw.forEach((recs, fwid) => {
          const framework = frameworks.find((fw) => qe(fw.get('id'), fwid));
          const hasResponse = framework && framework.getIn(['attributes', 'has_response']);
          recs.forEach((tax) => {
            recConnections.push(
              getRecommendationConnectionGroupsField(
                tax.get('categories'),
                appMessages.entities.taxonomies[tax.get('id')].single,
                taxonomies,
                recommendationConnections,
                onEntityClick,
                fwid,
                hasResponse,
              )
            );
          });
        });
        // related recommendations
      } else if (entity.getIn(['taxonomy', 'attributes', 'tags_recommendations']) && recommendationsByFw) {
        recommendationsByFw.forEach((recs, fwid) => {
          const framework = frameworks.find((fw) => qe(fw.get('id'), fwid));
          const hasResponse = framework && framework.getIn(['attributes', 'has_response']);
          recConnections.push(
            getRecommendationConnectionField(
              recs,
              taxonomies,
              recommendationConnections,
              onEntityClick,
              fwid,
              hasResponse,
            ),
          );
        });
      }
      fields.push({
        label: appMessages.nav.recommendationsSuper,
        icon: 'recommendations',
        fields: recConnections,
      });
    }
    return fields;
  };

  getBodyAsideFields = (entity, isManager, childTaxonomies) => {
    const fields = [];
    // include children links
    if (childTaxonomies && hasTaxonomyCategories(childTaxonomies)) {
      fields.push({ // fieldGroup
        label: appMessages.entities.taxonomies.children,
        icon: 'categories',
        fields: getTaxonomyFields(childTaxonomies, true),
      });
    }
    const showLink = entity.getIn(['attributes', 'url'])
      && entity.getIn(['attributes', 'url']).trim().length > 0;
    const showDate = entity.getIn(['taxonomy', 'attributes', 'has_date']);
    if (showLink || showDate) {
      fields.push({
        type: 'dark',
        fields: [
          showDate && getDateField(entity, 'date', true),
          showLink && getLinkField(entity),
        ],
      });
    }
    if (isManager && !!entity.getIn(['taxonomy', 'attributes', 'has_manager'])) {
      fields.push({
        type: 'dark',
        fields: [getManagerField(
          entity,
          appMessages.attributes.manager_id.categories,
          appMessages.attributes.manager_id.categoriesEmpty
        )],
      });
    }
    return fields.length > 0 ? fields : null;
  };

  /* eslint-disable react/destructuring-assignment */
  getTaxTitle = (id) => this.context.intl.formatMessage(
    appMessages.entities.taxonomies[id].single
  );
  /* eslint-ensable react/destructuring-assignment */

  render() {
    const { intl } = this.context;
    const {
      viewEntity,
      dataReady,
      isManager,
      recommendationsByFw,
      childRecommendationsByFw,
      measures,
      childMeasures,
      taxonomies,
      onEntityClick,
      measureConnections,
      recommendationConnections,
      parentTaxonomy,
      childTaxonomies,
      frameworks,
    } = this.props;
    let buttons = [];
    if (dataReady) {
      buttons.push({
        type: 'icon',
        onClick: () => window.print(),
        title: 'Print',
        icon: 'print',
      });
      buttons = isManager
        ? buttons.concat([
          {
            type: 'edit',
            onClick: () => this.props.handleEdit(this.props.params.id),
          },
          {
            type: 'close',
            onClick: () => this.props.handleClose(this.props.viewEntity && this.props.viewEntity.getIn(['taxonomy', 'id'])),
          },
        ])
        : buttons.concat([{
          type: 'close',
          onClick: () => this.props.handleClose(this.props.viewEntity && this.props.viewEntity.getIn(['taxonomy', 'id'])),
        }]);
    }

    let pageTitle = intl.formatMessage(messages.pageTitle);
    let metaTitle = pageTitle;
    if (
      viewEntity
      && viewEntity.get('taxonomy')
    ) {
      pageTitle = this.getTaxTitle(viewEntity.getIn(['taxonomy', 'id']));
      const ref = getEntityReference(viewEntity, false);
      metaTitle = ref
        ? `${pageTitle} ${ref}: ${getEntityTitleTruncated(viewEntity)}`
        : `${pageTitle}: ${getEntityTitleTruncated(viewEntity)}`;
    }

    return (
      <div>
        <Helmet
          title={metaTitle}
          meta={[
            { name: 'description', content: intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <Content>
          <ContentHeader
            title={pageTitle}
            type={CONTENT_SINGLE}
            icon="categories"
            buttons={buttons}
          />
          { !dataReady
            && <Loading />
          }
          { !viewEntity && dataReady
            && (
              <div>
                <FormattedMessage {...messages.notFound} />
              </div>
            )
          }
          { viewEntity && dataReady
            && (
              <EntityView
                fields={{
                  header: {
                    main: this.getHeaderMainFields(viewEntity, isManager, parentTaxonomy),
                    aside: this.getHeaderAsideFields(viewEntity, isManager),
                  },
                  body: {
                    main: this.getBodyMainFields(
                      viewEntity,
                      recommendationsByFw,
                      childRecommendationsByFw,
                      measures,
                      childMeasures,
                      taxonomies,
                      onEntityClick,
                      measureConnections,
                      recommendationConnections,
                      frameworks,
                    ),
                    aside: this.getBodyAsideFields(
                      viewEntity,
                      isManager,
                      childTaxonomies,
                    ),
                  },
                }}
              />
            )
          }
        </Content>
      </div>
    );
  }
}

CategoryView.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleEdit: PropTypes.func,
  handleClose: PropTypes.func,
  onEntityClick: PropTypes.func,
  viewEntity: PropTypes.object,
  dataReady: PropTypes.bool,
  params: PropTypes.object,
  isManager: PropTypes.bool,
  parentTaxonomy: PropTypes.object,
  recommendationsByFw: PropTypes.object,
  childRecommendationsByFw: PropTypes.object,
  taxonomies: PropTypes.object,
  childTaxonomies: PropTypes.object,
  measures: PropTypes.object,
  childMeasures: PropTypes.object,
  measureConnections: PropTypes.object,
  recommendationConnections: PropTypes.object,
  frameworks: PropTypes.object,
};

CategoryView.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  isManager: selectIsUserManager(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  viewEntity: selectViewEntity(state, props.params.id),
  recommendationsByFw: selectRecommendations(state, props.params.id),
  childRecommendationsByFw: selectChildRecommendations(state, props.params.id),
  childMeasures: selectChildMeasures(state, props.params.id),
  measures: selectMeasures(state, props.params.id),
  taxonomies: selectTaxonomiesWithCategories(state),
  parentTaxonomy: selectParentTaxonomy(state, props.params.id),
  childTaxonomies: selectChildTaxonomies(state, props.params.id),
  measureConnections: selectMeasureConnections(state),
  recommendationConnections: selectRecommendationConnections(state),
  frameworks: selectActiveFrameworks(state),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    onEntityClick: (id, path) => {
      dispatch(updatePath(`/${path}/${id}`));
    },
    handleEdit: (categoryId) => {
      dispatch(updatePath(`${PATHS.CATEGORIES}${PATHS.EDIT}/${categoryId}`, { replace: true }));
    },
    handleClose: (taxonomyId) => {
      dispatch(closeEntity(taxonomyId ? `${PATHS.TAXONOMIES}/${taxonomyId}` : PATHS.OVERVIEW));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryView);
