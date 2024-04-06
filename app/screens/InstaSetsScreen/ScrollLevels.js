import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';

import { SwipeListView } from 'react-native-swipe-list-view';
import { Text, View, TouchableOpacity, Image, FlatList } from 'react-native';

import styles from './styles.js';
import colours from '../../config/colours.js';

import SetsList from './SetsList.json';

export default function ScrollLevels(props) {
  const [levels, setLevels] = useState([]);
  const navigation = props.navigation;

  useEffect(() => {
    setLevels(SetsList.studylevels);
  }, []);
  const iconPath = require('../../assets/ReadyMadeSetsIcon.png');

  return (
    <View style={{ backgroundColor: colours.backgroundColour, flex: 1, justifyContent: "center", paddingHorizontal: 13}}>
      <Text style={[styles.subtitleText, {marginBottom: 11}]}>Elite level, ready-made study sets</Text>
      <FlatList
        data={levels}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.push('SubjectsScroll', { Item: item })
              }}
            >
              <View
                style={styles.scrollDataItemButton}
              >
                <Image style={{ width: 40, height: 40 }} source={iconPath} />
                <View style={{flexDirection: 'column', gap: 4}}>
                  <Text numberOfLines={1} style={{
                    paddingRight: 50,
                    fontWeight: '500',
                    fontSize: 21,
                    color: colours.black,
                    overflow: 'hidden',
                  }}>
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
