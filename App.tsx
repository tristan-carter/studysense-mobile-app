import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { SheetProvider } from "react-native-actions-sheet";

import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import analytics from '@react-native-firebase/analytics';
import store from './firebase/store';

import WrappedApp from './WrappedApp';
import "./app/screens/sheets.js";

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