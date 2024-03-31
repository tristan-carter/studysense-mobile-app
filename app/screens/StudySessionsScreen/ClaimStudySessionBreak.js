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
          source={require('../../assets/CatWritingAnimation.json')}
          autoPlay
          loop
          style={{
              width: '150%',
              height: '140%',
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
              <Text style={styles.duringSessionTitleText}>Brain break done. Study time!</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.duringSessionTimeLeftContainer} onPress={()=>{
            const newPastSessions = [...user.pastStudySessions];
            const updatedCurrentSession = {
              ...currentSession,
              hasClaimedBreak: true,
            };
            newPastSessions.push(updatedCurrentSession);
            const newUserData = {
              ...user,
              pastStudySessions: newPastSessions,
              currentSession: {
                length: user.currentSessionPreset.length,
                breakLength: user.currentSessionPreset.breakLength,
                focusMode: user.currentSessionPreset.focusMode,
                startTime: Date.now(),
                breakStartTime: null,
  
                hasClaimedSession: false,
                hasClaimedBreak: false,
              },
            };
            dispatch(saveUser(newUserData));
          }}>
            <Text style={styles.sessionMainButtonText}>
              Repeat Session
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
            "Take a Well-Deserved Rest?",
            "You can always come back and continue later.",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "Finish", onPress: () => {
                const newPastSessions = [...user.pastStudySessions];
                const updatedCurrentSession = {
                  ...currentSession,
                  hasClaimedBreak: true,
                };
                newPastSessions.push(updatedCurrentSession);
                const newUserData = {
                  ...user,
                  pastStudySessions: newPastSessions,
                  currentSession: null,
                };
                dispatch(saveUser(newUserData));
              } }
            ]
          );
        }}>
          <Text style={styles.duringSessionCancelSessionText}>Finish Studying</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default StudySessionsPage;