import { createSelector } from 'reselect';
import { Map } from 'immutable';

import {
  selectEntities,
  selectSortByQuery,
  selectSortOrderQuery,
  selectTaxonomiesSorted,
  selectFWRecommendations,
  selectFWMeasures,
} from 'containers/App/selectors';

import { attributesEqual } from 'utils/entities';
import { getSortOption, sortEntities } from 'utils/sort';

import { TAXONOMY_DEFAULT, SORT_OPTIONS } from './constants';

export const selectTaxonomy = createSelector(
  (state, { id }) => id,
  (state) => selectTaxonomiesSorted(state),
  (taxonomyId, taxonomies) => {
    if (!taxonomies || taxonomies.size === 0) return taxonomies;
    const id = typeof taxonomyId !== 'undefined' ? taxonomyId : TAXONOMY_DEFAULT;
    const taxonomy = taxonomies.get(id);
    return taxonomy
      .set('children', taxonomies.filter((tax) => attributesEqual(id, tax.getIn(['attributes', 'parent_id']))))
      .set('parent', taxonomies.find((tax) => attributesEqual(taxonomy.getIn(['attributes', 'parent_id']), tax.get('id'))));
  }
);

const selectMeasures = createSelector(
  selectFWMeasures,
  (state) => selectEntities(state, 'measure_categories'),
  (state) => selectEntities(state, 'recommendation_measures'),
  (entities, measureCategories, recMeasures) =>
    entities.map((entity, id) => entity
      .set('category_ids', measureCategories
        .filter((association) => attributesEqual(association.getIn(['attributes', 'measure_id']), id))
        .map((association) => association.getIn(['attributes', 'category_id']))
      )
      .set('recommendation_ids', recMeasures
        .filter((association) => attributesEqual(association.getIn(['attributes', 'measure_id']), id))
        .map((association) => association.getIn(['attributes', 'recommendation_id']))
      )
    )
);

const selectRecommendations = createSelector(
  selectFWRecommendations,
  (state) => selectEntities(state, 'recommendation_categories'),
  (entities, recCategories) =>
    entities.map((entity, id) => entity.set('category_ids', recCategories
      .filter((association) => attributesEqual(association.getIn(['attributes', 'recommendation_id']), id))
      .map((association) => association.getIn(['attributes', 'category_id']))
    ))
);

const filterAssociatedEntities = (entities, key, associations) =>
  entities.filter((entity) => associations.find((association, id) => entity.get(key).includes(parseInt(id, 10))));

const filterChildConnections = (entities, categories, categoryId) =>
  // all entities that are tagged with a child category of current category
  entities.filter((entity) => categories
    .filter((cat) => attributesEqual(categoryId, cat.getIn(['attributes', 'parent_id'])))
    .some((cat) => entity.get('category_ids').includes(parseInt(cat.get('id'), 10)))
  );

const getCategoryCounts = (
  taxonomyCategories,
  taxonomy,
  measures,
  recommendations,
  categories,
) => taxonomyCategories
  .map((cat, categoryId) => {
    let category = cat;
    // measures
    const childCatsTagMeasures =
      taxonomy.get('children') && taxonomy.get('children').some((childTax) => childTax.getIn(['attributes', 'tags_measures']));
    const tagsMeasures = taxonomy.getIn(['attributes', 'tags_measures']) || childCatsTagMeasures;
    if (tagsMeasures) {
      let associatedMeasures;
      if (taxonomy.getIn(['attributes', 'tags_measures'])) {
        associatedMeasures = measures.filter((entity) => entity.get('category_ids').includes(parseInt(categoryId, 10)));
        // recommendations tagged by child categories
      } else if (childCatsTagMeasures) {
        associatedMeasures = filterChildConnections(measures, categories, categoryId);
      }
      category = category.set('measuresTotal', associatedMeasures.size);
      // get all public associated measures
      const associatedMeasuresPublic = associatedMeasures.filter((measure) => !measure.getIn(['attributes', 'draft']));
      category = category.set('measures', associatedMeasuresPublic ? associatedMeasuresPublic.size : 0);
    }

    // recommendations
    const childCatsTagRecs =
      taxonomy.get('children') && taxonomy.get('children').some((childTax) => childTax.getIn(['attributes', 'tags_recommendations']));
    const tagsRecs = taxonomy.getIn(['attributes', 'tags_recommendations']) || childCatsTagRecs;
    if (tagsRecs) {
      let associatedRecs;
      // directly tagged recommendations
      if (taxonomy.getIn(['attributes', 'tags_recommendations'])) {
        associatedRecs = recommendations.filter((entity) => entity.get('category_ids').includes(parseInt(categoryId, 10)));
        // recommendations tagged by child categories
      } else if (childCatsTagRecs) {
        associatedRecs = filterChildConnections(recommendations, categories, categoryId);
      }

      category = category.set('recommendationsTotal', associatedRecs.size);
      const associatedRecsPublic = associatedRecs.filter((rec) => !rec.getIn(['attributes', 'draft']));
      category = category.set('recommendations', associatedRecsPublic ? associatedRecsPublic.size : 0);
      // get all public accepted associated recs
      const publicAccepted = associatedRecsPublic.filter((rec) => !!rec.getIn(['attributes', 'accepted']));
      category = category.set('recommendationsAccepted', publicAccepted ? publicAccepted.size : 0);

      // measures connected via recommendation
      if (!tagsMeasures) {
        const connectedMeasures = filterAssociatedEntities(measures, 'recommendation_ids', associatedRecs);
        category = category.set('measuresTotal', connectedMeasures ? connectedMeasures.size : 0);
        const connectedMeasuresPublic = connectedMeasures.filter((measure) => !measure.getIn(['attributes', 'draft']));
        category = category.set('measures', connectedMeasuresPublic ? connectedMeasuresPublic.size : 0);
      }
    }
    return category;
  }
);

