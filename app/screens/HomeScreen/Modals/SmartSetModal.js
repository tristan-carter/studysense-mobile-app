import React, { useEffect, useRef, useState } from 'react';

import { View, Text, TouchableOpacity, Modal, TextInput, Switch, ActivityIndicator, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import { Configuration, OpenAIApi } from "openai";
//import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';

import styles from '.././styles.js';
import colours from '../../../config/colours.js';

const BAD_API_KEY = '';

export function SmartSetModal ({ setShowModal, showModal, handleCreate, generatedCards }) {
    const CHATGPT_API_URL = 'https://api.openai.com/v1/engines/davinci-codex/completions';

    /*try {
        const configuration = new Configuration({
            organization: "org-DEyeUsEnMQ91vprnQhfTC3CN",
            apiKey: BAD_API_KEY,
        });
    } catch (error) {
        console.error("An error occurred:", error);
    }*/
    //const openai = new OpenAIApi(configuration);
    //console.log(openai)
    //const response = openai.listEngines();
    //const completion = openai.createChatCompletion({
    //    messages: [{ role: "system", content: "string" }],
    //    model: "gpt-3.5-turbo",
    //});

    const initialPrompt = useRef("");
    const [currentStep, setCurrentStep] = useState(0);
    const [isVocabSet, setIsVocabSet] = useState(true);
    const [isTextInputRed, setIsTextInputRed] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        setIsTextInputRed(false);
        setIsVocabSet(true);
        setCurrentStep(0);
        initialPrompt.current = "";
    }, [showModal]);

    const longCardsPrompt = "Terms and definitions should be less than 14 words."
    const shortCardsPrompt = "Terms and definitions should be less than 3 words and only be vocab for that topic."
    
    const generateResponse = async (prompt) => {
        /*const response = await axios.post(CHATGPT_API_URL, {
            prompt: `Create a set of 50 flashcards on ${prompt} as list of dictionaries.
            An example set of flashcards would be [{term: "term1", definition: "definition1"}, {term: "term2", definition: "definition2"}].
            ${isVocabSet ? shortCardsPrompt : longCardsPrompt} Flashcards should focus on more difficult content.`,
            max_tokens: 1000,
            temperature: 0.2,
            n: 1,
            stop: 'Human:',
        }, {
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${BAD_API_KEY}`, //MUST CHANGE BEFORE DEPLOYMENT OR GITHUB PUSH
            },
        });

        const { choices } = response.data;
        const { text: generatedText } = choices[0];
        //console.log(generatedText.trim())
        return generatedText.trim();*/
    };

    const handleContinueAttempt = () => {
        if (initialPrompt.current == "") {
            setIsTextInputRed(true);
        } else if (!isGenerating) {
            setIsGenerating(true);
            generateResponse(initialPrompt.current).then((response) => {
                //const filteredResponse = response
                //generatedCards.current = ["null", ...filteredResponse];
                setIsGenerating(false);
                setCurrentStep(1);
            });
        }
    }

    const generateMoreCards = () => {
        setIsGenerating(true);
        if (!isGenerating) {
            generateResponse("Continue").then((response) => {
                //const filteredResponse = response
                //generatedCards.current = [...generatedCards.current, ...filteredResponse];
                setIsGenerating(false);
            });
        }
    }

    return(
        <Modal
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
        >
            <KeyboardAvoidingView style={styles.modalContainer}>
                <SafeAreaView style={styles.modalSubContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                        onPress={() => setShowModal(false)}
                        style={{ position: 'absolute', top: 10, right: 10 }}
                        >
                            <Ionicons name={'close-circle-outline'} size={30} color={'#FF4242'} />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Generate Smart Set</Text>
                        {currentStep == 0 ? (
                            <>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Describe Set</Text>
                                    <TextInput
                                        multiline={true}
                                        style={isTextInputRed ? [styles.textInput, {borderColor: colours.incorrectRed}] : styles.textInput}
                                        defaultValue={initialPrompt.current}
                                        placeholder={isTextInputRed ? "Required" : "e.g. Physics GCSE"}
                                        placeholderTextColor={'rgba(0, 0, 0, 0.48)'}
                                        onChangeText={(text) => {
                                            initialPrompt.current = text;
                                        }}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Vocab Set</Text>
                                    <Switch
                                        trackColor={{false: colours.darkgray, true: colours.primary}}
                                        thumbColor={colours.background}
                                        ios_backgroundColor={colours.darkgray}
                                        onValueChange={(value) => setIsVocabSet(value)}
                                        value={isVocabSet}
                                    />
                                </View>
                            </>
                        ) : (
                            <>
                                {!isGenerating && 
                                    <TouchableOpacity
                                        style={[styles.createButton, {backgroundColor: colours.primaryAccent}]}
                                        onPress={generateMoreCards}
                                    >
                                        <Text style={styles.createButtonText}>Generate More Cards</Text>
                                    </TouchableOpacity>
                                }
                            </>
                        )}
                        {!isGenerating ? (
                            <TouchableOpacity
                                style={styles.createButton}
                                onPress={currentStep == 0 ? handleContinueAttempt : handleCreate}
                            >
                                <Text style={styles.createButtonText}>{currentStep == 0 ? "Generate" : "Finish"}</Text>
                            </TouchableOpacity>
                        )
                        : (
                            <ActivityIndicator size="large" color={colours.primary} />
                        )}
                    </View>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </Modal>
    )
}