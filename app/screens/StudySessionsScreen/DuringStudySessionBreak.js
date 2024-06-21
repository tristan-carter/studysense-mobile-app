import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, TextInput, Alert } from 'react-native';
import LottieView from 'lottie-react-native';

import { useDispatch, useSelector } from 'react-redux';
import { saveUser } from '../../../firebase/userSlice';

import styles from './styles';
import colours from '../../config/colours'

const MINUTE_IN_MILLISECONDS = 60000;

function StudySessionsPage({ navigation }) {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.user);
  const user = state.data;

  const timeLeft = state.studySessionsTimeLeft;
  return (
    <>
      <View style={[styles.container, {
        gap: 0,
      }]}>
        <Text style={[styles.duringSessionTitleText, {
          marginTop: 20,
        }]}>Brain Break in Progress...</Text>

        <LottieView
          source={require('../../assets/DuringBreakAnimation.json')}
          autoPlay
          loop
          style={{
              width: '130%',
              height: '50%',
              alignSelf: 'center',
              zIndex: 5,
          }}
        />

        <View style={styles.duringSessionFrame}>
          <View style={styles.duringSessionTimeLeftContainer}>
            {/* Displays time left in format minutes:seconds */}
            <Text style={[styles.duringSessionTimeLeftText, {
              fontSize: timeLeft/60 < 100 ? 100 : 90,
            }]}>
              {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}
            </Text>
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
              "Are you sure you would like to end your break early?",
              "Your session will still be counted as complete.",
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                },
                { text: "End Break", onPress: () => {
                  // saves session to past sessions and refreshes currentSession to null
                  const currentSession = user.currentSession;
                  const newPastSessions = [...user.pastStudySessions];
                  newPastSessions.push(currentSession);
                  const newUserData = {
                    ...user,
                    currentSession: null,
                    pastStudySessions: newPastSessions,
                  };
                  dispatch(saveUser(newUserData));
                  }
                }
              ]
            );
          }}>
            <Text style={styles.duringSessionCancelSessionText}>End Break</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

export default StudySessionsPage;