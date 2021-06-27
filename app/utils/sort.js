import { find } from 'lodash/collection';
import { CYCLE_TAXONOMY_ID } from 'themes/config';
import { getCategoryShortTitle } from 'utils/entities';
import isNumber from 'utils/is-number';

export const getSortOption = (sortOptions, sortBy, query = 'attribute') => find(sortOptions, (option) => option[query] === sortBy)
  || find(sortOptions, (option) => option.default);

const getEntitySortValueMapper = (entity, sortBy) => {
  if (!entity) {
    return 1;
  }
  switch (sortBy) {
    case 'id':
      return entity.get('id');
    case 'reference':
      // use id field when reference not available
      return entity.getIn(['attributes', sortBy]) || entity.get('id');
    // category sort option
    case 'referenceThenTitle':
      // use id field when reference not available
      return entity.getIn(['attributes', 'reference'])
      || entity.getIn(['attributes', 'title'])
      || entity.get('id');
    case 'referenceThenShortTitle':
      // use id field when reference not available
      return entity.getIn(['attributes', 'reference'])
      || getCategoryShortTitle(entity);
    // case 'titleSort':
    //   return entity.get(sortBy) || entity.getIn(['attributes', 'title']) || entity.get('id');
    case 'measures':
    case 'recommendations':
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

const prepSortTarget = (value) => {
  // 1. replace symbols with white spaces
  const testValue = value.toString().replace(/[.,/|-]/g, ' ');
  // 2. split into chunks
  return testValue.split(' ');
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
    /* eslint-disable no-restricted-globals */
    const aIsDate = new Date(valueA) instanceof Date && !isNaN(new Date(valueA));
    const bIsDate = new Date(valueB) instanceof Date && !isNaN(new Date(valueB));
    /* eslint-enable no-restricted-globals */
    if (aIsDate && !bIsDate) {
      result = 1;
    } else if (!aIsDate && bIsDate) {
      result = -1;
    } else if (aIsDate && bIsDate) {
      result = new Date(valueA) < new Date(valueB) ? -1 : 1;
    } else {
      result = 0;
    }
  } else if (isNumber(valueA) && isNumber(valueB)) {
    result = parseInt(valueA, 10) < parseInt(valueB, 10) ? -1 : 1;
  } else {
    // compare stings incl partial numbers
    // 1. prep sort targets
    const testValuesA = prepSortTarget(valueA);
    const testValuesB = prepSortTarget(valueB);
    // 2. figure out longest 'phrase'
    const maxLength = Math.max(testValuesA.length, testValuesB.length);
    // set default
    result = -1;
    // 4. compare phrases word by word
    let wordA;
    let wordB;
    /* eslint-disable no-plusplus */
    for (let i = 0; i < maxLength; i++) {
      /* eslint-enable no-plusplus */
      // get words
      wordA = testValuesA[i];
      wordB = testValuesB[i];
      // if equal go to next word else compare
      if (wordA !== wordB) {
        // check for undefined (ie shorter phrase wins)
        if (wordA && !wordB) {
          result = -1;
        } else if (!wordA && wordB) {
          result = 1;
        } else {
          // check for words with numbers
          const intA = parseInt(wordA, 10);
          const intB = parseInt(wordB, 10);
          /* eslint-disable no-restricted-globals */
          const aStartsWithNumber = !isNaN(intA);
          const bStartsWithNumber = !isNaN(intB);
          /* eslint-enable no-restricted-globals */
          // numbers beat non-numbers
          if (aStartsWithNumber && !bStartsWithNumber) {
            result = -1;
          } else if (!aStartsWithNumber && bStartsWithNumber) {
            result = 1;
          } else if (aStartsWithNumber && bStartsWithNumber) {
            // both are pure numbers
            if (intA.toString() === wordA && intB.toString() === wordB) {
              result = intA < intB ? -1 : 1;
            // both are not pure numbers but start with different numbers
            } else if (intA !== intB) {
              result = intA < intB ? -1 : 1;
            // both are not pure numbers and start with same number
            } else {
              // compare numbers first then remaining strings if numbers equal
              const intAlength = intA.toString().length;
              const intBlength = intB.toString().length;
              result = getEntitySortComparator(
                wordA.slice(intAlength + (wordA.slice(intAlength, intAlength + 1) === '.' ? 1 : 0)),
                wordB.slice(intBlength + (wordB.slice(intBlength, intBlength + 1) === '.' ? 1 : 0)),
                'asc'
              );
            }
          } else {
            // neither starting with number: compare stings
            result = valueA < valueB ? -1 : 1;
          }
        }
        break;
      }
    }
  }
  // const testSubject = testValuesA.length < testValuesB.length
  return sortOrder === 'desc' ? result * -1 : result;
};

export const sortEntities = (entities, sortOrder, sortBy, type, asList = true) => {
  const sorted = entities && entities.sortBy(
    (entity) => getEntitySortValueMapper(entity, sortBy || 'id'),
    (a, b) => getEntitySortComparator(a, b, sortOrder || 'asc', type)
  );
  return asList ? sorted.toList() : sorted;
};

export const sortCategories = (categories, taxonomyId, sortOrder, sortBy) => {
  if (taxonomyId && parseInt(taxonomyId, 10) === CYCLE_TAXONOMY_ID) {
    return sortEntities(
      categories,
      sortOrder || 'desc',
      sortBy || 'date',
      'date', // fild type
    );
  }
  return sortEntities(
    categories,
    sortOrder || 'asc',
    sortBy || 'referenceThenTitle',
  );
};
