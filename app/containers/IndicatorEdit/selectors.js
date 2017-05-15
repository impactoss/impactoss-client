import { createSelector } from 'reselect';

/**
 * Direct selector to the indicatorEdit state domain
 */
const selectIndicatorEditDomain = (state) => state.get('indicatorEdit');

/**
 * Default selector used by IndicatorEdit
 */

const viewDomainSelect = createSelector(
  selectIndicatorEditDomain,
  (substate) => substate.toJS()
);

export default viewDomainSelect;
export {
  selectIndicatorEditDomain,
};
