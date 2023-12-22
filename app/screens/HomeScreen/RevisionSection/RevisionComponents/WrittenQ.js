import React, { useRef, useEffect } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView } from 'react-native';

//import Fuse from 'fuse.js';

import styles from './styles';
import colours from '../../../../config/colours';

const threshold = 0.1;

function WrittenQ({ question, answer, setGotQCorrect, progress, typedAnswer, studyMode }) {
    const textInputRef = useRef(null);

    const handleKeyPress = (event) => {
        if (event.nativeEvent.key === 'Enter') {
            event.preventDefault();
            setGotQCorrect({correct: isAnswerCorrect()[0], showTypedAnswer: isAnswerCorrect()[1], answer: typedAnswer.current})
        }
    };

    const isAnswerCorrect = () => {
        /*const fuse = new Fuse([answer], {
            threshold: threshold,
            keys: ["item"],
            includeScore: true,
        });
        const fuse = new Fuse([answer.toLowerCase().replace(/[^a-zA-Z0-9]/, '')], {
            includeScore: true,
            threshold: threshold,
        });
    
        const formattedInput = typedAnswer.current.toLowerCase().replace(/[^a-zA-Z0-9]/, '');
        const result = fuse.search(formattedInput);
        return [result.length > 0 && result[0].score <= threshold, result.length > 0];*/
        if (typedAnswer.current.toLowerCase() == answer.toLowerCase()) {
            return [true, false];
        }
        else if (typedAnswer.current.toLowerCase().replace(/[^a-zA-Z0-9]/, '') === answer.toLowerCase().replace(/[^a-zA-Z0-9]/, '')) {
            return [true, true];
        } else {
            return [false, true];
        }
    }

    useEffect(() => {
        textInputRef.current.focus();
    }, [question, progress]);

    return (
        <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <Text style={styles.subtitleText}>{studyMode}</Text>
            <View style={styles.progressBar}>
                <View style={[styles.progressBarFiller, { width: `${progress * 100}%` }]} />
            </View>
            <View style={styles.questioningContainer}>
                <Text style={styles.question}>{question}</Text>
                <View style={styles.answerContainer}>
                    <TextInput
                        ref={textInputRef}
                        style={styles.textInput}
                        defaultValue={typedAnswer.current}
                        placeholder={"Type your answer"}
                        placeholderTextColor={colours.secondarytext}
                        multiline={true}
                        onChangeText={(text) => {typedAnswer.current=text}}
                        onKeyPress={handleKeyPress}
                        onSubmitEditing={() => setGotQCorrect({correct: isAnswerCorrect()[0], showTypedAnswer: isAnswerCorrect()[1], answer: typedAnswer.current})}
                        autoFocus={true}
                        autoCorrect={false}
                        autoComplete='off'
                    />
                    <View style={styles.underline} />
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

export default WrittenQ;