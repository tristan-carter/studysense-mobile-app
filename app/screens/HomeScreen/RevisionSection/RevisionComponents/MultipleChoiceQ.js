import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import styles from './styles';
import colours from '../../../../config/colours';

function MultipleChoiceQ({ question, incorrectAnswers, answer, setGotQCorrect, progress }) {
    const options = [
        { text: answer, correct: true },
        ...incorrectAnswers.map(text => ({ text, correct: false })),
    ];

    // Shuffle the options array
    const shuffledOptions = options.sort(() => Math.random() - 0.5);

    return (
        <View style={styles.container}>
            <Text style={styles.subtitleText}>Smart Study</Text>
            <View style={styles.progressBar}>
                <View style={[styles.progressBarFiller, { width: `${progress * 100}%` }]} />
            </View>
            <View style={styles.questioningContainer}>
                <Text style={styles.question}>{question}</Text>
                <View style={styles.optionContainer}>
                    {shuffledOptions.map((option, index) => (
                        <TouchableOpacity key={index} style={styles.optionButton} onPress={() => setGotQCorrect({correct: option.correct, answer: option.text})}>
                            <Text style={styles.optionText}>{option.text}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
}

export default MultipleChoiceQ;