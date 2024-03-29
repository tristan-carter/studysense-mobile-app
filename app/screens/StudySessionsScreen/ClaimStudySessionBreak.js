import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, TextInput, Alert } from 'react-native';
import LottieView from 'lottie-react-native';

import { useDispatch, useSelector } from 'react-redux';
import { setCurrentSession, saveUser } from '../../../firebase/userSlice';

import Ionicons from 'react-native-vector-icons/Ionicons';

import styles from './styles';
import colours from '../../config/colours'

const MINUTE_IN_MILLISECONDS = 60000;

function StudySessionsPage({ navigation }) {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.user);
  const user = state.data;

  const currentSession = user.currentSession;

  const now = Date.now();
  const [timeLeft, setTimeLeft] = useState();

  useEffect(() => {
    const newTimeLeft = Math.ceil((currentSession.length * MINUTE_IN_MILLISECONDS - (now - currentSession.startTime)) / MINUTE_IN_MILLISECONDS);
    setTimeLeft(newTimeLeft);
    const intervalId = setInterval(() => {
      const now = Date.now();
      const newTimeLeft = Math.ceil((currentSession.length * MINUTE_IN_MILLISECONDS - (now - currentSession.startTime)) / MINUTE_IN_MILLISECONDS);
      setTimeLeft(newTimeLeft);
    }, 10000); // updates every 10 seconds
    return () => clearInterval(intervalId);
  }, []);
  return (
    <>
      <View style={[styles.container, {
        gap: 0,
      }]}>
        {/* Page which user sees during a study session */}
        <LottieView
          source={require('../../assets/CatSleepingAnimation.json')}
          autoPlay
          loop
          style={{
              width: '130%',
              height: '60%',
              alignSelf: 'center',
              zIndex: 5,
          }}
        />
        
        <View style={styles.duringSessionFrame}>
          <View style={styles.duringSessionUpperSection}>
            <View style={styles.duringSessionTextContainer}>
              <Text style={styles.duringSessionTitleText}>Stay Focused.</Text>
            </View>
          </View>
          <View style={styles.duringSessionTimeLeftContainer}>
            <Text style={styles.duringSessionTimeLeftText}>
              {timeLeft}
            </Text>
            <Text style={styles.duringSessionTimeLeftMinutesText}> minutes left</Text>
          </View>
        </View>

        <View style={{
          width: '100%',
          alignItems: 'center',
          flex: 1,
          justifyContent: 'flex-end',
          marginBottom: 20,
        }}>
          <TouchableOpacity style={styles.duringSessionCancelSessionButton} onPress={() => {
            Alert.alert(
              "Shhh... Ending Will Wake the Cat",
              "Are You a Monster? Cat is So Peaceful",
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                },
                { text: "End Session", onPress: () => {
                  dispatch(setCurrentSession(null));
                  dispatch(saveUser("current"));
                } }
              ]
            );
          }}>
            <Text style={styles.duringSessionCancelSessionText}>Give Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

export default StudySessionsPage;