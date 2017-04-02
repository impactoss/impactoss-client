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
  (substate) => substate.get('form').data // TODO WTF HTF GRR
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

const filtersCheckedSelector = createSelector(
  formSelector,
  // () => window.location.href,
  // (formData, href) => {
  (formData) => {
    const values = formData.get('values');
    // going to want some intesection logic here aren't we
    // some way to remove all the existing params that we are using before appending
    // SEE https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
    // const url = new URL(href);
    return values.reduce((URLParams, value) => {
      URLParams.append(value.get('query'), value.get('value'));
      return URLParams;
    }, new URLSearchParams());
    // }, new URLSearchParams(url.search));
  }
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
  filtersCheckedSelector,
};
