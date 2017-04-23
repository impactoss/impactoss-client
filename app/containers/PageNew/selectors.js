import { createSelector } from 'reselect';

/**
 * Direct selector to the actionNew state domain
 */
const selectPageNewDomain = () => (state) => state.get('pageNew');

/**
 * Other specific selectors
 */


/**
 * Default selector used by PageNew
 */

const pageNewSelector = createSelector(
  selectPageNewDomain(),
  (substate) => substate.toJS()
);

export default pageNewSelector;
export {
  selectPageNewDomain,
};
