import { createSelector } from 'reselect';

/**
 * Direct selector to the actionNew state domain
 */
const selectActionNewDomain = () => (state) => state.get('actionNew');

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
