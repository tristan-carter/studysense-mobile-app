import { createSlice } from '@reduxjs/toolkit';
import { setUser } from './userSlice';

const studySessionsTimeLeftSlice = createSlice({
  name: 'studySessionsTimeLeft',
  initialState: null,
  reducers: {
    setStudySessionsTimeLeft: (state, action) => {
      state = action.payload;
      return action.payload;
    },
  },
});

export const { setStudySessionsTimeLeft } = studySessionsTimeLeftSlice.actions;
export default studySessionsTimeLeftSlice.reducer;