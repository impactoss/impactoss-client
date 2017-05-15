import { createSelector } from 'reselect';

/**
 * Direct selector to the categoryNew state domain
 */
const selectCategoryNewDomain = (state) => state.get('categoryNew');

/**
 * Default selector used by CategoryNew
 */

const viewDomainSelect = createSelector(
  selectCategoryNewDomain,
  (substate) => substate.toJS()
);

export default viewDomainSelect;
export {
  selectCategoryNewDomain,
};
