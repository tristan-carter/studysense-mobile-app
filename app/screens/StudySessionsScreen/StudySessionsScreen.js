import React, { useState, useRef } from 'react';
import { View, Dimensions, TouchableOpacity, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import CheckBox from '@react-native-community/checkbox';
import { BarChart } from "react-native-gifted-charts";

import Ionicons from 'react-native-vector-icons/Ionicons';

import styles from './styles';
import colours from '../../config/colours'

function StudySessionsPage({ navigation }) {
  const currentSession = useRef({
    title: "Studying",
    length: 30,
    breakLength: 5,
    date: null,
    focusMode: false,
  })
  const [focusMode, setFocusMode] = useState(false);

  const barData = [
    {value: 80, label: 'M'},
    {value: 100, label: 'T', frontColor: colours.primary},
    {value: 120, label: 'W', frontColor: colours.primary},
    {value: 60, label: 'T'},
    {value: 100, label: 'F', frontColor: colours.primary},
    {value: 1, label: 'S'},
    {value: 1, label: 'S'},
];
  return (
      <View style={styles.container}>
        <View style={styles.currentSessionView}>
          <View style={styles.currentSessionTextContainer}>
            <Text style={styles.currentSessionTitle}>session name: {currentSession.current.title}</Text>
            <TouchableOpacity
            onPress={()=>{
              
            }}>
              <Ionicons name="create-outline" size={23} color={colours.darkgray} />
            </TouchableOpacity>
          </View>

          <View style={styles.currentSessionTextContainer}>
            <Text style={styles.currentSessionText}>session length: {currentSession.current.length} mins</Text>
            <TouchableOpacity
            onPress={()=>{
              
            }}>
              <Ionicons name="create-outline" size={23} color={colours.darkgray} />
            </TouchableOpacity>
          </View>

          <View style={styles.currentSessionTextContainer}>
            <Text style={styles.currentSessionText}>break length: {currentSession.current.breakLength} mins</Text>
            <TouchableOpacity
            onPress={()=>{
              
            }}>
              <Ionicons name="create-outline" size={23} color={colours.darkgray} />
            </TouchableOpacity>
          </View>

          <View style={[styles.currentSessionTextContainer, {gap: 0}]}>
              <Text style={styles.currentSessionText}>focus mode: </Text>
              <CheckBox
                value={focusMode}
                onValueChange={() => {
                  currentSession.current.focusMode = !focusMode;
                  setFocusMode(!focusMode);
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