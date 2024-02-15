import React, { useEffect, useState, useRef } from 'react';

// external packages
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getHeaderTitle } from '@react-navigation/elements';

import { TouchableOpacity, View, Text, ActivityIndicator, AppState, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { saveUser, fetchSharedSetData, setBottomNavShown, setCreatingNewSetFromNoSets } from './firebase/userSlice';
import { addFolder } from './firebase/foldersSlice';
//import { Configuration, OpenAIApi } from "openai";

import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from "react-native-svg"

header: ({ navigation, route, options }) => {
  const title = getHeaderTitle(options, route.name);
  
  return <MyHeader title={title} style={options.headerStyle}/>;
};

import Ionicons from 'react-native-vector-icons/Ionicons';
import colours from './app/config/colours';

// screens
import { LoginScreen, RegistrationScreen, HomeScreen, InstaSetsScreen, ProfileScreen, StudySessionsScreen } from './app/screens';
import { CreateFileModal } from './app/screens/HomeScreen/Modals/CreateFileModal';
import { useAuthentication } from './firebase/useAuthentication';
import { SmartSetModal } from './app/screens/HomeScreen/Modals/SmartSetModal';
import { SetImportModal } from './app/screens/HomeScreen/Modals/SetImportModal';
import { SheetManager } from 'react-native-actions-sheet';

import {PermissionsAndroid} from 'react-native';
PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const ButtonScreen = () => null;

const AddFileIconButton = ({ onPress }) => {
  return(
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <TouchableOpacity onPress={onPress}>
        <Ionicons name={"add-circle-outline"} size={35} color={'darkgrey'} />
      </TouchableOpacity>
    </View>
  )
}

/*try {
  const configuration = new Configuration({
      organization: "org-DEyeUsEnMQ91vprnQhfTC3CN",
      apiKey: BAD_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai.listEngines();
  const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "string" }],
      model: "gpt-3.5-turbo",
  });
} catch (error) {
  console.error("An error occurred:", error);
}*/

async function handleImport (wholeSetCode, newName, dispatch, importingSet) {
  if (wholeSetCode != "") {
    const parts = wholeSetCode.split("/");
    const userId = parts[0];
    const setCode = parts[1];
    let set = await dispatch(fetchSharedSetData([setCode, userId]));
    set = set.payload.payload;
    set = set.cards.map((card, index) => {
      const newCard = {...card};
      if (index==0) {return card}
      newCard.levelLearned = 0;
      newCard.correct = 0;
      newCard.incorrect = 0;
      newCard.totalCorrect = 0;
      newCard.totalIncorrect = 0;
      return newCard;
    });

    if (set == null) {
      alert("Set not found");
    } else {
      importingSet.current = set;
    }
  } else {
    alert("Please enter a set code");
  }
}

function HomeTabs(props) {
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const importingSet = useRef(["null"]);
  const setOrFolderText = creatingFolder ? "Folder" : "Set";
  const navigation = useNavigation();
  const newName = useRef("");
  const newDescription = useRef("null");
  const newIcon = useRef("null");
  const [isPrivate, setIsPrivate] = useState(false);
  const inputRef = useRef(null);

  const [showSmartSetModal, setShowSmartSetModal] = useState(false);
  const generatedCards = useRef(["null"]);

  const generateID = () => {
      const randomString = Math.random().toString(36).substr(2, 10);
      const timestamp = Date.now().toString(36);
      const ID = randomString + timestamp;
      return ID;
  };

  const handleCreate = () => {
    if (newName.current != "") {
      setShowModal(false);
      const newid = generateID();
      if (creatingFolder) {
          dispatch(addFolder({
              folderId: newid,
              name: newName.current,
              icon: newIcon.current,
          }));
      } else {
          navigation.push('CreateCardsPage', {set: { setId: newid, name: newName.current, cards: importingSet.current, icon: newIcon.current, description: newDescription.current, isPrivate: isPrivate }, editOrCreate: "Create"});
      };
    } else {
        alert("Please enter a name for your " + setOrFolderText.toLowerCase());
        inputRef.current.focus();
    }
  };
  
  const handleGenerateSmartSet = () => {
      setShowModal(false);
      setShowSmartSetModal(true);
  };

  const handleOpenModal = () => {
    newName.current="";
    newDescription.current="null";
    newIcon.current="null";
    importingSet.current=["null"];
    setIsPrivate(false);
    setShowModal(true);
  }
  const showActionSheet = async () => {
    chosenOption = await SheetManager.show("NewFileActionSheet");
    switch (chosenOption) {
      case "NewSet":
        handleOpenModal();
        setCreatingFolder(false);
        break;
      case "NewFolder":
        handleOpenModal();
        setCreatingFolder(true);
        break;
    }
      /*const options = ['New Set', 'New Folder', 'Cancel'];
      const cancelButtonIndex = 2;

      showActionSheetWithOptions({
          options,
          cancelButtonIndex,
      }, (selectedIndex) => {
        switch (selectedIndex) {
          case 0:
            handleOpenModal();
            setCreatingFolder(false);
            break;
          case 1:
            handleOpenModal();
            setCreatingFolder(true);
            break;
      }});*/
  }

  const dispatch = useDispatch();
  const state = useSelector((state) => state.user);
  const data = state.data;
  const isBottomNavShown = state.bottomNavShown;
  const lastSavedTimestamp = useRef(Date.now());

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  useEffect(() => {
    if (state.creatingNewSetFromNoSets) {
      dispatch(setCreatingNewSetFromNoSets(false));
      handleOpenModal();
      setCreatingFolder(false);
    }
  }, [state.creatingNewSetFromNoSets]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (data && (nextAppState === 'background')) {
        const currentTimeStamp = Date.now();
        if (currentTimeStamp - lastSavedTimestamp.current >= 5000) {
          dispatch(saveUser("current"));
          lastSavedTimestamp.current = currentTimeStamp;
        }
      } else if (nextAppState === 'active' && !data) {
        //dispatch(fetchUser());
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return(
    <>
      <CreateFileModal
        newName={newName} 
        showModal={showModal} 
        setShowModal={setShowModal} 
        creatingFolder={creatingFolder} 
        handleCreate={handleCreate} 
        handleGenerateSmartSet={handleGenerateSmartSet} 
        setOrFolderText={setOrFolderText} 
        showGenerateSmartSet={true}
        inputRef={inputRef}
        isPrivate={isPrivate}
        setIsPrivate={setIsPrivate}
        setShowImportModal={setShowImportModal}
        importingSet={importingSet}
      />
      <SetImportModal
        visible={showImportModal}
        setVisible={setShowImportModal}
        setShowModal={setShowModal}
        onImport={handleImport}
        setCreateModalVisible={setShowModal}
        newName={newName}
        dispatch={dispatch}
        importingSet={importingSet}
      />
      <SmartSetModal
        newName={newName} 
        showModal={showSmartSetModal}
        setShowModal={setShowSmartSetModal}
        generatedCards={generatedCards}
        handleCreate={handleCreate} 
        handleGenerateSmartSet={handleGenerateSmartSet} 
        setOrFolderText={setOrFolderText} 
      />
      <Tab.Navigator
      backBehavior='history'
      headerShown={false}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          size = 35;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'InstaSets') {
            iconName = focused ? 'albums' : 'albums-outline';
          } else if (route.name === 'ProfileScreen') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'StudySessions') {
            iconName = focused ? 'timer' : 'timer-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'darkgray',
      })}
      >
        { isBottomNavShown ? (<Tab.Screen name="Home" options={{tabBarShowLabel: false}} component={HomeScreen}/>) : (<Tab.Screen name="Home" options={{tabBarShowLabel: false, tabBarStyle: { display: 'none' }}} component={HomeScreen}/>)}
        <Tab.Screen name="InstaSets" options={{tabBarShowLabel: false}} component={InstaSetsScreen} />
        <Tab.Screen name="AddFile"
          component={ButtonScreen}
          options={({navigation})=> ({
            tabBarButton:props => <AddFileIconButton onPress={showActionSheet}/>
          })}
        />
        <Tab.Screen name="StudySessions" options={{tabBarShowLabel: false}} component={StudySessionsScreen} />
        <Tab.Screen name="ProfileScreen" options={{tabBarShowLabel: false}} component={ProfileScreen} />
      </Tab.Navigator>
    </>
  )
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

export default function WrappedApp() {
  const { isLoggedIn } = useAuthentication();
  const stateLoggedIn = useSelector((state) => state.user.loggedIn);
  
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => {
      clearTimeout(loadingTimeout);
    };
  }, []);

  const state = useSelector((state) => state.user);
  if (isLoading || state.loading || state.loading === undefined || (state.data == null && stateLoggedIn)) {	
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF9F5' }}>
        <Image source={require('./app/assets/StudySenseAppLogo.png')} style={{ width: '80%', aspectRatio: 1/1, height: undefined }}/>
        {
        <ActivityIndicator size="large" color={colours.primary} />
        }
      </View>
    )
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        { stateLoggedIn ? (
          <Stack.Screen name="Main" component={HomeTabs} options={{headerShown: false}}/>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={({route}) => ({headerBackImage:()=>(<SVGBackButton/>), headerBackTitleVisible:false})}/>
            <Stack.Screen name="Registration" component={RegistrationScreen} options={({route}) => ({headerBackImage:()=>(<SVGBackButton/>), headerBackTitleVisible:false})}/>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};