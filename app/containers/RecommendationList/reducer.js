/*
 *
 * RecommendationList reducer
 *
 */

import { fromJS } from 'immutable';

const initialState = fromJS({
});

function recommendationListReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export default recommendationListReducer;
