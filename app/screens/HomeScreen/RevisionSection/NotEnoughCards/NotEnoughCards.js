import React from 'react';
import { View, Text, Image, TouchableOpacity} from 'react-native';

import { useSelector, useDispatch } from 'react-redux';

import { useNavigation } from '@react-navigation/native';

import styles from './styles';
import colours from '../../../../config/colours';

function NotEnoughCards({set, minCards, studyType}) {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../../assets/DefaultSetIcon.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Not Enough Cards to Study</Text>
      <Text style={styles.description}>
        You need at least {minCards} cards to use {studyType} mode.
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.push('CreateCardsPage', {set: { setId: set.id, name: set.name, cards: set.cards, icon: set.icon, description: set.description }, editOrCreate: "Edit", notEnoughCards: true})}>
        <Text style={styles.buttonText}>Add Flashcards</Text>
      </TouchableOpacity>
    </View>
  );
}

export default NotEnoughCards;