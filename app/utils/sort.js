import { find } from 'lodash/collection';

export const getSortOption = (sortOptions, sortBy, query = 'attribute') =>
  find(sortOptions, (option) => option[query] === sortBy)
  || find(sortOptions, (option) => option.default);

const getEntitySortValueMapper = (entity, sortBy) => {
  switch (sortBy) {
    case 'id':
      return entity.get(sortBy);
    case 'reference':
      // use id field when reference not available
      return entity.getIn(['attributes', sortBy]) || entity.get('id');
    // category sort option
    case 'referenceThenTitle':
      // use id field when reference not available
      return entity.getIn(['attributes', 'reference'])
      || entity.getIn(['attributes', 'title'])
      || entity.get('id');
    // case 'titleSort':
    //   return entity.get(sortBy) || entity.getIn(['attributes', 'title']) || entity.get('id');
    case 'measures':
    case 'recommendations':
    case 'sdgtargets':
      return entity.get(sortBy) || 0;
    default:
      return entity.getIn(['attributes', sortBy]);
  }
};

export const getEntitySortComparator = (valueA, valueB, sortOrder, type) => {
  // check equality
  if (valueA === valueB) {
    return 0;
  }
  let result;
  if (typeof valueA === 'undefined' || valueA === null) {
    result = 1;
  } else if (typeof valueB === 'undefined' || valueB === null) {
    result = -1;
  } else if (type === 'date') {
    result = new Date(valueA) < new Date(valueB) ? -1 : 1;
  } else {
    const intA = parseInt(valueA, 10);
    const intB = parseInt(valueB, 10);
    const aStartsWithNumber = !isNaN(intA);
    const bStartsWithNumber = !isNaN(intB);
    if (aStartsWithNumber && !bStartsWithNumber) {
      result = -1;
    } else if (!aStartsWithNumber && bStartsWithNumber) {
      result = 1;
    } else if (aStartsWithNumber && bStartsWithNumber) {
      const aIsNumber = aStartsWithNumber && isFinite(valueA) && intA.toString() === valueA;
      const bIsNumber = bStartsWithNumber && isFinite(valueB) && intB.toString() === valueB;
      if (aIsNumber && !bIsNumber) {
        result = -1;
      } else if (!aIsNumber && bIsNumber) {
        result = 1;
      } else if (aIsNumber && bIsNumber) {
        // both numbers
        result = intA < intB ? -1 : 1;
      } else if (intA !== intB) {
        result = intA < intB ? -1 : 1;
      } else {
        // both starting with number but are not numbers entirely
        // compare numbers first then remaining strings if numbers equal
        const intAlength = intA.toString().length;
        const intBlength = intB.toString().length;
        result = getEntitySortComparator(
          valueA.slice(intAlength + (valueA.slice(intAlength, intAlength + 1) === '.' ? 1 : 0)),
          valueB.slice(intBlength + (valueB.slice(intBlength, intBlength + 1) === '.' ? 1 : 0)),
          'asc'
        );
      }
    } else {
      // neither starting with number
      result = valueA < valueB ? -1 : 1;
    }
  }
  return sortOrder === 'desc' ? result * -1 : result;
};

export const sortEntities = (entities, sortOrder, sortBy, type) =>
  entities
    .sortBy(
      (entity) => getEntitySortValueMapper(entity, sortBy || 'id'),
      (a, b) => getEntitySortComparator(a, b, sortOrder || 'asc', type)
    ).toList();
