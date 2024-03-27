import React from 'react';
import { View, TouchableOpacity, Text, TextInput, Alert } from 'react-native';
import LottieView from 'lottie-react-native';

import { useDispatch, useSelector } from 'react-redux';
import { setCurrentSession, saveUser, setUser } from '../../../firebase/userSlice';

import Ionicons from 'react-native-vector-icons/Ionicons';

import styles from './styles';
import colours from '../../config/colours'

function StudySessionsPage({ navigation }) {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.user);
  const data = state.data;

  const currentSession = state.currentSession;

  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
  return (
    <>
      <View style={styles.container}>
        {/* Page which user sees during a study session */}
        <LottieView
            source={require('../../assets/CatSleepingAnimation.json')}
            autoPlay
            loop
            style={{
                width: '130%',
                height: '60%',
                marginTop: '-25%',
                alignSelf: 'center',
            }}
        />


      </View>
    </>
  );
}

export default StudySessionsPage;