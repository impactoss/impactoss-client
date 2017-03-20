import { createSelector } from 'reselect';

/**
 * Direct selector to the categoryNew state domain
 */
const selectCategoryNewDomain = () => (state) => state.get('categoryNew');

/**
 * Other specific selectors
 */


/**
 * Default selector used by CategoryNew
 */

const categoryNewSelector = createSelector(
  selectCategoryNewDomain(),
  (substate) => substate.toJS()
);

export default categoryNewSelector;
export {
  selectCategoryNewDomain,
};
