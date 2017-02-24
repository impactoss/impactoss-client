
import { fromJS } from 'immutable';
import recommendationNewReducer from '../reducer';

describe('recommendationNewReducer', () => {
  it('returns the initial state', () => {
    expect(recommendationNewReducer(undefined, {})).toEqual(fromJS({}));
  });
});
