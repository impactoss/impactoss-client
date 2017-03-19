import { createSelector } from 'reselect';

/**
 * Direct selector to the entityQuery state domain
 */
const selectEntityQueryDomain = () => (state) => state.get('entityQuery');

/**
 * Other specific selectors
 */


/**
 * Default selector used by EntityQuery
 */

const makeSelectEntityQuery = () => createSelector(
  selectEntityQueryDomain(),
  (substate) => substate.toJS()
);

export default makeSelectEntityQuery;
export {
  selectEntityQueryDomain,
};
