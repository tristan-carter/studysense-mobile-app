import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import React from "react";
import { Pressable, Text } from "react-native";
import styles from './styles'; // assuming styles.js is in the same directory

function NewFileActionSheet() {
    const sheetId = "NewFileActionSheet";
    return (
      <ActionSheet id={sheetId}>
        <Pressable
        onPress={() => {
            SheetManager.hide(sheetId, {
                payload: "NewSet",
            });
        }}
        style={styles.newFileActionSheetPressable}
        >
            <Text style={styles.newFileActionSheetText}>New Set</Text>
        </Pressable>
        <Pressable
        onPress={() => {
            SheetManager.hide(sheetId, {
                payload: "NewFolder",
            });
        }}
        style={styles.newFileActionSheetPressable}
        >
            <Text style={styles.newFileActionSheetText}>New Folder</Text>
        </Pressable>
        <Pressable
        onPress={() => {
            SheetManager.hide(sheetId, {
                payload: "Cancel",
            });
        }}
        style={styles.newFileActionSheetPressable}
        >
            <Text style={styles.newFileActionSheetTextCancel}>Cancel</Text>
        </Pressable>
      </ActionSheet>
    );
}

export default NewFileActionSheet;