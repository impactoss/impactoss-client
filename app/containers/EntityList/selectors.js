import { createSelector } from 'reselect';
import { REDUCER_PATH } from './constants';

/**
 * Direct selector to the actionEdit state domain
 */
const selectEntityListDomain = (state) => state.get(REDUCER_PATH);

/**
 * Other specific selectors
 */

const formSelector = createSelector(
  selectEntityListDomain,
  (substate) => substate.get('form').data // TODO WTF HTF GRR
 );

const pageSelector = createSelector(
   selectEntityListDomain,
   (substate) => substate.get('page')
 );

const activeFilterOptionSelector = createSelector(
  pageSelector,
  (pageState) => pageState.get('activeFilterOption')
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
  selectEntityListDomain,
  (substate) => substate.toJS()
);

export default entityListSelect;
export {
  selectEntityListDomain,
  entityListSelect,
  formSelector,
  activeFilterOptionSelector,
  filtersCheckedSelector,
};
