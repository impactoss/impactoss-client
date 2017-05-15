import { createSelector } from 'reselect';

/**
 * Direct selector to the actionNew state domain
 */
const selectIndicatorNewDomain = () => (state) => state.get('indicatorNew');

/**
 * Default selector used by IndicatorNew
 */

const viewDomainSelect = createSelector(
  selectIndicatorNewDomain(),
  (substate) => substate.toJS()
);

export default viewDomainSelect;
export {
  selectIndicatorNewDomain,
};
