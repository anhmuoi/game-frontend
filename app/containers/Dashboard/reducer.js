/*
 * dashboardReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */
import { fromJS } from 'immutable';

import {
  FETCH_DATA_SUCCESS
} from './constants';

// The initial state of the App
export const initialState = fromJS({
  data: {},
});

function dashboardReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_DATA_SUCCESS:
      // console.log(action.data);
      return state
        .set('data', action.data)
    default:
      return state;
  }
}

export default dashboardReducer;
