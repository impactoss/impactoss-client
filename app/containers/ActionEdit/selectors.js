import { createSelector } from 'reselect';

/**
 * Direct selector to the actionEdit state domain
 */
const selectActionEditDomain = (state) => state.get('actionEdit');

/**
 * Default selector used by ActionEdit
 */

const viewDomainSelect = createSelector(
  selectActionEditDomain,
  (substate) => substate.toJS()
);

export default viewDomainSelect;
export {
  selectActionEditDomain,
};
