import React, { useState, useRef } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, Modal } from 'react-native'
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

    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
    const emailToSendTo = useRef("");

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
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => onLoginPress()}>
                        <Text style={styles.buttonTitle}>Log in</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerView} onPress={()=>setShowResetPasswordModal(true)}>
                        <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                    </TouchableOpacity>
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