import React, { useState, useRef } from 'react';
import { View, Dimensions, TouchableOpacity, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import CheckBox from '@react-native-community/checkbox';

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
  return (
      <View style={styles.container}>
        <View style={styles.currentSessionView}>
          <View style={styles.currentSessionTextContainer}>
            <Text style={styles.currentSessionTitle}>session name: {currentSession.current.title}</Text>
            <TouchableOpacity
            style={styles.currentSessionEditButton}
            onPress={()=>{
              
            }}>
              <Text style={styles.currentSessionEditText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.currentSessionTextContainer}>
            <Text style={styles.currentSessionText}>session length: {currentSession.current.length}</Text>
            <TouchableOpacity
            style={styles.currentSessionEditButton}
            onPress={()=>{
              
            }}>
              <Text style={styles.currentSessionEditText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.currentSessionTextContainer}>
            <Text style={styles.currentSessionText}>breakLength: {currentSession.current.breakLength}</Text>
            <TouchableOpacity
            style={styles.currentSessionEditButton}
            onPress={()=>{

            }}>
              <Text style={styles.currentSessionEditText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.currentSessionTextContainer, {gap: 4}]}>
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