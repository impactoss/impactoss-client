
import { fromJS } from 'immutable';
import entityQueryReducer from '../reducer';

describe('entityQueryReducer', () => {
  it('returns the initial state', () => {
    expect(entityQueryReducer(undefined, {})).toEqual(fromJS({}));
  });
});
