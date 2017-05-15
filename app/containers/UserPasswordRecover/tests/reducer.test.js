
import { fromJS } from 'immutable';
import userLoginReducer from '../reducer';

describe('userLoginReducer', () => {
  it('returns the initial state', () => {
    expect(userLoginReducer(undefined, {})).toEqual(fromJS({}));
  });
});
