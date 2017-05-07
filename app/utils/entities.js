import { forEach, map } from 'lodash/collection';

// get connected category ids for taxonomy
export const getConnectedCategoryIds = (entity, connection, taxonomy) => {
  const categoryIds = [];
  if (taxonomy.categories) {
    // the associated entities ids, eg recommendation ids
    const connectionIds = map(map(Object.values(entity[connection.path]), 'attributes'), connection.key);
    // for each category of active taxonomy
    forEach(Object.values(taxonomy.categories), (category) => {
      // we have saved the associated entities, eg recommendations
      if (category[connection.path]) {
        // for each category-entitiy-connection, eg recommendation_categories
        forEach(Object.values(category[connection.path]), (categoryConnection) => {
          // if connection exists and category not previously recorded (through other connection)
          if (connectionIds.indexOf(categoryConnection.attributes[connection.key]) > -1
          && categoryIds.indexOf(categoryConnection.attributes.category_id) === -1) {
            // remember category
            categoryIds.push(categoryConnection.attributes.category_id);
          }
        });
      }
    });
  }
  return categoryIds;
};
