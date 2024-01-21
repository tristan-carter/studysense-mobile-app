import React, { useEffect } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, TouchableOpacity, Image } from 'react-native';
import { useSharedValue, useAnimatedStyle, interpolate, withTiming } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';

import styles from './styles';
import colours from '../../../../config/colours';

import correctIcon from '../../../../assets/CorrectIcon.png';
import incorrectIcon from '../../../../assets/IncorrectIcon.png';

import Svg, { Path, G, Circle } from "react-native-svg";

function FlashcardQ({ question, answer, setGotQCorrect, gotQCorrect, progress }) {
    useEffect(() => {
        spin.value = 0;
    }, [question, answer, gotQCorrect]);
    const spin = useSharedValue(0);
    const frontAnimatedStyle = useAnimatedStyle(() => {
        const spinVal = interpolate(spin.value, [0, 1], [0, 180]);
        return {
            transform: [
            {
                rotateY: withTiming(`${spinVal}deg`, { duration: 500 }),
            },
            ],
        };
    }, []);

    const backAnimatedStyle = useAnimatedStyle(() => {
        const spinVal = interpolate(spin.value, [0, 1], [180, 360]);
        return {
            transform: [
            {
                rotateY: withTiming(`${spinVal}deg`, { duration: 500 }),
            },
            ],
        };
    }, []);
    
    return (
        <View
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <Text style={styles.subtitleText}>Smart Study</Text>
            <View style={styles.progressBar}>
                <View style={[styles.progressBarFiller, { width: `${progress * 100}%` }]} />
            </View>
            <TouchableOpacity
            style={{ flex: 1, paddingVertical: 40, width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 50 }}
            onPress={() => (spin.value = spin.value ? 0 : 1)}
            >
                <Animated.View style={[styles.flashcardFront, frontAnimatedStyle]}>
                    <Text style={styles.flashcardTitleText}>Front</Text>
                    <Text style={styles.question}>{question}</Text>
                </Animated.View>
                <Animated.View style={[styles.flashcardBack, backAnimatedStyle]}>
                    <Text style={styles.flashcardTitleText}>Back</Text>
                    <Text style={styles.question}>{answer}</Text>
                </Animated.View>
            </TouchableOpacity>
            <View style={{ marginBottom: 50, flexDirection: 'row', width: '100%', justifyContent: 'space-evenly' }}>
                <TouchableOpacity style={{marginRight: 15, padding: 20}} onPress={() => setGotQCorrect({correct: false, answer: "Incorrect"})}>
                    {/*<Image style={styles.gotQCorrectImage} source={incorrectIcon} />*/}
                    <Svg
                        width="100px"
                        height="110px"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <Path
                            d="M16 8l-8 8m0-8l8 8m5-4a9 9 0 11-18 0 9 9 0 0118 0z"
                            stroke="#f66"
                            strokeWidth={1.6}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </Svg>
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft: 15, padding: 20}} onPress={() => setGotQCorrect({correct: true, answer: "Correct"})}>
                    <Svg
                        width="110px"
                        height="110px"
                        viewBox="-2.4 -2.4 28.80 28.80"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        >
                        <G stroke="#52c77b">
                            <Path
                            d="M7.294 12.958l3.21 3.21L17.674 9"
                            strokeWidth={1.8}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            />
                            <Circle cx={12} cy={12} r={10} strokeWidth={1.7} />
                        </G>
                    </Svg>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default FlashcardQ;