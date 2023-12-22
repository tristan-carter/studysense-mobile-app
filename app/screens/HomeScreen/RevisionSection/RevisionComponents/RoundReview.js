import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';

import { useSelector } from 'react-redux';

import styles from './styles';
import colours from '../../../../config/colours';
import donutChartComponent from './DonutChart';

const correctIcon = require('../../../../assets/CorrectIcon.png');
const incorrectIcon = require('../../../../assets/IncorrectIcon.png');

import InspirationalQuotes from './InspirationalQuotes';

function RoundReview({ roundData, setFinishRoundReview, buttonText }) {
    const user = useSelector((state) => state.user);
    const currentFolderId = user.currentFolder;
    const currentSetId = user.currentSet;
    var currentSet = null;
    if (currentFolderId!=null) {
        currentSet = user.data.folders.filter((folder) => folder.id === currentFolderId)[0].sets.filter((set) => set.id === currentSetId)[0];
    }
    else {
        currentSet = user.data.sets.filter((set) => set.id === currentSetId)[0];
    }

    if (currentSet==null) {
        return (
            <View style={styles.container}>
                <Text style={styles.subtitleText}>Revision Options</Text>
                <Text style={styles.subtitleText}>No set selected</Text>
            </View>
        );
    }

    const inspirationalQuote = InspirationalQuotes[Math.floor(Math.random() * InspirationalQuotes.length)];
    
    return (
        <ScrollView contentContainerStyle={{alignItems: 'center'}} style={styles.roundReviewContainer}>
            <Text style={styles.subtitleText}>Round Review</Text>
            <View style={styles.roundReviewDataContainer}>
                <View style={styles.roundReviewCorrectContainer}>
                    <View style={styles.roundReviewCorrectTextContainer}>
                        <Image style={{ width: 35, height: 35 }} source={correctIcon} />
                        <Text style={styles.roundReviewCorrectText}>{roundData.correct} correct</Text>
                    </View>
                    <View style={styles.roundReviewCorrectTextContainer}>
                        <Image style={{ width: 35, height: 35 }} source={incorrectIcon} />
                        <Text style={styles.roundReviewCorrectText}>{roundData.incorrect} incorrect</Text>
                    </View>
                </View>
                {donutChartComponent(currentSet.cards)}
                <View style={styles.inspirationalQuoteContainer}>
                    <Text style={styles.inspirationalQuoteLabel}>Inspirational Quote:</Text>
                    <Text style={styles.inspirationalQuoteText}>{inspirationalQuote}</Text>
                </View>
                <TouchableOpacity style={styles.nextRoundButton} onPress={() => setFinishRoundReview(true)}>
                    <Text style={styles.nextRoundButtonText}>{buttonText}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

export default RoundReview;