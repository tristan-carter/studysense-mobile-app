import 'react-native-gesture-handler';
import React, { useState, useRef, useEffect } from 'react';

import { SwipeListView } from 'react-native-swipe-list-view';
import { Text, View, TouchableOpacity, Image, TouchableWithoutFeedback, Alert, FlatList } from 'react-native';

import styles from './styles.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colours from '../../config/colours.js';

import { CreateFileModal } from '../HomeScreen/Modals/CreateFileModal.js';

export default function SubjectsScroll(props) {
  const subjects = props.route.params.Item.subjects;
  const navigation = props.navigation;
  const iconPath = require('../../assets/CreateFirstSetIcon.png');

  return (
    <View style={{ backgroundColor: colours.backgroundColour, flex: 1, justifyContent: "center", paddingHorizontal: 13}}>
      <Text style={[styles.subtitleText, {marginBottom: 11}]}>Choose a subject</Text>
      <FlatList
        data={subjects}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('TopicsSelection', {Item: item});
              }}
            >
              <View
                style={styles.scrollDataItemButton}
              >
                <Image style={{ width: 45, height: 45 }} source={iconPath} />
                <View style={{flexDirection: 'column', gap: 4}}>
                  <Text numberOfLines={1} style={{
                    paddingRight: 50,
                    fontFamily: 'Lato-Bold', fontWeight: '600',
                    fontSize: 21,
                    color: colours.primarytext,
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
