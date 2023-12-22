import { createSlice } from '@reduxjs/toolkit';
import { setUser } from './userSlice';

const currentSetSlice = createSlice({
  name: 'currentSet',
  initialState: null,
  reducers: {
    setCurrentSet: (state, action) => {
      state = action.payload;
      return action.payload;
    },
  },
});

export const { setCurrentSet } = currentSetSlice.actions;
export default currentSetSlice.reducer;