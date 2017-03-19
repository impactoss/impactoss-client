
import { fromJS } from 'immutable';
import taxonomiesReducer from '../reducer';

describe('taxonomiesReducer', () => {
  it('returns the initial state', () => {
    expect(taxonomiesReducer(undefined, {})).toEqual(fromJS({}));
  });
});
