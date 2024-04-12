import 'react-native-gesture-handler';
import React, { useState, useRef, useEffect } from 'react';

import { SwipeListView } from 'react-native-swipe-list-view';
import { Text, View, TouchableOpacity, Image, TouchableWithoutFeedback, Alert, FlatList } from 'react-native';

import styles from './styles.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colours from '../../config/colours.js';

export default function SubjectsScroll(props) {
  const subjects = props.route.params.Item.subjects;
  const navigation = props.navigation;
  const iconPath = require('../../assets/CreateFirstSetIcon.png');

  return (
    <View style={{ backgroundColor: colours.backgroundColour, flex: 1, justifyContent: "center", paddingHorizontal: 13}}>
      <Text style={styles.subtitleText}>Choose a subject</Text>
      <FlatList
        data={subjects}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ExamBoardPage', {Item: item});
              }}
            >
              <View
                style={styles.scrollDataItemButton}
              >
                <Image style={{ width: 40, height: 40 }} source={iconPath} />
                <View style={{flexDirection: 'column', gap: 4}}>
                  <Text numberOfLines={1} style={styles.scrollDataButtonText}>
                    {item.title}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
