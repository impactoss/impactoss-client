import { createSelector } from 'reselect';

/**
 * Direct selector to the actionEdit state domain
 */
const selectEditDomain = (state) => state.get('sdgtargetEdit');

/**
 * Default selector
 */
const viewDomainSelect = createSelector(
  selectEditDomain,
  (substate) => substate.toJS()
);

export default viewDomainSelect;
export {
  selectEditDomain,
};
