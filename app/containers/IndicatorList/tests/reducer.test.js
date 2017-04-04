
import { fromJS } from 'immutable';
import actionListReducer from '../reducer';

describe('actionListReducer', () => {
  it('returns the initial state', () => {
    expect(actionListReducer(undefined, {})).toEqual(fromJS({}));
  });
});
