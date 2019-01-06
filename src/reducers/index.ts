import { combineReducers } from 'redux';

import files from './files';
import upload from './upload';
import user from './user';

const appReducer = combineReducers({ files, upload, user });

const rootReducer = (state: any, action: any) => {
  if (action.type === 'SET_SIGN_IN' || action.value === false) {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
