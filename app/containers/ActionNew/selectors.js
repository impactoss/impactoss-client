import { createSelector } from 'reselect';

/**
 * Direct selector to the measureNew state domain
 */
const selectActionNewDomain = () => (state) => state.get('measureNew');

/**
 * Default selector used by ActionNew
 */

const viewDomainSelect = createSelector(
  selectActionNewDomain(),
  (substate) => substate.toJS()
);

export default viewDomainSelect;
export {
  selectActionNewDomain,
};
