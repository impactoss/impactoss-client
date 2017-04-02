import { createSelector } from 'reselect';

/**
 * Direct selector to the indicatorEdit state domain
 */
const selectIndicatorEditDomain = (state) => state.get('indicatorEdit');

/**
 * Other specific selectors
 */

const pageSelector = createSelector(
  selectIndicatorEditDomain,
  (substate) => substate.get('page').toJS()
 );
const formSelector = createSelector(
  selectIndicatorEditDomain,
  (substate) => substate.get('form')
 );


/**
 * Default selector used by IndicatorEdit
 */

const indicatorEditSelect = createSelector(
  selectIndicatorEditDomain,
  (substate) => substate.toJS()
);

export default indicatorEditSelect;
export {
  selectIndicatorEditDomain,
  indicatorEditSelect,
  pageSelector,
  formSelector,
};
