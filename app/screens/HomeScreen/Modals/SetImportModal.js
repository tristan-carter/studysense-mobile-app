import React, { useRef } from 'react';

import { View, Text, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, SafeAreaView } from 'react-native';

import styles from '.././styles.js';

export function SetImportModal({ visible, setVisible, onImport, setCreateModalVisible, newName, dispatch, importingSet, setShowModal }) {
    const importingSetCode = useRef("");
    return (
        <Modal
        visible={visible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setVisible(false)}
        >
            <KeyboardAvoidingView style={styles.modalContainer}>
                <SafeAreaView style={styles.modalSubContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Import Set</Text>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Setcode</Text>
                            <TextInput
                                style={styles.textInput}
                                defaultValue={importingSetCode.current}
                                placeholder={"Enter set code"}
                                placeholderTextColor={'rgba(0, 0, 0, 0.48)'}
                                onChangeText={(text) => {importingSetCode.current=text}}
                                maxLength={50}
                                autoFocus={true}
                            />
                        </View>
                        <TouchableOpacity style={styles.cancelButton} onPress={()=>{
                            importingSetCode.current = "";
                            setVisible(false);
                            setCreateModalVisible(true);
                        }}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.createButton} onPress={()=>{
                            onImport(importingSetCode.current, newName, dispatch, importingSet);
                            importingSetCode.current = "";
                            setVisible(false);
                            setShowModal(true);
                        }}>
                            <Text style={styles.createButtonText}>Import</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </Modal>
    );
};
