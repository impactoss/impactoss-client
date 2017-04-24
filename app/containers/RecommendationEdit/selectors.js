import { createSelector } from 'reselect';

/**
 * Direct selector to the recommendationEdit state domain
 */
const selectRecommendationEditDomain = (state) => state.get('recommendationEdit');

/**
 * Default selector used by RecommendationEdit
 */

const viewDomainSelect = createSelector(
  selectRecommendationEditDomain,
  (substate) => substate.toJS()
);

export default viewDomainSelect;
export {
  selectRecommendationEditDomain,
};
