import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { initializeApp } from '@react-native-firebase/app';
import { getDatabase } from '@react-native-firebase/database';
import { getAuth } from '@react-native-firebase/auth';
import { getAnalytics } from '@react-native-firebase/analytics';
import store from './firebase/store';
import WrappedApp from './WrappedApp';
import ActionSheet from 'react-native-actions-sheet';
import { loadFont } from 'react-native-fonts';

const firebaseConfig = {
  apiKey: "AIzaSyC6h49E3UKyhuZgi_20lyI6J8hVaJs_8Mw",
  authDomain: "studysense-29d39.firebaseapp.com",
  databaseURL: "https://studysense-29d39-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "studysense-29d39",
  storageBucket: "studysense-29d39.appspot.com",
  messagingSenderId: "351626845911",
  appId: "1:351626845911:web:70c9f984c94fb0f0ca1a92",
  measurementId: "G-QLZLLNZPVM"
};

export default function App() {
  const [initialized, setInitialized] = useState(false);
  const actionSheetRef = React.createRef(); // Create a ref for the ActionSheet

  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const authInstance = getAuth(app);
    const db = getDatabase(app);
    const analytics = getAnalytics(app);
    setInitialized(true);
  }, []);

  useEffect(() => {
    const loadFonts = async () => {
      await loadFont({ 'Lato': require('./app/assets/fonts/Lato-Regular.ttf') });
      await loadFont({ 'Lato-Bold': require('./app/assets/fonts/Lato-Bold.ttf') });
      await loadFont({ 'Lato-Black': require('./app/assets/fonts/Lato-Black.ttf') });
    };

    loadFonts();
  }, []);

  if (!initialized) {
    return null;
  }

  return (
    <Provider store={store}>
      <ActionSheet ref={actionSheetRef}>
        <WrappedApp />
      </ActionSheet>
    </Provider>
  );
}
