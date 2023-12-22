import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

import { useDispatch } from 'react-redux';

import Ionicons from 'react-native-vector-icons/Ionicons';
import colours from '../../../config/colours';

import styles from './styles';

import { addSet, editSet } from '../../../../firebase/setsSlice.js';
import { saveUser, setBottomNavShown } from '../../../../firebase/userSlice.js';

const generateID = () => {
    const randomString = Math.random().toString(36).substr(2, 10); // Generate a random alphanumeric string
    const timestamp = Date.now().toString(36); // Convert the current timestamp to base36
    const ID = randomString + timestamp; // Concatenate the random string and timestamp
    return ID;
};

function CreateCardsPage (props) {
    const dispatch = useDispatch();
    
    const navigation = useNavigation();
    const flatListRef = useRef(null);
    const creatingSet = useRef(false);

    const set = props.route.params.set;
    const editOrCreate = props.route.params.editOrCreate;
    const notEnoughCards = props.route.params.notEnoughCards;
    
    const cardsData = [...set.cards];
    cardsData.shift();
    const [cards, setCards] = useState();
    useEffect(() => {
        setCards(cardsData);
    }, []);

    const addCard = () => {
        setCards([{
            id: generateID(),
            term: "",
            definition: "",
            correct: 0,
            totalCorrect: 0,
            incorrect: 0,
            totalIncorrect: 0,
            levelLearned: 0, // 0 - Not Learned : 1 - Learning : 2 - Partially Learned : 3 - Learned
        }, ...cards]);
    }

    const editCard = (id, term, definition) => {
        setCards((prevCards) =>
            prevCards.map((card) =>
            card.id === id ? { ...card, term, definition } : card
            )
        );
    }

    const deleteCard = (id) => {
        const newCards = [...cards];
        const index = newCards.findIndex((card) => card.id === id);
        newCards.splice(index, 1);
        setCards(newCards);
    }

    const cardsChanged = () => {
        if (cards.length !== cardsData.length) {
            return true;
        }
    
        for (let i = 0; i < cards.length; i++) {
            const dict1 = cards[i];
            const dict2 = cardsData[i];
        
            if (
                dict1.id !== dict2.id ||
                dict1.term !== dict2.term ||
                dict1.definition !== dict2.definition
            ) {
                return true;
            }
        }
    
        return false;
    }

    const handleDoneSet = () => {
        if (editOrCreate === "Edit") {
            dispatch(editSet({ setId: set.setId, editedValues:  {cards: ["null", ...cards.slice()], name: set.name, isPrivate: set.isPrivate} }));
            if (cardsChanged()) { dispatch(saveUser("current")); }
            creatingSet.current = true;
            navigation.goBack();
            if (notEnoughCards) { navigation.goBack(); }
        } else {
            dispatch(addSet({
                setId: set.setId,
                name: set.name,
                icon: set.icon,
                cards: ["null", ...cards.slice()],
                description: set.description,
                isPrivate: set.isPrivate,
            }));
            if (cards.length>0) { dispatch(saveUser("current")); }
            creatingSet.current = true;
            navigation.goBack(); 
        }
    }

    useEffect(() => {
        navigation.addListener('beforeRemove', (event) => {
            dispatch(setBottomNavShown(true));
            if (!creatingSet.current) {
                event.preventDefault();
                Alert.alert("Discard Changes?", "You have unsaved changes. Are you sure you would like to discard them and leave the screen?", [
                    {
                        text: "Cancel",
                        onPress: () => {},
                        style: "cancel"
                    },
                    {
                    style: 'destructive',
                    text: "Discard",
                    onPress: () => navigation.dispatch(event.data.action),
                    }
                ], "plain-text");
            }
          });
          creatingSet.current = false;
    }, [navigation]);

    const onInputFocus = (index) => {
        flatListRef.current.scrollToIndex({
            animated: false,
            index: index,
            viewPosition: 0,
        });
    }

    const renderItem = ({ item, index }) => (
        <View style={styles.card}>
            <View style={styles.cardSubContainer}>
                <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitleText}>Term:</Text>
                    <TextInput
                        style={styles.cardText}
                        placeholder="type term"
                        onChangeText={(text) => {editCard(item.id, text, item.definition)}}
                        defaultValue={item.term}
                        multiline={true}
                        onFocus={() => {onInputFocus(index)}}
                    />
                </View>
                <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitleText}>Definition:</Text>
                    <TextInput
                        style={styles.cardText}
                        placeholder="type definition"
                        onChangeText={(text) => {editCard(item.id, item.term, text)}}
                        defaultValue={item.definition}
                        multiline={true}
                        onFocus={() => {onInputFocus(index)}}
                    />
                </View>
            </View>
            <TouchableOpacity onPress={()=>deleteCard(item.id)}>
                <Ionicons name={'close-circle-outline'} size={30} color={'#FF4242'} />
            </TouchableOpacity>
        </View>
    );
    
    return (
        <KeyboardAvoidingView 
            style={{ flex: 1 }}
            behavior="height" 
            enabled
        >
            <View style={styles.container}>
                    <Text style={styles.subtitleText}>{editOrCreate} Cards</Text>
                    <TouchableOpacity style={[styles.button, {backgroundColor: colours.darkPrimary}]} onPress={handleDoneSet}>
                        <Text style={[styles.buttonText, {color: colours.white}]}>Done</Text>
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity style={[styles.button, {backgroundColor: colours.blue}]} onPress={addCard}>
                        <Text style={[styles.buttonText, {color: colours.backgroundColour}]}>Add Card</Text>
                        <Ionicons name={'add-circle-outline'} size={40} color={colours.backgroundColour} />
                    </TouchableOpacity>
                    <FlatList
                        ref={flatListRef}
                        data={cards}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        style={{width: '100%', marginTop: 10}}
                    />
            </View>
        </KeyboardAvoidingView>
    );
}

export default CreateCardsPage;