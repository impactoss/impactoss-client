import { createSelector } from 'reselect';

/**
 * Direct selector to the categoryEdit state domain
 */
const selectCategoryEditDomain = (state) => state.get('categoryEdit');

/**
 * Default selector used by CategoryEdit
 */

const viewDomainSelect = createSelector(
  selectCategoryEditDomain,
  (substate) => substate.toJS()
);

export default viewDomainSelect;
export {
  selectCategoryEditDomain,
};
