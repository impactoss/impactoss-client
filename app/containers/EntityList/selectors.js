import { createSelector } from 'reselect';
import { REDUCER_PATH } from './constants';

/**
 * Direct selector to the actionEdit state domain
 */
const selectEntityListDomain = (state) => state.get(REDUCER_PATH);

/**
 * Other specific selectors
 */

const pageSelector = createSelector(
   selectEntityListDomain,
   (substate) => substate.get('page')
);

const filterFormSelector = createSelector(
  selectEntityListDomain,
  (substate) => substate.get('forms').filterData
);

const editFormSelector = createSelector(
  selectEntityListDomain,
  (substate) => substate.get('forms').editData
);

const activeFilterOptionSelector = createSelector(
  pageSelector,
  (pageState) => pageState.get('activeFilterOption')
);

const activeEditOptionSelector = createSelector(
  pageSelector,
  (pageState) => pageState.get('activeEditOption')
);

const activePanelSelector = createSelector(
  pageSelector,
  (pageState) => pageState.get('activePanel')
);

const entitiesSelectedSelector = createSelector(
  pageSelector,
  (pageState) => pageState.get('entitiesSelected').toJS()
);

const filtersCheckedSelector = createSelector(
  filterFormSelector,
  (formData) => formData.get('values').filter((value) => value.get('checked'))
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
  editFormSelector,
  filterFormSelector,
  activeFilterOptionSelector,
  activeEditOptionSelector,
  filtersCheckedSelector,
  activePanelSelector,
  entitiesSelectedSelector,
};
