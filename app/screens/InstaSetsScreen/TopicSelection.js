import 'react-native-gesture-handler';
import React, { useState, useRef, useEffect } from 'react';

import { SwipeListView } from 'react-native-swipe-list-view';
import { Text, View, TouchableOpacity, Image, TouchableWithoutFeedback, Alert, FlatList, CheckBox } from 'react-native';

import styles from './styles.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colours from '../../config/colours.js';

import { CreateFileModal } from '../HomeScreen/Modals/CreateFileModal.js';

export default function TopicSelection(props) {
  const Subject = props.route.params.Item;
  const topics = Subject.topics;
  const navigation = props.navigation;
  const selectionTopics = []
  for (let i = 0; i < topics.length; i++) {
    const [isSelected, setSelection] = useState(true);
    selectionTopics.push({
      title: topics[i].title,
      selected: isSelected,
      setSelection: setSelection,
      cards: topics[i].cards,
    });
  }

  return (
    <View style={{ backgroundColor: colours.backgroundColour, flex: 1, justifyContent: "center", paddingHorizontal: 13}}>
      <Text style={[styles.subtitleText, {marginBottom: 11}]}>Choose topics for {Subject}</Text>
      <FlatList
        data={topics}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => {
          return (
            <View
              style={styles.scrollDataItemButton}
            >
              <CheckBox
              value={item.selected}
              onValueChange={() => {
                item.setSelection(!item.selected);
              }}
              style={styles.checkbox}
              />
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
          );
        }}
      />
    </View>
  );
}
