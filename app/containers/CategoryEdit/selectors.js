import { createSelector } from 'reselect';

/**
 * Direct selector to the categoryEdit state domain
 */
const selectCategoryEditDomain = (state) => state.get('categoryEdit');

/**
 * Other specific selectors
 */

const pageSelector = createSelector(
  selectCategoryEditDomain,
  (substate) => substate.get('page').toJS()
 );
const formSelector = createSelector(
  selectCategoryEditDomain,
  (substate) => substate.get('form')
 );


/**
 * Default selector used by CategoryEdit
 */

const categoryEditSelect = createSelector(
  selectCategoryEditDomain,
  (substate) => substate.toJS()
);

export default categoryEditSelect;
export {
  selectCategoryEditDomain,
  categoryEditSelect,
  pageSelector,
  formSelector,
};
