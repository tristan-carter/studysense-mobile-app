import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { createUserWithEmailAndPassword, getAuth } from "@react-native-firebase/auth";

import styles from './styles';
import colours from '../../config/colours.js';

import { useDispatch } from 'react-redux';
import { saveUser, setLoggedIn } from '../../../firebase/userSlice';
import { createSharedSetsList } from '../../../firebase/service';

import { getAnalytics, logEvent } from "@react-native-firebase/analytics";

import { getCountry } from "react-native-localize";

export default function RegistrationScreen({navigation}) {
    const dispatch = useDispatch();
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const onFooterLinkPress = () => {
        navigation.navigate('Login')
    }

    const onRegisterPress = () => {
        if (password !== confirmPassword) {
            alert("Passwords don't match.")
            return
        }

        userCountry = "Initial"

        try {
            userCountry = getCountry();
        } catch (error) {
            userCountry = "NA"
        }

        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                const uid = user.uid
                const data = {
                    id: uid,
                    username: username,
                    email: email,
                    country: userCountry,

                    accountCreatedOnApp: true,
                    accountCreatedOn: "ios",
                    accountCreationDateTime: new Date().toString(),
                    settings: {
                        downloadSetsToUseOffline: true,
                        accountType: "default",
                    },
                    accountDeleted: false,

                    folders: ["null"],
                    sets: ["null"],

                    pastStudySessions: ["null"],
                    studySessionsGoals: {
                        daily: 120,
                        weekly: 840,
                        monthly: 0,
                    },
                    currentSessionPreset: {
                        length: 30,
                        breakLength: 5,
                        focusMode: false,
                    }
                  };
                const analytics = getAnalytics();
                logEvent(analytics, 'sign_up', {
                    method: 'email',
                });
                dispatch(saveUser(data));
                dispatch(createSharedSetsList(uid));
                dispatch(setLoggedIn(true));
                //dispatch(keepStateUpdated());
            })
            .catch((error) => {
                alert(error)
            }
        );
    }

    const createTestAccount = () => {
        setUsername("Test Account");
        setEmail("test@test.com");
        setPassword("password");
        setConfirmPassword("password");
    }

    return (
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
                    placeholder='First Name/Preferred Account Name'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setUsername(text)}
                    value={username}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoComplete='name'
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
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Confirm Password'
                    onChangeText={(text) => setConfirmPassword(text)}
                    value={confirmPassword}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoComplete='password'
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onRegisterPress()}>
                    <Text style={styles.buttonTitle}>Create account</Text>
                </TouchableOpacity>
                {/*<TouchableOpacity
                    style={styles.button}
                    onPress={() => createTestAccount()}>
                    <Text style={styles.buttonTitle}>Test Account</Text>
                </TouchableOpacity>*/}
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>
                        Already got an account?
                        <Text onPress={onFooterLinkPress} style={styles.footerLink}>Log in</Text>
                    </Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}