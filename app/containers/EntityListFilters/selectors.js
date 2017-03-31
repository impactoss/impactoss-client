import { createSelector } from 'reselect';
import { REDUCER_PATH } from './constants';

/**
 * Direct selector to the actionEdit state domain
 */
const selectEntityListFiltersDomain = (state) => state.get(REDUCER_PATH);

/**
 * Other specific selectors
 */

const formSelector = createSelector(
  selectEntityListFiltersDomain,
  (substate) => substate.get('form')
 );

const pageSelector = createSelector(
   selectEntityListFiltersDomain,
   (substate) => substate.get('page')
 );

const showFilterFormSelector = createSelector(
  pageSelector,
  (pageState) => pageState.get('showFilterForm')
);

const formOptionsSelector = createSelector(
  pageSelector,
  (pageState) => pageState.get('formOptions')
);

/**
 * Default selector used by ActionEdit
 */

const entityListSelect = createSelector(
  selectEntityListFiltersDomain,
  (substate) => substate.toJS()
);

export default entityListSelect;
export {
  selectEntityListFiltersDomain,
  entityListSelect,
  formSelector,
  showFilterFormSelector,
  formOptionsSelector,
};
