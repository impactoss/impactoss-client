
import { fromJS } from 'immutable';
import registerUserPageReducer from '../reducer';

describe('registerUserPageReducer', () => {
  it('returns the initial state', () => {
    expect(registerUserPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
