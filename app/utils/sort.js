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
    case 'sortBy':
      return entity.get(sortBy) || 0;
    case 'dueDateThenUpdated':
      return entity.get('due_date')
        ? entity.getIn(['due_date', 'attributes', 'due_date'])
        : entity.getIn(['attributes', 'updated_at']);
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
    const aIsDate = new Date(valueA) instanceof Date && !isNaN(new Date(valueA));
    const bIsDate = new Date(valueB) instanceof Date && !isNaN(new Date(valueB));
    if (aIsDate && !bIsDate) {
      result = 1;
    } else if (!aIsDate && bIsDate) {
      result = -1;
    } else if (aIsDate && bIsDate) {
      result = new Date(valueA) < new Date(valueB) ? -1 : 1;
    } else {
      result = 0;
    }
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
      // both are pure numbers
      if (intA.toString() === valueA && intB.toString() === valueB) {
        result = intA < intB ? -1 : 1;
      // both are not pure numbers but start with numbers
      } else if (intA !== intB) {
        result = intA < intB ? -1 : 1;
      // both are not pure numbers and start with same number
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

export const sortEntities = (entities, sortOrder, sortBy, type, asList = true) => {
  const sorted = entities.sortBy(
    (entity) => getEntitySortValueMapper(entity, sortBy || 'id'),
    (a, b) => getEntitySortComparator(a, b, sortOrder || 'asc', type)
  );
  return asList ? sorted.toList() : sorted;
};
