import { createSelector } from 'reselect';

/**
 * Direct selector to the actionView state domain
 */
const actionViewSelector = (state) => state.get('actionView');

/**
 * Other specific selectors
 */

/**
 * Default selector used by ActionView
 */

const actionViewPageSelector = createSelector(
  actionViewSelector,
  (substate) => substate.toJS()
);

export default actionViewPageSelector;
export {
  actionViewPageSelector,
  // makeActionsReadySelector,
  // makeActionSelector,
};
