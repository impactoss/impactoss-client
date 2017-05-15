import { find, map, forEach } from 'lodash/collection';
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
