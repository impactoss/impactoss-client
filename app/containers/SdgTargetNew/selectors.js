import { createSelector } from 'reselect';

/**
 * Direct selector to the actionNew state domain
 */
const selectEditDomain = () => (state) => state.get('sdgtargetNew');

/**
 * Default selector used by ActionNew
 */

const viewDomainSelect = createSelector(
  selectEditDomain(),
  (substate) => substate.toJS()
);

export default viewDomainSelect;
export {
  selectEditDomain,
};
