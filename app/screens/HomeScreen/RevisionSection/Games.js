import React from 'react';
import { View, Text, } from 'react-native';

import { useSelector, useDispatch } from 'react-redux';

import { PieChart } from "react-native-gifted-charts";

import styles from './styles';
import colours from '../../../config/colours';
import ComingSoonScreen from '../../StudySessionsScreen/ComingSoonScreen';

function Games({ navigation }) {
    const dispatch = useDispatch();
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
    return (
        <ComingSoonScreen/>
    );
}

export default Games;