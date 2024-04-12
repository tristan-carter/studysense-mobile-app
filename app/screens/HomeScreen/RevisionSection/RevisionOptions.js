import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';

import { useSelector } from 'react-redux';

import styles from './styles';
import colours from '../../../config/colours';
import donutChartComponent from './RevisionComponents/DonutChart';
import NotEnoughCards from './NotEnoughCards/NotEnoughCards.js';


// 0 - Not Learned : 1 - Learning : 2 - Partially Learned : 3 - Learned
const RevisionOptionsList = [
    {
        key: 0,
        title: 'Smart study',
        description: 'A mix of multiple choice Qs and written Qs',
        icon: require('../../../assets/StudySmartRevisionIcon.png'),
    },
    {
        key: 1,
        title: 'Refresher',
        description: 'Study cards you get wrong most often',
        icon: require('../../../assets/RefresherRevisionIcon.png'),
    },
    {
        key: 2,
        title: 'Test',
        description: 'Only written Qs, best for reviewing knowledge',
        icon: require('../../../assets/TestRevisionIcon.png'),
    },
    {
        key: 3,
        title: 'Smart flashcards',
        description: 'Effective for more detailed terms and definitions',
        icon: require('../../../assets/OldDefaultSetIcon.png'),
    },
];

/*
    {
        key: 4,
        title: 'Games',
        description: 'Learn while having fun with educational games',
        icon: require('../../../assets/GamesRevisionIcon.png'),
    },
*/

function RevisionOptions({ navigation }) {
    const screenHeight = Dimensions.get('window').height;

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
                <Text style={styles.subtitleText}>Study options</Text>
                <Text style={styles.subtitleText}>No set selected</Text>
            </View>
        );
    }
    
    return (
        currentSet.cards.length > 1 ? (
            /*<ScrollView contentContainerStyle={{alignItems: 'center'}} style={styles.container}>*/
                <View style={styles.container}>
                    <Text style={styles.subtitleText}>Study options</Text>
                    {donutChartComponent(currentSet.cards)}
                    <View style={styles.revisionOptionsContainer}>
                        {RevisionOptionsList.map((revisionOption) => (
                            <TouchableOpacity style={styles.revisionOption} key={revisionOption.key} onPress={()=>navigation.push(revisionOption.title, {set: currentSet})}>
                                <Image style={styles.revisionOptionIcon} source={revisionOption.icon} />
                                <View style={styles.revisionOptionsTextContainer}>
                                    <Text style={styles.revisionOptionTitle}>{revisionOption.title}</Text>
                                    <Text style={styles.revisionOptionDescription} numberOfLines={2}>{revisionOption.description}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            /*</ScrollView>*/
        ) : (
            <NotEnoughCards set={currentSet} minCards={1} studyType={"a study"} />
        )
    );
}

export default RevisionOptions;