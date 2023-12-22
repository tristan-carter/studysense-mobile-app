import React, { useState, useEffect } from 'react';
import { View } from 'react-native';

import Icon from 'react-native-ionicons'
import colours from '../../config/colours.js';

import ScrollData from './ScrollData.js';

import styles from './styles.js';

function FolderScreen ({ navigation }) {
    return (
        <View style={styles.scrollDataContainer}>
            <ScrollData navigation={navigation} isFolder={true} />
        </View>
    );
}

export default FolderScreen;