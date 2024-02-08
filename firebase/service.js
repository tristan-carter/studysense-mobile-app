import { firebase } from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";

import { useDispatch } from 'react-redux';
import { createAsyncThunk } from '@reduxjs/toolkit';

const placeholderData = {
  sets: ["null"],
  folders: ["null"],
}

// https://studysense-29d39-default-rtdb.europe-west1.firebasedatabase.app
/*
 firebase
  .app()
  .database('https://studysense-29d39-default-rtdb.europe-west1.firebasedatabase.app')
  .ref(userId);
*/

// only meant to be used on app startup
/*export const fetchUserData = createAsyncThunk('user/fetchUserData', async () => {
    const userId = auth().currentUser.uid;
    const dbRef = firebase.app().database('https://studysense-29d39-default-rtdb.europe-west1.firebasedatabase.app').ref(`users/${userId}`);
      await dbRef.once('value')
      .then(snapshot => {
        if (snapshot.exists()) {
            const userData = snapshot.val()
            console.log("Snapshot exists")
            return userData;
        } else {
            console.log("No data available");
        }
      });
});*/

export const fetchUserData = createAsyncThunk('user/fetchUserData', async () => {
  return new Promise((resolve, reject) => {
      const userId = auth().currentUser.uid;
      const dbRef = firebase.app().database('https://studysense-29d39-default-rtdb.europe-west1.firebasedatabase.app').ref(`users/${userId}`);
      dbRef.once('value')
          .then(snapshot => {
              if (snapshot.exists()) {
                  const userData = snapshot.val();
                  console.log("Fetched UserData Successfully.")
                  resolve(userData);
              } else {
                  console.log("No data available");
                  resolve(null);
              }
          })
          .catch(error => {
              console.error("Error fetching user data", error);
              reject(error);
          });
  });
});

export const saveUserData = createAsyncThunk(
    'user/saveUser',
    async (userData) => {
      const userId = auth().currentUser.uid;
      const dbRef = firebase.app().database('https://studysense-29d39-default-rtdb.europe-west1.firebasedatabase.app').ref(`users/${userId}`);
      try {
          await dbRef.set(userData);
          console.log("UserData saved successfully.")
          return userData;
        } catch (error) {
          console.error("Error saving data:", error);
          alert("Error saving data: " + error);
      }
    }
);

export const deleteAccount = createAsyncThunk(
    'user/deleteAccountData',
    async (userId) => {
      const dbSharedSetsRef = firebase.app().database('https://studysense-29d39-default-rtdb.europe-west1.firebasedatabase.app').ref(`sharedSets/${userId}`);
      const dbRef = firebase.app().database('https://studysense-29d39-default-rtdb.europe-west1.firebasedatabase.app').ref(`users/${userId}`);
      try {
          await dbRef.set(null);
          await dbSharedSetsRef.set(null);
          return null;
      } catch (error) {
          console.error("Error deleting data:", error);
          alert("Error deleting data: " + error);
      }
    }
);

export const saveSharedSet = createAsyncThunk(
  'user/saveSharedSet',
  async ([setCode, sharingSet]) => {
    const userId = auth().currentUser.uid;
    const dbRef = firebase.app().database('https://studysense-29d39-default-rtdb.europe-west1.firebasedatabase.app').ref(`sharedSets/${userId}/${setCode}`);
    try {
        await dbRef.set(sharingSet);
        console.log("SharedSetData saved successfully.")
        return setCode;
      } catch (error) {
        console.error("Error saving data:", error);
        alert("Error saving data: " + error);
      }
    }
);

export const fetchSharedSet = createAsyncThunk(
    'user/fetchSharedSet',
    async ([setCode, userId]) => {
      return new Promise((resolve, reject) => {
        const dbRef = firebase.app().database('https://studysense-29d39-default-rtdb.europe-west1.firebasedatabase.app').ref(`sharedSets/${userId}/${setCode}`);
        dbRef.once('value')
        .then(snapshot => {
          if (snapshot.exists()) {
              const sharedSet = snapshot.val();
              console.log("Fetched SharedSetData Successfully.")
              resolve(sharedSet);
          } else {
              console.log("No data available");
              resolve(null);
          }
      })
    });
});

export const createSharedSetsList = createAsyncThunk(
    'user/createSharedSetsList',
    async (userId) => {
      const dbRef = firebase.app().database('https://studysense-29d39-default-rtdb.europe-west1.firebasedatabase.app').ref(`sharedSets/${userId}`);
      try {
          await dbRef.set({"null": "null"});
          console.log("Created SharedSetsData Successfully.")
          return userId;
        } catch (error) {
          console.error("Error saving data:", error);
          alert("Error saving data: " + error);
      }
    }
);



// keeps state up to date with database
/*export const keepStateUpdated = () => {
    const auth = getAuth();
    const dispatch = useDispatch();
    const db = getDatabase();
    const userId = auth.currentUser.uid;
    if (!userId) {
        return;
    }
    const userRef = ref(db, `users/${userId}`);
    onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      dispatch(setUser(userData));
    });
}*/