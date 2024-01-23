// reducers/index.js
import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import groupSlice from './groupSlice';

const rootReducer = combineReducers({
    authSlice,
    groupSlice
});

export default rootReducer;
