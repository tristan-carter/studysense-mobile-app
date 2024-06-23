import firestore from '@react-native-firebase/firestore';
import auth from "@react-native-firebase/auth";

import { useDispatch } from 'react-redux';
import { createAsyncThunk } from '@reduxjs/toolkit';

const placeholderData = {
  sets: ["null"],
  folders: ["null"],
}

function fetchAllSets() {
  return new Promise((resolve, reject) => {
    const db = firestore();
    const setsRef = db.collection('sets');

    setsRef.get()
      .then(querySnapshot => {
        console.log("Fetched sets successfully.");
        const sets = querySnapshot.docs.map(doc => doc.data());
        console.log(sets);
      })
      .catch(error => {
        console.error("Error fetching sets:", error);
        reject(error);
      });
  });

}

export const fetchUserData = createAsyncThunk('user/fetchUserData', async () => {
  const userId = auth().currentUser.uid;
  const docRef = firestore().collection('users').doc(userId);

  try {
    const docSnapshot = await docRef.get();
    if (docSnapshot.exists) {
      let userData = docSnapshot.data();
      console.log("Fetched UserData Successfully.");
      //fetchAllSets();
      // Filter and fetch sets
      const validSetIds = userData.sets.filter(setId => setId !== "null" && setId !== null);
      const setsFetchPromises = validSetIds.map(async (setId) => {
        try {
          const setDocRef = firestore().collection('sets').doc(setId);
          const setDocSnapshot = await setDocRef.get();
          return setDocSnapshot.exists ? setDocSnapshot.data() : null;
        } catch (error) {
          console.error("Error fetching set data:", error);
          return null;
        }
      });
      const fetchedSets = await Promise.all(setsFetchPromises);
      //userData.sets = fetchedSets.filter(set => set !== null);

      // Filter and fetch sets within folders
      userData.folders = await Promise.all(userData.folders.map(async (folder) => {
        if (folder !== "null" && folder !== null) {
          const validFolderSetIds = folder.sets.filter(setId => setId !== "null" && setId !== null);
          const folderSetsFetchPromises = validFolderSetIds.map(async (setId) => {
            const setDocRef = firestore().collection('sets').doc(setId);
            const setDocSnapshot = await setDocRef.get();
            return setDocSnapshot.exists ? setDocSnapshot.data() : null;
          });
          const fetchedFolderSets = await Promise.all(folderSetsFetchPromises);
          folder.sets = fetchedFolderSets.filter(set => set !== null);
        }
        return folder;
      }));

      return userData;  // Return the modified userData
    } else {
      console.log("No data available");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
});


export const saveUserData = createAsyncThunk(
    'user/saveUser',
    async (userData) => {
      const userId = auth().currentUser.uid;
      const docRef = firestore().collection('users').doc(userId);
  
      try {
          // Duplicates userData to avoid modifying the original object
          let updatedUserData = JSON.parse(JSON.stringify(userData));
          console.log(updatedUserData)

          // Replaces all the sets and sets in folders with their set ids
          for (let i = 0; i < updatedUserData.sets.length; i++) {
            if (updatedUserData.sets[i] !== "null") {
              updatedUserData.sets[i] = updatedUserData.sets[i].id;
            }
          }

          for (let i = 0; i < updatedUserData.folders.length; i++) {
              const folder = updatedUserData.folders[i];
              if (folder !== "null") {
                for (let j = 0; j < folder.sets.length; j++) {
                  if (folder.sets[j] !== "null") {
                    folder.sets[j] = folder.sets[j].id;
                  }
                }
              }
          }

          await docRef.set(updatedUserData);  // Save data to Firestore
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

export const fetchSetData = createAsyncThunk('user/fetchSet', async (setId) => {
  return new Promise((resolve, reject) => {
    const docRef = firestore().collection('sets').doc(setId);
    
    docRef.get()
        .then(docSnapshot => {
            if (docSnapshot.exists) {
                const set = docSnapshot.data();
                resolve(set);
            } else {
                console.log("No set data available");
                resolve("No set data available");
            }
        })
        .catch(error => {
            console.error("Error fetching set data", error);
            reject(error);
        });
  });
});

export const saveSetData = createAsyncThunk(
  'user/saveSet',
  async (set) => {
    const docRef = firestore().collection('sets').doc(set.id);

    try {
        await docRef.set(set);  // Save data to Firestore
        console.log("SetData saved successfully.");
        return set; 
    } catch (error) {
        console.error("Error saving set data:", error);
        alert("Error saving set data: " + error);
    }
  }
);

export const deleteSetData = createAsyncThunk(
  'user/deleteSet',
  async (setId) => {
    const db = firestore();
    try {
        await db.collection('sets').doc(setId).delete(); 
        return null; 
    } catch (error) {
        console.error("Error deleting set data:", error);
        alert("Error deleting set data: " + error);
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
        .doc(userId.toString())
        .collection('userSets')
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