import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Switch, Modal, TextInput, Alert } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { setLoggedIn, setUser, deleteAccountData } from '../../../firebase/userSlice';

import auth from "@react-native-firebase/auth";
import { firebase } from "@react-native-firebase/database";

import styles from './styles';

import ComingSoonScreen from '../ComingSoonScreen';

const resetPassword = (setShowModal, informationToShow) => {
  auth()
  .sendPasswordResetEmail(auth.currentUser.email)
  .then(() => {
    informationToShow.current = "An email has been sent to your email address. Please follow the instructions in the email to reset your password.";
    setShowModal(true);
  })
  .catch((error) => {
    const errorMessage = error.message;
    alert(errorMessage)
  });
}

const changeEmail = (newEmail, setShowModal, informationToShow, user, dispatch) => {
  if (newEmail.current === "") {
    alert("Please enter a valid new email address.");
    return;
  }
  auth().updateEmail(auth().currentUser, newEmail.current).then(() => {
    //updates email in database
    user.email = newEmail.current;
    saveUserData(user);

    informationToShow.current = "Your email has been changed successfully.";
    setShowModal(true);
  }).catch((error) => {
    const errorMessage = error.message;
    alert(errorMessage)
  });
}

const logout = (dispatch) => {
  auth().signOut()
  .then(() => {
    dispatch(setLoggedIn(false));
    setUser(null)
  })
  .catch((error) => {
    const errorMessage = error.message;
    alert(errorMessage)
  });
}

const deleteAccount = (dispatch) => {
    Alert.alert("Delete Account", "Are you sure you would like to delete your account permanently?", [
      {
          text: "Cancel",
          onPress: () => {},
          style: "cancel"
      },
      {
        style: 'destructive',
        text: "Confirm",
        onPress: () => {
          // delete user from auth and leaves them in database so recovery of account is possible
          dispatch(setLoggedIn(false));
          const userId = auth().currentUser.uid;
          dispatch(deleteAccountData(userId));
          auth().deleteUser(auth().currentUser).then(() => {
            console.log("User deleted successfully.")
          }).catch((error) => {
            const errorMessage = error.message;
            alert(errorMessage)
            console.log(errorMessage)
          });
        }
      }
  ], "plain-text");
}

const SettingsPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  
  const [showInformationModal, setShowInformationModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const informationToShow = useRef("");
  const newEmail = useRef("");

  const toggleNotifications = () => {
    setNotificationsEnabled((prev) => !prev);
    // Implement logic to toggle notifications setting in the app
  };

  const toggleDarkMode = () => {
    setDarkModeEnabled((prev) => !prev);
    // Implement logic to toggle dark mode setting in the app
  };

  return (
    <> 
      <View style={styles.container}>
        <Text style={styles.title}>Account</Text>
        {/*<View style={styles.settingItem}>
          <Text>Enable Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
          />
        </View>
        <View style={styles.settingItem}>
          <Text>Dark Mode</Text>
          <Switch value={darkModeEnabled} onValueChange={toggleDarkMode} />
  </View>*/}
        <TouchableOpacity
          onPress={() => {resetPassword(setShowInformationModal, informationToShow)}}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {newEmail.current=""; setShowEmailModal(true)}}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Change Email</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <Text style={styles.title}>Danger Zone</Text>
        <TouchableOpacity
          onPress={() => logout(dispatch)}
          style={[styles.button, {backgroundColor: '#FF4242'}]}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => deleteAccount(dispatch, user)}
          style={[styles.button, {backgroundColor: '#FF4242'}]}
        >
          <Text style={styles.buttonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>

      {/* information modal e.g for displaying that an email has been sent to reset your password*/}
      <Modal
      animationType="fade"
      transparent={true}
      visible={showInformationModal}
      onRequestClose={() => setShowInformationModal(false)}
      >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>{informationToShow.current}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={()=>setShowInformationModal(false)}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
      </Modal>

      {/* Change email modal */}
      <Modal
      animationType="fade"
      transparent={true}
      visible={showEmailModal}
      onRequestClose={() => setShowEmailModal(false)}
      >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Change Email</Text>
          <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>New Email</Text>
              <TextInput
                  multiline={true}
                  style={styles.textInput} defaultValue={newEmail.current} placeholder={"studysense@hotmail.com"} placeholderTextColor={'rgba(0, 0, 0, 0.48)'}
                  onChangeText={(text) => {newEmail.current=text}}
              />
          </View>
          <TouchableOpacity
            style={styles.createButton}
            onPress={()=>{setShowEmailModal(false); changeEmail(newEmail, setShowInformationModal, informationToShow, user, dispatch)}}
          >
            <Text style={styles.createButtonText}>Done</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={()=>setShowEmailModal(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
        </View>
      </View>
      </Modal>
    </>
  );
};

export default SettingsPage;