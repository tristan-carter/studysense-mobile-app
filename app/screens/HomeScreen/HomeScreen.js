import 'react-native-gesture-handler';
import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { View, Image, Dimensions } from 'react-native';

import colours from '../../config/colours'
import styles from './styles';

import RevisionOptions from './RevisionSection/RevisionOptions.js';
import FolderPage from './FolderScreen.js';
import ScrollData from './ScrollData.js';
import CreateCardsPage from './CreateCardsPage/CreateCardsPage.js';

import Svg, { Path } from "react-native-svg";

import { setCurrentFolder, setCurrentSet } from '../../../firebase/userSlice';
import { setBottomNavShown } from '../../../firebase/userSlice.js';
import SmartStudy from './RevisionSection/SmartStudy';
import Test from './RevisionSection/Test';
import Refresher from './RevisionSection/Refresher';
import Flashcards from './RevisionSection/Flashcards';
import Games from './RevisionSection/Games';

const LogoTitle = () => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    {/*<Text style={{ color: colours.titletext, fontSize: 26, fontWeight: 'Bold', fontWeight: '600', fontFamily: 'AvenirNext-Heavy' }}>RevisionRocks</Text>*/}
    <Image
      source={require('../../assets/StudySenseLogoLongTransparent.png')}
      style={{
        bottom: 0,
        width: 190,
        height: 55,
      }}
      alt='Image Failed To Load'
    />
  </View>
);

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

function HomePage() {
  const navigation = useNavigation();
  return (
    <View style={styles.scrollDataContainer}>
      <ScrollData navigation={navigation} isFolder={false} />
    </View>
  );
}

const Stack = createStackNavigator();

