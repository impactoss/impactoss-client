import { createSelector } from 'reselect';

/**
 * Direct selector to the actionNew state domain
 */
const selectIndicatorNewDomain = () => (state) => state.get('indicatorNew');

/**
 * Other specific selectors
 */


/**
 * Default selector used by IndicatorNew
 */

const indicatorNewSelector = createSelector(
  selectIndicatorNewDomain(),
  (substate) => substate.toJS()
);

export default indicatorNewSelector;
export {
  selectIndicatorNewDomain,
};
