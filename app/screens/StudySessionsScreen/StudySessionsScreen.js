import React, { useState, useRef, useEffect } from 'react';
import { View, Dimensions, TouchableOpacity, Text, Modal, TextInput, Alert, PermissionsAndroid, NativeModules } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { BarChart } from "react-native-gifted-charts";
import notifee, { AndroidImportance } from '@notifee/react-native';
import BackgroundTimer from 'react-native-background-timer';


import { useDispatch, useSelector } from 'react-redux';
import { saveUser, setUser } from '../../../firebase/userSlice';
import { setStudySessionsTimeLeft } from '../../../firebase/userSlice';

import DuringStudySession from './DuringStudySession';
import ClaimStudySession from './ClaimStudySession';
import DuringStudySessionBreak from './DuringStudySessionBreak';
import ClaimStudySessionBreak from './ClaimStudySessionBreak';

import Ionicons from 'react-native-vector-icons/Ionicons';

import styles from './styles';
import colours from '../../config/colours'


const MINUTE_IN_MILLISECONDS = 60000;
const SECOND_IN_MILLISECONDS = 1000;

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

  function getDayLabel(date) {
    const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    return days[date.getDay()];
  }

  function getLast7Days() {
    const today = new Date();
    today.setHours(0, 0, 0, 1); 
    const todayLabel = getDayLabel(today);

    const last7Days = [];
    for (let i = 0; i < 7; i++) {
        const day = new Date(today.getTime() - i * 23 * 60 * 60 * 1000);
        last7Days.unshift(getDayLabel(day));
    }

    return last7Days;
  }


  function getPastStudySessionsForLast7Days() {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day

    // Get last 7 days of sessions
    const last7Days = getLast7Days();
    const past7DaysSessions = data.pastStudySessions.filter(session => now - session.startTime < 7 * oneDay);

    const sessionsList = last7Days.map(day => ({ label: day, value: 0 }));
    past7DaysSessions.forEach(session => {
        const dayLabel = getDayLabel(new Date(session.startTime));
        const existingDay = sessionsList.find(item => item.label === dayLabel);
        existingDay.value += session.length;
    });

    return sessionsList;
  }

  function getPastSessionsFormatted() {
    sessionsList = getPastStudySessionsForLast7Days();
    for (let i = 0; i < sessionsList.length; i++) {
      sessionsList[i].label = sessionsList[i].label.substring(0, 1);
      if (sessionsList[i].value >= data.studySessionsGoals.daily) {
        sessionsList[i].frontColor = colours.primaryAccent;
      }
      else if (sessionsList[i].value == 0) {
        sessionsList[i].value = 0.7;
      }
    }
    return sessionsList;
  }

  const barData = getPastSessionsFormatted();

  // calculate the total time studied today, this week, this month, this year
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day

  var totalToday = {
    value: data.pastStudySessions.filter(session => {
        var today = new Date();
        today.setHours(0,0,0,0);
        var sessionDate = new Date(session.startTime);
        sessionDate.setHours(0,0,0,0);
        return +today === +sessionDate;
    }).reduce((acc, session) => acc + session.length, 0),
    type: "mins",
};
  var totalThisWeek = {
    value: data.pastStudySessions.filter(session => now - session.startTime < 7 * oneDay).reduce((acc, session) => acc + session.length, 0),
    type: "mins",
  };
  var totalThisMonth = {
    value: data.pastStudySessions.filter(session => now - session.startTime < 30 * oneDay).reduce((acc, session) => acc + session.length, 0),
    type: "mins",
  };
  var totalThisYear = {
    value: data.pastStudySessions.filter(session => now - session.startTime < 365 * oneDay).reduce((acc, session) => acc + session.length, 0),
    type: "mins",
  };

  // converts totals to either hours if more than 60 minutes or to minutes if less than 60 minutes
  if (totalToday >= 60) {
    totalToday = {
      value: (totalToday / 60),
      type: "hours",
    };
  }
  if (totalThisWeek >= 60) {
    totalThisWeek = {
      value: (totalThisWeek / 60),
      type: "hours",
    };
  }
  if (totalThisMonth >= 60) {
    totalThisMonth = {
      value: (totalThisMonth / 60),
      type: "hours",
    };
  }
  if (totalThisYear >= 60) {
    totalThisYear = {
      value: (totalThisYear / 60),
      type: "hours",
    };
  }
  // rounds to 2 significant figures but without trailing zeros
  totalToday.value = totalToday.value.toFixed(2).replace(/\.?0+$/, '');
  totalThisWeek.value = totalThisWeek.value.toFixed(2).replace(/\.?0+$/, '');
  totalThisMonth.value = totalThisMonth.value.toFixed(2).replace(/\.?0+$/, '');
  totalThisYear.value = totalThisYear.value.toFixed(2).replace(/\.?0+$/, '');

  const [showLengthModal, setShowLengthModal] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(data.studySessionsGoals.daily);
  const newLength = useRef();
  const newLengthType = useRef();

  let newMaxDayThisWeek = data.pastStudySessions
  .filter(session => now - new Date(session.startTime).getTime() < 7 * oneDay)
  .reduce((acc, session) => session.length > acc ? session.length : acc, 0);
  if (newMaxDayThisWeek < data.studySessionsGoals.daily) {
    newMaxDayThisWeek = data.studySessionsGoals.daily;
  }
  // round maxDayThisWeek up to the nearest 40
  newMaxDayThisWeek = Math.ceil(newMaxDayThisWeek / 40) * 40;
  const [maxDayThisWeek, setMaxDayThisWeek] = useState(newMaxDayThisWeek);

  // calculate the max day this week if daily goal or past sessions is changed 

  useEffect(() => {
    let newMaxDayThisWeek = data.pastStudySessions
    .filter(session => now - new Date(session.startTime).getTime() < 7 * oneDay)
    .reduce((acc, session) => session.length > acc ? session.length : acc, 0);
    if (newMaxDayThisWeek < data.studySessionsGoals.daily) {
      newMaxDayThisWeek = data.studySessionsGoals.daily;
    }
    // round maxDayThisWeek up to the nearest 40
    newMaxDayThisWeek = Math.ceil(newMaxDayThisWeek / 40) * 40;
    setMaxDayThisWeek(newMaxDayThisWeek);
  }, [data.studySessionsGoals.daily, data.pastStudySessions]);

  async function requestUserPermissionIOS() {
    await notifee.requestPermission()
  }

  return (
    <>
      <View style={styles.container}>
        <View style={[styles.currentSessionView, {
          marginTop: 8,
        }]}>
          <View style={styles.currentSessionTextContainer}>
            <Text style={styles.currentSessionTitle}>Edit session</Text>
          </View>

          <View style={styles.currentSessionTextContainer}>
            <Text style={styles.currentSessionText}>Session length: {data.currentSessionPreset.length} mins</Text>
            <TouchableOpacity
            onPress={()=>{
              newLengthType.current = 'Session';
              newLength.current = data.currentSessionPreset.length.toString();
              setShowLengthModal(true);
            }}>
              <Ionicons name="create-outline" size={24} color={colours.darkgray} />
            </TouchableOpacity>
          </View>

          <View style={styles.currentSessionTextContainer}>
            <Text style={styles.currentSessionText}>Break length: {data.currentSessionPreset.breakLength} mins</Text>
            <TouchableOpacity
            onPress={()=>{
              newLengthType.current = 'Break';
              newLength.current = data.currentSessionPreset.breakLength.toString();
              setShowLengthModal(true);
            }}>
              <Ionicons name="create-outline" size={24} color={colours.darkgray} />
            </TouchableOpacity>
          </View>

          <View style={styles.currentSessionTextContainer}>
              <Text style={styles.currentSessionText}>Focus mode: </Text>
              <BouncyCheckbox
                size={22}
                isChecked={focus}
                onPress={() => {
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
                fillColor={colours.primaryAccent}
                unfillColor={colours.backgroundAccent}
              />
          </View>
        </View>

        <BarChart
          key={maxDayThisWeek}
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
          referenceLine1Position={dailyGoal}
          referenceLine1Config={{
            color: colours.darkgray,
            dashWidth: 8,
            dashGap: 5,
            dashThickness: 5,
          }}
        />
        
        <TouchableOpacity
          style={[styles.button, {
            shadowOpacity: 1,
            shadowColor: 'rgba(0, 0, 0, 0.15)',
          }]}
          onPress={()=>{
            // checks if on android and requests permission
            if (Platform.OS === 'android') {
              PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
            } else {
              requestUserPermissionIOS();
            }
            dispatch(saveUser(
              {
                ...data,
                currentSession: {
                  length: data.currentSessionPreset.length,
                  breakLength: data.currentSessionPreset.breakLength,
                  focusMode: data.currentSessionPreset.focusMode,
                  startTime: Date.now(),
                  breakStartTime: null,
    
                  hasClaimedSession: false,
                  hasClaimedBreak: false,
                }
              }
            ));
          }}>
          <Text
            style={{
              color: colours.white,
              fontFamily: 'Lato',
              fontSize: 21,
              fontWeight: '500',
            }}
          >Start session</Text>
        </TouchableOpacity>
          
        <TouchableOpacity
          style={[styles.button, {backgroundColor: colours.backgroundAccent}]}
          onPress={()=>{
            newLengthType.current = 'Daily Goal';
            newLength.current = data.studySessionsGoals.daily.toString();
            setShowLengthModal(true);
          }}>
          <Text
            style={{
              color: colours.black,
              fontFamily: 'Lato',
              fontSize: 21,
              fontWeight: '400',
            }}
          >Set new goal</Text>
        </TouchableOpacity>

        <View style={styles.currentSessionView}>
          <Text style={styles.currentSessionTitle}>You've studied</Text>
          
          <Text
            style={styles.currentSessionText}
          >Today: {totalToday.value} {totalToday.type}</Text>
          <Text
            style={styles.currentSessionText}
          >Past week: {totalThisWeek.value} {totalThisWeek.type}</Text>
          <Text
            style={styles.currentSessionText}
          >Past month: {totalThisMonth.value} {totalThisMonth.type}</Text>
          <Text
            style={styles.currentSessionText}
          >Past year: {totalThisYear.value} {totalThisYear.type}</Text>
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
                  // MUST BE UNCOMMENTED FOR FINAL BUILD
                  /*if (intNewLength < 5) {
                    Alert.alert('Invalid Session Length', 'Please enter a session length of at least 5 minutes');
                    return;
                  }
                  if (intNewLength > 120) {
                    Alert.alert('Invalid Session Length', 'Please enter a session length of 120 minutes or less');
                    return;
                  }*/
                  dispatch(setUser({
                    ...data,
                    currentSessionPreset: {
                      ...data.currentSessionPreset,
                      length: intNewLength,
                    }
                  }));
                }
                else if (newLengthType.current == 'Break') {
                  if (intNewLength < 1) {
                    Alert.alert('Invalid Break Length', 'Please enter a break length of at least 1 minute');
                    return;
                  }
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
                  setDailyGoal(parseInt(newLength.current));
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

const { StudyCountdownWidgetModule } = NativeModules;

function StudySessionsScreen({ navigation }) {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.user);
  const currentSession = state.data.currentSession;
  const timeLeft = state.timeLeft;
  const screenHeight = Dimensions.get('window').height;
  const inSession = currentSession != null && !currentSession.hasClaimedBreak

  const [sessionFinished, setSessionFinished] = useState(false);
  const [breakFinished, setBreakFinished] = useState(false);

  const liveActivityShown = useRef(false);


  // calculates whether the session or break is finished, and updates the time left state for those screens
  const calcWhatsFinished = () => {
    if (currentSession != null && currentSession.startTime != null) {
      // calculates time left in seconds
      const newTimeLeft = Math.ceil((currentSession.length * MINUTE_IN_MILLISECONDS - (Date.now() - currentSession.startTime)) / SECOND_IN_MILLISECONDS);
      if (newTimeLeft <= 0) {
        setSessionFinished(true);
      } else {
        setSessionFinished(false);
        dispatch(setStudySessionsTimeLeft(newTimeLeft));
      }
    }

    if (currentSession != null && currentSession.breakStartTime != null) {
      // calculates time left in seconds
      const newTimeLeft = Math.ceil((currentSession.breakLength * MINUTE_IN_MILLISECONDS - (Date.now() - currentSession.breakStartTime)) / SECOND_IN_MILLISECONDS);
      if (newTimeLeft <= 0) {
        setBreakFinished(true);
      } else {
        setBreakFinished(false);
        dispatch(setStudySessionsTimeLeft(newTimeLeft));
      }
    }
  }

  useEffect(() => {
    calcWhatsFinished();
    const intervalId = setInterval(() => {
      calcWhatsFinished();
    }, 1000); // updates every second
    return () => clearInterval(intervalId);
  }, [currentSession]);

  // IOS Live Activities
  useEffect(() => {
    // stops live activities for session or break
    if (!currentSession || currentSession.hasClaimedBreak === true 
      || (currentSession.hasClaimedSession === true && currentSession.breakStartTime === null)
      || timeLeft <= 0
      || (Date.now() - currentSession.startTime > currentSession.length * MINUTE_IN_MILLISECONDS) ) {
        console.log("stopping live activity");
        liveActivityShown.current = false;
        StudyCountdownWidgetModule.stopLiveActivity();
    }

    // starts live activities for session or break
    if (currentSession && currentSession.startTime
      && currentSession.hasClaimedSession !== true
      && liveActivityShown.current === false
      && Math.ceil((currentSession.length * MINUTE_IN_MILLISECONDS - (Date.now() - currentSession.startTime)) / SECOND_IN_MILLISECONDS) > 0) {
        console.log("starting live activity");
        liveActivityShown.current = true;
        StudyCountdownWidgetModule.startLiveActivity(currentSession.startTime / 1000 + currentSession.length * 60, false);
    }
    else if (currentSession && currentSession.breakStartTime
      && currentSession.hasClaimedSession === true
      && currentSession.hasClaimedBreak !== true
      && liveActivityShown.current === false
      && Math.ceil((currentSession.breakLength * MINUTE_IN_MILLISECONDS - (Date.now() - currentSession.breakStartTime)) / SECOND_IN_MILLISECONDS) > 0) {
        console.log("starting live activity break");
        liveActivityShown.current = true;
        StudyCountdownWidgetModule.startLiveActivity(currentSession.breakStartTime / 1000 + currentSession.breakLength * 60, true);
    }
  }, [currentSession, timeLeft]);

  // Android only notifications, incomplete, for ios using live activities
  /*
  const displayNotification = async (timerSeconds) => {
    const channelId = await notifee.createChannel({
      id: 'timer',
      name: 'Timer Notifications',
      importance: AndroidImportance.HIGH,
      sound: 'none',
      vibration: false, 
    });
  
    notifee.displayNotification({
      title: 'Session time left',
      body: formatTime(timerSeconds),
      android: {
        channelId,
        ongoing: true, // Keep notification persistent
        showTimestamp: false,
        color: colours.primary,
      },
      ios: {
        _displayInForeground: false,
        vibration: false,
        sound: 'default',
      },
    });
  }
  
  // Formats the time in seconds to MM:SS
  const formatTime = (seconds) => { 
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }


  // background timer for notifications
  useEffect(() => {
    // Checks if the session or break is in progress
    let sentFinishedNotification = false;
    if (inSession === true && !(timeLeft <= 0 || currentSession.hasClaimedSession === true)) {
      sentFinishedNotification = false;
      BackgroundTimer.runBackgroundTimer(() => {
        // Checks if the time left is in 10 second intervals
        const newTimeLeft = Math.ceil((currentSession.length * MINUTE_IN_MILLISECONDS - (Date.now() - currentSession.startTime)) / SECOND_IN_MILLISECONDS);
        console.log(newTimeLeft);
        console.log("sent finished notification: " + sentFinishedNotification)
        if ((newTimeLeft <= 0 || inSession === false) && sentFinishedNotification === false) {
          BackgroundTimer.stopBackgroundTimer();
          sentFinishedNotification = true;
          // Trigger final notification for timer completion
          notifee.displayNotification({
            title: 'Session finished',
            body: 'Time to take a break!',
            android: {
              channelId: 'timer',
              ongoing: false,
              showTimestamp: false,
              color: colours.primary,
              showChronometer: false,
            },
          });
        } else if (newTimeLeft % 10 === 0) {
          displayNotification(newTimeLeft);
        }
      }, 5000); // Update every second
      return () => {
        BackgroundTimer.stopBackgroundTimer();
      };
    }
  }, [inSession, sessionFinished, breakFinished]);*/

  return(
    <Stack.Navigator initialRouteName='StudySessionsMainPage'
    screenOptions={{
      headerShadowVisible: false,
    }}
    >
      {inSession ? (


          !currentSession.hasClaimedSession ? (
            
            sessionFinished ? (
                <Stack.Screen name="ClaimStudySession" component={ClaimStudySession} 
                  options={{
                    headerShown: true,
                    title: "Study Sessions",
                    headerTitleStyle: { color: colours.titletext, fontFamily: 'Lato', fontSize: 24, fontWeight: '600' },
                    headerStyle: { height: screenHeight <= 800 ? 50 : 90, backgroundColor: colours.backgroundColour },
                  }}
                />
              ) : (
                <Stack.Screen name="DuringStudySession" component={DuringStudySession} 
                  options={{
                    headerShown: true,
                    title: "Study Sessions",
                    headerTitleStyle: { color: colours.titletext, fontFamily: 'Lato', fontSize: 24, fontWeight: '600' },
                    headerStyle: { height: screenHeight <= 800 ? 50 : 90, backgroundColor: colours.backgroundColour },
                  }}
                />
              )

          ) : (

            breakFinished ? (
              <Stack.Screen name="ClaimStudySessionBreak" component={ClaimStudySessionBreak} 
                options={{
                  headerShown: true,
                  title: "Study Sessions",
                  headerTitleStyle: { color: colours.titletext, fontFamily: 'Lato', fontSize: 24, fontWeight: '600' },
                  headerStyle: { height: screenHeight <= 800 ? 50 : 90, backgroundColor: colours.backgroundColour },
                }}
              />
          ) : (
            <Stack.Screen name="DuringStudySessionBreak" component={DuringStudySessionBreak} 
              options={{
                headerShown: true,
                title: "Study Sessions",
                headerTitleStyle: { color: colours.titletext, fontFamily: 'Lato', fontSize: 24, fontWeight: '600' },
                headerStyle: { height: screenHeight <= 800 ? 50 : 90, backgroundColor: colours.backgroundColour },
              }}
            />
          )

        )
      ) : (


      <Stack.Screen name="StudySessionsMainPage" component={StudySessionsPage} 
        options={{
          headerShown: true,
          title: "Study Sessions",
          headerTitleStyle: { color: colours.titletext, fontFamily: 'Lato', fontSize: 24, fontWeight: '600' },
          headerStyle: { height: screenHeight <= 800 ? 50 : 90, backgroundColor: colours.backgroundColour },
        }}
      /> 
    )}
    </Stack.Navigator>
  )
}

export default StudySessionsScreen;