const selectCategoryCountGroups = createSelector(
  selectTaxonomy,
  selectRecommendations,
  selectMeasures,
  (state) => selectEntities(state, 'categories'),
  (taxonomy, recommendations, measures, categories) => {
    const taxonomyCategories = categories.filter((cat) =>
      attributesEqual(cat.getIn(['attributes', 'taxonomy_id']), taxonomy.get('id'))
    );
    if (taxonomy && taxonomyCategories) {
      if (!taxonomy.get('parent')) {
        const catCounts = getCategoryCounts(
          taxonomyCategories,
          taxonomy,
          measures,
          recommendations,
          categories,
        );
        return Map().set(taxonomy.get('id'), taxonomy.set('categories', catCounts));
      }
      if (taxonomy.get('parent')) {
        const taxParentCategories = categories.filter((cat) =>
          attributesEqual(cat.getIn(['attributes', 'taxonomy_id']), taxonomy.get('parent').get('id'))
        );
        return taxParentCategories
          .map((parentCat) => {
            const taxChildCategories = taxonomyCategories.filter((cat) => attributesEqual(cat.getIn(['attributes', 'parent_id']), parentCat.get('id')));
            const catCounts = getCategoryCounts(
              taxChildCategories,
              taxonomy,
              measures,
              recommendations,
              categories,
            );
            return parentCat.set('categories', catCounts);
          });
      }
    }
    return Map();
  }
);

export const selectCategoryGroups = createSelector(
  selectCategoryCountGroups,
  (state, { query }) => selectSortByQuery(state, query),
  (state, { query }) => selectSortOrderQuery(state, query),
  (categoryGroups, sort, order) => {
    const sortOption = getSortOption(SORT_OPTIONS, sort, 'query');
    return sortEntities(
      categoryGroups.map((group) => group
        .set('categories', sortEntities(
          sortEntities(
            group.get('categories').filter((cat) => !cat.getIn(['attributes', 'user_only'])),
            order || (sortOption ? sortOption.order : 'asc'),
            sortOption ? sortOption.field : 'title',
            sortOption ? sortOption.type : 'string',
          ),
          'asc',
          'draft',
          'bool',
        ))
        .set('measures', group.get('categories').reduce((sum, cat) => sum + cat.get('measures'), 0))
        .set('recommendations', group.get('categories').reduce((sum, cat) => sum + cat.get('recommendations'), 0))
      ),
      order || (sortOption ? sortOption.order : 'asc'),
      sortOption ? sortOption.field : 'title',
      sortOption ? sortOption.type : 'string',
    );
  }
);

export const selectUserOnlyCategoryGroups = createSelector(
  selectCategoryCountGroups,
  (state, { query }) => selectSortByQuery(state, query),
  (state, { query }) => selectSortOrderQuery(state, query),
  (categoryGroups, sort, order) => {
    const sortOption = getSortOption(SORT_OPTIONS, sort, 'query');
    return sortEntities(
      categoryGroups.map((group) => group
        .set('categories', sortEntities(
          sortEntities(
            group.get('categories').filter((cat) => cat.getIn(['attributes', 'user_only'])),
            order || (sortOption ? sortOption.order : 'asc'),
            sortOption ? sortOption.field : 'title',
            sortOption ? sortOption.type : 'string',
          ),
          'asc',
          'draft',
          'bool',
        ))
        .set('measures', group.get('categories').reduce((sum, cat) => sum + cat.get('measures'), 0))
        .set('recommendations', group.get('categories').reduce((sum, cat) => sum + cat.get('recommendations'), 0))
      ),
      order || (sortOption ? sortOption.order : 'asc'),
      sortOption ? sortOption.field : 'title',
      sortOption ? sortOption.type : 'string',
    );
  }
);
