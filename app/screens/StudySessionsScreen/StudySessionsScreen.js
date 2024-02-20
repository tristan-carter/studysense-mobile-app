import React, { useState, useRef, useEffect } from 'react';
import { View, Dimensions, TouchableOpacity, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import CheckBox from '@react-native-community/checkbox';
import { BarChart } from "react-native-gifted-charts";

import { useDispatch, useSelector } from 'react-redux';
import { setCurrentSession, saveUser } from '../../../firebase/userSlice';

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
        name: "Studying",
        focusMode: false,
      },
    }));
  }

  const [focus, setFocus] = useState(data.currentSessionPreset.focusMode);

  useEffect(() => {
    dispatch(setCurrentSession({
      name: data.currentSessionPreset.name,
      length: data.currentSessionPreset.length,
      breakLength: data.currentSessionPreset.breakLength,
      focusMode: data.currentSessionPreset.focusMode,
      startTime: null,
      completed: false,
    }));
  }, []);

  const currentSession = state.currentSession;

  function getDayLabel(date) {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return days[date.getDay()];
  }

  function getPastStudySessionsForLast7Days() {
    /*const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day

    // Get last 7 days of sessions
    const past7DaysSessions = data.pastStudySessions.filter(session => now - session.date < 7 * oneDay);

    const sessionsList = [];
    past7DaysSessions.forEach(session => {
        const dayLabel = getDayLabel(new Date(session.date));
        const existingDay = sessionsList.find(item => item.label === dayLabel);
        if (existingDay) {
            existingDay.value += session.length;
        } else {
            sessionsList.push({ label: dayLabel, value: session.length });
        }
    });*/

    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
    const today = new Date();
    const past7DaysSessions = [];

    data.pastStudySessions.forEach(session => {
        if (today - session.date <= 7 * oneDay) {
            past7DaysSessions.push(session);
        }
    });

    const sessionsList = {
        'M': 0,
        'T': 0,
        'W': 0,
        'T': 0,
        'F': 0,
        'S': 0,
        'S': 0,
    };

    // Populate sessionsList with study session lengths for each day
    past7DaysSessions.forEach(session => {
        const dayLabel = getDayLabel(new Date(session.date));
        sessionsList[dayLabel] += session.length;
    });

    return sessionsList;
  }

  function getPastSessionsFormatted() {
    sessionsList = getPastStudySessionsForLast7Days();
    console.log(sessionsList)
    for (let i = 0; i < sessionsList.length; i++) {
      if (sessionsList[i].value > data.studySessionsGoals.daily) {
        sessionsList[i].frontColor = colours.primary;
      }
      else if (sessionsList[i].value == 0) {
        sessionsList[i].value = 1;
      }
    }
  }

  const barData = getPastSessionsFormatted();

  /*const barData = [
    {value: 0, label: 'M'},
    {value: 0, label: 'T', frontColor: colours.primary},
    {value: 0, label: 'W', frontColor: colours.primary},
    {value: 0, label: 'T'},
    {value: 0, label: 'F', frontColor: colours.primary},
    {value: 0, label: 'S'},
    {value: 0, label: 'S'},
  ];*/
  return (
      <View style={styles.container}>
        <View style={styles.currentSessionView}>
          <View style={styles.currentSessionTextContainer}>
            <Text style={styles.currentSessionTitle}>session name: {currentSession.name}</Text>
            <TouchableOpacity
            onPress={()=>{
              
            }}>
              <Ionicons name="create-outline" size={23} color={colours.darkgray} />
            </TouchableOpacity>
          </View>

          <View style={styles.currentSessionTextContainer}>
            <Text style={styles.currentSessionText}>session length: {currentSession.length} mins</Text>
            <TouchableOpacity
            onPress={()=>{
              
            }}>
              <Ionicons name="create-outline" size={23} color={colours.darkgray} />
            </TouchableOpacity>
          </View>

          <View style={styles.currentSessionTextContainer}>
            <Text style={styles.currentSessionText}>break length: {currentSession.breakLength} mins</Text>
            <TouchableOpacity
            onPress={()=>{
              
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
                  dispatch(setCurrentSession({
                    ...currentSession,
                    focusMode: !focus,
                  }));
                }}
                tintColors={{true: colours.darkPrimary, false: colours.incorrectRed}}
              />
          </View>
        </View>

        <BarChart
          barWidth={23}
          noOfSections={120/30}
          barBorderRadius={4}
          frontColor="lightgray"
          data={barData}
          yAxisThickness={0}
          xAxisThickness={0}
          maxValue={120}

          hideRules
          showReferenceLine1
          referenceLine1Position={90}
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

          }}>
          <Text
            style={{color: colours.white, fontSize: 20, fontFamily: 'Lato-Bold'}}
          >Start Session</Text>
        </TouchableOpacity>
          
        <TouchableOpacity
          style={[styles.button, {backgroundColor: colours.blue}]}
          onPress={()=>{

          }}>
          <Text
            style={{color: colours.white, fontSize: 20, fontFamily: 'Lato-Bold'}}
          >Set New Goal</Text>
        </TouchableOpacity>

        <View style={styles.currentSessionView}>
          <Text style={styles.currentSessionTitle}>You've Studied</Text>
          
          <Text
            style={styles.currentSessionText}
          >today: {30} mins</Text>
          <Text
            style={styles.currentSessionText}
          >this week: {}13hrs 50 mins</Text>
          <Text
            style={styles.currentSessionText}
          >this month: {}2 days 17hrs</Text>
          <Text
            style={styles.currentSessionText}
          >this year: {}1 week 5 days</Text>
        </View>
      </View>
  );
}

const SVGBackButton = (props) => (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={44}
      height={44}
      left={8}
      top={8}
      fill="none"
      stroke="salmon"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      className="feather feather-arrow-left"
      {...props}
    >
      <Path d="M19 12H5M12 19l-7-7 7-7" />
    </Svg>
)

const Stack = createStackNavigator();

function StudySessionsScreen({ navigation }) {
    const screenHeight = Dimensions.get('window').height;
    return(
      <Stack.Navigator initialRouteName='InstaSetsPage'
      screenOptions={{
        headerShadowVisible: false,
      }}
      >
        <Stack.Screen name="InstaSetsPage" component={StudySessionsPage} 
          options={{
            headerShown: true,
            title: "Study Sessions",
            headerTitleStyle: { color: colours.titletext, fontSize: 28, fontFamily: 'Lato-Bold', fontWeight: '600' },
            headerStyle: { height: screenHeight <= 800 ? 50 : 90, backgroundColor: colours.backgroundColour },
          }}
        /> 
      </Stack.Navigator>
    )
}

export default StudySessionsScreen;