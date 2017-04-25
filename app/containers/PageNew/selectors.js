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

const viewDomainSelect = createSelector(
  selectPageNewDomain(),
  (substate) => substate.toJS()
);

export default viewDomainSelect;
export {
  selectPageNewDomain,
};
