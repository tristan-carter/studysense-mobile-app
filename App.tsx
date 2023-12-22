import React, { useState, useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
//import firebase from '@react-native-firebase/app';
import { SheetProvider } from "react-native-actions-sheet";
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import analytics from '@react-native-firebase/analytics';
import store from './firebase/store';
import WrappedApp from './WrappedApp';
import "./app/screens/sheets.js";

const firebaseConfig = {
  apiKey: "AIzaSyC6h49E3UKyhuZgi_20lyI6J8hVaJs_8Mw",
  authDomain: "studysense-29d39.firebaseapp.com",
  databaseURL: "https://studysense-29d39-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "studysense-29d39",
  storageBucket: "studysense-29d39.appspot.com",
  messagingSenderId: "351626845911",
  appId: "1:351626845911:web:70c9f984c94fb0f0ca1a92",
  measurementId: "G-QLZLLNZPVM"
};

export default function App() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeFirebase = async () => {
      //const app = await firebase.initializeApp(credentials, config);
      const authInstance = auth();
      const db = database();
      const fbAnalytics = analytics();
      setInitialized(true);
    };

    initializeFirebase();
  }, []);

  if (!initialized) {
    return null;
  }

  return (
    <Provider store={store}>
      <SheetProvider>
        <WrappedApp />
      </SheetProvider>
    </Provider>
  );
}