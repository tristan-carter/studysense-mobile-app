import React from 'react';

import { View, Text, TouchableOpacity, Modal, Image, TextInput, Alert, Switch, SafeAreaView, Clipboard } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import styles from '.././styles.js';

import colours from '../../../config/colours.js';

const shareIcon = require('../../../assets/ShareIcon.png')
const importIcon = require('../../../assets/ImportIcon.png')

import {  useDispatch } from 'react-redux';
import { saveSharedSet } from '../../../../firebase/service.js';

import { editSet } from '../../../../firebase/setsSlice.js';

export function CreateFileModal ({ 
    newName,
    setShowModal,
    showModal,
    creatingFolder,
    handleCreate,
    handleGenerateSmartSet,
    showGenerateSmartSet,
    setOrFolderText,
    editOrCreate,
    inputRef,
    isPrivate,
    setIsPrivate,
    setCode,
    setShowImportModal,
    set,
    saveSharedSetSetCode,
    importingSet,
    answerWithTerm,
    setAnswerWithTerm,
    answerWithDefinition,
    setAnswerWithDefinition
}) {
    const dispatch = useDispatch();
    return(
        <Modal
            animationType="fade"
            transparent={true}
            visible={showModal}
            onRequestClose={() => setShowModal(false)}
        >
            <View style={styles.modalContainer}>
                <SafeAreaView style={styles.modalSubContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{editOrCreate == "Edit" ? "Edit" : "New"} {setOrFolderText}</Text>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Name</Text>
                            <TextInput
                                ref={inputRef}
                                style={styles.textInput} defaultValue={newName.current} placeholder={setOrFolderText + " Name"} placeholderTextColor={'rgba(0, 0, 0, 0.48)'}
                                onChangeText={(text) => {newName.current=text}}
                                maxLength={50}
                                autoFocus={true}
                            />
                        </View>
                        
                        {/* Tagged out for now, to reduce clutter of the modal, can easily be added back in if needed
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '80%',
                        }}>
                            <Text>Make Private</Text>
                            <Switch
                                value={isPrivate}
                                onValueChange={() => {setIsPrivate((prev) => !prev);}}
                            />
                        </View>
                         */}

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '80%',
                        }}>
                            <Text>Answer with term</Text>
                            <BouncyCheckbox
                                size={22}
                                isChecked={answerWithTerm}
                                onPress={() => {
                                    setAnswerWithTerm((prev) => !prev);
                                }}
                                fillColor={colours.primaryAccent}
                                unfillColor={colours.backgroundAccent}
                            />
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '80%',
                        }}>
                            <Text>Answer with definition</Text>
                            <BouncyCheckbox
                                size={22}
                                isChecked={answerWithDefinition}
                                onPress={() => {
                                    setAnswerWithDefinition((prev) => !prev);
                                }}
                                fillColor={colours.primaryAccent}
                                unfillColor={colours.backgroundAccent}
                            />
                        </View>

                        {
                            editOrCreate == "Edit" ? (

                                <TouchableOpacity
                                style={[styles.createButton, {
                                    backgroundColor: colours.incorrectRed,
                                    marginTop: 20,
                                    opacity: 0.96,
                                }]}
                                onPress={() => {
                                    Alert.alert(
                                        "Reset Progress",
                                        "Are you sure you want to reset your progress on this set? This will set all cards to unlearned.",
                                        [
                                            {
                                                text: "Cancel",
                                            },
                                            {
                                                text: "Reset",
                                                onPress: () => {
                                                    // updates cards to be unlearned
                                                    const resetCards = set.cards.map(card => {
                                                        if (card == "null") {
                                                            return card;
                                                        }
                                                        const newCard = {...card};
                                                        newCard.levelLearned = 0;
                                                        newCard.correct = 0;
                                                        newCard.totalCorrect = 0;
                                                        newCard.incorrect = 0;
                                                        newCard.totalIncorrect = 0;
                                                        return newCard
                                                    });
                                                    dispatch(editSet({setId: set.id, editedValues: { cards: resetCards }}));
                                                }
                                            }
                                        ]
                                    );
                                }}
                                >
                                    <Text style={styles.createButtonText}>Reset progress</Text>
                                </TouchableOpacity>
                            ) : <View></View>
                        }

                        <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
                            <Text style={styles.createButtonText}>{editOrCreate == "Edit" ? "Save" : "Create"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={()=>setShowModal(false)}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        {/*(creatingFolder || !showGenerateSmartSet) ? <View></View> :
                        <>
                            <View style={styles.divider} />
                            <TouchableOpacity style={styles.generateButton} onPress={handleGenerateSmartSet}>
                                <Image style={{ width: 45, height: 45 }} source={brainIcon} />
                                <View style={{ marginLeft: 8, flex: 1}}>
                                    <Text style={styles.generateButtonText}>Generate a SmartSet</Text>
                                    <Text style={styles.generateButtonSubText}>Have an AI generate your set and let you make adjustments.</Text>
                                </View>
                            </TouchableOpacity>
                        </>
                        */}
                        {editOrCreate != "Edit" && !creatingFolder ?
                        <>
                            <View style={styles.divider} />
                            <TouchableOpacity style={styles.importButton} onPress={()=>{
                                setShowImportModal(true);
                                setShowModal(false);
                                if (importingSet.current && importingSet.current.length > 1) {
                                    Alert.alert("Already Imported A Set", 
                                    "You can only import one set, by importing a new set you will override the current imported set, to not override it press cancel on the importset modal.", 
                                    [
                                        {
                                            text: "Go Back",
                                            onPress: () => {},
                                        },
                                    ]);
                                }
                                }}>
                                <Image style={{ width: 45, height: 45 }} source={importIcon} />
                                <View style={{ marginLeft: 8, flex: 1}}>
                                    <Text style={styles.importButtonText}>Import a Set</Text>
                                    <Text style={styles.importButtonSubText}>Import anyone's set with just its setcode.</Text>
                                </View>
                            </TouchableOpacity>
                        </> : <View></View>
                        }
                        {editOrCreate == "Edit" && !creatingFolder ?
                        <>
                            <View style={styles.divider} />
                            <TouchableOpacity
                                style={styles.importButton}
                                onPress={() => {
                                    if (!isPrivate) {
                                    Alert.alert(
                                        "SetCode Copied To Clipboard",
                                        "Send to someone so they can to import it! To use a code click on import set while creating a set.",
                                        [
                                            {
                                                text: "Ok",
                                                onPress: () => {
                                                    Clipboard.setString(setCode);
                                                    dispatch(saveSharedSet([saveSharedSetSetCode, set]));
                                                },
                                            },
                                        ]
                                    );
                                    } else {
                                    Alert.alert(
                                        "Set Is Private",
                                        "Unprivate this set in order to be able to share it.",
                                        [
                                            {
                                                text: "Go Back",
                                            },
                                        ]
                                    );
                                    }
                                }}
                                >
                                <Image style={{ width: 45, height: 45 }} source={shareIcon} />
                                <View style={{ marginLeft: 8, flex: 1}}>
                                    <Text style={styles.importButtonText}>Share Set</Text>
                                    <Text style={styles.importButtonSubText}>Share your set with anyone with just its setcode.</Text>
                                </View>
                            </TouchableOpacity>
                        </> : <View></View>
                        }
                    </View>
                </SafeAreaView>
            </View>
        </Modal>
    )
}