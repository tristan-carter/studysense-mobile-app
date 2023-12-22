import React from 'react';
import colours from '../config/colours';
import { View, Text, StyleSheet, Image } from 'react-native';
import LottieView from 'lottie-react-native';

const underConstructionAnimation = require('../assets/UnderConstructionAnimation.json');

export default function ComingSoonScreen() {
  return (
    <View style={styles.container}>
      <LottieView source={underConstructionAnimation} autoPlay loop style={{}}/>
      <View style={{marginBottom: "60%", alignItems: "center", justifyContent: "center"}}>
        <Text style={styles.title}>Under Construction</Text>
        <Text style={styles.subtitle}>Stay tuned for exciting updates!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.backgroundColour,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colours.darkPrimary,
  },
  subtitle: {
    fontSize: 18,
    color: colours.secondarytext,
  },
});