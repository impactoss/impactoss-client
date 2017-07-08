import { Map, List } from 'immutable';
import { getCheckedValuesFromOptions } from 'components/forms/MultiSelectControl';

// get connected category ids for taxonomy
export const getConnectedCategoryIds = (entity, connection, taxonomy) => {
  let categoryIds = List();
  if (taxonomy.get('categories')) {
    // the associated entities ids, eg recommendation ids
    const connectionIds = entity.get(connection.path).map((connectedEntity) => connectedEntity.get('attributes')).map((att) => att.get(connection.key));
    // for each category of active taxonomy
    taxonomy.get('categories').forEach((category) => {
      // we have saved the associated entities, eg recommendations
      if (category.get(connection.path)) {
        // for each category-entitiy-connection, eg recommendation_categories
        category.get(connection.path).forEach((categoryConnection) => {
          // if connection exists and category not previously recorded (through other connection)
          if (connectionIds.includes(categoryConnection.getIn(['attributes', connection.key]))
            && !categoryIds.includes(categoryConnection.getIn(['attributes', 'category_id']))) {
            // remember category
            categoryIds = categoryIds.push(categoryConnection.getIn(['attributes', 'category_id']));
          }
        });
      }
    });
  }
  return categoryIds;
};

// get connected category ids for taxonomy
// export const getConnectedCategoryIds = (entity, connection, taxonomy) => {
//   const categoryIds = [];
//   if (taxonomy.categories) {
//     // the associated entities ids, eg recommendation ids
//     const connectionIds = map(map(Object.values(entity[connection.path]), 'attributes'), connection.key);
//     // for each category of active taxonomy
//     forEach(Object.values(taxonomy.categories), (category) => {
//       // we have saved the associated entities, eg recommendations
//       if (category[connection.path]) {
//         // for each category-entitiy-connection, eg recommendation_categories
//         forEach(Object.values(category[connection.path]), (categoryConnection) => {
//           // if connection exists and category not previously recorded (through other connection)
//           if (connectionIds.indexOf(categoryConnection.attributes[connection.key]) > -1
//           && categoryIds.indexOf(categoryConnection.attributes.category_id) === -1) {
//             // remember category
//             categoryIds.push(categoryConnection.attributes.category_id);
//           }
//         });
//       }
//     });
//   }
//   return categoryIds;
// };


export const getAssociatedCategories = (taxonomy) => taxonomy.get('categories')
  ? taxonomy.get('categories').reduce((catsAssociated, cat) => {
    if (cat.get('associated')) {
      return catsAssociated.set(cat.get('id'), cat.get('associated').keySeq().first());
    }
    return catsAssociated;
  }, Map())
  : Map();


export const getAssociatedEntities = (entities) =>
  entities.reduce((entitiesAssociated, entity) => entity.get('associated')
    ? entitiesAssociated.set(entity.get('id'), entity.get('associated').keySeq().first())
    : entitiesAssociated
  , Map());

export const getCategoryUpdatesFromFormData = ({ formData, taxonomies, createKey }) =>
  taxonomies.reduce((updates, tax, taxId) => {
    const formCategoryIds = getCheckedValuesFromOptions(formData.getIn(['associatedTaxonomies', taxId]));

    // store associated cats as { [cat.id]: [association.id], ... }
    // then we can use keys for creating new associations and values for deleting
    const associatedCategories = getAssociatedCategories(tax);

    return Map({
      delete: updates.get('delete').concat(associatedCategories.reduce((associatedIds, associatedId, catId) =>
        !formCategoryIds.includes(catId)
          ? associatedIds.push(associatedId)
          : associatedIds
      , List())),
      create: updates.get('create').concat(formCategoryIds.reduce((payloads, catId) =>
        !associatedCategories.has(catId)
          ? payloads.push(Map({
            category_id: catId,
            [createKey]: formData.get('id'),
          }))
          : payloads
      , List())),
    });
  }, Map({ delete: List(), create: List() }));

export const getConnectionUpdatesFromFormData = ({ formData, connections, connectionAttribute, createConnectionKey, createKey }) => {
  const formConnectionIds = getCheckedValuesFromOptions(formData.get(connectionAttribute));
  // store associated Actions as { [action.id]: [association.id], ... }
  const associatedConnections = getAssociatedEntities(connections);

  return Map({
    delete: associatedConnections.reduce((associatedIds, associatedId, id) =>
      !formConnectionIds.includes(id)
        ? associatedIds.push(associatedId)
        : associatedIds
    , List()),
    create: formConnectionIds.reduce((payloads, id) =>
      !associatedConnections.has(id)
        ? payloads.push(Map({
          [createConnectionKey]: id,
          [createKey]: formData.get('id'),
        }))
        : payloads
    , List()),
  });
};
