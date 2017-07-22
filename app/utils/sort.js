import { find } from 'lodash/collection';

export const getEntitySortIteratee = (field) => {
  switch (field) {
    case 'id':
      // ID field needs to be treated as an int when sorting
      return (entity) => parseInt(entity.id, 10);
    default:
      return field;
  }
};

export const getSortOption = (sortOptions, sortBy) =>
  find(sortOptions, (option) => option.attribute === sortBy)
  || find(sortOptions, (option) => option.default);
