import firestore from '@react-native-firebase/firestore';
import auth from "@react-native-firebase/auth";

import { useDispatch } from 'react-redux';
import { createAsyncThunk } from '@reduxjs/toolkit';

const placeholderData = {
  sets: ["null"],
  folders: ["null"],
}

export const fetchUserData = createAsyncThunk('user/fetchUserData', async () => {
  return new Promise((resolve, reject) => {
    const userId = auth().currentUser.uid;
    const docRef = firestore().collection('users').doc(userId);
    
    docRef.get()
        .then(docSnapshot => {
            if (docSnapshot.exists) {
                const userData = docSnapshot.data();
                console.log("Fetched UserData Successfully.");
                resolve(userData);
            } else {
                console.log("No data available");
                resolve("No data available");
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
      const docRef = firestore().collection('users').doc(userId);
  
      try {
          await docRef.set(userData);  // Save data to Firestore
          console.log("UserData saved successfully.");
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
      const db = firestore();
  
      try {
          await db.collection('users').doc(userId).delete(); 
  
          const sharedSetsRef = db.collection('sharedSets').doc(userId);
          const sharedSetsData = await sharedSetsRef.get();
  
          sharedSetsData.forEach(async (subCollection) => {
              await subCollection.ref.delete();
          });
  
          console.log("Data deleted successfully.");
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
    const db = firestore();

    try {
        await db.collection('sharedSets')
                .doc(userId)
                .doc(setCode)
                .set(sharingSet);

        console.log("SharedSetData saved successfully.");
        return setCode;
    } catch (error) {
        console.error("Error saving shared data:", error);
        alert("Error saving shared data: " + error);
    }
  }
);

export const fetchSharedSet = createAsyncThunk(
  'user/fetchSharedSet',
  async ({ setCode, userId }) => {
    const db = firestore();

    try {
      const setDocRef = db.collection('sharedSets').doc(userId).doc(setCode);
      const setDocSnapshot = await setDocRef.get();

      if (setDocSnapshot.exists()) {
        return setDocSnapshot.data();
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }
);

export const createSharedSetsList = createAsyncThunk(
  'user/createSharedSetsList',
  async (userId) => {
    const db = firestore();

    try {
      const sharedSetsRef = db.collection('sharedSets').doc(userId);
      await sharedSetsRef.set({ placeholder: 'placeholder' }); 

      console.log("Created SharedSetsData Successfully.");
      return userId; 
    } catch (error) {
      console.error("Error creating shared data:", error);
      alert("Error creating shared data: " + error);
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