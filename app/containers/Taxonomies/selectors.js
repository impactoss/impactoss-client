import { createSelector } from 'reselect';

/**
 * Direct selector to the taxonomies state domain
 */
const selectTaxonomiesDomain = () => (state) => state.get('taxonomies');

/**
 * Other specific selectors
 */


/**
 * Default selector used by Taxonomies
 */

const makeSelectTaxonomies = () => createSelector(
  selectTaxonomiesDomain(),
  (substate) => substate.toJS()
);

export default makeSelectTaxonomies;
export {
  selectTaxonomiesDomain,
};
