import React, { useState, useRef, useEffect } from 'react';
import { View, Dimensions, TouchableOpacity, Text, Modal, TextInput, Alert } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import CheckBox from '@react-native-community/checkbox';
import { BarChart } from "react-native-gifted-charts";

import { useDispatch, useSelector } from 'react-redux';
import { setCurrentSession, saveUser, setUser } from '../../../firebase/userSlice';

import DuringStudySession from './DuringStudySession';

import Ionicons from 'react-native-vector-icons/Ionicons';

import styles from './styles';
import colours from '../../config/colours'

function StudySessionsPage({ navigation }) {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.user);
  const data = state.data;

  if (data.currentSessionPreset == null) {
    dispatch(saveUser({
      ...data,
      pastStudySessions: ["null"],
      currentSessionPreset: {
        length: 30,
        breakLength: 5,
        focusMode: false,
      },
      studySessionsGoals: {
        daily: 120,
        weekly: 840,
        monthly: 0,
        yearly: 0,
      },
    }));
    dispatch(setUser({
      ...data,
      pastStudySessions: ["null"],
      currentSessionPreset: {
        length: 30,
        breakLength: 5,
        focusMode: false,
      },
      studySessionsGoals: {
        daily: 120,
        weekly: 840,
        monthly: 0,
        yearly: 0,
      },
    }))
  }

  const [focus, setFocus] = useState(data.currentSessionPreset.focusMode);

  const currentSession = state.currentSession;

  function getDayLabel(date) {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return days[date.getDay()];
  }

  function getLast7Days() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    const last7Days = [];
  
    for (let i = 0; i < 7; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      last7Days.unshift(days[day.getDay()].charAt(0).toUpperCase());
    }
  
    return last7Days;
  }

  function getPastStudySessionsForLast7Days() {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day

    // Get last 7 days of sessions
    const last7Days = getLast7Days();
    const past7DaysSessions = data.pastStudySessions.filter(session => now - session.date < 7 * oneDay);

    const sessionsList = last7Days.map(day => ({ label: day, value: 0 }));
    past7DaysSessions.forEach(session => {
        const dayLabel = getDayLabel(new Date(session.date));
        const existingDay = sessionsList.find(item => item.label === dayLabel);
        existingDay.value += session.length;
    });

    return sessionsList;
  }

  function getPastSessionsFormatted() {
    sessionsList = getPastStudySessionsForLast7Days();
    for (let i = 0; i < sessionsList.length; i++) {
      if (sessionsList[i].value > data.studySessionsGoals.daily) {
        sessionsList[i].frontColor = colours.primary;
      }
      else if (sessionsList[i].value == 0) {
        sessionsList[i].value = 1;
      }
    }
    return sessionsList;
  }

  const barData = getPastSessionsFormatted();

  // calculate the total time studied today, this week, this month, this year
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day

  var totalToday = data.pastStudySessions.filter(session => now - session.date < oneDay).reduce((acc, session) => acc + session.value, 0);
  var totalThisWeek = data.pastStudySessions.filter(session => now - session.date < 7 * oneDay).reduce((acc, session) => acc + session.value, 0);
  var totalThisMonth = data.pastStudySessions.filter(session => now - session.date < 30 * oneDay).reduce((acc, session) => acc + session.value, 0);
  var totalThisYear = data.pastStudySessions.filter(session => now - session.date < 365 * oneDay).reduce((acc, session) => acc + session.value, 0);

  // divide by 60 to get hours and rounds to 3 significant figures but without trailing zeros
  totalToday = (totalToday / 60).toFixed(3).replace(/\.?0*$/, '');
  totalThisWeek = (totalThisWeek / 60).toFixed(3).replace(/\.?0*$/, '');
  totalThisMonth = (totalThisMonth / 60).toFixed(3).replace(/\.?0*$/, '');
  totalThisYear = (totalThisYear / 60).toFixed(3).replace(/\.?0*$/, '');

  var maxDayThisWeek = data.pastStudySessions.filter(session => now - session.date < 7 * oneDay).reduce((acc, session) => {session.value > acc ? acc = session.value : null}, 0);;
  if (maxDayThisWeek < data.studySessionsGoals.daily) {
    maxDayThisWeek = data.studySessionsGoals.daily;
  }
  // round maxDayThisWeek up to the nearest 40
  maxDayThisWeek = Math.ceil(maxDayThisWeek / 40) * 40;

  const [showLengthModal, setShowLengthModal] = useState(false);
  const newLength = useRef();
  const newLengthType = useRef();
  return (
    <>
      <View style={styles.container}>
        <View style={styles.currentSessionView}>
          <View style={styles.currentSessionTextContainer}>
            <Text style={styles.currentSessionTitle}>Edit Session</Text>
          </View>

          <View style={styles.currentSessionTextContainer}>
            <Text style={styles.currentSessionText}>session length: {data.currentSessionPreset.length} mins</Text>
            <TouchableOpacity
            onPress={()=>{
              newLengthType.current = 'Session';
              newLength.current = data.currentSessionPreset.length.toString();
              setShowLengthModal(true);
            }}>
              <Ionicons name="create-outline" size={23} color={colours.darkgray} />
            </TouchableOpacity>
          </View>

          <View style={styles.currentSessionTextContainer}>
            <Text style={styles.currentSessionText}>break length: {data.currentSessionPreset.breakLength} mins</Text>
            <TouchableOpacity
            onPress={()=>{
              newLengthType.current = 'Break';
              newLength.current = data.currentSessionPreset.breakLength.toString();
              setShowLengthModal(true);
            }}>
              <Ionicons name="create-outline" size={23} color={colours.darkgray} />
            </TouchableOpacity>
          </View>

          <View style={[styles.currentSessionTextContainer, {gap: 0}]}>
              <Text style={styles.currentSessionText}>focus mode: </Text>
              <CheckBox
                value={focus}
                onValueChange={() => {
                  setFocus(!focus);
                  if (data.currentSessionPreset.focusMode != null) {
                    dispatch(setUser({
                      ...data,
                      currentSessionPreset: {
                        ...data.currentSessionPreset,
                        focusMode: !focus,
                      }
                    }));
                  } else {
                    dispatch(setUser({
                      ...data,
                      currentSessionPreset: {
                        ...data.currentSessionPreset,
                        focusMode: true,
                      }
                    }));
                  
                  }
                }}
                tintColors={{true: colours.darkPrimary, false: colours.incorrectRed}}
              />
          </View>
        </View>

        <BarChart
          barWidth={23}
          noOfSections={4}
          barBorderRadius={4}
          frontColor="lightgray"
          data={barData}
          yAxisThickness={0}
          xAxisThickness={0}
          maxValue={maxDayThisWeek}
          hideRules
          showReferenceLine1
          referenceLine1Position={data.studySessionsGoals.daily}
          referenceLine1Config={{
            color: 'gray',
            dashWidth: 2,
            dashGap: 3,
            dashThickness: 2,
          }}
          
          yAxisStep={30}
        />
        
        <TouchableOpacity
          style={styles.button}
          onPress={()=>{
            dispatch(setCurrentSession({
              length: data.currentSessionPreset.length,
              breakLength: data.currentSessionPreset.breakLength,
              focusMode: data.currentSessionPreset.focusMode,
              startTime: Date.now(),

              hasFinishedSession: false,
              hasClaimedSession: false,

              hasFinishedBreak: false,
              hasClaimedBreak: false,
            }));
            dispatch(saveUser("current"));
          }}>
          <Text
            style={{color: colours.white, fontSize: 20, fontFamily: 'Lato-Bold'}}
          >Start Session</Text>
        </TouchableOpacity>
          
        <TouchableOpacity
          style={[styles.button, {backgroundColor: colours.blue}]}
          onPress={()=>{
            newLengthType.current = 'Daily Goal';
            newLength.current = data.studySessionsGoals.daily.toString();
            setShowLengthModal(true);
          }}>
          <Text
            style={{color: colours.white, fontSize: 20, fontFamily: 'Lato-Bold'}}
          >Set New Goal</Text>
        </TouchableOpacity>

        <View style={styles.currentSessionView}>
          <Text style={styles.currentSessionTitle}>You've Studied</Text>
          
          <Text
            style={styles.currentSessionText}
          >today: {totalToday} hours</Text>
          <Text
            style={styles.currentSessionText}
          >this week: {totalThisWeek} hours</Text>
          <Text
            style={styles.currentSessionText}
          >this month: {totalThisMonth} hours</Text>
          <Text
            style={styles.currentSessionText}
          >this year: {totalThisYear} hours</Text>
        </View>
      </View>


      {/* Change session/break length and goal modal */}
      <Modal
      animationType="fade"
      transparent={true}
      visible={showLengthModal}
      onRequestClose={() => setShowLengthModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {newLengthType == "Daily Goal" ? (
              <Text style={styles.modalText}>Set New Daily Goal</Text>
            ) : (
              <Text style={styles.modalText}>Change {newLengthType.current} Length</Text>
            )}
            <View style={styles.inputContainer}>
                {newLengthType.current == "Daily Goal" ? (
                  <Text style={styles.inputLabel}>New Daily Goal (minutes)</Text>
                ) : (
                  <Text style={styles.inputLabel}>New Length (minutes)</Text>
                )}
                <TextInput
                    keyboardType='numeric'
                    multiline={true}
                    style={styles.textInput} defaultValue={newLength.current} placeholderTextColor={'rgba(0, 0, 0, 0.48)'}
                    onChangeText={(text) => {
                      if (text === '' || parseInt(text) == text) {
                        newLength.current = text;
                      }
                    }}
                />
            </View>
            <TouchableOpacity
              style={styles.createButton}
              onPress={()=>{
                if (newLength.current == '' || parseInt(newLength.current) != newLength.current) {
                  Alert.alert('Invalid Input', 'Please enter a valid number');
                  return;
                }
                const intNewLength = parseInt(newLength.current);
                if (newLengthType.current == 'Session') {
                  if (intNewLength < 5) {
                    Alert.alert('Invalid Session Length', 'Please enter a session length of at least 5 minutes');
                    return;
                  }
                  if (intNewLength > 120) {
                    Alert.alert('Invalid Session Length', 'Please enter a session length of 120 minutes or less');
                    return;
                  }
                  dispatch(setUser({
                    ...data,
                    currentSessionPreset: {
                      ...data.currentSessionPreset,
                      length: intNewLength,
                    }
                  }));
                }
                else if (newLengthType.current == 'Break') {
                  if (intNewLength > 60) {
                    Alert.alert('Invalid Break Length', 'Please enter a break length of 60 minutes or less');
                    return;
                  }
                  dispatch(setUser({
                    ...data,
                    currentSessionPreset: {
                      ...data.currentSessionPreset,
                      breakLength: intNewLength,
                    }
                  }));
                }
                else if (newLengthType.current == 'Daily Goal') {
                  if (intNewLength < 10) {
                    Alert.alert('Invalid Daily Goal', 'Please enter a daily goal of at least 10 minutes');
                    return;
                  }
                  if (intNewLength > 600) {
                    Alert.alert('Invalid Daily Goal', 'Please enter a daily goal of 600 minutes or less');
                    return;
                  }
                  dispatch(setUser({
                    ...data,
                    studySessionsGoals: {
                      ...data.studySessionsGoals,
                      daily: parseInt(newLength.current),
                    }
                  }));
                }
                setShowLengthModal(false);
              }}
            >
              <Text style={styles.createButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={()=>setShowLengthModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const Stack = createStackNavigator();

function StudySessionsScreen({ navigation }) {
    const user = useSelector((state) => state.user.data);
    const screenHeight = Dimensions.get('window').height;
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
    const inSession = user.currentSession != null && !user.currentSession.hasFinishedSession
    return(
      <Stack.Navigator initialRouteName='StudySessionsMainPage'
      screenOptions={{
        headerShadowVisible: false,
      }}
      >
        {inSession ? (
        <Stack.Screen name="DuringStudySession" component={DuringStudySession} 
          options={{
            headerShown: true,
            title: "Study Sessions",
            headerTitleStyle: { color: colours.titletext, fontSize: 28, fontFamily: 'Lato-Bold', fontWeight: '600' },
            headerStyle: { height: screenHeight <= 800 ? 50 : 90, backgroundColor: colours.backgroundColour },
          }}
        />
        ) : (
        <Stack.Screen name="StudySessionsMainPage" component={StudySessionsPage} 
          options={{
            headerShown: true,
            title: "Study Sessions",
            headerTitleStyle: { color: colours.titletext, fontSize: 28, fontFamily: 'Lato-Bold', fontWeight: '600' },
            headerStyle: { height: screenHeight <= 800 ? 50 : 90, backgroundColor: colours.backgroundColour },
          }}
        /> 
        )}
      </Stack.Navigator>
    )
}

export default StudySessionsScreen;