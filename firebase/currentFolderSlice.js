import { createSlice } from '@reduxjs/toolkit';
import { setUser } from './userSlice';

const currentFolderSlice = createSlice({
  name: 'currentFolder',
  initialState: null,
  reducers: {
    setCurrentFolder: (state, action) => {
      state = action.payload;
      return action.payload;
    },
  },
});

export const { setCurrentFolder } = currentFolderSlice.actions;
export default currentFolderSlice.reducer;