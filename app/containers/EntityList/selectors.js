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
  (substate) => substate.get('forms').filterData // TODO WTF HTF GRR
);

const editFormSelector = createSelector(
  selectEntityListDomain,
  (substate) => substate.get('forms').editData // TODO WTF HTF GRR
);

const selectionFormSelector = createSelector(
  selectEntityListDomain,
  (substate) => substate.get('forms').selectionData // TODO WTF HTF GRR
);

// TODO enable better caching on this, it's expensive ish
const entitiesSelectedSelector = createSelector(
    selectionFormSelector,
    (form) => form.get('entities').reduce((selected, entity, id) => entity.get('selected') ? selected.concat(id) : selected, [])
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
  selectionFormSelector,
  entitiesSelectedSelector,
};
