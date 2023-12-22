import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import React from "react";
import { Button } from "react-native";
import colours from '../config/colours';

function NewFileActionSheet() {
    sheetId = "NewFileActionSheet";
    return (
      <ActionSheet id={sheetId}>
        <Button
        title="New Set"
        style={{marginBottom: 10}}
        color={colours.darkPrimary}
        onPress={() => {
            SheetManager.hide(sheetId, {
                payload: "NewSet",
            });
        }}
        />
        <Button
        title="New Folder"
        style={{marginBottom: 10, }}
        color={colours.darkPrimary}
        onPress={() => {
            SheetManager.hide(sheetId, {
                payload: "NewFolder",
            });
        }}
        />
        <Button
        title="Cancel"
        style={{marginBottom: 10}}
        color={colours.darkgray}
        onPress={() => {
            SheetManager.hide(sheetId, {
                payload: "Cancel",
            });
        }}
        />
      </ActionSheet>
    );
  }
   
  export default NewFileActionSheet;