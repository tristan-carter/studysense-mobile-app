import React, { useState } from 'react';

import { View, Text, TouchableOpacity, Modal, Image, TextInput, KeyboardAvoidingView, Alert, Clipboard, Switch, SafeAreaView } from 'react-native';

import styles from '.././styles.js';

const brainIcon = require('../../../assets/StudySmartRevisionIcon.png');
const shareIcon = require('../../../assets/ShareIcon.png')
const importIcon = require('../../../assets/ImportIcon.png')

import { useSelector, useDispatch } from 'react-redux';
import { saveSharedSet } from '../../../../firebase/service.js';

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
}) {
    const dispatch = useDispatch();
    return(
        <Modal
            animationType="fade"
            transparent={true}
            visible={showModal}
            onRequestClose={() => setShowModal(false)}
        >
            <KeyboardAvoidingView style={styles.modalContainer}>
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
                                    Alert.alert("Already Imported A Set", "You can only import one set, by importing a new set you will override the current imported set, to not override it press cancel on the importset modal.", () => {});
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
                            <TouchableOpacity style={styles.importButton} onPress={()=>{
                                if (!isPrivate) {
                                    Alert.alert("SetCode Copied To Clipboard", "Send to someone so they can to import it! To use a code click on import set while creating a set.", () => {
                                        Clipboard.setString(setCode);
                                        dispatch(saveSharedSet([saveSharedSetSetCode, set]));
                                    });
                                } else {
                                    Alert.alert("Set Is Private", "Unprivate this set in order to be able to share it.", () => {});
                                }
                            }}>
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
            </KeyboardAvoidingView>
        </Modal>
    )
}