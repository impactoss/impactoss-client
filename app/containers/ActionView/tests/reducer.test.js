
import { fromJS } from 'immutable';
import actionViewReducer from '../reducer';

describe('actionViewReducer', () => {
  it('returns the initial state', () => {
    expect(actionViewReducer(undefined, {})).toEqual(fromJS({}));
  });
});
