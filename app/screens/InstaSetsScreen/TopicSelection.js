import 'react-native-gesture-handler';
import React, { useState, useRef, useEffect } from 'react';

import { SwipeListView } from 'react-native-swipe-list-view';
import { Text, View, TouchableOpacity, Image, TouchableWithoutFeedback, Alert, FlatList } from 'react-native';

import BouncyCheckbox from "react-native-bouncy-checkbox";

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
  const longCards = Subject.longCards;
  var setHasPapers = false;
  var paperSelectionTopics = [];

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
      answerWithDefinition: true,
      answerWithTerm: false,
    }

    navigation.navigate('CreateCardsPage', {
      set: set,
      editOrCreate: "Create",
    });
  }

  for (let i = 0; i < topics.length; i++) {
    const [isSelected, setSelection] = useState(true);
    title = topics[i].title;

    if (title.includes("(paper")) {
      setHasPapers = true;
    }

    paper = ""
    if (setHasPapers) {
      for (let i = 0; i < 8; i++) {
        if (title.includes("paper" + i)) {
          paper = i
          break
        }
      }
    }

    selectionTopics.push({
      title: setHasPapers ? title.substring(0, title.indexOf("(")) : title,
      selected: isSelected,
      setSelection: setSelection,
      cards: topics[i].cards,
      paper: paper,
      checkmarkRef: useRef(),
    });
  }

  var allSelected = true;
  for (let i = 0; i < selectionTopics.length; i++) {
    if (!selectionTopics[i].selected) {
      allSelected = false;
      break;
    }
  }

  if (setHasPapers) {
    highestPaper = 0;
    for (let i = 1; i < selectionTopics.length; i++) {
      if (selectionTopics[i].paper > highestPaper) {
        highestPaper = selectionTopics[i].paper;
      }
    }
    for (let i = 1; i <= highestPaper; i++) {
      paperSelectionTopics.push({
        title: "Paper " + (i),
        isPaperLabel: true,
      });
      for (let j = 0; j < selectionTopics.length; j++) {
        if (selectionTopics[j].paper == i) {
          paperSelectionTopics.push(selectionTopics[j]);
        }
      }
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
      <Text style={styles.subtitleText}>{Subject.setname} topics</Text>

      <FlatList
        data={setHasPapers ? paperSelectionTopics : selectionTopics}
        keyExtractor={(item) => item.title}
        style={{width: '100%', marginTop: 3.5}}
        renderItem={({ item }) => {
          return (
            item.isPaperLabel ? (
              <Text style={{
                fontWeight: '400',
                fontFamily: 'Lato',
                fontSize: 20,
                color: colours.black,
                display: 'flex',
                marginBottom: 10,
              }}>{item.title}</Text>
            ) : (
              <View
                style={styles.scrollDataTopicButton}
              >
                <BouncyCheckbox
                  ref={item.checkmarkRef}
                  size={22}
                  isChecked={item.selected}
                  onPress={() => {
                      item.setSelection(!item.selected);
                  }}
                  fillColor={colours.primaryAccent}
                  unfillColor={colours.backgroundAccent}
                />
                <View style={{flexDirection: 'column', flex: 1}}>
                  <Text style={{
                    paddingRight: 12,
                    fontWeight: '400',
                    fontFamily: 'Lato',
                    fontSize: 18,
                    color: colours.black,
                    display: 'flex',
                  }}>
                    {item.title}
                  </Text>
                </View>
              </View>
            )
          );
        }}
      />
      
      <TouchableOpacity
        style={[styles.button, {
          backgroundColor: colours.backgroundAccent,
          borderWidth: 1.5,
          borderColor: 'rgba(0, 0, 0, 0.005);',
          marginTop: 7,
        }]}
        onPress={()=>{
          for (let i = 0; i < selectionTopics.length; i++) {
            if (selectionTopics[i].selected === allSelected) {
              selectionTopics[i].checkmarkRef.current.onPress();
            }
          }
        }}
      >
          <Text style={[styles.buttonText, {color: colours.black, fontWeight: '400'}]}>{allSelected ? "Deselect all" : "Select all"}</Text>
      </TouchableOpacity>
      <View style={styles.divider} />
      <TouchableOpacity
        style={[styles.button, {
          backgroundColor: colours.primary,
        }]}
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

            // If the set has longCards, then show an alert suggesting to use smart flashcards
            if (longCards) {
              Alert.alert(
                "Smart flashcards study mode suggested",
                "This set contains long cards so we recommend using the Smart Flashcards study mode.",
                [
                  { text: "Ok" }
                ]
              );
            }
            navigation.goBack();
            navigation.goBack();
            handleSetImport(selectedTopics);
          }
        }}
      >
        <Text style={[styles.buttonText, {color: colours.white}]}>Create Set</Text>
      </TouchableOpacity>
    </View>
  );
}
