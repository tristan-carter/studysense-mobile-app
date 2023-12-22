import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import auth from "@react-native-firebase/auth";

import styles from './styles';
import colours from '../../config/colours.js';

import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, setLoggedIn } from '../../../firebase/userSlice';
import { keepStateUpdated } from '../../../firebase/service';

import analytics from "@react-native-firebase/analytics";

export default function LoginScreen({navigation}) {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const user = useSelector((state) => state.user.data);

    const onFooterLinkPress = () => {
        navigation.navigate('Registration')
    }

    const onLoginPress = () => {
        auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log(userCredential.user)
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
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onLoginPress()}>
                    <Text style={styles.buttonTitle}>Log in</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Don't have an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Sign up</Text></Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}