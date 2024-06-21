import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, Alert, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';

import { useDispatch, useSelector } from 'react-redux';
import { saveUser } from '../../../firebase/userSlice';

import Ionicons from 'react-native-vector-icons/Ionicons';

import styles from './styles';
import colours from '../../config/colours'

const MINUTE_IN_MILLISECONDS = 60000;

function StudySessionsPage({ navigation }) {
  const screenHeight = Dimensions.get('window').height;
  
  const dispatch = useDispatch();
  const state = useSelector((state) => state.user);
  const user = state.data;

  const timeLeft = state.studySessionsTimeLeft;

  const now = Date.now();
  const [animationHeight, setAnimationHeight] = useState(0);
  return (
    <>
      <View style={[styles.container, {
        gap: 0,
      }]}>
        <View
        onLayout={(event) => {
          const {height} = event.nativeEvent.layout;
          setAnimationHeight(height);
        }}
        style={{
          width: '130%',
          height: '60%',
          alignSelf: 'center',
          zIndex: 5,
        }}
        >
          <LottieView
            source={require('../../assets/CatSleepingAnimation.json')}
            autoPlay
            loop
            style={{
                width: '100%',
                height: '100%',
                alignSelf: 'center',
                zIndex: 5,
            }}
          />
        </View>
        
        <View style={[styles.duringSessionFrame, {marginTop: -animationHeight * 0.307}]}>
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
              "Shhh... Ending Will Wake the Cat",
              "Are You a Monster? Cat is So Peaceful",
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
            <Text style={styles.duringSessionCancelSessionText}>Give Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

export default StudySessionsPage;