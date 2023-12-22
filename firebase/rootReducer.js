import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import foldersReducer from './foldersSlice';
import setsReducer from './setsSlice';
import currentSetReducer from './currentSetSlice';
import currentFolderReducer from './currentFolderSlice';

const rootReducer = combineReducers({
  user: userReducer,
  folders: foldersReducer,
  sets: setsReducer,
  currentSet: currentSetReducer,
  currentFolder: currentFolderReducer,
});

export default rootReducer;