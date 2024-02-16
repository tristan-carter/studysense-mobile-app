import React from 'react';
import { View, Dimensions } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';

import styles from './styles';
import colours from '../../config/colours'

function StudySessionsPage({ navigation }) {
    return (
        <View style={styles.container}>
            
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