import { createSelector } from 'reselect';

/**
 * Direct selector to the actionNew state domain
 */
const selectActionNewDomain = () => (state) => state.get('actionNew');

/**
 * Other specific selectors
 */


/**
 * Default selector used by ActionNew
 */

const actionNewSelector = createSelector(
  selectActionNewDomain(),
  (substate) => substate.toJS()
);

export default actionNewSelector;
export {
  selectActionNewDomain,
};
