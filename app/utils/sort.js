export const getEntitySortIteratee = (field) => {
  switch (field) {
    case 'id':
      // ID field needs to be treated as an int when sorting
      return (entity) => parseInt(entity.id, 10);
    default:
      return field;
  }
};
