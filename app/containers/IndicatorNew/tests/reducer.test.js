
import { fromJS } from 'immutable';
import actionNewReducer from '../reducer';

describe('actionNewReducer', () => {
  it('returns the initial state', () => {
    expect(actionNewReducer(undefined, {})).toEqual(fromJS({}));
  });
});
