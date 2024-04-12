import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Image, TextInput } from 'react-native';

import styles from './styles';
import colours from '../../../../config/colours';

import correct from '../../../../assets/CorrectIcon.png';
import incorrect from '../../../../assets/IncorrectIcon.png';

const correctAnimation = require('../../../../assets/TickAnimation.json');
const incorrectAnimation = require('../../../../assets/CrossAnimation.json');

import LottieView from 'lottie-react-native';

function QuestionFeedbackModal({ showFeedback, setShowFeedback, setFinalGotQCorrect, gotQCorrect, question, isFlashcardFeedback }) {
    const [countdown, setCountdown] = useState(5);
    useEffect(() => {
        let countdownInterval;
        if (!gotQCorrect.correct && countdown > 0) {
            countdownInterval = setInterval(() => {
            setCountdown(prevCountdown => prevCountdown - 1);
            }, 1000);
        } else if (countdown == 0) {
            clearInterval(countdownInterval);
        }

        return () => {
            clearInterval(countdownInterval);
        };
    }, [countdown, gotQCorrect.correct]);

    useEffect(() => {
        if (showFeedback) {
            setCountdown(5);
        }
    }, [showFeedback]);

    const handleContinue = () => {
        setShowFeedback(false);
        setFinalGotQCorrect(gotQCorrect);
    }

    const handleChangeGotQCorrect = () => {
        setShowFeedback(false);
        setFinalGotQCorrect({correct: !gotQCorrect.correct});
    }

    return(
        <Modal
        animationType="fade"
        transparent={true}
        visible={showFeedback}
        onRequestClose={() => setShowFeedback(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    {/*<Image style={{ width: 50, height: 50, alignSelf: 'center' }} source={(gotQCorrect.correct ? correct : incorrect)} />*/}
                    <View style={{ alignItems: 'center', justifyContent: 'center', height: 100 }}>
                        <LottieView
                            source={gotQCorrect.correct ? correctAnimation : incorrectAnimation}
                            style={{
                                width: 100,
                                height: 100,
                                transform: gotQCorrect.correct ? [{ scale: 1.5 }] : [{ scale: 1 }], // Adjust scale as needed
                            }}
                            autoPlay
                            loop={false}
                        />
                    </View>
                    <View style={styles.modalTextContainer}>
                        <Text style={[styles.modalTextLabel, {
                                    fontFamily: 'Lato',
fontSize: question.question.length > 200 ? 14 : 18,
                        }]}>Question:</Text>
                        <Text style={[styles.modalText, {
                                    fontFamily: 'Lato',
fontSize: question.question.length > 200 ? 14 : 18,
                        }]}>{question.question}</Text>
                    </View>
                    <View style={styles.modalTextContainer}>
                        <Text style={[styles.modalTextLabel, {
                                    fontFamily: 'Lato',
fontSize: question.answer.length > 200 ? 14 : 18,
                        }]}>Correct answer:</Text>
                        <Text style={[styles.modalText, {
                                    fontFamily: 'Lato',
fontSize: question.answer.length > 200 ? 14 : 18,
                        }]}>{question.answer}</Text>
                    </View>
                    {!isFlashcardFeedback && (
                        gotQCorrect.showTypedAnswer && (
                            <View style={styles.modalTextContainer}>
                                <Text style={[styles.modalTextLabel, {
                                            fontFamily: 'Lato',
fontSize: gotQCorrect.answer.length > 200 ? 14 : 18,
                                }]}>Your answer:</Text>
                                <Text style={[styles.modalText, {
                                            fontFamily: 'Lato',
fontSize: gotQCorrect.answer.length > 200 ? 14 : 18,
                                }]}>{gotQCorrect.answer}</Text>
                            </View>
                        )
                    )}
                    <TouchableOpacity
                        style={styles.modalButton}
                        onPress={gotQCorrect.correct || countdown == 0 || isFlashcardFeedback ? handleContinue : null}
                        disabled={!gotQCorrect.correct && countdown > 0  && !isFlashcardFeedback}
                    >
                        <Text style={styles.modalButtonText}>
                            {gotQCorrect.correct || countdown === 0 || isFlashcardFeedback ? 'Continue' : ('Continue in ' + countdown + ' seconds')}
                        </Text>
                    </TouchableOpacity>
                    {!isFlashcardFeedback && (
                        <TouchableOpacity style={styles.changeGotQCorrectButton} onPress={handleChangeGotQCorrect}>
                            <Text style={styles.changeGotQCorrectButtonText}>Change to {gotQCorrect.correct ? "incorrect" : "correct"}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Modal>
    )
}

export default QuestionFeedbackModal;