import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setUser } from './userSlice';

export const addFolder = createAsyncThunk(
  'folders/addFolder',
  async ({ folderId, name, icon }, { getState, dispatch }) => {
    const { data } = getState().user;
    const newFolder = {
      id: folderId,
      name: name,
      sets: ["null"],
      icon: icon,
      isFolder: true,
      lastRevised: null,
    };

    const updatedData = {
      ...data,
      folders: [...data.folders, newFolder],
    };

    await dispatch(setUser(updatedData));
    return newFolder;
  }
);

export const editFolder = createAsyncThunk(
  'folders/editFolder',
  async ({ folderId, editedValues }, { getState, dispatch }) => {
    const { data } = getState().user;
    const updatedFolders = data.folders.map((folder) => {
      if (folder.id === folderId) {
        const updatedfolder = {
          ...folder,
          name: editedValues.name != null ? editedValues.name : folder.name,
          icon: editedValues.icon != null ? editedValues.icon : folder.icon,
        };
        return updatedfolder;
      }
      return folder;
    });
    updatedData = {
      ...data,
      folders: updatedFolders,
    };
    await dispatch(setUser(updatedData));
    return;
  }
);

export const deleteFolder = createAsyncThunk(
  'folders/deleteFolder',
  async (folderId, { getState, dispatch }) => {
    const { data } = getState().user;
    const updatedData = {
      ...data,
      folders: data.folders.filter((folder) => folder.id !== folderId),
    };

    await dispatch(setUser(updatedData));
    return folderId;
  }
);

const foldersSlice = createSlice({
  name: 'folders',
  initialState: {
    id: null,
    name: null,
    sets: null,
    icon: null,
    isFolder: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
  },
});

export default foldersSlice.reducer;