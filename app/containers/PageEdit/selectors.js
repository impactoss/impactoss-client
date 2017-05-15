import { createSelector } from 'reselect';

/**
 * Direct selector to the pageEdit state domain
 */
const selectPageEditDomain = (state) => state.get('pageEdit');

/**
 * Default selector used by PageEdit
 */

const viewDomainSelect = createSelector(
  selectPageEditDomain,
  (substate) => substate.toJS()
);

export default viewDomainSelect;
export {
  selectPageEditDomain,
};
