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

  const [timeLeft, setTimeLeft] = useState();

  useEffect(() => {
    const newTimeLeft = Math.ceil((currentSession.length * MINUTE_IN_MILLISECONDS - (Date.now() - currentSession.startTime)) / MINUTE_IN_MILLISECONDS);
    setTimeLeft(newTimeLeft);
    const intervalId = setInterval(() => {
      const newTimeLeft = Math.ceil((currentSession.length * MINUTE_IN_MILLISECONDS - (Date.now() - currentSession.startTime)) / MINUTE_IN_MILLISECONDS);
      setTimeLeft(newTimeLeft);
    }, 10000); // updates every 10 seconds
    return () => clearInterval(intervalId);
  }, []);
  return (
    <View style={[styles.container, {
      gap: 0,
    }]}>
      <View style={styles.rewardAnimationContainer}>
        <LottieView
          source={require('../../assets/CelebrationAnimation.json')}
          autoPlay
          loop
          style={{
              width: '150%',
              height: '150%',
              position: 'absolute',
          }}
        />
        <LottieView
          source={require('../../assets/CatCelebratingAnimation.json')}
          autoPlay
          loop
          style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
          }}
        />
      </View>

      <View style={{
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
      }}>
        <View style={styles.duringSessionFrame}>
          <View style={styles.duringSessionUpperSection}>
            <View style={styles.duringSessionTextContainer}>
              <Text style={styles.duringSessionTitleText}>You Finished, Well Done!</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.duringSessionTimeLeftContainer} onPress={()=>{
            const newUserData = {
              ...user,
              currentSession: {
                ...currentSession,
                hasClaimedSession: true,
                breakStartTime: Date.now(),
              },
            };
            dispatch(saveUser(newUserData));
          }}>
            <Text style={styles.sessionMainButtonText}>
              Start Break
            </Text>
          </TouchableOpacity>
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
            "",
            "",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "End Session", onPress: () => {
                const newUserData = {
                  ...user,
                  currentSession: null,
                };
                dispatch(saveUser(newUserData));
              } }
            ]
          );
        }}>
          <Text style={styles.duringSessionCancelSessionText}>Skip Break</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default StudySessionsPage;