import { createSelector } from 'reselect';
import { Map } from 'immutable';

import {
  selectEntities,
  selectSortByQuery,
  selectSortOrderQuery,
  selectFWTaxonomiesSorted,
  selectFWRecommendations,
  selectFWMeasures,
  selectActiveFrameworks,
  selectRecommendationMeasuresByMeasure,
  selectMeasureCategoriesByMeasure,
  selectRecommendationCategoriesByRecommendation,
} from 'containers/App/selectors';

import { qe } from 'utils/quasi-equals';
import { getSortOption, sortEntities } from 'utils/sort';

import { TAXONOMY_DEFAULT, SORT_OPTIONS } from './constants';

export const selectTaxonomy = createSelector(
  (state, { id }) => id,
  (state) => selectFWTaxonomiesSorted(state),
  (taxonomyId, taxonomies) => {
    if (!taxonomies || taxonomies.size === 0) return null;
    const id = typeof taxonomyId !== 'undefined' ? taxonomyId : TAXONOMY_DEFAULT;
    const taxonomy = taxonomies.get(id);
    return taxonomy && taxonomy.set(
      'children',
      taxonomies.filter(
        (tax) => qe(
          id,
          tax.getIn(['attributes', 'parent_id'])
        )
      )
    ).set(
      'parent',
      taxonomies.find(
        (tax) => qe(
          taxonomy.getIn(['attributes', 'parent_id']),
          tax.get('id')
        )
      )
    );
  }
);

const selectMeasures = createSelector(
  selectFWMeasures,
  selectMeasureCategoriesByMeasure,
  selectRecommendationMeasuresByMeasure,
  (entities, measureCategories, measureRecommendations) => entities
    && measureCategories
    && measureRecommendations
    && entities.map(
      (entity, id) => entity.set(
        'category_ids',
        measureCategories.get(parseInt(id, 10)) || Map(),
      ).set(
        'recommendation_ids',
        measureRecommendations.get(parseInt(id, 10)) || Map(),
      )
    )
);

const selectRecommendations = createSelector(
  selectFWRecommendations,
  selectRecommendationCategoriesByRecommendation,
  (entities, recCategories) => entities && recCategories && entities.map(
    (entity, id) => entity.set(
      'category_ids',
      recCategories.get(parseInt(id, 10)) || Map(),
    )
  )
);

const filterAssociatedEntities = (
  entities,
  key,
  associations,
) => entities.filter(
  (entity) => associations.find(
    (association, id) => entity.get(key).includes(parseInt(id, 10))
  )
);

// all entities that are tagged with a child category of current category
const filterChildConnections = (
  entities,
  categories,
  categoryId,
) => entities.filter(
  (entity) => categories.filter(
    (cat) => qe(
      categoryId,
      cat.getIn(['attributes', 'parent_id'])
    )
  ).some(
    (cat) => entity.get('category_ids').includes(parseInt(cat.get('id'), 10))
  )
);

