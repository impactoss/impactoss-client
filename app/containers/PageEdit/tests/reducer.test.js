
import { fromJS } from 'immutable';
import actionEditReducer from '../reducer';

describe('actionEditReducer', () => {
  it('returns the initial state', () => {
    expect(actionEditReducer(undefined, {})).toEqual(fromJS({}));
  });
});
