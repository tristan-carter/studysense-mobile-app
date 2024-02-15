import 'react-native-gesture-handler';
import React, { useState, useRef, useEffect } from 'react';

import { SwipeListView } from 'react-native-swipe-list-view';
import { Text, View, TouchableOpacity, Image, TouchableWithoutFeedback, Alert, FlatList } from 'react-native';

import CheckBox from '@react-native-community/checkbox';

import styles from './styles.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colours from '../../config/colours.js';

const generateID = () => {
  const randomString = Math.random().toString(36).substr(2, 10);
  const timestamp = Date.now().toString(36);
  const ID = randomString + timestamp;
  return ID;
};

export default function TopicSelection(props) {
  const Subject = props.route.params.Item;
  const topics = Subject.topics;
  const navigation = props.navigation;
  const selectionTopics = []

  const handleSetImport = (selectedTopics) => {
    const importedCards = []
    for (let i = 0; i < selectedTopics.length; i++) {
      for (let j = 0; j < selectedTopics[i].cards.length; j++) {
        const card = {
          id: generateID(),
          term: selectedTopics[i].cards[j].term,
          definition: selectedTopics[i].cards[j].definition,
          correct: 0,
          totalCorrect: 0,
          incorrect: 0,
          totalIncorrect: 0,
          levelLearned: 0,
        }
        importedCards.push(card);
      }
    }

    const set = {
      setId: generateID(),
      name: Subject.setname,
      subject: Subject.subject,
      topics: selectedTopics,
      cards: importedCards,
      description: "null",
      icon: "null",
      isFolder: false,
      isPrivate: false,
      refresherOptions: {
        answerWithDefinition: true,
        answerWithTerm: false,
      },
      smartStudyOptions: {
        answerWithDefinition: true,
        answerWithTerm: false,
      },
      testOptions: {
        answerWithDefinition: true,
        answerWithTerm: false,
      },
      flashcardOptions: {
        answerWithDefinition: true,
        answerWithTerm: false,
      },
    }

    navigation.navigate('CreateCardsPage', {
      set: set,
      editOrCreate: "Create",
    });
  }

  for (let i = 0; i < topics.length; i++) {
    const [isSelected, setSelection] = useState(true);
    selectionTopics.push({
      title: topics[i].title,
      selected: isSelected,
      setSelection: setSelection,
      cards: topics[i].cards,
    });
  }

  var allSelected = true;
  for (let i = 0; i < selectionTopics.length; i++) {
    if (!selectionTopics[i].selected) {
      allSelected = false;
      break;
    }
  }

  return (
    <View style={{
      backgroundColor: colours.backgroundColour,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 13,
      gap: 4,
    }}>
      <Text style={[styles.subtitleText, {marginBottom: 11}]}>Choose topics for {Subject.setname}</Text>
      <TouchableOpacity
        style={[styles.button, {backgroundColor: colours.darkPrimary}]}
        onPress={() => {
          var selectedTopics = [];
          for (let i = 0; i < selectionTopics.length; i++) {
            if (selectionTopics[i].selected) {
              const topic = {
                title: selectionTopics[i].title,
                cards: selectionTopics[i].cards,
              }
              selectedTopics.push(topic);
            }
          }
          if (selectedTopics.length === 0) {
            Alert.alert(
              "No topics selected",
              "Please select at least one topic to continue",
              [
                { text: "OK" }
              ]
            );
          } else {
            navigation.goBack();
            navigation.goBack();
            handleSetImport(selectedTopics);
          }
        }}
      >
        <Text style={[styles.buttonText, {color: colours.white}]}>Done</Text>
      </TouchableOpacity>
      <View style={styles.divider} />
      <TouchableOpacity
        style={[styles.button, {backgroundColor: colours.blue}]}
        onPress={()=>{
          for (let i = 0; i < selectionTopics.length; i++) {
            selectionTopics[i].setSelection(!allSelected);
          }
        }}
      >
          <Text style={[styles.buttonText, {color: colours.backgroundColour}]}>{allSelected ? "Deselect All" : "Select All"}</Text>
      </TouchableOpacity>

      <FlatList
        data={selectionTopics}
        keyExtractor={(item) => item.title}
        style={{width: '100%', marginTop: 10}}
        renderItem={({ item }) => {
          return (
            <View
              style={styles.scrollDataTopicButton}
            >
              <CheckBox
                value={item.selected}
                onValueChange={() => {
                  item.setSelection(!item.selected);
                }}
                tintColors={{true: colours.darkPrimary, false: colours.incorrectRed}}
              />
              <View style={{flexDirection: 'column', flex: 1}}>
                <Text style={{
                  paddingRight: 12,
                  fontFamily: 'Lato-SemiBold',
                  fontWeight: '600',
                  fontSize: 20,
                  color: colours.black,
                  display: 'flex',
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