function HomeScreen() {
  const screenHeight = Dimensions.get('window').height;

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const currentFolder = user.currentFolder;
  const currentSet = user.currentSet;
  var currentFolderName = null;
  if (currentFolder) {
    currentFolderName = user.data.folders.filter((folder) => folder.id === currentFolder)[0].name;
  }
  var currentSetName = null;
  if (currentSet && currentFolder) {
    currentSetName = user.data.folders.filter((folder) => folder.id === currentFolder)[0].sets.filter((set) => set.id === currentSet)[0].name;
  }
  else if (currentSet) {
    currentSetName = user.data.sets.filter((set) => set.id === currentSet)[0].name;
  }
  return(
    <Stack.Navigator initialRouteName='HomePage'
    screenOptions={{
      headerShadowVisible: false,
    }}
    >
      <Stack.Screen name="HomePage" component={HomePage} 
        options={{
          headerShown: true,
          headerStyle: { height: screenHeight <= 800 ? 50 : 90, backgroundColor: colours.backgroundColour },
          headerTitle: () => <LogoTitle />,
        }}
      /> 

      <Stack.Screen name="FolderPage" component={FolderPage} options={({route}) => ({
        headerBackImage:()=>(<SVGBackButton/>), 
        headerBackTitleVisible:false,
        title: currentFolderName,
        headerTitleStyle: { color: colours.titletext, fontSize: 28, fontFamily: 'Lato-Bold', fontWeight: '600' },
        headerStyle: { height: screenHeight <= 800 ? 50 : 90, backgroundColor: colours.backgroundColour }})}
        listeners={{
          beforeRemove: () => {
            dispatch(setCurrentFolder(null));
          },
        }}
      />
      <Stack.Screen name="RevisionOptions" component={RevisionOptions} options={({route}) => ({
        headerBackImage:()=>(<SVGBackButton/>),
        headerBackTitleVisible:false,
        title: currentSetName,
        headerTitleStyle: { color: colours.titletext, fontSize: screenHeight <= 700 ? 28 : 28, fontFamily: 'Lato-Bold', fontWeight: '600', alignSelf: 'flex-start' }, 
        headerStyle: { height: screenHeight <= 800 ? 50 : 90, backgroundColor: colours.backgroundColour }})}
        listeners={{
          focus: () => {
            dispatch(setBottomNavShown(false));
          },
          beforeRemove: () => {
            dispatch(setCurrentSet(null));
            dispatch(setBottomNavShown(true));
          },
        }}
      />
      <Stack.Screen name="CreateCardsPage" component={CreateCardsPage} options={({route}) => ({
        headerBackImage:()=>(<SVGBackButton/>),
        gestureEnabled: false,
        headerBackTitleVisible:false,
        title: route.params?.set.name || "Unknown Set",
        headerTitleStyle: { color: colours.titletext, fontSize: 28, fontFamily: 'Lato-Bold', fontWeight: '600' },
        headerStyle: { height: screenHeight <= 800 ? 50 : 90, backgroundColor: colours.backgroundColour }})}
        listeners={{
          focus: () => {
            dispatch(setBottomNavShown(false));
          },
        }}
      />
      <Stack.Screen name="Smart Study" component={SmartStudy} options={({route}) => ({
        headerBackImage:()=>(<SVGBackButton/>),
        gestureEnabled: false,
        headerBackTitleVisible:false,
        title: route.params?.set.name || "Unknown Set",
        headerTitleStyle: { color: colours.titletext, fontSize: 28, fontFamily: 'Lato-Bold', fontWeight: '600' },
        headerStyle: { height: screenHeight <= 800 ? 50 : 90, backgroundColor: colours.backgroundColour }})}
        listeners={{
          focus: () => {
            dispatch(setBottomNavShown(false));
            //dispatch(editSet({setId: route.params?.set.id, editedValues:  {lastRevised: new Date()}}));
          },
          beforeRemove: () => {
            dispatch(setBottomNavShown(true));
            //dispatch(editSet({setId: route.params?.set.id, editedValues:  {lastRevised: new Date()}}));
          },
        }}
      />
      <Stack.Screen name="Test" component={Test} options={({route}) => ({
        headerBackImage:()=>(<SVGBackButton/>),
        gestureEnabled: false,
        headerBackTitleVisible:false,
        title: route.params?.set.name || "Unknown Set",
        headerTitleStyle: { color: colours.titletext, fontSize: 28, fontFamily: 'Lato-Bold', fontWeight: '600' },
        headerStyle: { height: screenHeight <= 800 ? 50 : 90, backgroundColor: colours.backgroundColour }})}
        listeners={{
          focus: () => {
            dispatch(setBottomNavShown(false));
            //dispatch(editSet({setId: route.params?.set.id, editedValues:  {lastRevised: new Date()}}));
          },
          beforeRemove: () => {
            dispatch(setBottomNavShown(true));
            //dispatch(editSet({setId: route.params?.set.id, editedValues:  {lastRevised: new Date()}}));
          },
        }}
      />
      <Stack.Screen name="Refresher" component={Refresher} options={({route}) => ({
        headerBackImage:()=>(<SVGBackButton/>),
        gestureEnabled: false,
        headerBackTitleVisible:false,
        title: route.params?.set.name || "Unknown Set",
        headerTitleStyle: { color: colours.titletext, fontSize: 28, fontFamily: 'Lato-Bold', fontWeight: '600' },
        headerStyle: { height: screenHeight <= 800 ? 50 : 90, backgroundColor: colours.backgroundColour }})}
        listeners={{
          focus: () => {
            dispatch(setBottomNavShown(false));
            //dispatch(editSet({setId: route.params?.set.id, editedValues:  {lastRevised: new Date()}}));
          },
          beforeRemove: () => {
            dispatch(setBottomNavShown(true));
            //dispatch(editSet({setId: route.params?.set.id, editedValues:  {lastRevised: new Date()}}));
          },
        }}
      />
      <Stack.Screen name="Smart Flashcards" component={Flashcards} options={({route}) => ({
        headerBackImage:()=>(<SVGBackButton/>),
        gestureEnabled: false,
        headerBackTitleVisible:false,
        title: route.params?.set.name || "Unknown Set",
        headerTitleStyle: { color: colours.titletext, fontSize: 28, fontFamily: 'Lato-Bold', fontWeight: '600' },
        headerStyle: { height: screenHeight <= 800 ? 50 : 90, backgroundColor: colours.backgroundColour }})}
        listeners={{
          focus: () => {
            dispatch(setBottomNavShown(false));
            //dispatch(editSet({setId: route.params?.set.id, editedValues:  {lastRevised: new Date()}}));
          },
          beforeRemove: () => {
            dispatch(setBottomNavShown(true));
            //dispatch(editSet({setId: route.params?.set.id, editedValues:  {lastRevised: new Date()}}));
          },
        }}
      />
      <Stack.Screen name="Games" component={Games} options={({route}) => ({
        headerBackImage:()=>(<SVGBackButton/>),
        gestureEnabled: false,
        headerBackTitleVisible:false,
        title: route.params?.set.name || "Unknown Set",
        headerTitleStyle: { color: colours.titletext, fontSize: 28, fontFamily: 'Lato-Bold', fontWeight: '600' },
        headerStyle: { height: 90, backgroundColor: colours.backgroundColour }})}
        listeners={{
          focus: () => {
            dispatch(setBottomNavShown(false));
            //dispatch(editSet({setId: route.params?.set.id, editedValues:  {lastRevised: new Date()}}));
          },
          beforeRemove: () => {
            dispatch(setBottomNavShown(true));
            //dispatch(editSet({setId: route.params?.set.id, editedValues:  {lastRevised: new Date()}}));
          },
        }}
      />
        
    </Stack.Navigator>
  )
}

export default HomeScreen;