import 'react-native-gesture-handler';
import React, { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { View, Image, Dimensions } from 'react-native';

import colours from '../../config/colours'
import styles from './styles';

import ScrollLevels from './ScrollLevels.js';
import ExamBoardPage from './ExamBoardPage.js';
import SubjectsScroll from './SubjectsScroll.js';
import TopicsSelection from './TopicSelection.js';

import Svg, { Path } from "react-native-svg";

function InstaSetsPage({ navigation }) {
    return (
      <View style={styles.scrollDataContainer}>
        <ScrollLevels navigation={navigation}/>
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
      stroke={colours.primaryAccent}
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

function InstaSetsScreen() {
  const screenHeight = Dimensions.get('window').height;
  return(
    <Stack.Navigator initialRouteName='InstaSetsPage'
    screenOptions={{
      headerShadowVisible: false,
    }}
    >
      <Stack.Screen name="InstaSetsPage" component={InstaSetsPage} 
        options={{
          headerShown: true,
          title: "InstaSets",
          headerTitleStyle: { color: colours.titletext,         fontFamily: 'Lato',
fontSize: 24,  fontWeight: '600' },
          headerStyle: { height: screenHeight <= 800 ? 50 : 90, backgroundColor: colours.backgroundColour },
        }}
      /> 

      <Stack.Screen name="ExamBoardPage" component={ExamBoardPage} options={({route}) => ({
        headerBackImage:()=>(<SVGBackButton/>), 
        headerBackTitleVisible: false,
        title: "InstaSets",
        headerTitleStyle: { color: colours.titletext,         fontFamily: 'Lato',
fontSize: 24,  fontWeight: '600' },
        headerStyle: { height: screenHeight <= 800 ? 50 : 90, backgroundColor: colours.backgroundColour }})}
      />

      <Stack.Screen name="SubjectsScroll" component={SubjectsScroll} options={({route}) => ({
        headerBackImage:()=>(<SVGBackButton/>), 
        headerBackTitleVisible: false,
        title: "InstaSets",
        headerTitleStyle: { color: colours.titletext,         fontFamily: 'Lato',
fontSize: 24,  fontWeight: '600' },
        headerStyle: { height: screenHeight <= 800 ? 50 : 90, backgroundColor: colours.backgroundColour }})}
      />
      
      <Stack.Screen name="TopicsSelection" component={TopicsSelection} options={({route}) => ({
          headerBackImage:()=>(<SVGBackButton/>), 
          headerBackTitleVisible: false,
          title: "InstaSets",
          headerTitleStyle: { color: colours.titletext,         fontFamily: 'Lato',
fontSize: 24,  fontWeight: '600' },
          headerStyle: { height: screenHeight <= 800 ? 50 : 90, backgroundColor: colours.backgroundColour }})}
      />
    </Stack.Navigator>
  )
}

export default InstaSetsScreen;