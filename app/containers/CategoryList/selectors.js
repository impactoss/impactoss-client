import { createSelector } from 'reselect';
import { Map } from 'immutable';

import {
  selectEntities,
  selectSortByQuery,
  selectSortOrderQuery,
} from 'containers/App/selectors';

import { attributesEqual } from 'utils/entities';
import { getSortOption, sortEntities } from 'utils/sort';

import { TAXONOMY_DEFAULT, SORT_OPTIONS } from './constants';

export const selectTaxonomy = createSelector(
  (state, { id }) => id,
  (state) => selectEntities(state, 'taxonomies'),
  (taxonomyId, taxonomies) =>
    taxonomies && taxonomies.get(typeof taxonomyId !== 'undefined' ? taxonomyId : TAXONOMY_DEFAULT)
);

const selectTaxonomyCategories = createSelector(
  selectTaxonomy,
  (state) => selectEntities(state, 'categories'),
  (taxonomy, categories) =>
    taxonomy && taxonomy.set('categories', categories.filter((cat) =>
      attributesEqual(cat.getIn(['attributes', 'taxonomy_id']), taxonomy.get('id'))
    ))
);

const selectMeasures = createSelector(
  (state) => selectEntities(state, 'measures'),
  (state) => selectEntities(state, 'measure_categories'),
  (state) => selectEntities(state, 'recommendation_measures'),
  (state) => selectEntities(state, 'sdgtarget_measures'),
  (entities, measureCategories, recMeasures, sdgtargetMeasures) =>
    entities.map((entity, id) => entity
      .set('category_ids', measureCategories
        .filter((association) => attributesEqual(association.getIn(['attributes', 'measure_id']), id))
        .map((association) => association.getIn(['attributes', 'category_id']))
      )
      .set('recommendation_ids', recMeasures
        .filter((association) => attributesEqual(association.getIn(['attributes', 'measure_id']), id))
        .map((association) => association.getIn(['attributes', 'recommendation_id']))
      )
      .set('sdgtarget_ids', sdgtargetMeasures
        .filter((association) => attributesEqual(association.getIn(['attributes', 'measure_id']), id))
        .map((association) => association.getIn(['attributes', 'sdgtarget_id']))
      )
    )
);

const selectRecommendations = createSelector(
  (state) => selectEntities(state, 'recommendations'),
  (state) => selectEntities(state, 'recommendation_categories'),
  (entities, recCategories) =>
    entities.map((entity, id) => entity.set('category_ids', recCategories
      .filter((association) => attributesEqual(association.getIn(['attributes', 'recommendation_id']), id))
      .map((association) => association.getIn(['attributes', 'category_id']))
    ))
);
const selectSdgTargets = createSelector(
  (state) => selectEntities(state, 'sdgtargets'),
  (state) => selectEntities(state, 'sdgtarget_categories'),
  (entities, sdgtargetCategories) =>
    entities.map((entity, id) => entity.set('category_ids', sdgtargetCategories
      .filter((association) => attributesEqual(association.getIn(['attributes', 'sdgtarget_id']), id))
      .map((association) => association.getIn(['attributes', 'category_id']))
    ))
);
const filterAssociatedEntities = (entities, key, associations) =>
  entities.filter((entity) => associations.find((association, id) => entity.get(key).includes(parseInt(id, 10))));

const selectCategoriesCounts = createSelector(
  selectTaxonomyCategories,
  selectRecommendations,
  selectMeasures,
  selectSdgTargets,
  (taxonomy, recommendations, measures, sdgtargets) => {
    if (taxonomy && taxonomy.get('categories')) {
      const taxonomyCategories = taxonomy
        .get('categories')
        .map((cat, categoryId) => {
          let category = cat;
          // measures
          if (taxonomy.getIn(['attributes', 'tags_measures'])) {
            const associatedMeasures = measures.filter((entity) => entity.get('category_ids').includes(parseInt(categoryId, 10)));
            category = category.set('measures', associatedMeasures.size);
            // get all public associated measures
            const associatedMeasuresPublic = associatedMeasures.filter((measure) => !measure.getIn(['attributes', 'draft']));
            category = category.set('measuresTotalPublic', associatedMeasuresPublic ? associatedMeasuresPublic.size : 0);
          }

          // recommendations
          if (taxonomy.getIn(['attributes', 'tags_recommendations'])) {
            const associatedRecs = recommendations.filter((entity) => entity.get('category_ids').includes(parseInt(categoryId, 10)));
            category = category.set('recommendations', associatedRecs.size);
            const associatedRecsPublic = associatedRecs.filter((rec) => !rec.getIn(['attributes', 'draft']));
            category = category.set('recommendationsPublic', associatedRecsPublic ? associatedRecsPublic.size : 0);
            // get all public accepted associated recs
            const publicAccepted = associatedRecsPublic.filter((rec) => !!rec.getIn(['attributes', 'accepted']));
            category = category.set('recommendationsAccepted', publicAccepted ? publicAccepted.size : 0);

            // measures connected via recommendation
            if (!taxonomy.getIn(['attributes', 'tags_measures'])) {
              const connectedMeasures = filterAssociatedEntities(measures, 'recommendation_ids', associatedRecs);
              category = category.set('measures', connectedMeasures ? connectedMeasures.size : 0);
              const connectedMeasuresPublic = connectedMeasures.filter((measure) => !measure.getIn(['attributes', 'draft']));
              category = category.set('measuresTotalPublic', connectedMeasuresPublic ? connectedMeasuresPublic.size : 0);
            }
          }

          // sdgtargets
          if (taxonomy.getIn(['attributes', 'tags_sdgtargets'])) {
            const associatedTargets = sdgtargets.filter((entity) => entity.get('category_ids').includes(parseInt(categoryId, 10)));
            category = category.set('sdgtargets', associatedTargets.size);
            const associatedTargetsPublic = associatedTargets.filter((target) => !target.getIn(['attributes', 'draft']));
            category = category.set('sdgtargetsPublic', associatedTargetsPublic ? associatedTargetsPublic.size : 0);

            // measures connected via recommendation
            if (!taxonomy.getIn(['attributes', 'tags_measures'])) {
              const connectedMeasuresTarget = filterAssociatedEntities(measures, 'sdgtarget_ids', associatedTargets);
              category = category.set('measures', connectedMeasuresTarget ? connectedMeasuresTarget.size : 0);
              const connectedMeasuresTargetPublic = connectedMeasuresTarget.filter((measure) => !measure.getIn(['attributes', 'draft']));
              category = category.set('measuresTotalPublic', connectedMeasuresTargetPublic ? connectedMeasuresTargetPublic.size : 0);
            }
          }

          return category;
        }
      );

      return taxonomyCategories;
    }
    return Map();
  }
);

export const selectCategories = createSelector(
  selectCategoriesCounts,
  (state, { query }) => selectSortByQuery(state, query),
  (state, { query }) => selectSortOrderQuery(state, query),
  (categories, sort, order) => {
    const sortOption = getSortOption(SORT_OPTIONS, sort, 'query');
    return sortEntities(
      categories,
      order || (sortOption ? sortOption.order : 'asc'),
      sortOption ? sortOption.field : 'title',
      sortOption ? sortOption.type : 'string',
    );
  }
);
