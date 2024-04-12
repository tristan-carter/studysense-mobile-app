import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';

import auth from "@react-native-firebase/auth";

import { useSelector } from 'react-redux';

import Svg, { Path } from "react-native-svg";

import styles from './styles';
import colours from '../../config/colours';

import SettingsPage from './SettingsPage';

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

const ProfilePage = ({ navigation }) => {
  const user = useSelector((state) => state.user);
  const email = auth().currentUser && auth().currentUser.email ? auth().currentUser.email : "No email found";
  const isGoogleUser = user.data.isGoogleUser;
  return (
    <View style={styles.container}>
      {/* Display user information here */}
      <Text style={styles.text}>{user.data.username}</Text>
      <Text style={styles.text}>{!isGoogleUser ? email : "Google Account"}</Text>
      <View style={styles.divider}/>
      <Text style={styles.text}>Account Since -</Text>
      <Text style={styles.text}>{user.data.accountCreationDateTime}</Text>
      <View style={styles.divider}/>
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => navigation.navigate('Settings')}
      >
        <Text style={styles.buttonText}>Go to Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

function ProfileScreen({ navigation }) {
  return (
      <Stack.Navigator>
          <Stack.Screen name="Profile" component={ProfilePage}
          options={({route}) => ({ headerBackImage:()=>(<SVGBackButton/>), headerBackTitleVisible:false, headerTitleStyle: { color: colours.titletext,         fontFamily: 'Lato',
fontSize: 24, fontWeight: 'Bold', fontWeight: '600' }, headerStyle: { height: 90, backgroundColor: colours.backgroundColour }})}
          />
          <Stack.Screen name="Settings" component={SettingsPage} 
          options={({route}) => ({ headerBackImage:()=>(<SVGBackButton/>), headerBackTitleVisible:false,  headerTitleStyle: { color: colours.titletext,         fontFamily: 'Lato',
fontSize: 24, fontWeight: 'Bold', fontWeight: '600' }, headerStyle: { height: 90, backgroundColor: colours.backgroundColour }})}
        />
      </Stack.Navigator>
  );
}

export default ProfileScreen;