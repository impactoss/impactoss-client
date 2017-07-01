import { createSelector } from 'reselect';
import { reduce } from 'lodash/collection';

import {
  selectEntities,
  getAttributeQuery,
  getSearchQuery,
  getWithoutQuery,
} from 'containers/App/selectors';

import { cleanupSearchTarget, regExMultipleWords } from 'utils/string';

import asList from 'utils/as-list';
import isNumber from 'utils/is-number';

const attributesEqual = (testValue, value) => {
  if (typeof testValue === 'undefined' || testValue === null) {
    return value === 'null';
  }
  return testValue.toString() === value.toString();
};

export const getConnections = createSelector(
  (state) => selectEntities(state, 'measures'),
  (measures) => ({ measures })
);

export const getTaxonomies = createSelector(
  (state) => selectEntities(state, 'taxonomies'),
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) => taxonomies
    .filter((taxonomy) => taxonomy.getIn(['attributes', 'tags_recommendations']))
    .map((taxonomy) => taxonomy.set(
      'categories',
      categories.filter((category) => attributesEqual(category.getIn(['attributes', 'taxonomy_id']), taxonomy.get('id')))
    ))
);

const getEntitiesWhere = createSelector(
  getAttributeQuery,
  (state, { path }) => selectEntities(state, path),
  (attributeQuery, entities) => {
    // console.log('getEntitiesWhere', attributeQuery)
    if (attributeQuery) {
      return entities.filter((entity) =>
        reduce(attributeQuery, (passing, value, attribute) => {
          // TODO if !passing return false, no point going further
          if (attribute === 'id') {
            return passing && entity.get('id') === value.toString();
          }
          const testValue = entity.getIn(['attributes', attribute]);
          if (typeof testValue === 'undefined' || testValue === null) {
            return (value === 'null') ? passing : false;
          }
          return passing && testValue.toString() === value.toString();
        }, true)
      );
    }
    return entities;
  }
);

// const getEntitiesWithout = createSelector(
//   (state, {path}) = getEntitiesWhere(state, {path}),
//   getWithoutAssociationQuery,
//   (entities, withoutQuery) = {
//
//   }
// )
// prep searchtarget, incl id
const prepareEntitySearchTarget = (entity, fields) =>
  reduce(
    fields,
    (target, field) => `${target} ${cleanupSearchTarget(entity.getIn(['attributes', field]))}`,
    entity.get('id')
  );

const getEntitiesSearch = createSelector(
  getEntitiesWhere,
  getSearchQuery,
  (state, { searchAttributes }) => JSON.stringify(searchAttributes), // enable caching,
  (entities, searchQuery, searchAttributes) => {
    if (searchQuery) {
      try {
        const regex = new RegExp(regExMultipleWords(searchQuery), 'i');
        return entities.filter((entity) =>
          regex.test(prepareEntitySearchTarget(entity, JSON.parse(searchAttributes)))
        );
      } catch (e) {
        return entities;
      }
    }
    return entities;  // !search
  }
);

export const getRecommendationsNested = createSelector(
  (state) => getEntitiesSearch(state, {
    path: 'recommendations',
    searchAttributes: ['reference', 'title'],
  }),
  // (state) => getEntitiesSearch(state, {
  //   path: 'recommendations',
  //   searchAttributes: ['reference', 'title'],
  // }),
  (state) => selectEntities(state, 'recommendation_categories'),
  (state) => selectEntities(state, 'recommendation_measures'),
  (state) => selectEntities(state, 'measures'),
  (recommendations, recCategories, recMeasures, measures) =>
    recommendations.map((recommendation) => recommendation
      .set(
        'taxonomies',
        recCategories.filter((recCat) => attributesEqual(recCat.getIn(['attributes', 'recommendation_id']), recommendation.get('id')))
      )
      .set(
        'measures',
        recMeasures.filter((recMeasure) =>
          attributesEqual(recMeasure.getIn(['attributes', 'recommendation_id']), recommendation.get('id'))
          && measures.get(recMeasure.getIn(['attributes', 'measure_id']).toString())
        )
      )
    )
);

export const getRecommendations = createSelector(
  getRecommendationsNested,
  (state) => selectEntities(state, 'categories'),
  getWithoutQuery,
  (recommendations, categories, withoutQuery) => withoutQuery
    ? recommendations.filter((entity) => asList(withoutQuery).reduce((passing, pathOrTax) => {
      // check numeric ? taxonomy filter : related entity filter
      if (isNumber(pathOrTax)) {
        // tax!
        // for all rec-cat associations...
        // get category for rec-cat association
        const associatedTaxonomyIds = entity.get('taxonomies').map((recCategory) =>
          categories.get(recCategory.getIn(['attributes', 'category_id']).toString()).getIn(['attributes', 'taxonomy_id'])
        );
        return passing && !associatedTaxonomyIds.includes(parseInt(pathOrTax, 10));
      }
      const path = pathOrTax !== 'actions' ? pathOrTax : 'measures';
      // console.log(path)
      // console.log(entity.toJS())
      // console.log(entity.get('measures').toJS())
      return passing && !(entity.get(path) && entity.get(path).size > 0);
    }, true)
  )
  : recommendations
);


// const getEntitiesWithout = createSelector(
//   getEntitiesSearch,
//   getWithoutQuery,
//   (state, { withoutOptions }) => JSON.stringify(withoutOptions), // enable caching,
//   (entities, withoutQuery, withoutOptionsString) => {
  //   const options = JSON.parse(withoutOptionsString);
  //   const query = asArray(withoutQuery).map((pathOrTax) => {
  //     // check numeric ? taxonomy filter : related entity filter
  //     if (isNumber(pathOrTax)) {
  //       return {
  //         taxonomyId: pathOrTax,
  //         path: options.taxonomies.connected.path,
  //         key: options.taxonomies.connected.key,
  //       };
  //     } else if (options.connections.options) {
  //       // related entity filter
  //       const connection = find(options.connections.options, { query: pathOrTax });
  //       return connection ? connection.connected : {};
  //     }
  //     return {}
  //   });
  //   return entities.filter((entity) => {
  //     return reduce(query, (passing, condition) => {
  //       // check for taxonomies
  //       if (condition.taxonomyId) {
  //         // get all associations for entity and store category count for given taxonomy
  //         const associations = getEntities(state, {
  //           path: condition.path, // measure_categories
  //           where: {
  //             [condition.key]: entity.get('id'),
  //           }, // {measure_id : 3}
  //           extend: {
  //             path: 'categories',
  //             as: 'count',
  //             key: 'category_id',
  //             type: 'count',
  //             where: {
  //               taxonomy_id: condition.taxonomyId,
  //             },
  //           },
  //         });
  //         // check if not any category present (count > 0)
  //         return passing && !associations.reduce((hasCategories, association) =>
  //           hasCategories || association.get('count') > 0, false
  //         );
  //       }
  //       // other entities
  //       const associations = getEntitiesWhere(state, {
  //         path: condition.path, // recommendation_measures
  //         where: {
  //           [condition.key]: entity.get('id'),
  //         },
  //       });
  //       return passing && !(associations && associations.size); // !not associated
  //     }, true)
  //   })
  //   return entities;  // !withoutQuery
  // }
// )
