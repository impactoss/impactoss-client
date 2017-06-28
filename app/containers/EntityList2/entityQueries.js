import { reduce, find, map, forEach } from 'lodash/collection';
import { cloneDeep } from 'lodash/lang';
import isNumber from 'utils/is-number';
import asArray from 'utils/as-array';

// attribute conditions
// query:"where=att1:value+att2:value"
export const getAttributeQuery = (queryWhere) =>
  asArray(queryWhere).reduce((result, item) => {
    const r = result;
    const keyValue = item.split(':');
    r[keyValue[0]] = keyValue[1];
    return r;
  }, {});


  // associative conditions
export const getConnectedQuery = (locationQuery, filters) => {
  const connected = [];
  forEach(locationQuery, (value, queryKey) => {
    // filter by associated category
    // "cat=1+2+3" catids regardless of taxonomy
    if (filters.taxonomies && queryKey === filters.taxonomies.query) {
      const condition = filters.taxonomies.connected;
      condition.where = asArray(value).map((catId) => ({
        [condition.whereKey]: catId,
      })); // eg { category_id: 3 }
      connected.push(condition);
    // filter by associated entity
    // "recommendations=1+2" recommendationids
    } else if (filters.connections && map(filters.connections.options, 'query').indexOf(queryKey) > -1) {
      const connectedEntity = find(
        filters.connections.options,
        { query: queryKey }
      );
      if (connectedEntity) {
        const condition = connectedEntity.connected;
        condition.where = asArray(value).map((connectionId) => ({
          [condition.whereKey]: connectionId,
        })); // eg { recommendation_id: 3 }
        connected.push(condition);
      }
    // filter by associated category of associated entity
    // query:"catx=recommendations:1" entitypath:catids regardless of taxonomy
    } else if (filters.connectedTaxonomies && queryKey === filters.connectedTaxonomies.query) {
      asArray(value).forEach((val) => {
        const pathValue = val.split(':');
        const connectedTaxonomy = find(
          filters.connectedTaxonomies.connections,
          (connection) => connection.path === pathValue[0]
        );
        if (connectedTaxonomy) {
          const condition = cloneDeep(connectedTaxonomy.connected);
          condition.connected.where = {
            [condition.connected.whereKey]: pathValue[1],
          };
          connected.push(condition);
        }
      });
    }
  });
  return connected;
};

// absent taxonomy conditions
// query:"without=1+2+3+actions" either tax-id (numeric) or table path
export const getWithoutQuery = (queryWithout, filters) =>
  asArray(queryWithout).map((pathOrTax) => {
    // check numeric ? taxonomy filter : related entity filter
    if (isNumber(pathOrTax)) {
      return {
        taxonomyId: pathOrTax,
        path: filters.taxonomies.connected.path,
        key: filters.taxonomies.connected.key,
      };
    }
    if (filters.connections.options) {
      // related entity filter
      const connection = find(filters.connections.options, { query: pathOrTax });
      return connection ? connection.connected : {};
    }
    return {};
  });

const filterEntitiesByAttributes = ({ entities, conditions }) =>
  conditions
    ? entities.filter((entity) =>
      reduce(conditions, (passing, value, attribute) => {
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
    )
  : entities;

const filterEntitiesWithoutConnection = ({ entities, conditions, entityConnectionJoinTables }) =>
  entities.filter((entity) =>
    reduce(conditions, (passing, condition, connectionId) => {
      if (entityConnectionJoinTables[connectionId]) {
        const associations = filterEntitiesByAttributes({
          entities: entityConnectionJoinTables[connectionId],
          conditions: { [condition.key]: entity.get('id') },
        });
        return passing && !(associations && associations.size);
      }
      return passing;
    }, true)
  );

const joinEntity = ({ entity, joinTable, condition, entityConnectionJoinTables, key }) =>
  entity.set(
    condition.as || key,
    filterEntitiesByAttributes({
      entities: condition.hasConnection
        ? filterEntitiesWithoutConnection({
          entities: joinTable,
          conditions: condition.hasConnection,
          entityConnectionJoinTables,
        })
        : joinTable,
      conditions: condition.reverse
        ? { [condition.key]: entity.get('id') }
        : { id: entity.getIn(['attributes', condition.key]) },
    })
  );
export const joinEntities = ({
  entityTable,
  relationships,
  entityCategoryJoinTable,
  entityConnectionJoinTables,
  // connectionTables,
}) => reduce(
  relationships,
  (jointEntities, relation, type) => {
    switch (type) {
      case ('entityCategories') :
        return jointEntities.map((entity) => joinEntity({
          entity,
          joinTable: entityCategoryJoinTable,
          condition: relation,
          key: 'taxonomies',
        }));
      case ('entityConnections') :
        return jointEntities.map((entity) => reduce(
          relation,
          (connectedEntity, condition, key) => joinEntity({
            entity: connectedEntity,
            joinTable: entityConnectionJoinTables[key],
            condition,
            entityConnectionJoinTables,
            key,
          }),
          entity
        ));
      default :
        return jointEntities;
    }
  },
  entityTable
);

export const filterEntities = ({ entities, query }) =>
  // filterEntitiesSearch(
  filterEntitiesByAttributes({
    entities,
    conditions: query && query.where
      ? getAttributeQuery(query.where)
      : null,
  });
  //     props.location.query && props.location.query.search
  //       ? {
  //         query: props.location.query.search,
  //         fields: props.filters.search,
  //       }
  //       : null
  //   )
  // ;

export const joinTaxonomies = ({
  taxonomyTable,
  categoryTable,
}) => taxonomyTable.map((taxonomy) => joinEntity({
  entity: taxonomy,
  joinTable: categoryTable,
  condition: {
    key: 'taxonomy_id',
    reverse: true,
  },
  key: 'categories',
}));


export const filterTaxonomies = ({ taxonomies, condition }) => condition
  ? filterEntitiesByAttributes({
    entities: taxonomies,
    conditions: condition,
  })
  : taxonomies;

  // filterEntitiesWithoutTaxonomy = (entities, without, categoryJoins, categories) =>
  //   entities.filter((entity) =>
  //     reduce(asArray(without), (passing, condition) => {
  //       // check for taxonomies
  //       if (condition.taxonomyId) {
  //         // get all associations for entity and store category count for given taxonomy
  //         const associations = joinEntitiesCount(
  //           filterEntitiesByAttributes(
  //             categoryJoins,
  //             {
  //               [condition.key]: entity.get('id'),
  //             }, // {measure_id : 3}
  //           ),
  //           categories,
  //           {
  //             key: 'category_id',
  //             type: 'count',
  //             where: {
  //               taxonomy_id: condition.taxonomyId,
  //             },
  //           },
  //         );
  //         // check if not any category present (count > 0)
  //         return passing && !associations.reduce((hasCategories, association) =>
  //           hasCategories || association.get('count') > 0, false
  //         );
  //     // }
  //   )
  // export const filterEntitiesWithoutTaxonomy = (entities, conditions, connections) => {
  //   return entities.filter((entity) => {
  //     return reduce(conditions, (passing, condition, connectionId) => {
  //       if (connections[connectionId]) {
  //         const associations = filterEntitiesByAttributes(
  //           connections[connectionId],
  //           { [condition.key]: entity.get('id') }
  //         );
  //         return passing && !(associations && associations.size)
  //       }
  //       return passing;
  //     }, true);
  //   });
  // }
