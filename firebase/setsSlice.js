import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveUser, setUser, saveSet, deleteSetFromDatastore } from './userSlice';

export const addSet = createAsyncThunk(
  'sets/addSet',
  async ({ setId, name, icon, cards, description, isPrivate, answerWithTerm, answerWithDefinition }, { getState, dispatch }) => {
    const { data, currentFolder } = getState().user;
    const newSet = {
      id: setId,
      name: name,
      cards: cards,
      icon: icon,
      description: description,
      isFolder: false,
      lastRevised: null,
      smartStudyOptions: {
        answerWithTerm: answerWithTerm,
        answerWithDefinition: answerWithDefinition,
      },
      refresherOptions: {
        answerWithTerm: answerWithTerm,
        answerWithDefinition: answerWithDefinition,
      },
      testOptions: {
        answerWithTerm: answerWithTerm,
        answerWithDefinition: answerWithDefinition,
      },
      flashcardOptions: {
        answerWithTerm: answerWithTerm,
        answerWithDefinition: answerWithDefinition,
      },
      isPrivate: isPrivate,
    };
    var updatedData
    if (currentFolder == null) {
      const sets = [...data.sets, newSet]
      updatedData = {
        ...data,
        sets: sets,
      };
    } else {
      updatedData = {
        ...data,
        folders: data.folders.map((folder) => {
          if (folder.id === currentFolder) {
            return {
              ...folder,
              sets: [...folder.sets, newSet],
            };
          }
          return folder;
        }),
      };
    }
    await dispatch(saveUser(updatedData));
    await dispatch(saveSet(newSet));
    return newSet;
  } 
);

export const editSet = createAsyncThunk(
  'sets/editset',
  async ({ setId, editedValues }, { getState, dispatch }) => {
    let updatedSet;
    const { data, currentFolder } = getState().user;
    let updatedData;
    if (currentFolder === null) {
      const updatedSets = data.sets.map((set) => {
        if (set.id === setId) {
          const answerWithTerm = editedValues.answerWithTerm != null ? editedValues.answerWithTerm : set.testOptions.answerWithTerm;
          const answerWithDefinition = editedValues.answerWithDefinition != null ? editedValues.answerWithDefinition : set.testOptions.answerWithDefinition;
          updatedSet =  {
            ...set,
            name: editedValues.name != null ? editedValues.name : set.name,
            description: editedValues.description != null ? editedValues.description : set.description,
            icon: editedValues.icon != null ? editedValues.icon : set.icon,
            cards: editedValues.cards != null ? editedValues.cards : set.cards,
            isPrivate: editedValues.isPrivate != null ? editedValues.isPrivate : set.isPrivate,
            testOptions: { answerWithTerm: answerWithTerm, answerWithDefinition: answerWithDefinition },
            flashcardOptions: { answerWithTerm: answerWithTerm, answerWithDefinition: answerWithDefinition },
            refresherOptions: { answerWithTerm: answerWithTerm, answerWithDefinition: answerWithDefinition },
            smartStudyOptions: { answerWithTerm: answerWithTerm, answerWithDefinition: answerWithDefinition },
          }
          return updatedSet;
        }
        return set;
      });
      updatedData = {
        ...data,
        sets: updatedSets,
      };
    } else {
      const updatedFolders = data.folders.map((folder) => {
        if (folder.id === currentFolder) {
          const updatedSets = folder.sets.map((set) => {
            if (set.id === setId) {
              const answerWithTerm = editedValues.answerWithTerm != null ? editedValues.answerWithTerm : set.testOptions.answerWithTerm;
              const answerWithDefinition = editedValues.answerWithDefinition != null ? editedValues.answerWithDefinition : set.testOptions.answerWithDefinition;
              updatedSet = {
                ...set,
                name: editedValues.name != null ? editedValues.name : set.name,
                description: editedValues.description != null ? editedValues.description : set.description,
                icon: editedValues.icon != null ? editedValues.icon : set.icon,
                cards: editedValues.cards != null ? editedValues.cards : set.cards,
                isPrivate: editedValues.isPrivate != null ? editedValues.isPrivate : set.isPrivate,
                testOptions: { answerWithTerm: answerWithTerm, answerWithDefinition: answerWithDefinition },
                flashcardOptions: { answerWithTerm: answerWithTerm, answerWithDefinition: answerWithDefinition },
                refresherOptions: { answerWithTerm: answerWithTerm, answerWithDefinition: answerWithDefinition },
                smartStudyOptions: { answerWithTerm: answerWithTerm, answerWithDefinition: answerWithDefinition },
              }
              return updatedSet;
            }
            return set;
          });
          updatedData = {
            ...folder,
            sets: updatedSets,
          };
          return updatedData;
        }
        return folder;
      });
      updatedData = {
        ...data,
        folders: updatedFolders,
      };
    }

    await dispatch(saveSet(updatedSet));
    await dispatch(saveUser(updatedData));
    return updatedData;
  }
);

export const deleteSet = createAsyncThunk('sets/deleteSet', async (setId, { getState, dispatch }) => {
  const { data, currentFolder } = getState().user;
    const updatedData = {
      ...data,
      sets: data.sets.filter((set) => set.id != setId),
      folders: data.folders.map((folder) => {
        if (folder.id === currentFolder) {
          return {
            ...folder,
            sets: folder.sets.filter((set) => set.id != setId),
          };
        }
        return folder;
      }),
    };
    await dispatch(deleteSetFromDatastore(setId));
    await dispatch(saveUser(updatedData));
    return setId;
});

const setsSlice = createSlice({
  name: 'sets',
  initialState: {
    id: null,
    name: null,
    cards: null,
    icon: null,
    description: null,
    isFolder: false,
    lastRevised: null,
    smartStudyOptions: {
      answerWithTerm: false,
      answerWithDefinition: true,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
  },
});

export default setsSlice.reducer;