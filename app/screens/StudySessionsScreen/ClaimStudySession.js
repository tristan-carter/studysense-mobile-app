import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, TextInput, Alert } from 'react-native';
import LottieView from 'lottie-react-native';

import { useDispatch, useSelector } from 'react-redux';
import { saveUser } from '../../../firebase/userSlice';


import styles from './styles';
import colours from '../../config/colours'


function StudySessionsPage({ navigation }) {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.user);
  const user = state.data;
  const currentSession = user.currentSession;
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
        zIndex: 10,
      }}>
        <View style={styles.claimFrame}>
          <View style={styles.claimUpperSection}>
            <View style={styles.duringSessionTextContainer}>
              <Text style={styles.claimTitleText}>You Finished, Well Done!</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.claimButtonContainer} onPress={()=>{
            console.log('Claimed session');
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
            <Text style={styles.claimButtonText}>
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
            "Are you sure you would like to skip your break?",
            "Your session will still be counted as complete.",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "Skip Break", onPress: () => {
                // saves session to past sessions and refreshes currentSession to null
                const newPastSessions = [...user.pastStudySessions];
                newPastSessions.push(currentSession);
                const newUserData = {
                  ...user,
                  currentSession: null,
                  pastStudySessions: newPastSessions,
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