const getCategoryCounts = (
  taxonomyCategories,
  taxonomy,
  measures,
  recommendations,
  categories,
  frameworks,
) => taxonomyCategories.map(
  (cat, categoryId) => {
    let category = cat;
    // measures
    const tagsMeasures = taxonomy.getIn(['attributes', 'tags_measures']);
    const childCatsTagMeasures = taxonomy.get('children')
      && taxonomy.get('children').some(
        (childTax) => childTax.getIn(['attributes', 'tags_measures'])
      );
    if (tagsMeasures || childCatsTagMeasures) {
      let associatedMeasures;
      // recommendations tagged by child categories
      if (childCatsTagMeasures) {
        associatedMeasures = filterChildConnections(
          measures,
          categories,
          categoryId
        );
      } else if (tagsMeasures) {
        associatedMeasures = measures.filter(
          (entity) => entity.get('category_ids').includes(parseInt(categoryId, 10))
        );
      }
      category = category.set('measuresCount', associatedMeasures.size);
      // get all public associated measures
      const associatedMeasuresPublic = associatedMeasures.filter(
        (measure) => !measure.getIn(['attributes', 'draft'])
      );
      category = category.set(
        'measuresPublicCount',
        associatedMeasuresPublic ? associatedMeasuresPublic.size : 0,
      );
      // for sorting
      category = category.set(
        'measures',
        associatedMeasuresPublic ? associatedMeasuresPublic.size : 0,
      );
    }

    // recommendations
    const tagsRecs = taxonomy.getIn(['attributes', 'tags_recommendations']);
    const childCatsTagRecs = taxonomy.get('children')
      && taxonomy.get('children').some(
        (childTax) => childTax.getIn(['attributes', 'tags_recommendations'])
      );
    if (tagsRecs || childCatsTagRecs) {
      let associatedRecs;
      // recommendations tagged by child categories
      if (childCatsTagRecs) {
        associatedRecs = filterChildConnections(
          recommendations,
          categories,
          categoryId,
        );
        // directly tagged recommendations
      } else if (tagsRecs) {
        associatedRecs = recommendations.filter(
          (entity) => entity.get('category_ids').includes(parseInt(categoryId, 10))
        );
      }
      const associatedRecsPublic = associatedRecs.filter(
        (rec) => !rec.getIn(['attributes', 'draft'])
      );
      // get all public accepted associated recs
      const publicAccepted = associatedRecsPublic.filter(
        (rec) => !!rec.getIn(['attributes', 'accepted'])
      );

      // all frameworks
      category = category.set('recommendationsCount', associatedRecs.size);
      category = category.set(
        'recommendationsPublicCount',
        associatedRecsPublic ? associatedRecsPublic.size : 0
      );
      // const framework = frameworks.find((fw) => qe(fw.get('id'), taxonomy.get('frameworkIds').first()));
      category = category.set(
        'recommendationsAcceptedCount',
        publicAccepted ? publicAccepted.size : 0
      );
      // by framework
      category = category.set(
        'recommendationsCountByFW',
        associatedRecs.groupBy(
          (rec) => rec.getIn(['attributes', 'framework_id'])
        ).map((group) => group.size),
      );
      category = category.set(
        'recommendationsPublicCountByFW',
        associatedRecsPublic
          ? associatedRecsPublic.groupBy(
            (rec) => rec.getIn(['attributes', 'framework_id'])
          ).map((group) => group.size)
          : 0,
      );
      category = category.set(
        'recommendationsAcceptedCountByFW',
        publicAccepted
          ? publicAccepted.groupBy(
            (rec) => rec.getIn(['attributes', 'framework_id'])
          ).map((group, key) => {
            const framework = frameworks.find(
              (fw) => qe(fw.get('id'), key)
            );
            return (framework && framework.getIn(['attributes', 'has_response']))
              ? group.size
              : -1;
          })
          : 0
      );
      // for sorting
      category = category.set(
        'recommendations',
        associatedRecsPublic ? associatedRecsPublic.size : 0
      );

      // measures connected via recommendation
      if (!tagsMeasures && !childCatsTagMeasures) {
        const connectedMeasures = filterAssociatedEntities(
          measures,
          'recommendation_ids',
          associatedRecsPublic,
        );
        category = category.set(
          'measuresCount',
          connectedMeasures ? connectedMeasures.size : 0
        );
        const connectedMeasuresPublic = connectedMeasures.filter(
          (measure) => !measure.getIn(['attributes', 'draft'])
        );
        category = category.set(
          'measuresPublicCount',
          connectedMeasuresPublic ? connectedMeasuresPublic.size : 0
        );
        // for sorting
        category = category.set(
          'measures',
          connectedMeasuresPublic ? connectedMeasuresPublic.size : 0
        );
        // by framework
        category = category.set(
          'measuresPublicCountByFw',
          associatedRecsPublic
            ? associatedRecsPublic.groupBy(
              (rec) => rec.getIn(['attributes', 'framework_id'])
            ).map((group) => {
              const connectedMeasuresForGroup = filterAssociatedEntities(
                measures,
                'recommendation_ids',
                group,
              );
              const connectedMeasuresPublicForGroup = connectedMeasuresForGroup.filter(
                (measure) => !measure.getIn(['attributes', 'draft'])
              );
              return connectedMeasuresPublicForGroup
                ? connectedMeasuresPublicForGroup.size
                : 0;
            })
            : 0,
        );
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
  selectActiveFrameworks,
  (taxonomy, recommendations, measures, categories, frameworks) => {
    if (taxonomy && recommendations && measures && categories && frameworks) {
      const taxonomyCategories = taxonomy && categories && categories.filter(
        (cat) => qe(
          cat.getIn(['attributes', 'taxonomy_id']),
          taxonomy.get('id')
        )
      );
      if (taxonomyCategories) {
        if (!taxonomy.get('parent')) {
          const catCounts = getCategoryCounts(
            taxonomyCategories,
            taxonomy,
            measures,
            recommendations,
            categories,
            frameworks,
          );
          return catCounts
            ? Map().set(
              taxonomy.get('id'),
              taxonomy.set('categories', catCounts)
            )
            : Map();
        }
        if (taxonomy.get('parent')) {
          const taxParentCategories = categories.filter(
            (cat) => qe(
              cat.getIn(['attributes', 'taxonomy_id']),
              taxonomy.get('parent').get('id')
            )
          );
          return taxParentCategories.map(
            (parentCat) => {
              const taxChildCategories = taxonomyCategories.filter(
                (cat) => qe(
                  cat.getIn(['attributes', 'parent_id']),
                  parentCat.get('id')
                )
              );
              const catCounts = getCategoryCounts(
                taxChildCategories,
                taxonomy,
                measures,
                recommendations,
                categories,
                frameworks,
              );
              return parentCat.set('categories', catCounts);
            }
          );
        }
      }
      return Map();
    }
    return null;
  }
);

const mapCategoryGroups = (
  categoryGroups,
  sort,
  order,
  userOnly = false,
) => {
  const sortOption = getSortOption(SORT_OPTIONS, sort, 'query');
  const groups = categoryGroups && categoryGroups.map(
    (group) => {
      const filtered = group.get('categories').filter(
        (cat) => userOnly
          ? cat.getIn(['attributes', 'user_only'])
          : !cat.getIn(['attributes', 'user_only'])
      );
      return group.set(
        'measures',
        filtered.reduce(
          (sum, cat) => sum + cat.get('measuresPublicCount'),
          0,
        ),
      ).set(
        'recommendations',
        filtered.reduce(
          (sum, cat) => sum + cat.get('recommendationsPublicCount'),
          0,
        ),
      ).set(
        'categories',
        sortEntities(
          sortEntities(
            filtered,
            order || (sortOption ? sortOption.order : 'asc'),
            sortOption ? sortOption.field : 'title',
            sortOption ? sortOption.type : 'string',
          ),
          'asc',
          'draft',
          'bool',
        ),
      );
    }
  );

  return sortEntities(
    groups,
    order || (sortOption ? sortOption.order : 'asc'),
    sortOption ? sortOption.field : 'title',
    sortOption ? sortOption.type : 'string',
  );
};

export const selectCategoryGroups = createSelector(
  selectCategoryCountGroups,
  (state, { query }) => selectSortByQuery(state, query),
  (state, { query }) => selectSortOrderQuery(state, query),
  (categoryGroups, sort, order) => categoryGroups
    ? mapCategoryGroups(
      categoryGroups,
      sort,
      order
    )
    : Map()
);

export const selectUserOnlyCategoryGroups = createSelector(
  selectCategoryCountGroups,
  (state, { query }) => selectSortByQuery(state, query),
  (state, { query }) => selectSortOrderQuery(state, query),
  (categoryGroups, sort, order) => categoryGroups
    ? mapCategoryGroups(
      categoryGroups,
      sort,
      order,
      true, // userOnly
    )
    : Map()
);
