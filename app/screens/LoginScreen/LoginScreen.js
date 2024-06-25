import React, { useState, useRef } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, Modal } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import auth from "@react-native-firebase/auth";

import styles from './styles';
import colours from '../../config/colours.js';

import {
    GoogleSignin,
    GoogleSigninButton,
} from '@react-native-google-signin/google-signin';

import { AppleButton, appleAuth } from '@invertase/react-native-apple-authentication';

import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, saveUser, setLoggedIn } from '../../../firebase/userSlice';

import analytics from "@react-native-firebase/analytics";

export default function LoginScreen({navigation}) {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const user = useSelector((state) => state.user.data);

    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
    const emailToSendTo = useRef("");

    const onFooterLinkPress = () => {
        navigation.navigate('Registration')
    }

    const onLoginPress = () => {
        auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            dispatch(fetchUser());
            analytics().logEvent('login', {
                method: 'email',
            });
            dispatch(setLoggedIn(true));
        })
        .catch((error) => {
            alert(error)
        })
    }

    const resetPassword = () => {
        auth()
        .sendPasswordResetEmail(emailToSendTo.current)
        .then(() => {
            alert("An email has been sent to your email address. Please follow the instructions in the email to reset your password.");
        })
        .catch(() => {
            alert("An email has been sent to your email address if an account is associated with it. Please follow the instructions in the email to reset your password.");
        });
    }

    async function onAppleButtonPress() {
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
        });

        // Ensure Apple returned a user identityToken
        if (!appleAuthRequestResponse.identityToken) {
            throw new Error('Apple Sign-In failed - no identify token returned');
        }

        // Create a Firebase credential from the response
        const { identityToken, nonce } = appleAuthRequestResponse;
        const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

        // Sign the user in with the credential
        const userCredential = await auth().signInWithCredential(appleCredential);

        // Checks if user is new
        if (userCredential.additionalUserInfo.isNewUser) {
            console.log("New User")

            userCountry = "Initial"

            try {
                userCountry = getCountry();
            } catch (error) {
                userCountry = "Unavailable"
            }

            console.log(userCredential)
            const user = userCredential.user;
            const { uid, email } = user;
            const username = user.displayName || '';
            const data = {
                id: uid,
                username: username,
                email: email,
                country: userCountry,

                accountType: "Apple Account",
                accountCreatedOn: "ios",
                accountCreationDateTime: new Date().toString(),
                settings: {
                    downloadSetsToUseOffline: true,
                    accountType: "default",
                },

                folders: ["null"],
                sets: ["null"],

                pastStudySessions: ["null"],
                studySessionsGoals: {
                    daily: 120,
                    weekly: 840,
                },
                currentSessionPreset: {
                    length: 30,
                    breakLength: 5,
                    focusMode: false,
                }
            };

            analytics().logEvent('sign_up', {
                method: 'apple',
            });
            dispatch(saveUser(data));
            dispatch(setLoggedIn(true));
        } else {
            console.log("Existing User")

            // Fetch user data
            dispatch(fetchUser());
            analytics().logEvent('login', {
                method: 'apple',
            });
            dispatch(setLoggedIn(true));
        }
    }

    async function onGoogleButtonPress() {
        try {
            // Check for Google Play services
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    
            // Get ID token
            const { idToken, user } = await GoogleSignin.signIn();

            // Create Google credential
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);

            // Sign-in 
            const userCredential = await auth().signInWithCredential(googleCredential);

            // Checks if user is new
            if (userCredential.additionalUserInfo.isNewUser) {
                console.log("New User")

                userCountry = "Initial"

                try {
                    userCountry = getCountry();
                } catch (error) {
                    userCountry = "Unavailable"
                }

                const { uid, email } = user;
                const username = user.displayName || '';
                const data = {
                    id: uid,
                    username: username,
                    email: email,
                    country: userCountry,

                    accountType: "Google Account",
                    accountCreatedOn: "ios",
                    accountCreationDateTime: new Date().toString(),
                    settings: {
                        downloadSetsToUseOffline: true,
                        accountType: "default",
                    },

                    folders: ["null"],
                    sets: ["null"],

                    pastStudySessions: ["null"],
                    studySessionsGoals: {
                        daily: 120,
                        weekly: 840,
                    },
                    currentSessionPreset: {
                        length: 30,
                        breakLength: 5,
                        focusMode: false,
                    }
                };

                analytics().logEvent('sign_up', {
                    method: 'google',
                });
                dispatch(saveUser(data));
                dispatch(setLoggedIn(true));
            } else {
                console.log("Existing User")

                // Fetch user data
                dispatch(fetchUser());
                analytics().logEvent('login', {
                    method: 'google',
                });
                dispatch(setLoggedIn(true));
            }
        } catch (error) {
            console.error(error);
        }
    }
    

    return (
        <>
            <View style={styles.container}>
                <KeyboardAwareScrollView
                    style={{ flex: 1, width: '100%' }}
                    keyboardShouldPersistTaps="always">
                    <Image
                        style={styles.logo}
                        source={require('../../assets/StudySenseLogoTransparent.png')}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='E-mail'
                        placeholderTextColor="#aaaaaa"
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                        autoComplete='email'
                    />
                    <TextInput
                        style={styles.input}
                        placeholderTextColor="#aaaaaa"
                        secureTextEntry
                        placeholder='Password'
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                        autoComplete='password'
                    />
                    <TouchableOpacity style={{
                        alignSelf: 'flex-end',
                        marginTop: 3,
                        marginRight: 32,
                    }} onPress={()=>setShowResetPasswordModal(true)}>
                        <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => onLoginPress()}>
                        <Text style={styles.buttonTitle}>Log in</Text>
                    </TouchableOpacity>

                    <View style={styles.dividerWrapper}>
                        <View style={[styles.divider, {

                        }]}/>
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={[styles.divider, {

                        }]}/>
                    </View>

                    <GoogleSigninButton
                        size={GoogleSigninButton.Size.Wide}
                        color={GoogleSigninButton.Color.Dark}
                        style={{
                            alignSelf: 'center',
                        }}
                        onPress={onGoogleButtonPress}
                    />

                    <AppleButton
                        buttonStyle={AppleButton.Style.BLACK}
                        buttonType={AppleButton.Type.SIGN_IN}
                        style={{
                            width: 300,
                            height: 40,
                            alignSelf: 'center',
                            marginTop: 15,
                        }}
                        onPress={() => onAppleButtonPress().then(() => onAppleButtonPress().catch((error) => console.log(error)))}
                    />

                    <View style={styles.footerView}>
                        <Text style={styles.footerText}>Don't have an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Sign up</Text></Text>
                    </View>
                </KeyboardAwareScrollView>
            </View>

            {/* Reset password modal */}
            <Modal
            animationType="fade"
            transparent={true}
            visible={showResetPasswordModal}
            onRequestClose={() => setShowResetPasswordModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                    <Text style={styles.modalText}>Reset Password</Text>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Account Email</Text>
                        <TextInput
                            multiline={true}
                            style={styles.textInput} defaultValue={""} placeholder={"studysense@hotmail.com"} placeholderTextColor={'rgba(0, 0, 0, 0.48)'}
                            onChangeText={(text) => {emailToSendTo.current=text}}
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={()=>{setShowResetPasswordModal(false); resetPassword()}}
                    >
                        <Text style={styles.createButtonText}>Reset</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={()=>setShowResetPasswordModal(false)}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    )
}