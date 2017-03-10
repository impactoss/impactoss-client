import { createSelector } from 'reselect';
import { orderBy } from 'lodash/collection';
import { slice } from 'lodash/array';
import {
  // makeEntitiesArraySelector,
  makeEntitiesPagedSelector,
} from '../App/selectors';

/**
* TODO implement filtering selectors, see actionsSortedSelector as a reference
*/

/**
* Used by lodash's orderBy function
* https://lodash.com/docs/4.17.4#orderBy
* returns an iteratee applicable to the field, defaults to field name ( which will alpha sort that field )
*
* TODO next steps handle date sort etc
*/
const getSortIteratee = (field) => {
  switch (field) {
    case 'id':
      // ID field needs to be treated as an int when sorting
      return (action) => parseInt(action.id, 10);
    default:
      return field;
  }
};

const localStateSelector = (state) => state.get('actionList');

const sortBySelector = createSelector(
  localStateSelector,
  (substate) => ({
    sort: substate.get('sort'),
    order: substate.get('order'),
  })
);

// const pagingSelector = createSelector(
//     localStateSelector,
//     (substate) => ({
//       perPage: substate.get('perPage'),
//       currentPage: substate.get('currentPage'),
//     })
// );
const pagingSelector = (_, { perPage, currentPage }) => ({
  perPage,
  currentPage,
});

/**
* Order JS list of actions based on sort state
*/
const actionsFilteredSelector = createSelector(
  makeEntitiesPagedSelector(),
  sortBySelector,
  (actions, { sort, order }) => orderBy(actions, getSortIteratee(sort), order)
);

const actionsPagedSelector = createSelector(
  pagingSelector,
  actionsFilteredSelector,
  ({ currentPage, perPage }, entities) => {
    const length = entities.length;
    const totalPages = Math.ceil(Math.max(length, 0) / perPage);
    const pageNum = Math.min(currentPage, totalPages);
    const offset = (pageNum - 1) * perPage;
    const end = offset + perPage;
    const haveNextPage = end < entities.length;
    const havePrevPage = pageNum > 1;
    const page = slice(entities, offset, end);
    return {
      page,
      havePrevPage,
      haveNextPage,
      totalPages,
      currentPage,
      perPage,
    };
  }
);

export {
  actionsFilteredSelector,
  actionsPagedSelector,
  sortBySelector,
};
