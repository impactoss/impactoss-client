import { createSelector } from 'reselect';

/**
 * Direct selector to the recommendationNew state domain
 */
const selectRecommendationNewDomain = (state) => state.get('recommendationNew');

/**
 * Default selector used by RecommendationNew
 */

const viewDomainSelect = createSelector(
  selectRecommendationNewDomain,
  (substate) => substate.toJS()
);

export default viewDomainSelect;
export {
  selectRecommendationNewDomain,
};
